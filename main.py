from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine, Column, Integer, String, Text, TIMESTAMP, func, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
import boto3
from fastapi_socketio import SocketManager
from elasticsearch import Elasticsearch

app = FastAPI()
socket_manager = SocketManager(app=app)
es = Elasticsearch(['http://elasticsearch:9200'])
s3_client = boto3.client('s3', aws_access_key_id='YOUR_KEY', aws_secret_access_key='YOUR_SECRET')
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

# PostgreSQL bağlantısı
DATABASE_URL = "postgresql://user:password@postgres:5432/kamu_portal"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modeller
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255))
    bio = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    media_url = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.now())

class Poll(Base):
    __tablename__ = "polls"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    question = Column(Text)
    options = Column(Text)  # JSON string: ["option1", "option2"]
    created_at = Column(TIMESTAMP, server_default=func.now())

# Pydantic modeller
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    bio: str | None = None

class PostCreate(BaseModel):
    content: str
    media_url: str | None = None

class PollCreate(BaseModel):
    question: str
    options: list[str]

# DB bağımlılığı
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Kayıt
@app.post("/register")
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, email=user.email, password_hash=hashed_password, bio=user.bio)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    await es.index(index="users", id=db_user.id, body={"username": user.username, "email": user.email})
    await socket_manager.emit("new_user", {"username": user.username})
    return {"message": "User created", "user_id": db_user.id}

# Gönderi oluşturma
@app.post("/posts")
async def create_post(post: PostCreate, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    db_post = Post(content=post.content, user_id=1, media_url=post.media_url)  # JWT'den user_id al
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    await socket_manager.emit("new_post", {"content": post.content})
    return {"message": "Post created", "post_id": db_post.id}

# Anket oluşturma
@app.post("/polls")
async def create_poll(poll: PollCreate, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    db_poll = Poll(question=poll.question, options=str(poll.options), user_id=1)
    db.add(db_poll)
    db.commit()
    db.refresh(db_poll)
    await socket_manager.emit("new_poll", {"question": poll.question})
    return {"message": "Poll created", "poll_id": db_poll.id}

# Medya yükleme
@app.post("/upload-media")
async def upload_media(file: UploadFile = File(...)):
    s3_client.upload_fileobj(file.file, "kamu-portal-bucket", file.filename)
    url = f"https://kamu-portal-bucket.s3.amazonaws.com/{file.filename}"
    return {"media_url": url}

# Arama
@app.get("/search")
async def search_users(query: str):
    result = es.search(index="users", body={"query": {"match": {"username": query}}})
    return result['hits']['hits']

# Login
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"sub": user.username}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

# WebSocket
@app.sio.on('connect')
async def handle_connect(sid, environ):
    print(f"Client connected: {sid}")

# Tabloları oluştur
Base.metadata.create_all(bind=engine)
