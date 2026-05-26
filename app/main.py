from importlib import reload

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import users, chat

app = FastAPI(title="聊天机器人", version="1.0.0", description="基于fastapi + Vue的聊天机器人")

# 添加CORS中间件，允许前端跨域访问
app.add_middleware(

    CORSMiddleware,
    allow_origins=["*"],  # 生产环境建议指定具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(users.router, prefix="/users", tags=["用户管理"])
app.include_router(chat.router, prefix="/chat", tags=["聊天管理"])

if __name__ == "__main__":
    import uvicorn

    # 打印启动信息
    print("=" * 50)
    print("聊天机器人服务启动中...")
    print("=" * 50)

    print(f"Web界面: http://127.0.0.1:8000")
    print(f"API文档: http://127.0.0.1:8000/docs")

    print("=" * 50)

    # 启动服务器
    uvicorn.run(
        "main:app",  # 应用模块路径
        host="0.0.0.0",  # 监听所有网络接口
        port=8000,  # 端口号
        reload=True,  # 开发模式热重载
        log_level="info",  # 日志级别
    )
