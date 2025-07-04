# app/schemas
from pydantic import BaseModel
from datetime import datetime


class ExpenseBase(BaseModel):
    title: str
    category: str
    price: float
    location: str | None = None
    datetime: datetime


class ExpenseCreate(ExpenseBase):
    pass


class Expense(ExpenseBase):
    id: int

    class Config:
        orm_mode = True
