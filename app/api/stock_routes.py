from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import db, User, Watchlist, Stock, Holding, News
from app.config import Config
import requests
import time
import finnhub

stock_routes = Blueprint('stocks', __name__)

av_api_key = Config.AV_API_KEY
twelve_api_key = Config.TWELVE_API_KEY
twelve_native_api_key = Config.TWELVE_NATIVE_API_KEY
finn_hub_api_key = Config.FINN_HUB_API_KEY

# Setup client
finnhub_client = finnhub.Client(api_key=finn_hub_api_key)

@stock_routes.route('/search/<string:query>')
def search_stocks(query):
    """
    Query the db for a stock by symbol and returns that data in a dictionary
    """

    #  this filters stocks by symbol or company name (case insensitive) and prioritize symbol matches over company name matches

    stocks = Stock.query.filter(Stock.symbol.ilike(f'%{query}%')).all()
    stocks += Stock.query.filter(Stock.symbol.ilike(f'%{query}%') == False, Stock.company_name.ilike(f'%{query}%')).all()

    return {'stocks': [stock.to_dict() for stock in stocks]}


@stock_routes.route('/search/db/<string:symbol>')
def get_stock_by_symbol(symbol):
    """
    Query the db for a stock by symbol and returns that data in a dictionary
    """
    stock = Stock.query.filter(Stock.symbol == symbol.upper()).first()

    # print('-------------')
    # print(stock.to_dict())

    if not stock:
        return {'message': 'Stock not found'}, 404

    return stock.to_dict()



@stock_routes.route('/search/db/id/<int:stock_id>')
def get_stock_by_id(stock_id):
    """
    Query the db for a stock by id and returns that data in a dictionary
    """
    stock = Stock.query.filter(Stock.id == stock_id).first()

    # print('-------------')
    # print(stock.to_dict())

    if not stock:
        return {'message': 'Stock not found'}, 404

    return stock.to_dict()


@stock_routes.route('/all')
def get_all_stocks():
    """
    Query the db for all stocks and returns that data in a dictionary
    """
    stocks = Stock.query.all()

    return {
        'stocks': [stock.to_dict() for stock in stocks],
        'byId': [stock.to_dict() for stock in stocks]
    }


@stock_routes.route('/data/finn-hub/current/<string:symbol>')
def get_current_stock_data_by_symbol_finn_hubb(symbol):
    """
    Query the FinnHUb API for a stock by symbol and returns that data in a dictionary
    """

    retries = 3
    while retries > 0:
        try:
            time.sleep(1)

            # trying to use requests package instead of finnhub client

            # url = "https://finnhub.io/api/v1/quote?symbol={}&token={}".format(symbol, finn_hub_api_key)

            url = "https://finnhub.io/api/v1/quote"

            querystring = {
                "symbol": symbol,
                "token": finn_hub_api_key
            }

            res = requests.get(url, params=querystring).json()


            # finnhub client method
            '''
            res = finnhub_client.quote(symbol)

            # if res.status_code != 200:
            #     return {'message': 'Stock not found'}, 404

            print('finn hub res', res)

            '''
            return res

        except Exception as e:
            retries -= 1
            if retries == 0:
                print (f'Error fetching data for symbol {symbol}: {e}')
                return {'message': f'Error fetching data for symbol {symbol}: {e}'}, 500
            time.sleep(1)
    
    # return res


@stock_routes.route('/data/current/<string:symbol>')
def get_current_stock_data_by_symbol(symbol):
    """
    Query the TWELVE API for a stock by symbol and returns that data in a dictionary
    """
    url = "https://twelve-data1.p.rapidapi.com/quote"

    querystring = {
        "symbol": symbol,
        "interval":"5min",
        "outputsize":"288",
        "format":"json"
    }

    headers = {
        "X-RapidAPI-Key": twelve_api_key,
        "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com"
    }

    res = requests.get(url, headers=headers, params=querystring).json()

    # if res.status_code != 200:
    #     return {'message': 'Stock not found'}, 404

    return res




