import os

load_dotenc()


class Config:
    # 阿里云DashScope API
    API_KEY = os.getenv("DASHSCOPE_API_KEY")
    BASE_URL = os.getenv("DASHSCOPE_BASE_URL")
    MODEL_NAME = "qwen-turbo"
    MAX_TOKENS = 2000
    TEMPERATURE = 0.7


    secret_key: str = "your-default-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30