from pydantic import BaseModel


class CategorySlice(BaseModel):
    category: str
    amount: float


class MonthPoint(BaseModel):
    month: str
    income: float
    expense: float


class DashboardSummary(BaseModel):
    net_worth: float
    monthly_income: float
    monthly_expense: float
    savings_rate: float
    category_breakdown: list[CategorySlice]
    cashflow: list[MonthPoint]
