import { defineStore } from 'pinia';

/** * 设置前端本地定义的 Token 有效期（分钟）
 * 注意：这只是前端表现层逻辑，真正的过期校验由后端 JWT 决定
 */
const TOKEN_EXPIRE_MINUTES = 30;

export const useUserStore = defineStore('user', {
  // 1. 定义状态 (State)：类似于组件的 data
  state: () => ({
    // 存储用户的唯一标识或 Token 字符串
    userId: null as string | null,
    // 存储用户名
    name: null as string | null,
    // 存储 Token 的过期时间戳（毫秒）
    tokenExpireTime: null as number | null,
  }),

  // 2. 定义动作 (Actions)：类似于组件的 methods，用于修改状态
  actions: {
    /**
     * 登录成功后调用，保存用户信息并计算过期时间
     * @param data 包含用户 ID 和名称的对象
     */
    setUser(data: { userId: string; name: string }) {
      this.userId = data.userId;
      this.name = data.name;
      // 设置过期时间 = 当前时间 + 30分钟的毫秒数
      this.tokenExpireTime = Date.now() + TOKEN_EXPIRE_MINUTES * 60 * 1000;
    },

    /**
     * 退出登录：清空所有用户数据
     */
    logout() {
      this.userId = null;
      this.name = null;
      this.tokenExpireTime = null;
    },

    /**
     * 校验 Token 是否已经过期
     * @returns true 表示已过期，false 表示还在有效期内
     */
    isTokenExpired(): boolean {
      // 如果没有过期时间记录，默认视为已过期
      if (!this.tokenExpireTime) return true;
      // 比较当前系统时间是否超过了记录的过期时间
      return Date.now() >= this.tokenExpireTime;
    },
  },

  /**
   * 3. 持久化配置 (Persist)
   * 开启后，Pinia 会自动将 state 存储在浏览器的 LocalStorage 中
   * 这样用户刷新页面后，登录状态依然存在，不会被重置
   */
  persist: true,
});