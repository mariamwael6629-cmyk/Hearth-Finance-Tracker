from pydantic import BaseModel, EmailStr, ConfigDict, Field


class UserCreate(BaseModel):
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    currency: str = "USD"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    currency: str | None = None
    monthly_income: float | None = None
    savings_target: float | None = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    first_name: str
    last_name: str
    currency: str
    monthly_income: float
    savings_target: float
    name: str
    initials: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
