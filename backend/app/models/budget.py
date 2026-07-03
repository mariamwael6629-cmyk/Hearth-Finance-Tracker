from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.session import Base


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String, nullable=False)
    limit = Column(Float, nullable=False, default=0)
    spent = Column(Float, nullable=False, default=0)
    icon = Column(String, nullable=False, default="💰")
    color = Column(String, nullable=False, default="#CC8350")
    month = Column(String, nullable=False, default="")

    owner = relationship("User", back_populates="budgets")
