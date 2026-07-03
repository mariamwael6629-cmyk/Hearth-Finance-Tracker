from fastapi import APIRouter

from app.api.routes import accounts, auth, bills, budgets, dashboard, goals, subscriptions, transactions

api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(accounts.router)
api_router.include_router(transactions.router)
api_router.include_router(budgets.router)
api_router.include_router(goals.router)
api_router.include_router(subscriptions.router)
api_router.include_router(bills.router)
api_router.include_router(dashboard.router)
