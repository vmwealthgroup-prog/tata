from fastapi import FastAPI ,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
import psycopg2

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="login_db",
        user="postgres",
        password="Rmusapet@1011",
        port=5433
    )
class UserRegistration(BaseModel):
    name: str
    email: str
    password: str
class UserLogin(BaseModel):
    email: str
    password: str    

@app.get("/")
def home():
    return {"message": "Login API is running"}

@app.post("/register")
def register(user: UserRegistration):
    password_hash = pwd_context.hash(user.password)
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
        (user.name, user.email,password_hash)
    )
    connection.commit()
    cursor.close()
    connection.close()
    return {"message": "User registered successfully"}

@app.post("/login")
def login(user: UserLogin):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "SELECT name, email, password_hash FROM users WHERE email = %s",
        (user.email,)
    )
    result = cursor.fetchone()
    cursor.close()
    connection.close()

    if result is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    name, email, password_hash = result

    if not pwd_context.verify(user.password, password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"message": "Login successful", "name": name, "email": email}