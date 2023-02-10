from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import db, User, Watchlist, Stock, Holding, News

watchlist_routes = Blueprint('watchlists', __name__)

@watchlist_routes.route('/')
@login_required
def get_user_watchlists():
    """
    Query for all User watchlists and returns them in a list of watchlist dictionaries
    """
    watchlists = Watchlist.query.filter(Watchlist.user_id == current_user.id).all()

    return {'watchlists': [watchlist.to_dict() for watchlist in watchlists]}


@watchlist_routes.route('/', methods=['POST'])
@login_required
def create_watchlist():
    """
    Creates a new watchlist and returns that watchlist in a dictionary
    """

    watchlist = Watchlist(
        name=request.json['name'],
        user_id=current_user.id
    )

    db.session.add(watchlist)
    db.session.commit()
    return watchlist.to_dict()


@watchlist_routes.route('/<int:watchlist_id>')
@login_required
def get_watchlist_by_id(watchlist_id):
    """
    Query for a watchlist by id and returns that watchlist in a dictionary
    """
    watchlist = Watchlist.query.get(watchlist_id)

    # Check if the user is authorized to view this watchlist
    if watchlist.user_id != current_user.id:
        return jsonify({'message': "Unauthorized", 'statusCode': 401}), 401

    return watchlist.to_dict()



@watchlist_routes.route('/<int:watchlist_id>', methods=['PUT'])
@login_required
def update_watchlist_name(watchlist_id):
    """
    Query for a watchlist by id, and update the name of that watchlist
    """
    watchlist = Watchlist.query.get(watchlist_id)

    # Check if the user is authorized to edit this watchlist
    if watchlist.user_id != current_user.id:
        return jsonify({'message': "Unauthorized", 'statusCode': 401}), 401

    watchlist.name = request.json['name']
    db.session.commit()
    return watchlist.to_dict()


@watchlist_routes.route('/<int:watchlist_id>', methods=['DELETE'])
@login_required
def delete_watchlist(watchlist_id):
    """
    Query for a watchlist by id, and delete that watchlist
    """
    watchlist = Watchlist.query.get(watchlist_id)

    # Check if the user is authorized to delete this watchlist
    if watchlist.user_id != current_user.id:
        return jsonify({'message': "Unauthorized", 'statusCode': 401}), 401


    db.session.delete(watchlist)
    db.session.commit()
    return watchlist.to_dict()


@watchlist_routes.route('/<int:id>/stocks')
@login_required
def get_watchlist_stocks(watchlist_id):
    """
    Query for a watchlist by id and returns that watchlist's stocks in a dictionary
    """
    watchlist = Watchlist.query.get(watchlist_id)

    # Check if the user is authorized to view this watchlist
    if watchlist.user_id != current_user.id:
        return jsonify({'message': "Unauthorized", 'statusCode': 401}), 401

    return watchlist.stocks.to_dict()


@watchlist_routes.route('/<int:watchlist_id>/stocks/<int:stock_id>', methods=['POST'])
@login_required
def add_stock_to_watchlist(watchlist_id, stock_id):
    """
    Query for a watchlist by id, and add a stock to that watchlist
    """
    watchlist = Watchlist.query.get(watchlist_id)
    stock = Stock.query.get(stock_id)

    # Check if the user is authorized to edit this watchlist
    if watchlist.user_id != current_user.id:
        return jsonify({'message': "Unauthorized", 'statusCode': 401}), 401

    watchlist.stocks.append(stock)
    db.session.commit()
    return watchlist.to_dict()


@watchlist_routes.route('/<int:watchlist_id>/stocks/<int:stock_id>', methods=['DELETE'])
@login_required
def delete_stock_from_watchlist(watchlist_id, stock_id):
    """
    Query for a watchlist by id, and delete a stock from that watchlist
    """
    watchlist = Watchlist.query.get(watchlist_id)
    stock = Stock.query.get(stock_id)

    # Check if the user is authorized to edit this watchlist
    if watchlist.user_id != current_user.id:
        return jsonify({'message': "Unauthorized", 'statusCode': 401}), 401

    watchlist.stocks.remove(stock)
    db.session.commit()
    return watchlist.to_dict()