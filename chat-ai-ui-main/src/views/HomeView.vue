<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import robotImage from '../assets/robot.png';

const userStore = useUserStore();
const router = useRouter();

const name = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const loginUser = async () => {
if (!name.value || !password.value) {
  error.value = '用户名和密码是必填项';
  return;
}

loading.value = true;
error.value = '';

try {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/users/token`,
    {
      username: name.value,
      password: password.value,
    }
  );

  userStore.setUser({
    userId: data.access_token,
    name: data.username,
  });

  router.push('/chat');
} catch (err: any) {
  error.value = err.response.data.detail;
} finally {
  loading.value = false;
}
};
</script>

<template>
<div class="h-screen flex items-center justify-center bg-gray-900 text-white">
  <div class="p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
    <img :src="robotImage" alt="" class="mx-auto w-24 h-24 mb-4" />
    <h1 class="text-2xl font-semibold mb-4 text-center">
     欢迎使用AI
    </h1>

    <input
      type="text"
      class="w-full p-2 mb-2 bg-gray-700 text-white rounded-lg focus:outline-none"
      placeholder="Name"
      v-model="name"
      @keyup.enter="loginUser"
    />
    <input
      type="password"
      class="w-full p-2 mb-2 bg-gray-700 text-white rounded-lg focus:outline-none"
      placeholder="password"
      v-model="password"
      @keyup.enter="loginUser"
    />

    <button
      @click="loginUser"
      class="w-full p-2 bg-blue-500 rounded-lg"
      :disabled="loading"
    >
      {{ loading ? 'Logging in...' : 'Start Chat' }}
    </button>

    <p v-if="error" class="text-red-400 text-center mt-2">{{ error }}</p>
  </div>
</div>
</template>