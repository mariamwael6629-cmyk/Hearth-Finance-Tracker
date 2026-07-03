from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.session import Base


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    icon = Column(String, nullable=False, default="🎯")
    target = Column(Float, nullable=False, default=0)
    saved = Column(Float, nullable=False, default=0)
    monthly = Column(Float, nullable=False, default=0)
    eta = Column(String, nullable=False, default="")

    owner = relationship("User", back_populates="goals")
