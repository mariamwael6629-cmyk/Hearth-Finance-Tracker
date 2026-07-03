from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.session import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    icon = Column(String, nullable=False, default="🔁")
    amount = Column(Float, nullable=False, default=0)
    cycle = Column(String, nullable=False, default="Monthly")
    next_charge = Column(String, nullable=False, default="")
    category = Column(String, nullable=False, default="")

    owner = relationship("User", back_populates="subscriptions")
