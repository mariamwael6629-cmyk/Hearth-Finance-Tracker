from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=False, default="")
    last_name = Column(String, nullable=False, default="")
    currency = Column(String, nullable=False, default="USD")
    monthly_income = Column(Float, nullable=False, default=0)
    savings_target = Column(Float, nullable=False, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    accounts = relationship("Account", back_populates="owner", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="owner", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="owner", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="owner", cascade="all, delete-orphan")
    subscriptions = relationship("Subscription", back_populates="owner", cascade="all, delete-orphan")
    bills = relationship("Bill", back_populates="owner", cascade="all, delete-orphan")

    @property
    def initials(self) -> str:
        first = self.first_name[:1] if self.first_name else ""
        last = self.last_name[:1] if self.last_name else ""
        return (first + last).upper() or self.email[:2].upper()

    @property
    def name(self) -> str:
        full = f"{self.first_name} {self.last_name}".strip()
        return full or self.email
