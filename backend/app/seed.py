"""Seed the database with a demo user and sample financial data.

Run with: python -m app.seed
"""
from datetime import date

from app.core.security import hash_password
from app.db.session import Base, SessionLocal, engine
from app.models.account import Account
from app.models.bill import Bill
from app.models.budget import Budget
from app.models.goal import Goal
from app.models.subscription import Subscription
from app.models.transaction import Transaction
from app.models.user import User

DEMO_EMAIL = "demo@hearth.app"
DEMO_PASSWORD = "password123"


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(User).filter(User.email == DEMO_EMAIL).first():
            print(f"Demo user {DEMO_EMAIL} already exists, skipping seed.")
            return

        user = User(
            email=DEMO_EMAIL,
            hashed_password=hash_password(DEMO_PASSWORD),
            first_name="Mariam",
            last_name="Khalil",
            currency="USD",
            monthly_income=7000,
            savings_target=2000,
        )
        db.add(user)
        db.flush()

        accounts = [
            Account(user_id=user.id, name="Primary Checking", type="checking", balance=12480.55, color="#CC8350"),
            Account(user_id=user.id, name="Savings Account", type="savings", balance=28350.00, color="#B5562E"),
            Account(user_id=user.id, name="Investment Portfolio", type="investment", balance=54200.00, color="#CE9A52"),
            Account(user_id=user.id, name="Credit Card", type="credit", balance=-2140.33, color="#E2825F"),
        ]
        db.add_all(accounts)
        db.flush()
        checking, savings, investment, credit = accounts

        transactions = [
            ("2025-06-17", "Whole Foods Market", "Groceries", -124.50, checking, "🛒", False),
            ("2025-06-17", "Monthly Salary", "Income", 5200.00, checking, "💼", True),
            ("2025-06-16", "Rent Payment", "Housing", -2200.00, checking, "🏠", True),
            ("2025-06-15", "Netflix", "Subscriptions", -15.99, credit, "📺", True),
            ("2025-06-15", "Spotify", "Subscriptions", -9.99, credit, "🎵", True),
            ("2025-06-14", "Uber", "Transport", -18.40, credit, "🚗", False),
            ("2025-06-14", "Freelance Project", "Income", 1800.00, savings, "💻", False),
            ("2025-06-13", "Restaurant Le Petit", "Dining", -67.80, credit, "🍽️", False),
            ("2025-06-12", "Gym Membership", "Health", -45.00, credit, "💪", True),
            ("2025-06-11", "Amazon", "Shopping", -89.99, credit, "📦", False),
            ("2025-06-10", "Electric Bill", "Utilities", -112.30, checking, "⚡", True),
            ("2025-06-09", "Coffee Artisan", "Dining", -6.80, credit, "☕", False),
            ("2025-06-08", "Dividend Payment", "Income", 340.00, investment, "📈", False),
            ("2025-06-07", "Phone Bill", "Utilities", -55.00, checking, "📱", True),
            ("2025-06-06", "Book Store", "Education", -32.00, credit, "📚", False),
            ("2025-06-05", "Pharmacy", "Health", -28.50, credit, "💊", False),
            ("2025-06-04", "Yoga Studio", "Health", -80.00, credit, "🧘", True),
            ("2025-06-03", "Online Course", "Education", -199.00, credit, "🎓", False),
            ("2025-06-02", "Farmers Market", "Groceries", -45.20, checking, "🌿", False),
            ("2025-06-01", "Insurance Premium", "Insurance", -145.00, checking, "🛡️", True),
        ]
        for d, merchant, category, amount, account, icon, recurring in transactions:
            db.add(Transaction(
                user_id=user.id, account_id=account.id, date=date.fromisoformat(d),
                merchant=merchant, category=category, amount=amount, icon=icon, recurring=recurring,
            ))

        budgets = [
            ("Groceries", 500, 169.70, "🛒", "#CC8350"),
            ("Dining", 300, 74.60, "🍽️", "#E2825F"),
            ("Transport", 200, 18.40, "🚗", "#CE9A52"),
            ("Health", 250, 153.50, "💪", "#D9A892"),
            ("Shopping", 400, 89.99, "🛍️", "#A8543A"),
            ("Utilities", 300, 167.30, "⚡", "#B5562E"),
            ("Subscriptions", 100, 25.98, "📺", "#CC8350"),
            ("Education", 300, 231.00, "📚", "#CE9A52"),
        ]
        for category, limit, spent, icon, color in budgets:
            db.add(Budget(user_id=user.id, category=category, limit=limit, spent=spent, icon=icon, color=color, month="June 2025"))

        goals = [
            ("Emergency Fund", "🛡️", 15000, 9200, 500, "Oct 2026"),
            ("Dream Vacation", "✈️", 6000, 2800, 350, "Mar 2026"),
            ("New MacBook Pro", "💻", 2500, 1900, 300, "Aug 2025"),
            ("Investment Portfolio", "📈", 50000, 28000, 1000, "Jan 2027"),
            ("Home Down Payment", "🏠", 80000, 22000, 1500, "Jun 2029"),
        ]
        for name, icon, target, saved, monthly, eta in goals:
            db.add(Goal(user_id=user.id, name=name, icon=icon, target=target, saved=saved, monthly=monthly, eta=eta))

        subscriptions = [
            ("Netflix", "📺", 15.99, "Monthly", "Jun 25", "Entertainment"),
            ("Spotify", "🎵", 9.99, "Monthly", "Jun 25", "Entertainment"),
            ("Gym Membership", "💪", 45.00, "Monthly", "Jul 1", "Health"),
            ("Adobe CC", "🎨", 54.99, "Monthly", "Jun 28", "Software"),
            ("iCloud Storage", "☁️", 2.99, "Monthly", "Jun 22", "Software"),
            ("Yoga Studio", "🧘", 80.00, "Monthly", "Jul 4", "Health"),
        ]
        for name, icon, amount, cycle, next_charge, category in subscriptions:
            db.add(Subscription(user_id=user.id, name=name, icon=icon, amount=amount, cycle=cycle, next_charge=next_charge, category=category))

        bills = [
            ("Rent Payment", 2200.00, 1, "Jul", "upcoming", "🏠"),
            ("Electric Bill", 112.30, 10, "Jun", "paid", "⚡"),
            ("Phone Bill", 55.00, 7, "Jun", "paid", "📱"),
            ("Insurance Premium", 145.00, 1, "Jun", "paid", "🛡️"),
            ("Internet Service", 70.00, 20, "Jun", "due", "📡"),
            ("Water Bill", 38.50, 25, "Jun", "upcoming", "💧"),
        ]
        for name, amount, due_day, month, status, icon in bills:
            db.add(Bill(user_id=user.id, name=name, amount=amount, due_day=due_day, month=month, status=status, icon=icon))

        db.commit()
        print(f"Seeded demo user: {DEMO_EMAIL} / {DEMO_PASSWORD}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
