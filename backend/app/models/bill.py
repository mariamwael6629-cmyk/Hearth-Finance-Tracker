from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.session import Base


class Bill(Base):
    __tablename__ = "bills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    amount = Column(Float, nullable=False, default=0)
    due_day = Column(Integer, nullable=False, default=1)
    month = Column(String, nullable=False, default="")
    status = Column(String, nullable=False, default="upcoming")
    icon = Column(String, nullable=False, default="🧾")

    owner = relationship("User", back_populates="bills")
