from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

class News(db.Model):
    __tablename__ = "news"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    bookmark = db.Column(db.Boolean, nullable=False, default=False)
    symbol = db.Column(db.String(255))
    title = db.Column(db.Text)
    summary = db.Column(db.Text)
    source = db.Column(db.String(255))
    url = db.Column(db.Text)
    image_link = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now())

    user = db.relationship('User', back_populates='news')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'bookmark': self.bookmark,
            'symbol': self.symbol,
            'title': self.title,
            'summary': self.summary,
            'source': self.source,
            'url': self.url,
            'image_link': self.image_link,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'updated_at': self.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
        }
