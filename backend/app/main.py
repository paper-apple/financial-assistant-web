# app/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .routers import expenses
from . import models, schemas, crud, database

# создаём таблицы (для dev)
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()
app.include_router(expenses.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # адрес фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# @app.get("/todos/", response_model=list[schemas.Todo])
# def read_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     return crud.get_todos(db, skip=skip, limit=limit)
#
# @app.post("/todos/", response_model=schemas.Todo, status_code=201)
# def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
#     return crud.create_todo(db, todo)
