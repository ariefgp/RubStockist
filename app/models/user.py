from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from datetime import datetime

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(255), nullable=False)
    buying_power = db.Column(db.Float, nullable=False, default=10000.00)
    dark_mode_pref = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now(), onupdate=datetime.now())

    holdings = relationship('Holding', back_populates='user')
    watchlists = relationship('Watchlist', back_populates='user')
    news = relationship('News', back_populates='user')

    @property
    def password(self):
        return self.password_hash

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'buying_power': self.buying_power,
            'dark_mode_pref': self.dark_mode_pref,
            # 'holdings': [holding.to_dict() for holding in self.holdings],
            # 'watchlists': [watchlist.to_dict() for watchlist in self.watchlists],
            # 'news': [news.to_dict() for news in self.news],
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
