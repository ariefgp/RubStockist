from app.models import db, Holding, Stock, environment, SCHEMA


# Adds a demo user, you can add other users here if you want
def seed_holdings():

    demo1holding = Holding(
        user_id=1, stock_id=407, shares=2, avg_cost=100.00, total_cost=200.00)

    demo2holding = Holding(
        user_id=1, stock_id=1595, shares=1, avg_cost=70.00, total_cost=70.00)



    db.session.add(demo1holding)
    db.session.add(demo2holding)

    db.session.commit()


def seed_holding_stocks():
    demo1holding = Holding.query.get(1)
    demo2holding = Holding.query.get(2)

    demo1stock = Stock.query.get(407)
    demo2stock = Stock.query.get(1595)

    demo1holding.stock.append(demo1stock)
    demo2holding.stock.append(demo2stock)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_holdings():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM holdings")
        
    db.session.commit()