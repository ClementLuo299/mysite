from fastapi import Depends, FastAPI, HTTPException, status
from database import engine, Base
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import app.auth as auth

from datetime import timedelta

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = auth.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/protected-route")
async def protected_route(current_user = Depends(auth.get_current_user)):
    return {"message": f"Hello, {current_user.username}! You have access."}

# Serve React build files
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
