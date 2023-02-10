from flask.cli import AppGroup
from .users import seed_users, undo_users
from .stocks import seed_stocks, undo_stocks
from .watchlists import seed_watchlists, seed_watchlist_stocks, undo_watchlists
from .holdings import seed_holdings, undo_holdings, seed_holding_stocks

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_watchlists()
        undo_holdings()
        undo_stocks()
        undo_users()
    seed_users()
    seed_stocks()
    seed_holdings()
    seed_holding_stocks()
    seed_watchlists()
    seed_watchlist_stocks()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_watchlists()
    undo_holdings()
    undo_stocks()
    undo_users()
    # Add other undo functions here