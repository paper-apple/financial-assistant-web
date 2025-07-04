# app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas


def create_expense(db: Session, expense: schemas.ExpenseCreate):
    db_expense = models.Expense(**expense.dict())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


def get_expenses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Expense).offset(skip).limit(limit).all()


# Получение одной записи по id
def get_expense_by_id(db: Session, expense_id: int):
    return db.query(models.Expense).filter(models.Expense.id == expense_id).first()

# Обновление существующей записи
def update_expense(
    db: Session,
    db_expense: models.Expense,
    expense_in: schemas.ExpenseCreate,
):
    # Обновляем по полям из Pydantic-модели
    for field, value in expense_in.dict().items():
        setattr(db_expense, field, value)

    db.commit()
    db.refresh(db_expense)
    return db_expense