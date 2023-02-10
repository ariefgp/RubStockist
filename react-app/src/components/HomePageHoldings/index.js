import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { formatToCurrency, isObjectEmpty } from "../utility";

import { getHoldingCurrentPriceFinnHub, getAllUserHoldings } from "../../store/holdings";
// import {getSingleStockCurrentPriceYahoo} from '../../store/stocks';
import { getAllStocks } from "../../store/stockList";
import StockList from "../StockList";
import WatchListStockChartMini from "../WatchListsStockChartMini";
import HoldingsStockChartMini from "./HoldingsStockChartMini";
import OpenModalButton from "../OpenModalButton";

import './HomePageHoldings.css';

const HomePageHoldings = () => {
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(true);
	const [isCalling, setIsCalling] = useState(false);

	const user = useSelector((state) => state.session.user);

	const holdings = useSelector((state) => state.holdings.allHoldings);

	const holdingsStockData = useSelector((state) => state.holdings.stockData);

	const hitAPI = async () => {
		setLoading(true);

		// if (typeof holdingsStockData === 'undefined' || isObjectEmpty(holdingsStockData)) {
		// await dispatch(getAllUserHoldings())
		// }

		console.log('at top of hitAPI in holdings homepage component')
		console.log(holdingsStockData)

		if (holdings.length > 0) {
			holdings.forEach((holding) => {
				holding?.stock?.forEach(async (stock) => {
					// console.log(stock.symbol)
					console.log((typeof holdingsStockData[stock.symbol] === 'undefined')
						|| (typeof holdingsStockData[stock.symbol]?.currentPrice === 'undefined')
						|| !isObjectEmpty(holdingsStockData[stock.symbol]?.currentPrice))
					if (!isCalling && (
						(typeof holdingsStockData[stock.symbol] === 'undefined')
						|| (typeof holdingsStockData[stock.symbol]?.currentPrice === 'undefined')
						|| !isObjectEmpty(holdingsStockData[stock.symbol]?.currentPrice))
					) {
						setIsCalling(true);
						await dispatch(getHoldingCurrentPriceFinnHub(stock.symbol))
							.then(() => setIsCalling(false))
						// setIsCalling(false);

						console.log('running dispatch in holdings homepage component')
						// await dispatch(getWatchlistStockData(stock.symbol))
						// await dispatch(getWatchlistStockDataDaily(stock.symbol))
					}
				});
			});
		}
	};

	useEffect(() => {
		setLoading(true);

		if(holdings.length === 0){
			dispatch(getAllUserHoldings())
		} else {
			hitAPI()
		}

		// hitAPI()

		const timer = setTimeout(() => {
			// hitAPI();
		}, 5000);

		// console.log(state)
		setLoading(false);

		console.log("holdings", holdings)
		// console.log(holdingsStockData['COIN'])

		return () => clearTimeout(timer);
	}, [dispatch, holdings]);



	// useEffect(() => {
	// 	setLoading(true);
	// 	hitAPI();
	// 	setLoading(false);
	// }, [holdings]);

	return (
		<div className="home-page-holdings-container">
			<div>
				<div className="home-page-holdings-header">
					<h3>Stocks</h3>
				</div>
			</div>
			<>
				{holdings.length > 0 ? (
					<>
						<div className="watchlist-stock-list">
							{holdings.map((holding) => {
								const stock = holding.stock[0];
								console.log("stock", stock);
								if (!stock) return null;

								return (
									<div
										key={stock.id}
										value={stock.id}
										className="watchlist-stock-individual"
									>
										<div className="watchlist-stock-individual-symbol">
											<div className="watchlist-stock-individual-symbol">
												<Link
													to={`/stocks/${stock.symbol}`}
												>
													<div className="watchlist-stock-individual-symbol-symbol">
														{stock.symbol}
													</div>
													<div className="stock-individual-number-of-shares">
														{(0 < holding.shares && holding.shares <= 1.0)
															&&
															<>
																{holding.shares} Share
															</>

														}
														{(0 < holding.shares && holding.shares > 1.0)
															&&
															<>
																{holding.shares} Shares
															</>
														}
													</div>
												</Link>
											</div>
										</div>
										<div className="watchlist-stock-individual-chart">
											<div>
												{
													!isObjectEmpty(holdingsStockData[stock.symbol])
														|| (holdingsStockData[stock.symbol]?.values?.length > 0)
														?
														(
															// <WatchListStockChartMini stockSymbol={stock.symbol} />
															<HoldingsStockChartMini stockSymbol={stock.symbol} />
														) : (
															<i className="fa-solid fa-circle-notch fa-spin"></i>
														)}
											</div>
										</div>
										<div className="watchlist-stock-individual-price-and-change">
											<>
												{(typeof holdingsStockData[stock.symbol] !== "undefined") && (!isNaN(
													holdingsStockData[stock.symbol]?.currentPrice?.c)) ? (
													<div>
														<div>
															{
																<div>
																	$
																	{parseFloat(
																		holdingsStockData[stock.symbol]?.currentPrice?.c
																	).toFixed(
																		2
																	)}
																</div>
															}
														</div>
														<div>
															{/* {holdingsStockData[stock.symbol]?.percent_change > 0  */}
															{holdingsStockData[stock.symbol]?.currentPrice?.dp > 0 ? (
																<div className="watchlist-stock-individual-price-and-change-positive">
																	{/* +{parseFloat(holdingsStockData[stock.symbol]?.Info?.percent_change).toFixed(2)}% */}
																	+
																	{parseFloat(
																		holdingsStockData[
																			stock
																				.symbol
																		]
																			?.currentPrice
																			?.dp
																	).toFixed(
																		2
																	)}
																	%
																</div>
															) : (
																<div className="watchlist-stock-individual-price-and-change-negative">
																	{/* {parseFloat(holdingsStockData[stock.symbol]?.Info?.percent_change).toFixed(2)}% */}
																	{parseFloat(
																		holdingsStockData[stock.symbol]
																			?.currentPrice
																			?.dp
																	).toFixed(
																		2
																	)}
																	%
																</div>
															)}
														</div>
													</div>
												) : (
													<div className="watchlist-stock-individual-price-percent-loading">
														<span>
															<i className="fa-solid fa-circle-notch fa-spin"></i>
															&nbsp;
															Loading...
														</span>
													</div>
												)}
											</>
										</div>
									</div>
								);
							})}
						</div>
					</>
				) : (

					<p>You do not have any holdings</p>
				)}
			</>
		</div>
	);
};
export default HomePageHoldings;
