from app.models import db, Watchlist, Stock, environment, SCHEMA


# Adds a demo user, you can add other users here if you want
def seed_watchlists():
    demo1 = Watchlist(
        user_id=1, name="Tech Stocks")

    demo2 = Watchlist(
        user_id=1, name="Moon Shots")

    demo3 = Watchlist(
        user_id=1, name="Ole Reliables")


    db.session.add(demo1)
    db.session.add(demo2)
    db.session.add(demo3)

    db.session.commit()

def seed_watchlist_stocks():
    demo1wl = Watchlist.query.get(1)

    demo1stock1 = Stock.query.get(18)

    demo1stock2 = Stock.query.get(4402)

    demo1wl.stocks.append(demo1stock1)

    demo1wl.stocks.append(demo1stock2)

    demo2wl = Watchlist.query.get(2)

    demo2stock1 = Stock.query.get(1595)

    demo2wl.stocks.append(demo2stock1)

    demo3wl = Watchlist.query.get(3)

    demo3stock1 = Stock.query.get(407)

    demo3wl.stocks.append(demo3stock1)

    db.session.commit()



# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_watchlists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM watchlists")
        
    db.session.commit()