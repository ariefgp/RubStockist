import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { openInNewTab } from "../utility";
import { getAllNewsForHomePage, getUserBookmarkedNews } from "../../store/news";
import { getAllStocks } from "../../store/stocks";
import NewsCard from "../NewsCard";

import "./HomePageNewsFeed.css";


const HomePageNewsFeed = () => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    const allNews = useSelector((state) => state.news.allNews);

    useEffect(() => {
        setLoading(true);
        dispatch(getAllStocks())
        dispatch(getAllNewsForHomePage())
            .then(() => {
                dispatch(getUserBookmarkedNews())
                setLoading(false);
            }
            );
    }, []);
    // const getNews = async () => {
    //     const response = await fetch("/api/news/external/all");
    //     const data = await response.json();
    //     return data['feed'];
    // };

    // let allNews

    // async function fetchData() {
    //     allNews = await getNews();
    //     if(allNews?.length > 0) {
    //         setLoading(false);
    //     }
    // }

    // useEffect(() => {
    //     setLoading(true);
    //     if(allNews?.length === 0 || !allNews){
    //         fetchData();
    //     }
    //     // fetchData();

    // }, [allNews]);


    return (
        <div className="news-feed-container">
            <div className="news-feed-header">
                <h2>News</h2>
            </div>
            <>
                {
                    (!loading && allNews?.length > 0) && allNews.map((article, idx) => {
                        return (
                            <NewsCard article={article} key={idx} />
                        )
                    })
                }
            </>
        </div>
    );
}

export default HomePageNewsFeed;