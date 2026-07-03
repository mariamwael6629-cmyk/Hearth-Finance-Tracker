from pydantic import BaseModel, ConfigDict


class BudgetBase(BaseModel):
    category: str
    limit: float
    spent: float = 0
    icon: str = "💰"
    color: str = "#CC8350"
    month: str = ""


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BaseModel):
    category: str | None = None
    limit: float | None = None
    spent: float | None = None
    icon: str | None = None
    color: str | None = None
    month: str | None = None


class BudgetOut(BudgetBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
