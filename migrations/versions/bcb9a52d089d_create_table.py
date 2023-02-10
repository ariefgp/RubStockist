"""create table

Revision ID: bcb9a52d089d
Revises: 
Create Date: 2023-02-03 12:12:01.386954

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = 'bcb9a52d089d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('stocks',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('symbol', sa.String(length=255), nullable=False),
    sa.Column('company_name', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
       op.execute(f"ALTER TABLE stocks SET SCHEMA {SCHEMA};")

    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('password_hash', sa.String(length=255), nullable=False),
    sa.Column('username', sa.String(length=255), nullable=False),
    sa.Column('buying_power', sa.Float(), nullable=False),
    sa.Column('dark_mode_pref', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )

    if environment == "production":
       op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")

    op.create_table('holdings',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('stock_id', sa.Integer(), nullable=False),
    sa.Column('shares', sa.Float(), nullable=False),
    sa.Column('avg_cost', sa.Float(), nullable=False),
    sa.Column('total_cost', sa.Float(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['stock_id'], ['stocks.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
       op.execute(f"ALTER TABLE holdings SET SCHEMA {SCHEMA};")

    op.create_table('news',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('bookmark', sa.Boolean(), nullable=False),
    sa.Column('symbol', sa.String(length=255), nullable=True),
    sa.Column('title', sa.Text(), nullable=True),
    sa.Column('summary', sa.Text(), nullable=True),
    sa.Column('source', sa.String(length=255), nullable=True),
    sa.Column('url', sa.Text(), nullable=True),
    sa.Column('image_link', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
       op.execute(f"ALTER TABLE news SET SCHEMA {SCHEMA};")

    op.create_table('watchlists',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
       op.execute(f"ALTER TABLE watchlists SET SCHEMA {SCHEMA};")

    op.create_table('holdings_stocks',
    sa.Column('stock_id', sa.Integer(), nullable=False),
    sa.Column('holding_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['holding_id'], ['holdings.id'], ),
    sa.ForeignKeyConstraint(['stock_id'], ['stocks.id'], ),
    sa.PrimaryKeyConstraint('stock_id', 'holding_id')
    )

    if environment == "production":
       op.execute(f"ALTER TABLE holdings_stocks SET SCHEMA {SCHEMA};")

    op.create_table('watchlists_stocks',
    sa.Column('stock_id', sa.Integer(), nullable=False),
    sa.Column('watchlist_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['stock_id'], ['stocks.id'], ),
    sa.ForeignKeyConstraint(['watchlist_id'], ['watchlists.id'], ),
    sa.PrimaryKeyConstraint('stock_id', 'watchlist_id')
    )

    if environment == "production":
       op.execute(f"ALTER TABLE watchlists_stocks SET SCHEMA {SCHEMA};")
       
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('watchlists_stocks')
    op.drop_table('holdings_stocks')
    op.drop_table('watchlists')
    op.drop_table('news')
    op.drop_table('holdings')
    op.drop_table('users')
    op.drop_table('stocks')
    # ### end Alembic commands ###
