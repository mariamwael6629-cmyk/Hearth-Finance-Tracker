from pydantic import BaseModel, ConfigDict


class BillBase(BaseModel):
    name: str
    amount: float
    due_day: int
    month: str = ""
    status: str = "upcoming"
    icon: str = "🧾"


class BillCreate(BillBase):
    pass


class BillUpdate(BaseModel):
    name: str | None = None
    amount: float | None = None
    due_day: int | None = None
    month: str | None = None
    status: str | None = None
    icon: str | None = None


class BillOut(BillBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
