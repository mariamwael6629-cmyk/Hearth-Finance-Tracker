from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.bill import Bill
from app.models.user import User
from app.schemas.bill import BillCreate, BillOut, BillUpdate

router = APIRouter(prefix="/bills", tags=["bills"])


def _get_owned(db: Session, user: User, bill_id: int) -> Bill:
    bill = db.get(Bill, bill_id)
    if not bill or bill.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found")
    return bill


@router.get("", response_model=list[BillOut])
def list_bills(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Bill).filter(Bill.user_id == current_user.id).order_by(Bill.due_day).all()


@router.post("", response_model=BillOut, status_code=status.HTTP_201_CREATED)
def create_bill(payload: BillCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bill = Bill(**payload.model_dump(), user_id=current_user.id)
    db.add(bill)
    db.commit()
    db.refresh(bill)
    return bill


@router.patch("/{bill_id}", response_model=BillOut)
def update_bill(bill_id: int, payload: BillUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bill = _get_owned(db, current_user, bill_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(bill, field, value)
    db.commit()
    db.refresh(bill)
    return bill


@router.delete("/{bill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bill(bill_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bill = _get_owned(db, current_user, bill_id)
    db.delete(bill)
    db.commit()
