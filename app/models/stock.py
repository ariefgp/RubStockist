from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

class Stock(db.Model):
    __tablename__ = "stocks"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    symbol = db.Column(db.String(255), nullable=False)
    company_name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now(), onupdate=datetime.now())

    watchlists = db.relationship("Watchlist", secondary="watchlists_stocks", back_populates="stocks")
    holdings = db.relationship("Holding", back_populates="stock")

    def to_dict(self):
        return {
            "id": self.id,
            "symbol": self.symbol,
            "company_name": self.company_name,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": self.updated_at.strftime("%Y-%m-%d %H:%M:%S")
        }
