from pydantic import BaseModel, ConfigDict


class AccountBase(BaseModel):
    name: str
    type: str = "checking"
    balance: float = 0
    color: str = "#CC8350"


class AccountCreate(AccountBase):
    pass


class AccountUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    balance: float | None = None
    color: str | None = None


class AccountOut(AccountBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
