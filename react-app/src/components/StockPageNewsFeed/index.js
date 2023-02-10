import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { openInNewTab } from "../utility";
import { getNewsForStockPage, getUserBookmarkedNews } from "../../store/news";
import NewsCard from "../NewsCard";
import { getAllStocks } from "../../store/stocks";

// import "./StockPageNewsFeed.css";


const StockPageNewsFeed = ({ stockInfo }) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    const stockNews = useSelector((state) => state.news.singleStockNews);
    // const stockSymbol = useSelector((state) => state.stocks.singleStock.Info.symbol);
    const { symbol } = useParams()

    useEffect(() => {
        setLoading(true);
        dispatch(getUserBookmarkedNews())
        dispatch(getNewsForStockPage(symbol))
        dispatch(getAllStocks())
            .then(() => {
                setLoading(false);
                console.log('stocknews', stockNews)
            }
            );
    }, [symbol]);

    useEffect(() => {
        console.log('stocknews', stockNews)
    }, [stockNews])

    return (
        <>
            {
                (!loading && stockNews?.length > 0) ?
                    <div className="news-feed-container">
                        <div className="news-feed-header">
                            <h2>News</h2>
                        </div>
                        <>
                            {
                                (!loading && stockNews?.length > 0) && stockNews.map((article, idx) => {
                                    return (
                                        <NewsCard article={article} key={idx} />
                                    )
                                })
                            }
                        </>
                    </div>
                    :
                    <div className="news-feed-container">
                        <div className="news-feed-header">
                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                        </div>
                    </div>

            }
        </>
    );
}

export default StockPageNewsFeed;