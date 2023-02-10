from flask_sqlalchemy import SQLAlchemy
from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


stocks_watchlists = db.Table("watchlists_stocks",

    db.Column("stock_id", db.Integer, db.ForeignKey(add_prefix_for_prod("stocks.id")), primary_key=True),
    db.Column("watchlist_id", db.Integer, db.ForeignKey(add_prefix_for_prod("watchlists.id")), primary_key=True)
)

if environment == "production":
    stocks_watchlists.schema = SCHEMA

class Watchlist(db.Model):
    __tablename__ = "watchlists"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    name = db.Column(db.String(255), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now(), onupdate=datetime.now())

    user = db.relationship("User", back_populates="watchlists")
    stocks = db.relationship("Stock", secondary="watchlists_stocks", back_populates="watchlists")
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name" : self.name,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": self.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
            "user": self.user.to_dict(),
            "stocks": [stock.to_dict() for stock in self.stocks]
        }
            
