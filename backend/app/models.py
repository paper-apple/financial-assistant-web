# app/models.py
from sqlalchemy import Column, Integer, String, Numeric, DateTime
from .database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(30), nullable=False)
    category = Column(String(30), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    location = Column(String(30), nullable=False)
    datetime = Column(DateTime(timezone=False), nullable=False)
