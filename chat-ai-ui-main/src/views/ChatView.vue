<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import { useUserStore } from '../stores/user';
import { useChatStore } from '../stores/chat';
import { useRouter } from 'vue-router';
import Header from '../components/Header.vue';
import ChatInput from '../components/ChatInput.vue';
import { watch } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { markedHighlight } from 'marked-highlight';

const userStore = useUserStore();
const chatStore = useChatStore();
const router = useRouter();

// 确保用户已登录
if (!userStore.userId) {
  router.push('/');
}
// 配置标记以获得更好的呈现
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {}
    }
    return hljs.highlightAuto(code).value;
  }
}));

// 格式化AI信息以更好地显示
const formatMessage = (text: string, role: string) => {
  if (!text) return '';
  
  if (role === 'user') {
    // 对于用户消息，只需转义HTML并保留换行符
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  } else {
    // 对于AI消息，渲染为 markdown
    return marked(text);
  }
};

// 自动滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  });
};

// 初始化页面后进行加载历史消息
onMounted(() => {
  chatStore.loadChatHistory().then(() => scrollToBottom());
});

// 使用响应式监听器 监听 messages 变化并滚动到底
watch(
  () => chatStore.messages,
  () => {
    scrollToBottom(); // 回调函数，每次 messages 变化就滚动到底
  },
  { deep: true }
);
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <Header />

    <!-- 具有居中聊天区域的主容器 -->
    <div class="flex justify-center px-4 py-6">
      <div class="w-full max-w-4xl flex flex-col h-[calc(100vh-120px)]">
        
        <!-- 聊天消息容器 -->
        <div id="chat-container" class="flex-1 overflow-y-auto space-y-4 mb-4 px-4 py-4 rounded-lg shadow-lg">
          <!-- 没有对话内容显示的内容 -->
          <div v-if="chatStore.messages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400">
            <div class="text-6xl mb-4">💬</div>
            <h2 class="text-2xl font-semibold mb-2">开始对话</h2>
            <p class="text-center">向我提问任何问题，我会尽力为你解答</p>
          </div>

          <!-- 聊天信息 -->
          <div
            v-for="(msg, index) in chatStore.messages"
            :key="index"
            class="flex items-start"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <!-- 图标 -->
            <div v-if="msg.role !== 'user'" class="flex-shrink-0 mr-3">
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                AI
              </div>
            </div>

            <!-- 消息内容 -->
            <div
              v-html="formatMessage(msg.content, msg.role)"
              class="max-w-2xl px-4 py-3 rounded-lg shadow-sm prose prose-invert max-w-none"
              :class="
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm prose-headings:text-white prose-p:text-white prose-strong:text-white prose-em:text-white'
                  : 'bg-gray-700 text-white rounded-bl-sm prose-headings:text-gray-100 prose-p:text-gray-100 prose-strong:text-gray-100 prose-em:text-gray-100 prose-code:text-blue-300 prose-code:bg-gray-800 prose-pre:bg-gray-800 prose-blockquote:border-blue-500'
              "
            ></div>
            <!-- 用户 -->
            <div v-if="msg.role === 'user'" class="flex-shrink-0 ml-3">
              <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                我
              </div>
            </div>
          </div>

          <!-- 等待回复过程 -->
          <div v-if="chatStore.isLoading" class="flex justify-start">
            <div class="flex-shrink-0 mr-3">
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                AI
              </div>
            </div>
            <div class="bg-gray-700 text-white px-4 py-3 rounded-lg rounded-bl-sm shadow-sm">
              <div class="flex items-center space-x-2">
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
                <span class="text-sm text-gray-400">正在思考中...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat input -->
        <div class="flex-shrink-0">
          <ChatInput @send="chatStore.sendMessage" />
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* 聊天容器的自定义滚动条 */
#chat-container::-webkit-scrollbar {
  width: 6px;
}

#chat-container::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 3px;
}

#chat-container::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 3px;
}

#chat-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* 平滑移动 */
#chat-container {
  scroll-behavior: smooth;
}

/* 列出格式化消息的样式 */
:deep(ul) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

:deep(li) {
  margin: 0.25rem 0;
}

:deep(code) {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

:deep(b) {
  font-weight: 600;
}

:deep(i) {
  font-style: italic;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4),
:deep(.prose h5),
:deep(.prose h6) {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

:deep(.prose h1) { font-size: 1.5rem; }
:deep(.prose h2) { font-size: 1.375rem; }
:deep(.prose h3) { font-size: 1.25rem; }

:deep(.prose p) {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

:deep(.prose ul),
:deep(.prose ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

:deep(.prose li) {
  margin: 0.25rem 0;
}

:deep(.prose code) {
  background-color: rgba(0, 0, 0, 0.4);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: 'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
  font-size: 0.875rem;
}

:deep(.prose pre) {
  background-color: #1f2937;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid #374151;
}

:deep(.prose pre code) {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  font-size: 0.875rem;
}

:deep(.prose blockquote) {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 0 0.25rem 0.25rem 0;
}

:deep(.prose table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

:deep(.prose th),
:deep(.prose td) {
  border: 1px solid #374151;
  padding: 0.5rem;
  text-align: left;
}

:deep(.prose th) {
  background-color: #374151;
  font-weight: 600;
}

:deep(.prose tr:nth-child(even)) {
  background-color: rgba(75, 85, 99, 0.3);
}

/* Syntax highlighting for code blocks */
:deep(.hljs) {
  background: #1f2937 !important;
  color: #e5e7eb;
}

:deep(.hljs-keyword),
:deep(.hljs-selector-tag),
:deep(.hljs-literal),
:deep(.hljs-section),
:deep(.hljs-link) {
  color: #8b5cf6;
}

:deep(.hljs-string),
:deep(.hljs-attr) {
  color: #10b981;
}

:deep(.hljs-number),
:deep(.hljs-regexp),
:deep(.hljs-addition) {
  color: #f59e0b;
}

:deep(.hljs-comment),
:deep(.hljs-quote),
:deep(.hljs-meta) {
  color: #6b7280;
}

:deep(.hljs-name),
:deep(.hljs-symbol),
:deep(.hljs-bullet),
:deep(.hljs-subst),
:deep(.hljs-title),
:deep(.hljs-class),
:deep(.hljs-type) {
  color: #ef4444;
}
</style>