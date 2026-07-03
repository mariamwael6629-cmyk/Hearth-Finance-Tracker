from pydantic import BaseModel, ConfigDict


class SubscriptionBase(BaseModel):
    name: str
    icon: str = "🔁"
    amount: float
    cycle: str = "Monthly"
    next_charge: str = ""
    category: str = ""


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionUpdate(BaseModel):
    name: str | None = None
    icon: str | None = None
    amount: float | None = None
    cycle: str | None = None
    next_charge: str | None = None
    category: str | None = None


class SubscriptionOut(SubscriptionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
