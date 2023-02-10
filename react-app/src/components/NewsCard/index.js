import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { openInNewTab, isObjectEmpty } from "../utility";
import { getAllNewsForHomePage, getUserBookmarkedNews, createAndBookmarkNews, removeAndDeleteNewsFromBookmarks } from "../../store/news";
import './NewsCard.css';

const NewsCard = ({ article }) => {

    const dispatch = useDispatch();

    const userBookmarkedNews = useSelector(state => state.news.userBookmarkedNews);
    const allStocks = useSelector(state => state.stocks.allStocks.byId);

    const sameUrl = (news) => news.url === article.url;
    const isBookmarked = userBookmarkedNews.some(sameUrl);
    // const isBookmarked = userBookmarkedNews?.filter((news) => news.url === article.url);
    // const isBookmarked = false

    // const doesStockExistInDB = async (symbol) => {
    //     const res = await fetch(`/api/stocks/search/db/${symbol}`);
    //     const data = await res.json();
    //     if (res.ok && typeof data['message'] === 'undefined') {
    //         return true
    //     } else {
    //         return false
    //     }
    // }

    const doesStockExistInDB = (symbol) => {
        if (!allStocks || allStocks?.length === 0 || isObjectEmpty(allStocks)) return false;

        const stock = allStocks?.find(stock => stock.symbol === symbol);

        if (stock) {
            return true
        } else {
            return false
        }
    }

    const handleBookmarkClickAdd = () => {
        // e.preventDefault();
        // e.stopPropagation();
        console.log('article clicked: ', article)
        if (isBookmarked) {
            dispatch(removeAndDeleteNewsFromBookmarks(article))
                .then(() => dispatch(getUserBookmarkedNews()));
        } else {
            dispatch(createAndBookmarkNews(article))
                .then(() => dispatch(getUserBookmarkedNews()));
        }
    }

    const handleBookmarkClickRemove = () => {
        // e.preventDefault();
        // e.stopPropagation();
        if (isBookmarked) {
            dispatch(removeAndDeleteNewsFromBookmarks(article))
                .then(() => dispatch(getUserBookmarkedNews()));
        }
    }

    return (
        <div className='news-feed-individual-news' id={`${article.url}`} key={`${article.url}`}>
            <div className="news-feed-individual-left-side">
                <div className="news-feed-individual-left-side-text">
                    <h5>{article.source}</h5>
                </div>
                <div className="news-feed-individual-left-side-text">
                    <h5 onClick={() => openInNewTab(article.url)}>
                        <a>
                            {article.title}
                        </a>
                    </h5>
                </div>
                <div className="news-feed-individual-left-side-text">
                    <p>{article.summary}</p>
                </div>
                <div className="news-feed-individual-ticker-row">
                    {
                        article.ticker_sentiment && article.ticker_sentiment.map((ticker) => {
                            return (
                                doesStockExistInDB(ticker.ticker) ?
                                    <Link to={`/stocks/${ticker.ticker}`} key={`${ticker.ticker}`}>
                                        <span>
                                            {ticker.ticker}
                                        </span>
                                        &nbsp;
                                    </Link>
                                    :
                                    <></>
                            )
                        })
                    }
                </div>
            </div>
            <div className="news-feed-individual-news-img-and-bookmark">
                <div className="news-feed-individual-news-bookmark">
                    {
                        isBookmarked ?
                            <button onClick={() => handleBookmarkClickRemove()}>
                                <i className="fa-solid fa-bookmark"></i>
                            </button>
                            :
                            <button onClick={() => handleBookmarkClickAdd()}>
                                <i className="fa-regular fa-bookmark"></i>
                            </button>
                    }
                    {/* <i className="fa-solid fa-bookmark"></i>
                    <i className="fa-regular fa-bookmark"></i> */}
                </div>
                <div className="news-feed-individual-news-img">
                    <img src={article.banner_image} />
                </div>
            </div>
        </div>
    )
}

export default NewsCard