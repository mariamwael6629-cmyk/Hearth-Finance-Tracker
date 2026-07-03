from datetime import date as date_

from pydantic import BaseModel, ConfigDict


class TransactionBase(BaseModel):
    account_id: int
    date: date_
    merchant: str
    category: str
    amount: float
    icon: str = "💳"
    recurring: bool = False


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    account_id: int | None = None
    date: date_ | None = None
    merchant: str | None = None
    category: str | None = None
    amount: float | None = None
    icon: str | None = None
    recurring: bool | None = None


class TransactionOut(TransactionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
