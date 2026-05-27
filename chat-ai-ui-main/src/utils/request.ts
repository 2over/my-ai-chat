import axios from 'axios';
import { useUserStore } from '../stores/user';
import { router } from '../router/index';

// 1. 创建 Axios 实例
const request = axios.create({
  // 从环境变量中读取后端 API 的基础地址（通常是 http://localhost:8000）
  baseURL: import.meta.env.VITE_API_URL, 
  // 设置请求超时时间为 30 秒
  timeout: 30000,
});

/**
 * 2. 请求拦截器 (Request Interceptor)
 * 在请求发送给后端之前执行
 */
request.interceptors.request.use(
  (config) => {
    // 获取用户状态仓库（Pinia Store）
    const userStore = useUserStore();
    
    // 如果用户已登录（存在 userId/Token），则在请求头中注入身份认证信息
    // 注意：虽然这里变量名叫 userId，但在 JWT 逻辑中它通常存放的是 Token 字符串
    if (userStore.userId) {
      // 按照 OAuth2 标准，在 Header 中添加 Bearer 格式的令牌
      config.headers.Authorization = `Bearer ${userStore.userId}`;
    }
    return config;
  },
  (error) => {
    // 处理请求发送前的错误
    return Promise.reject(error);
  }
);

/**
 * 3. 响应拦截器 (Response Interceptor)
 * 在接收到后端返回的数据后，先进行统一预处理
 */
request.interceptors.response.use(
  (response) => {
    // 请求成功，直接返回原始响应数据
    return response;
  },
  (error) => {
    const userStore = useUserStore();
    
    // 处理特定的 HTTP 错误状态码
    // 401 代表 Unauthorized（未授权/登录过期）
    if (error.response?.status === 401) {
      // 1. 清除本地存储的用户信息和 Token
      userStore.logout();
      // 2. 强制跳转回首页或登录页
      router.push('/');
      
      console.error('身份验证失效，请重新登录');
    }
    
    // 将错误继续抛出，方便在具体的业务逻辑中捕获
    return Promise.reject(error);
  }
);

export default request;