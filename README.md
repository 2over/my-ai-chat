# 🤖 AI 聊天机器人项目

基于 FastAPI + Vue3 的智能对话系统，支持流式响应、用户认证和 Markdown 渲染。

## 📚 目录

- [项目简介](#项目简介)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [功能特性](#功能特性)
- [API 文档](#api-文档)
- [配置说明](#配置说明)
- [安全注意事项](#安全注意事项)
- [常见问题](#常见问题)

***

## 🎯 项目简介

这是一个全栈 AI 聊天机器人应用，采用前后端分离架构：

- **后端**：FastAPI + Python，提供 RESTful API
- **前端**：Vue3 + TypeScript，提供现代化交互界面
- **AI 引擎**：阿里云 DashScope (通义千问模型)

***

## 🛠 技术栈

### 后端技术

| 技术            | 版本 | 说明               |
| ------------- | -- | ---------------- |
| FastAPI       | -  | Python 现代 Web 框架 |
| Pydantic      | -  | 数据验证             |
| JWT           | -  | 用户身份认证           |
| openai        | -  | AI API 调用        |
| python-dotenv | -  | 环境变量管理           |

### 前端技术

| 技术           | 版本      | 说明          |
| ------------ | ------- | ----------- |
| Vue          | 3.5.13  | 前端框架        |
| TypeScript   | 5.7.2   | 类型系统        |
| Vite         | 6.2.0   | 构建工具        |
| Pinia        | 3.0.1   | 状态管理        |
| Vue Router   | 4.5.0   | 路由管理        |
| Tailwind CSS | 4.0.17  | UI 样式框架     |
| Axios        | 1.8.4   | HTTP 请求库    |
| Marked       | 12.0.2  | Markdown 解析 |
| Highlight.js | 11.11.1 | 代码高亮        |

***

## 📁 项目结构

```
fastapi项目案例/
├── 案例/                          # 后端项目
│   ├── main.py                    # 应用入口
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config/
│   │   │   ├── __init__.py
│   │   │   └── config.py          # 配置管理
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── chat.py            # 聊天 API
│   │       └── users.py          # 用户 API
│   └── __pycache__/
│
├── chat-ai-ui-main/               # 前端项目
│   ├── src/
│   │   ├── assets/                # 静态资源
│   │   ├── components/           # Vue 组件
│   │   │   ├── ChatInput.vue     # 聊天输入框
│   │   │   └── Header.vue        # 页面头部
│   │   ├── router/
│   │   │   └── index.ts          # 路由配置
│   │   ├── stores/               # Pinia 状态管理
│   │   │   ├── chat.ts           # 聊天状态
│   │   │   └── user.ts           # 用户状态
│   │   ├── views/                # 页面视图
│   │   │   ├── ChatView.vue      # 聊天页面
│   │   │   └── HomeView.vue      # 首页
│   │   ├── App.vue               # 根组件
│   │   ├── main.ts              # 入口文件
│   │   └── style.css            # 全局样式
│   ├── public/                   # 公共资源
│   ├── .env                     # 环境变量
│   ├── package.json             # 依赖配置
│   └── vite.config.ts          # Vite 配置
│
└── .env                         # 后端环境变量
```


![架构图](./架构图.png)

***

## 🚀 快速开始

### 前置要求

- Python 3.12
- Node.js 16+
- npm 或 yarn

### 1. 克隆项目

```bash
git clone <repository-url>
cd fastapi项目案例
```

### 2. 配置环境变量

创建 `.env` 文件（已提供示例）：

```env
# 阿里云 DashScope 配置
DASHSCOPE_API_KEY=your-api-key-here
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1

# DeepSeek 配置（可选）
DEEPSEEK_API_KEY=your-deepseek-key
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

### 3. 启动后端

```bash
# 进入后端目录
cd 案例

# 安装依赖
pip install fastapi uvicorn PyJWT pwdlib[argon2] openai python-dotenv pydantic python-multipart bcrypt==4.3.0

# 启动服务
python main.py
```

后端服务启动后：

- 接口 地址：<http://localhost:8000>
- API 文档：<http://localhost:8000/docs>

### 4. 启动前端

```bash
# 进入前端目录
cd chat-ai-ui-main

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端启动后访问：<http://localhost:5173>

***

## ✨ 功能特性

### 用户功能

- ✅ 用户注册 / 登录
- ✅ JWT 身份认证
- ✅ 获取用户信息
- ✅ 更新用户资料
- ✅ 账户注销

### 聊天功能

- ✅ 发送消息对话
- ✅ 流式响应（实时输出）
- ✅ 聊天历史记录
- ✅ 清空聊天历史
- ✅ 多模型支持

### 前端特性

- 🎨 深色主题界面
- 📝 Markdown 渲染
- 💻 代码语法高亮
- 📱 响应式布局
- 🔄 加载动画
- 💾 自动保存会话

***

## 📖 API 文档

### 用户管理接口

| 方法     | 路径                | 说明     | 认证 |
| ------ | ----------------- | ------ | -- |
| POST   | `/users/token`    | 用户登录   | ❌  |
| POST   | `/users/register` | 用户注册   | ❌  |
| POST   | `/users/logout`   | 用户登出   | ✅  |
| GET    | `/users/me`       | 获取当前用户 | ✅  |
| PUT    | `/users/me`       | 更新用户信息 | ✅  |
| DELETE | `/users/me`       | 删除用户账户 | ✅  |
| GET    | `/users/all`      | 获取所有用户 | ✅  |

### 聊天接口

| 方法     | 路径              | 说明     | 认证 |
| ------ | --------------- | ------ | -- |
| POST   | `/chat/chat`    | 发送聊天消息 | ✅  |
| GET    | `/chat/history` | 获取聊天历史 | ✅  |
| DELETE | `/chat/history` | 清空聊天历史 | ✅  |
| GET    | `/chat/models`  | 获取可用模型 | ✅  |
| GET    | `/chat/health`  | 健康检查   | ❌  |

### 使用示例

#### 登录获取 Token

```bash
curl -X POST "http://localhost:8000/users/token" \
  -H "Content-Type: application/json" \
  -d '{"username": "root", "password": "admin"}'
```

#### 发送聊天消息

```bash
curl -X POST "http://localhost:8000/chat/chat" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "你好，请介绍一下自己"}],
    "stream": false
  }'
```

#### 流式聊天

```bash
curl -X POST "http://localhost:8000/chat/chat" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "写一首诗"}],
    "stream": true
  }'
```

***

## ⚙️ 配置说明

### 后端配置 (config.py)

| 参数          | 说明           | 默认值           |
| ----------- | ------------ | ------------- |
| API\_KEY    | AI 服务 API 密钥 | 从环境变量读取       |
| BASE\_URL   | API 基础地址     | 阿里云 DashScope |
| MODEL\_NAME | 使用的模型        | qwen-turbo    |
| MAX\_TOKENS | 最大生成 token 数 | 2000          |
| TEMPERATURE | 生成随机性 (0-2)  | 0.7           |

### 前端配置 (.env)

| 变量             | 说明        | 默认值                     |
| -------------- | --------- | ----------------------- |
| VITE\_API\_URL | 后端 API 地址 | <http://localhost:8000> |

***

## 🔒 安全注意事项

> ⚠️ 以下问题仅供学习参考，生产环境请务必修复：

1. **JWT 密钥硬编码**
   - 当前密钥直接写在代码中
   - 建议：使用环境变量或密钥管理服务
2. **CORS 允许所有来源**
   - `allow_origins=["*"]` 存在安全风险
   - 建议：指定具体域名
3. **内存存储数据**
   - 用户数据和聊天记录存储在内存中
   - 建议：使用数据库（PostgreSQL/MySQL/Redis）

***

## ❓ 常见问题

### Q1: 如何注册新用户？

访问前端注册页面，或调用 API：

```bash
curl -X POST "http://localhost:8000/users/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "newuser", "password": "password123"}'
```

### Q2: 默认登录账户是什么？

- 用户名：`root`
- 密码：`admin`

### Q3: 如何切换 AI 模型？

修改 `案例/app/config/config.py` 中的 `MODEL_NAME` 参数，支持的模型包括：

- qwen-turbo
- qwen-plus
- qwen-max

### Q4: 前端无法连接后端？

1. 检查后端是否运行在 <http://localhost:8000>
2. 检查前端 .env 中的 VITE\_API\_URL 配置
3. 检查 CORS 配置

### Q5: 如何实现流式输出？

在聊天请求中设置 `stream: true`：

```json
{
  "messages": [{"role": "user", "content": "你好"}],
  "stream": true
}
```

***


