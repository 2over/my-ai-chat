from datetime import datetime, timedelta, timezone
from typing import Optional, Annotated
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pwdlib import PasswordHash
from pydantic import BaseModel, Field


# JWT和安全配置

# JWT密钥配置 - 生产环境中应该使用环境变量或密钥管理服务
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"  # 警告：生产环境请使用强密钥并通过环境变量管理
ALGORITHM = "HS256"  # JWT签名算法
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Token过期时间（分钟）


# 密码加密上下文配置
# 安全哈希算法
password_hash = PasswordHash.recommended()

# OAuth2密码Bearer令牌方案
# tokenURl: 获取token的端点URL, 必须与实际的token端点路径匹配，是给swagger中的登录使用的
# 告诉FastAPI和前端客户端在哪里获取访问令牌，会自动在请求头中获取Bearer后面的token
oauth2_schema = OAuth2PasswordBearer(tokenUrl="/users/token")


# 创建路由器实例
# 这个路由将包含所有用户相关的路由
router = APIRouter()


# Pydantic数据模型定义
class LogiRequest(BaseModel):
    """
        用户登录输入的模型
    """
    username: str = Field(description="用户名")
    password: str = Field(description="密码")

class Token(BaseModel):
    """
    访问令牌相应模型
    用于登录成功后返回JWT令牌
    """

    message: str
    access_token: str # JWT访问令牌
    token_type: str # 令牌类型, 通常是bearer
    username: str


class TokenData(BaseModel):
    """
    令牌数据模型
    用于解析JWT令牌中的用户信息
    """
    username: Optional[str] = None # 用户名


class User(BaseModel):
    """
    用户基础信息模型
    定义用户的公开信息(不包含密码等敏感信息)
    """
    username: str # 用户名
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    """
    数据库中的用户模型
    继承User模型，添加了密码哈希字段
    """
    hashed_password: str # 哈希后的密码

class UserCreate(BaseModel):
    """
    用户注册时接收前端传来的数据
    """

    username: str # 用户名
    password: str # 铭文密码
    email: Optional[str] = None
    full_name: Optional[str] = None


class UserUpdate(BaseModel):
    """
    用户更新请求模型
    用于更新用户信息时接收前端传来的数据
    """
    email: Optional[str] = None
    full_name: Optional[str] = None