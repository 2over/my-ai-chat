import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from './user';
import { router } from '../router/index';

interface FormattedMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<{ role: string; content: string }[]>([]);
  const isLoading = ref(false);

  const userStore = useUserStore();

  // 获取历史消息接口调用
  const loadChatHistory = async () => {
    if (!userStore.userId) return;

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/chat/history`,
        {
          headers: {
          'Authorization': `Bearer ${userStore.userId}`, // 添加认证头
          'Content-Type': 'application/json'
          }
        }
      );

      messages.value = data.filter((msg: FormattedMessage) => msg.content);
    } catch (error) {
      console.error('Error loading chat history: ', error);
    }
  };

  // 对话接口调用
  const sendMessage = async (message: string, model: string, temperature: number, max_tokens: number, stream: boolean) => {
    console.log(123);
    if (!message.trim() || !userStore.userId) return;

    messages.value.push({ role: 'user', content: message });

    isLoading.value = true;

    try {
      if (stream) {
      // 流式处理
      await handleStreamResponse(model, temperature, max_tokens);
    } else {
      // 非流式处理（保持原有逻辑）
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat/chat`,
        {
          // 请求体数据
          messages: messages.value,
          model: model,
          temperature: temperature,
          max_tokens: max_tokens,
          stream: false,
        },
        {
          // axios 配置选项
          headers: {
            'Authorization': `Bearer ${userStore.userId}`, // 认证头
            'Content-Type': 'application/json', // 可选，axios通常会自动设置
          }
        }
      );
      messages.value.push({ role: data.message.role, content: data.message.content });
    }
    } catch (error) {
      console.error('Error sending message: ', error);
      messages.value.push({
        role: 'ai',
        content: 'Error: unable to process request',
      });
    } finally {
      isLoading.value = false;
    }
  };


/**
 * 处理流式响应
 * @param model - AI模型名称
 * @param temperature - 温度参数，控制回复的随机性
 * @param max_tokens - 最大token数量限制
 */
const handleStreamResponse = async (model: string, temperature: number, max_tokens: number) => {
  // 获取即将添加的AI消息在数组中的索引位置
  const aiMessageIndex = messages.value.length;
  // 预先添加一个空的AI消息占位，用于后续实时更新内容
  messages.value.push({ role: 'assistant', content: '' });
  try {
    // 发起流式请求到后端API
    const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.userId}`, // 认证头
      },
      body: JSON.stringify({
        messages: messages.value,           // 完整的对话历史
        model: model,                       // AI模型
        temperature: temperature,           // 温度参数
        max_tokens: max_tokens,            // token限制
        stream: true                       // 开启流式响应
      }
    )
    });
    // 检查HTTP响应状态
    if (!response.ok) {
      if (response.status === 401) {
        userStore.logout();
        router.push('/');
        throw new Error('Token expired');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
     // 检查浏览器是否支持ReadableStream
    if (!response.body) {
      throw new Error('ReadableStream not supported');
    }
     // 获取流式数据读取器
    const reader = response.body.getReader();
    // 创建文本解码器，用于将字节流转换为文本
    const decoder = new TextDecoder();
    // 缓冲区，用于处理可能被分割的数据行
    let buffer = '';
    // 持续读取流式数据
    while (true) {
       // 读取数据块
      const { done, value } = await reader.read();
      // 如果流结束，跳出循环
      if (done) break;
       // 将字节数据解码为文本并添加到缓冲区
      buffer += decoder.decode(value, { stream: true });
      // 按换行符分割数据，处理SSE格式的数据行
      const lines = buffer.split('\n');
      // 保留最后一行（可能是不完整的），其余行进行处理
      buffer = lines.pop() || '';

      // 逐行处理SSE数据
      for (const line of lines) {
        const trimmedLine = line.trim();
         // 检查是否是SSE数据行（以"data: "开头）
        if (trimmedLine.startsWith('data: ')) {
          // 提取JSON数据部分，移除"data: "前缀
          const jsonStr = trimmedLine.slice(6);
          
          // 跳过空数据行或结束标记
          if (jsonStr.trim() === '' || jsonStr.trim() === '[DONE]') continue;

          try {
             // 解析JSON数据
            const data = JSON.parse(jsonStr);
            // 如果包含内容数据，实时更新AI消息
            if (data.content) {
              // 将新内容追加到AI消息中，实现打字机效果
              messages.value[aiMessageIndex].content += data.content;
            }
            // 如果收到结束信号，跳出数据处理循环
            if (data.finished) {
              break;
            }
          } catch (e) {
            console.warn('Failed to parse JSON:', jsonStr, e);
          }
        }
      }
    }
    // 释放读取器资源
    reader.releaseLock();
    
  } catch (error) {
    console.error('Stream error:', error);
    messages.value.splice(aiMessageIndex, 1);
    throw error;
  }
};

  return { messages, isLoading, loadChatHistory, sendMessage };
});
