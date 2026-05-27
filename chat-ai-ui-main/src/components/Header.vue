<script setup lang="ts">
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import robotImage from '../assets/robot.png';
import axios from 'axios';

const userStore = useUserStore();
const router = useRouter();

const logout = async () => {
  
  if (!userStore.userId) {
    userStore.logout();
    router.push('/');
    return;
  }

  try {     
    // 修正axios参数顺序：post(url, data, config)
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/logout`,
      {}, // 空的请求体
      {
        headers: {
          'Authorization': `Bearer ${userStore.userId}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('退出接口响应:', response.data);
    
    // 清除用户状态
    userStore.logout();
    
    // 跳转到首页或登录页
    router.push('/');
    
    console.log('退出登录成功');
  } catch (error: any) {
    console.error('退出登录失败:', error);
    console.error('状态码:', error.response?.status);
    console.error('错误详情:', error.response?.data);
    
    // 即使后端调用失败，也要清除本地数据
    userStore.logout();
    router.push('/');
  }
};
</script>

<template>
  <div
    class="py-4 px-6 bg-gray-800 shadow-md flex justify-between items-center"
  >
    <div class="flex items-center space-x-3">
      <img :src="robotImage" alt="Chat AI" class="w-8 h-8" />
      <h1 class="text-lg font-semibold text-white">AI智能问答系统</h1>
    </div>
    
    <!-- 用户信息区域 -->
    <div class="flex items-center space-x-4">
      <!-- 用户头像或图标 -->
      <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
        <span class="text-white text-sm font-medium">
          {{ (userStore.name || 'U').charAt(0).toUpperCase() }}
        </span>
      </div>
      
      <!-- 用户名 -->
      <span class="text-gray-300 text-sm">
        {{ userStore.name || '用户' }}
      </span>
      
      <!-- 退出按钮 -->
      <button 
        @click="logout" 
        class="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors duration-200 px-3 py-1 rounded hover:bg-gray-700"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        <span>退出</span>
      </button>
    </div>
  </div>
</template>
