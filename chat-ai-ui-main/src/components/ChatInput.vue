<script setup lang="ts">
import { ref } from 'vue';

const message = ref('');
const model =  ref("qwen-turbo-2025-04-28");
const temperature = ref(0.7);
const maxTokens = ref(2000);
const stream = ref(false);
const emit = defineEmits(['send']);

// 可用的模型选项
const models = [
  { value: "qwen-turbo-2025-04-28", label: "Qwen Turbo" },
  { value: "qwen3.6-plus", label: "Qwen Plus" },
  { value: "qwen-flash", label: "Qwen Flash" }
];

/**
 * 发送消息函数
 * 
 * 该函数用于发送用户输入的消息，并触发相应的事件
 * 
 * @param {string} message.value - 要发送的消息内容
 * @param {string} model.value - 使用的模型参数
 * @param {number} temperature.value - 温度参数，控制生成文本的随机性
 * @param {number} maxTokens.value - 最大令牌数参数，限制生成文本的长度
 * @param {boolean} stream.value - 是否启用流式传输
 * 
 * @returns {void}
 */
const sendMessage = () => {
  // 检查消息是否为空，如果为空则直接返回
  if (!message.value.trim()) return;
  // 触发send事件，传递消息和相关参数
  emit('send', message.value, model.value, temperature.value, maxTokens.value, stream.value);
  // 清空消息输入框
  message.value = '';
};
</script>
<!-- bg-gray-800 -->
<template>
  <div class="p-4 space-y-4">
    <!-- 第一行：流式输出、状态指示器、模型选择 -->
    <div class="flex items-center space-x-6">
      <!-- 流式输出开关 -->
      <label class="flex items-center space-x-2 text-white cursor-pointer">
        <input
          v-model="stream"
          type="checkbox"
          class="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
        />
        <span class="text-sm">流式输出</span>
      </label>
      
      <!-- 状态指示器 -->
      <div class="flex items-center space-x-1">
        <div 
          :class="[
            'w-2 h-2 rounded-full',
            stream ? 'bg-green-400' : 'bg-yellow-400'
          ]"
        ></div>
        <span 
          :class="[
            'text-xs font-medium',
            stream ? 'text-green-400' : 'text-yellow-400'
          ]"
        >
          {{ stream ? '流式模式' : '完整模式' }}
        </span>
      </div>

      <!-- 模型选择下拉框 -->
      <div class="flex items-center space-x-2">
        <label class="text-sm text-gray-300">模型:</label>
        <select
          v-model="model"
          class="bg-gray-700 text-white text-sm rounded-lg border border-gray-600 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
        >
          <option 
            v-for="model in models" 
            :key="model.value" 
            :value="model.value"
            class="bg-gray-700"
          >
            {{ model.label }}
          </option>
        </select>
      </div>

      <!-- 模型显示 -->
      <div class="flex items-center space-x-1 text-xs text-gray-400">
        <span>当前:</span>
        <span class="text-blue-400 font-medium">
          {{ models.find(m => m.value === model)?.label }}
        </span>
      </div>
    </div>

    <!-- 第二行：温度和Token控制滑块 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 温度控制 -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-300">温度 (Temperature)</label>
          <span class="text-xs text-blue-400 font-mono bg-gray-700 px-2 py-1 rounded">
            {{ temperature.toFixed(1) }}
          </span>
        </div>
        <div class="relative">
          <input
            v-model.number="temperature"
            type="range"
            min="0"
            max="2"
            step="0.1"
            class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>保守 (0.0)</span>
            <span>平衡 (1.0)</span>
            <span>创造 (2.0)</span>
          </div>
        </div>
      </div>

      <!-- 最大Token控制 -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-300">最大Tokens</label>
          <span class="text-xs text-green-400 font-mono bg-gray-700 px-2 py-1 rounded">
            {{ maxTokens.toLocaleString() }}
          </span>
        </div>
        <div class="relative">
          <input
            v-model.number="maxTokens"
            type="range"
            min="100"
            max="8000"
            step="100"
            class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>短 (100)</span>
            <span>中 (4000)</span>
            <span>长 (8000)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入框和发送按钮 -->
    <div class="flex space-x-2">
      <input
        v-model="message"
        @keyup.enter="sendMessage"
        placeholder="输入你的消息..."
        type="text"
        class="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
      />
      <button 
        @click="sendMessage" 
        :disabled="!message.trim()"
        :class="[
          'px-6 py-3 rounded-lg font-medium transition-all duration-200',
          message.trim() 
            ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer transform hover:scale-105' 
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        ]"
      >
        <div class="flex items-center space-x-2">
          <span>发送</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 自定义滑块样式 */
.slider-thumb::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid #1f2937;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.slider-thumb::-webkit-slider-thumb:hover {
  background: #2563eb;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.slider-thumb::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid #1f2937;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.slider-thumb::-moz-range-thumb:hover {
  background: #2563eb;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* 滑块轨道样式 */
.slider-thumb::-webkit-slider-runnable-track {
  height: 8px;
  background: linear-gradient(to right, #374151 0%, #3b82f6 50%, #374151 100%);
  border-radius: 4px;
}

.slider-thumb::-moz-range-track {
  height: 8px;
  background: linear-gradient(to right, #374151 0%, #3b82f6 50%, #374151 100%);
  border-radius: 4px;
}
</style>