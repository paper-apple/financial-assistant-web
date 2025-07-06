# app/routers/expenses.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from .. import schemas, models, crud
from .. database import get_db

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.get("/", response_model=list[schemas.Expense])
def read_expenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_expenses(db, skip, limit)


@router.post("/", response_model=schemas.Expense)
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    return crud.create_expense(db, expense)


@router.put(
    "/{expense_id}",
    response_model=schemas.Expense,
    status_code=status.HTTP_200_OK
)
def update_expense(
    expense_id: int,
    expense_in: schemas.ExpenseCreate,
    db: Session = Depends(get_db)
):
    db_expense = crud.get_expense_by_id(db, expense_id)
    if not db_expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense {expense_id} not found"
        )
    return crud.update_expense(db, db_expense, expense_in)

@router.delete(
    "/{expense_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить расход по ID"
)
def remove_expense(
    expense_id: int,
    db: Session = Depends(get_db)
):
    success = crud.delete_expense(db, expense_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense {expense_id} not found"
        )
    # При 204 FastAPI не возвращает тело
    return