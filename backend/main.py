import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import FastAPI, HTTPException, Status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from psycopg2.pool import SimpleConnectionPool
import jwt

# Configuration via Environment Variables
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "login_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Rmusapet@1011")
DB_PORT = os.getenv("DB_PORT", "5433")
JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-key-change-in-production")
ALGORITHM = "HS256"

app = FastAPI(title="VM Algo Pro API", version="1.0.0")

# Restrict CORS to local Next.js frontend during dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Thread-safe Connection Pool (1 to 10 connections)
db_pool = SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    host=DB_HOST,
    database=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    port=DB_PORT,
)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(hours=24))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)

class UserRegistration(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@app.get("/")
def health_check():
    return {"status": "ok", "service": "VM Algo Pro Backend API"}

@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserRegistration):
    conn = db_pool.getconn()
    try:
        with conn.cursor() as cursor:
            # Check for existing email
            cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
            if cursor.fetchone():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )

            password_hash = pwd_context.hash(user.password)
            cursor.execute(
                "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
                (user.name, user.email, password_hash)
            )
            conn.commit()
            return {"message": "User registered successfully"}
    finally:
        db_pool.putconn(conn)

@app.post("/login")
def login(user: UserLogin):
    conn = db_pool.getconn()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id, name, email, password_hash FROM users WHERE email = %s",
                (user.email,)
            )
            result = cursor.fetchone()

            if not result or not pwd_context.verify(user.password, result[3]):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )

            user_id, name, email, _ = result
            access_token = create_access_token(data={"sub": str(user_id), "email": email})

            return {
                "message": "Login successful",
                "access_token": access_token,
                "token_type": "bearer",
                "user": {"id": user_id, "name": name, "email": email}
            }
    finally:
        db_pool.putconn(conn)
