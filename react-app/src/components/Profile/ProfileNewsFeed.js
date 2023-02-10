import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { openInNewTab } from "../utility";
import { getAllNewsForHomePage, getUserBookmarkedNews } from "../../store/news";
import NewsCard from "../NewsCard";

// import "./HomePageNewsFeed.css";


const ProfileNewsFeed = () => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);


    const userNews = useSelector((state) => state.news.userBookmarkedNews);

    const formatArticles = userNews?.map((article) => {
        const { title, summary, url, symbol, image_link, sourc } = article;
        return {
            ...article,
            url: article.url,
            title: article.title,
            source: article.source,
            summary: article.summary,
            ticker_sentiment: [{ticker: article.symbol}],
            banner_image: article.image_link,
        }
    })


    useEffect(() => {
        setLoading(true);
        dispatch(getUserBookmarkedNews())
            .then(() => {
                setLoading(false);
            }
            );
    }, []);

    return (
        <div className="profile-news-feed-container">
            <div className="news-feed-header">
                <h2>Bookmarked News</h2>
            </div>
            <>
                {
                    (!loading && formatArticles?.length > 0) && formatArticles?.reverse().map((article, idx) => {
                        return (
                            <NewsCard article={article} key={idx} />
                        )
                    })
                }
            </>
        </div>
    );
}

export default ProfileNewsFeed;