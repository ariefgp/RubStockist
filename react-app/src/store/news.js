const GET_ALL_NEWS_FOR_HOMEPAGE = 'news/GET_ALL_NEWS_FOR_HOMEPAGE';
const GET_NEWS_FOR_STOCK_PAGE = 'news/GET_NEWS_FOR_STOCK_PAGE';
const GET_USER_BOOKMARKED_NEWS = 'news/GET_USER_BOOKMARKED_NEWS';
const CREATE_AND_BOOKMARK_NEWS = 'news/CREATE_AND_BOOKMARK_NEWS';
const REMOVE_AND_DELETE_NEWS_FROM_BOOKMARKS = 'news/REMOVE_NEWS_FROM_BOOKMARKS';


const getAllNewsForHomePageAction = (news) => ({
    type: GET_ALL_NEWS_FOR_HOMEPAGE,
    payload: news
})

const getNewsForStockPageAction = (news) => ({
    type: GET_NEWS_FOR_STOCK_PAGE,
    payload: news
})

const getUserBookmarkedNewsAction = (news) => ({
    type: GET_USER_BOOKMARKED_NEWS,
    payload: news
})

const createAndBookmarkNewsAction = (news) => ({
    type: CREATE_AND_BOOKMARK_NEWS,
    payload: news
})

const removeAndDeleteNewsFromBookmarksAction = (article) => ({
    type: REMOVE_AND_DELETE_NEWS_FROM_BOOKMARKS,
    payload: article
})


export const getAllNewsForHomePage = () => async (dispatch) => {
    const response = await fetch('/api/news/external/all');
    if (response.ok) {
        const data = await response.json();
        console.log('data', data)
        dispatch(getAllNewsForHomePageAction(data));
    } else {
        console.log('Error fetching news');
    }
}

export const getNewsForStockPage = (symbol) => async (dispatch) => {
    const response = await fetch(`/api/news/external/stock/${symbol}`);
    if (response.ok) {
        // console.log('response', response)
        const data = await response.json();
        console.log('data', data)
        dispatch(getNewsForStockPageAction(data));
    } else {
        console.log('Error fetching news');
    }
}

export const getUserBookmarkedNews = () => async (dispatch) => {
    const response = await fetch(`/api/news/user/bookmarked`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getUserBookmarkedNewsAction(data));
    } else {
        console.log('Error fetching news');
    }
}

export const createAndBookmarkNews = (article) => async (dispatch) => {
    // console.log(JSON.stringify({
    //     // ...news,
    //     'symbol': news.ticker_sentiment[0].ticker
    // }))
    if (article.ticker_sentiment.length === 0) {
        article.ticker_sentiment.push({ 'ticker': 'N/A' })
    }
    const response = await fetch('/api/news/internal/stock/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...article,
            'symbol': article.ticker_sentiment[0].ticker
        })
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(createAndBookmarkNewsAction(data));
    } else {
        console.log('Error fetching news');
    }
}

export const removeAndDeleteNewsFromBookmarks = (article) => async (dispatch) => {
    const response = await fetch(`/api/news/internal/byURL/delete/bookmark`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(article)
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(removeAndDeleteNewsFromBookmarksAction(data));
    } else {
        console.log('Error fetching news');
    }
}


const initialState = {
    allNews: [],
    singleStockNews: [],
    userBookmarkedNews: []
};

const newsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_NEWS_FOR_HOMEPAGE:
            return {
                ...state,
                allNews: action.payload.feed
            }

        case GET_NEWS_FOR_STOCK_PAGE:
            console.log('action.payloadin news reduce', action.payload)
            return {
                ...state,
                singleStockNews: action.payload.feed
            }

        case GET_USER_BOOKMARKED_NEWS:
            return {
                ...state,
                userBookmarkedNews: action.payload.news
            }

        case CREATE_AND_BOOKMARK_NEWS:
            return {
                ...state,
                userBookmarkedNews: [...state.userBookmarkedNews, action.payload]
            }
    
        default:
            return state;
    }
}

export default newsReducer;