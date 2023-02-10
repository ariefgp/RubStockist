from .db import db, environment, SCHEMA, add_prefix_for_prod
from .stock import Stock
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

stocks_holdings = db.Table("holdings_stocks",

    db.Column("stock_id", db.Integer, db.ForeignKey(add_prefix_for_prod("stocks.id")), primary_key=True),
    db.Column("holding_id", db.Integer, db.ForeignKey(add_prefix_for_prod("holdings.id")), primary_key=True)
)

if environment == "production":
    stocks_holdings.schema = SCHEMA

class Holding(db.Model):
    __tablename__ = "holdings"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('stocks.id')), nullable=False)
    shares = db.Column(db.Float, nullable=False)
    avg_cost = db.Column(db.Float, nullable=False)
    total_cost = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())

    user = db.relationship('User', back_populates='holdings')
    stock = db.relationship("Stock", secondary="holdings_stocks", back_populates="holdings")
    
    def to_dict(self):
        # stocks = [stock.to_dict() for stock in self.stock]
        return {
            'id': self.id,
            'user_id': self.user_id,
            'stock_id': self.stock_id,
            'shares': self.shares,
            'avg_cost': self.avg_cost,
            'total_cost': self.total_cost,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'user': self.user.to_dict(),
            'stock': [stock.to_dict() for stock in self.stock]
        }

