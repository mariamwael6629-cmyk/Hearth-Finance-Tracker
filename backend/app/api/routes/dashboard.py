from collections import defaultdict

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.account import Account
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.dashboard import CategorySlice, DashboardSummary, MonthPoint

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def dashboard_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    accounts = db.query(Account).filter(Account.user_id == current_user.id).all()
    net_worth = sum(a.balance for a in accounts)

    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    income = sum(t.amount for t in transactions if t.amount > 0)
    expense = abs(sum(t.amount for t in transactions if t.amount < 0))
    savings_rate = round(((income - expense) / income) * 100, 1) if income else 0.0

    category_totals: dict[str, float] = defaultdict(float)
    for t in transactions:
        if t.amount < 0:
            category_totals[t.category] += abs(t.amount)
    category_breakdown = [CategorySlice(category=c, amount=round(a, 2)) for c, a in sorted(category_totals.items(), key=lambda x: -x[1])]

    month_totals: dict[str, dict[str, float]] = defaultdict(lambda: {"income": 0.0, "expense": 0.0})
    for t in transactions:
        key = t.date.strftime("%Y-%m")
        if t.amount > 0:
            month_totals[key]["income"] += t.amount
        else:
            month_totals[key]["expense"] += abs(t.amount)
    cashflow = [
        MonthPoint(month=m, income=round(v["income"], 2), expense=round(v["expense"], 2))
        for m, v in sorted(month_totals.items())
    ]

    return DashboardSummary(
        net_worth=round(net_worth, 2),
        monthly_income=round(income, 2),
        monthly_expense=round(expense, 2),
        savings_rate=savings_rate,
        category_breakdown=category_breakdown,
        cashflow=cashflow,
    )