@stock_routes.route('/data/time-series/<string:symbol>/<string:filter>')
def get_timeseries_stock_data_by_symbol(symbol, filter):
    """
    Query the TWELVE API for a stock by symbol and returns that data in a dictionary
    """
    useRapid = True
    delay = 0

    # filter = request.args.get('filter') or '1D'
    if not filter:
        filter = '1D'

    # interval = request.args.get('interval') or '5min'
    # outputsize = request.args.get('outputsize') or '288'

    if filter == '1D':
        interval = '5min'
        outputsize = '288'
    elif filter == '1W':
        interval = '1h'
        outputsize = '168'
    elif filter == '1M':
        interval = '1h'
        outputsize = '720'
    elif filter == '3M':
        interval = '1day'
        outputsize = '90'
    elif filter == '1Y':
        interval = '1day'
        outputsize = '365'
    elif filter == '5Y':
        interval = '1day'
        outputsize = '1825'
    else:
        interval = '5min'
        outputsize = '288'

    if filter == '1D':
        delay = 0.5
    else:
        delay = 1

    time.sleep(0.5)

    if not useRapid:

        # url = "https://twelve-data1.p.rapidapi.com/time_series"
        url = 'https://api.twelvedata.com/time_series'

        querystring = {
            "symbol": symbol,
            "interval": interval,
            "outputsize": outputsize,
            "format":"json",
            "apikey": twelve_native_api_key
        }

        # headers = {
        #     "X-RapidAPI-Key": twelve_api_key,
        #     "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com"
        # }

        # res = requests.get(url, headers=headers, params=querystring).json()
        res = requests.get(url, params=querystring, timeout=20).json()

        # if res.status_code != 200:
        #     return {'message': 'Stock not found'}, 404

        # print('RESPONSE FOR STOCK DATA ------', res)

    else: 
        url = "https://twelve-data1.p.rapidapi.com/time_series"

        querystring = {
            "symbol": symbol,
            "interval": interval,
            "outputsize": outputsize,
            "format":"json"
        }

        headers = {
            "X-RapidAPI-Key": twelve_api_key,
            "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com"
        }

        res = requests.get(url, headers=headers, params=querystring).json()

        # if res.status_code != 200:
        #     return {'message': 'Stock not found'}, 404

        if 'message' in res:
            return {'message': 'Minutely API Limit Reached'}, 429

        # print('RESPONSE FOR STOCK DATA ------', res)

    time.sleep(delay)

    return res


@stock_routes.route('/data/<string:symbol>')
def get_stock_data_by_symbol(symbol):
    """
    Query the AV API for a stock by symbol and returns that data in a dictionary
    """
    func = request.args.get('func') or 'daily'

    if func == 'daily':
        func = 'TIME_SERIES_DAILY_ADJUSTED'
    elif func == 'minutely':
        func = 'TIME_SERIES_INTRADAY'
    else:
        func = 'TIME_SERIES_DAILY_ADJUSTED'

    interval = ''
    interval_string = ''
    if interval == 'minutely':
        interval_string  = '&interval=5min'

    url = 'https://www.alphavantage.co/query?' + 'function=TIME_SERIES_DAILY_ADJUSTED' + '&symbol=' + symbol + '&apikey=' + av_api_key + '&outputsize=full'

    res = requests.get(url).json()

    return res


@stock_routes.route('/company-info/<string:symbol>')
def get_company_info(symbol):
    """
    Query the AV API for a company info by symbol and returns that data in a dictionary
    """

    url = 'https://www.alphavantage.co/query?' + 'function=OVERVIEW' + '&symbol=' + symbol + '&apikey=' + av_api_key

    res = requests.get(url).json()

    # print(res)

    # if (res.keys().length == 0):
    #     return {'error': 'No company info found'}

    if (res.keys() == 0):
        return {'error': 'No company info found'}

    elif 'error' in res:
        return {'error': res['error']}

    elif 'Description' in res:
        return res

    time.sleep(1)

    return res


