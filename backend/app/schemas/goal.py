from pydantic import BaseModel, ConfigDict


class GoalBase(BaseModel):
    name: str
    icon: str = "🎯"
    target: float
    saved: float = 0
    monthly: float = 0
    eta: str = ""


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    name: str | None = None
    icon: str | None = None
    target: float | None = None
    saved: float | None = None
    monthly: float | None = None
    eta: str | None = None


class GoalOut(GoalBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class GoalContribution(BaseModel):
    amount: float
