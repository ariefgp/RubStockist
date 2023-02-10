from app.models import db, User, Stock, environment, SCHEMA
import csv
import os

# def seed_stocks():

#     with open(f'{os.path.dirname(__file__)}/all_stocks.csv', 'r') as readfile:
#         for line in readfile.readlines()[1:]:
#             symbol, company_name = line.split(',')[:2]
#             db.session.add(Stock(symbol=symbol, company_name=company_name))

#     db.session.commit()


# def seed_stocks():
#     with open(f'{os.path.dirname(__file__)}/12data_stocks.csv', 'r') as readfile:
#         reader = csv.reader(readfile, delimiter=';')
#         next(reader)  # skip the header row
#         for row in reader:
#             symbol, name, currency, *_ = row
#             if currency == 'USD':
#                 db.session.add(Stock(symbol=symbol, company_name=name))
    
#     db.session.commit()

def seed_stocks():
    from app import app
    
    with app.app_context():
        stock_dict = {}

        with open(f'{os.path.dirname(__file__)}/av_active_stocks.csv', 'r') as readfile:
            reader = csv.reader(readfile, delimiter=',')
            next(reader) # skip the header row
            for row in reader:
                symbol, name, *_ = row
                stock_dict[symbol] = name
        with open(f'{os.path.dirname(__file__)}/12data_stocks.csv', 'r') as readfile:
            reader = csv.reader(readfile, delimiter=';')
            next(reader)  # skip the header row
            for row in reader:
                symbol, name, currency, exchange, mic_code, country, *_ = row
                # if currency == 'USD' and symbol in stock_dict and stock_dict[symbol] == name:
                if currency == 'USD' and country == 'United States' and symbol in stock_dict:
                    db.session.add(Stock(symbol=symbol, company_name=name))

        db.session.commit()



# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.

def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM stocks")
       
    db.session.commit()
