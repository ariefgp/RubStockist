from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import db, User, Watchlist, Stock, Holding, News

holding_routes = Blueprint('holdings', __name__)

@holding_routes.route('/')
@login_required
def get_user_holdings():
    """
    Query for all User holdings and returns them in a list of holding dictionaries
    """
    holdings = Holding.query.filter(Holding.user_id == current_user.id).all()
    holding_list = []
    for holding in holdings:
        holding_list.append(holding.to_dict())
    return {'holdings': holding_list}



@holding_routes.route('/', methods=['POST'])
@login_required
def create_holding():
    """
    Creates a new holding and returns that holding in a dictionary
    """
    stock_id = request.json['stock_id']
    quantity = request.json['quantity']
    stock_price = request.json['stock_price']

    # Retrieve the current user's buying power
    user = User.query.get(current_user.id)
    buying_power = user.buying_power

    # Check if the user already has a holding for this stock
    holding = Holding.query.filter(Holding.stock_id == stock_id, Holding.user_id == current_user.id).first()
    if holding:
        return jsonify({'message': "Holding already exists", 'statusCode': 400}), 400

    # Check if the user is trying to purchase a negative amount of stock
    if float(quantity) < 0:
        return jsonify({'message': "Invalid quantity", 'statusCode': 400}), 400
    
    # Check if stock exists
    stock = Stock.query.get(stock_id)
    if not stock:
        return jsonify({'message': "Stock does not exist", 'statusCode': 400}), 400

    # Calculate the cost of the stock
    cost = float(stock_price) * float(quantity)

    # Check if the user has enough buying power to purchase the stock
    if cost > buying_power:
        return jsonify({'message': "Not enough buying power", 'statusCode': 400}), 400

    holding = Holding(
        stock_id=stock_id,
        user_id=current_user.id,
        shares=quantity,
        avg_cost=stock_price,
        total_cost=cost
    )

    holding.stock.append(stock)

    # Update the user's buying power
    user.buying_power -= cost
    db.session.add(holding)
    db.session.commit()

    return holding.to_dict()


@holding_routes.route('/<int:holding_id>', methods=['DELETE'])
@login_required
def delete_holding(holding_id):
    """
    Query for a holding by id, and delete that holding
    """
    holding = Holding.query.get(holding_id)

    # Check if the user is authorized to delete this holding
    if holding.user_id != current_user.id:
        return jsonify({'message': "Unauthorized", 'statusCode': 401}), 401


    # Note quantity is negative for delete routes

    stock_price = request.json['stock_price']
    quantity = request.json['quantity']

    # Validate that the quantity of the holding is equal to the quantity being sold
    if (float(holding.shares) + float(quantity) != 0):
        return jsonify({'message': "Invalid quantity", 'statusCode': 400}), 400

    shares = holding.shares
    revenue = float(stock_price) * float(shares)

    # Retrieve the current user
    user = User.query.get(current_user.id)

    # Add the revenue to the user's buying power
    user.buying_power += revenue

    db.session.delete(holding)
    db.session.commit()
    return jsonify ({'message': "Holding deleted", 'statusCode': 200}), 200


@holding_routes.route('/symbol/<string:symbol>')
@login_required
def get_holdings_by_symbol(symbol):
    """
    Query for holdings of a specific stock symbol and returns them in a list of holding dictionaries
    """
    stock = Stock.query.filter_by(symbol=symbol).first()
    if stock:
        holding = Holding.query.filter(Holding.stock_id == stock.id, Holding.user_id == current_user.id).first()
        if holding:
            # print(holding)
            # print('------------------')
            return holding.to_dict()
        else:
            return jsonify({'message': "No holdings for this stock and user", 'statusCode': 204}), 204
    else:
        return jsonify({'message': "Stock not found", 'statusCode': 404}), 404



@holding_routes.route('/<int:holding_id>')
@login_required
def get_holding_by_id(holding_id):
    """
    Query for a holding by id and returns that holding in a dictionary
    """
    holding = Holding.query.get(holding_id)

    # Check if the user is authorized to view this holding
    if holding.user_id != current_user.id:
        return jsonify({'message': "Unauthorized", 'statusCode': 401}), 401

    return holding.to_dict()


@holding_routes.route('/<int:holding_id>', methods=['PUT'])
@login_required
def update_holding_quantity(holding_id):
    """
    Query for a holding by id, and update the quantity of that holding
    """
    holding = Holding.query.get(holding_id)

    # Check if the user is authorized to edit this holding
    if holding.user_id != current_user.id:
        return jsonify({'message': "Unauthorized", 'statusCode': 401}), 401

    # Retrieve the current user
    user = User.query.get(current_user.id)
    buying_power = float(user.buying_power)
    new_quantity = request.json['quantity']
    stock_price = request.json['stock_price']
    old_quantity = holding.shares
    # cost = float(stock_price) * (float(new_quantity) - float(old_quantity))
    cost = float(stock_price) * float(new_quantity)

    # For a buy order, quantity is positive
    if (float(old_quantity) + float(new_quantity)) > 0 and float(new_quantity) > 0:
        if cost > buying_power:
            return jsonify({'message': "Not enough buying power", 'statusCode': 400}), 400
        user.buying_power -= cost
        holding.total_cost += cost
        holding.shares = (float(old_quantity) + float(new_quantity))
        if holding.shares > 0:
            holding.avg_cost = holding.total_cost / holding.shares

    # For a sell order, quantity is negative for a sell order
    elif (float(old_quantity) + float(new_quantity)) > 0 and float(new_quantity) < 0:
        revenue = float(stock_price) * (float(new_quantity) * -1)
        user.buying_power += revenue
        if holding.total_cost > revenue:
            holding.total_cost -= revenue
        holding.shares = (float(old_quantity) + float(new_quantity))
        if holding.shares > 0:
            holding.avg_cost = holding.total_cost / holding.shares

    # If the user is trying to sell more shares than they own
    elif (float(old_quantity) + float(new_quantity)) < 0:
        return jsonify({'message': "Not enough shares to sell", 'statusCode': 400}), 400

    # If the user is trying to sell all of their shares
    elif (float(old_quantity) + float(new_quantity)) == 0:
        revenue = float(stock_price) * float(old_quantity)
        user.buying_power += revenue
        db.session.delete(holding)

    # holding.shares = new_quantity

    db.session.commit()
    return holding.to_dict()


