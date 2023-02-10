from fastapi import FastAPI
from src.model.database import create_db
from src.routers import author, publication

create_db()
app = FastAPI()

app.include_router(author.router)
app.include_router(publication.router)
