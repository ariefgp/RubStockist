import { getWatchlistStockDataAction, getWatchlistStockDataDailyAction } from "./watchlists";
import yahooFinance from "yahoo-finance";

const GET_ALL_STOCKS_FROM_DB = 'stockList/GET_ALL_STOCKS_FROM_DB';
const GET_SINGLE_STOCK_INFO_FROM_DB = 'stockList/GET_SINGLE_STOCK_INFO_FROM_DB';
const GET_SINGLE_STOCK_DATA = 'stockList/GET_SINGLE_STOCK_DATA_FROM_API';
const GET_SINGLE_STOCK_CURRENT_PRICE = 'stockList/GET_SINGLE_STOCK_CURRENT_PRICE';
const GET_SINGLE_STOCK_COMPANY_INFO = 'stockList/GET_SINGLE_STOCK_COMPANY_INFO';
const RESET_SINGLE_STOCK_DATA = 'stockList/RESET_SINGLE_STOCK_DATA';

const GET_SINGLE_STOCK_CURRENT_PRICE_YAHOO = 'stockList/GET_SINGLE_STOCK_CURRENT_PRICE_YAHOO';
const RESET_ENTIRE_SINGLE_STOCK = 'stockList/RESET_ENTIRE_SINGLE_STOCK';

const getAllStocksFromDB = (stocks) => ({
    type: GET_ALL_STOCKS_FROM_DB,
    payload: stocks
});

const getSingleStockInfoFromDB = (stock) => ({
    type: GET_SINGLE_STOCK_INFO_FROM_DB,
    payload: stock
});

const getSingleDataStock = (stock) => ({
    type: GET_SINGLE_STOCK_DATA,
    payload: stock
});

const getSingleStockCurrentPrice = (data) => ({
    type: GET_SINGLE_STOCK_CURRENT_PRICE,
    payload: data
});

const getSingleStockCompanyInfo = (data) => ({
    type: GET_SINGLE_STOCK_COMPANY_INFO,
    payload: data
});

const getSingleStockCurrentPriceYahooAction = (data) => ({
    type: GET_SINGLE_STOCK_CURRENT_PRICE_YAHOO,
    payload: data
});

const resetEntireSingleStockAction = () => ({
    type: RESET_ENTIRE_SINGLE_STOCK
});

export const getAllStocks = () => async (dispatch) => {
    const response = await fetch('/api/stocks/all');
    if (response.ok) {
        const data = await response.json();
        dispatch(getAllStocksFromDB(data.stocks));
    } else {
        console.log('Error fetching stocks');
    }
}

export const getSingleStockInfo = (symbol) => async (dispatch) => {
    const response = await fetch(`/api/stocks/search/db/${symbol}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getSingleStockInfoFromDB(data));
        return data;
    } else {
        console.log('Error fetching stock');
    }
}

// export const getSingleStockDataFromAPI = (symbol) => async (dispatch) => {
//     const response = await fetch(`/api/stocks/data/${symbol}`);
//     if (response.ok) {
//         const data = await response.json();
//         dispatch(getSingleDataStock(data));
//         return data;

//     } else {
//         console.log('Error fetching stock');
//     }
// }

export const getSingleStockDataFromAPI = (symbol, filter) => async (dispatch) => {
    if (!filter) filter = '1D';
    console.log('IN SINGLE STOCK THUNK', symbol, filter)

    const response = await fetch(`/api/stocks/data/time-series/${symbol}/${filter}`);
    if (response.ok && response.status !== 429) {
        const data = await response.json();
        if (typeof data['message'] === 'string') {
            console.log('Error fetching watchlist stock data', data)
            return
        }
        // console.log('data IN SINGLE STOCK THUNK', data)
        dispatch(getSingleDataStock(data));
        return data;

    } else {
        console.log('Error fetching stock');
    }
}


export const getSingleStockCurrentPriceFromAPI = (symbol) => async (dispatch) => {
    // 12 data route
    // const response = await fetch(`/api/stocks/data/current/${symbol}`);
    // finnhub route
    const response = await fetch(`/api/stocks/data/finn-hub/current/${symbol}`);
    if (response.ok && response.status !== 429) {
        const data = await response.json();
        if (typeof data['message'] === 'string') {
            console.log('Error fetching watchlist stock data', data)
            return
        }
        dispatch(getSingleStockCurrentPrice(data));
        // dispatch(getWatchlistStockDataAction(data));
        return data;

    } else {
        console.log('Error fetching stock');
    }
}

export const getSingleStockCompanyInfoFromAPI = (symbol) => async (dispatch) => {
    const response = await fetch(`/api/stocks/company-info/${symbol}`);
    if (response.ok && response.status !== 429) {
        const data = await response.json();
        dispatch(getSingleStockCompanyInfo(data));
        return data;
        
    } else {
        console.log('Error fetching stock');
    }
}

// export const getSingleStockCurrentPriceYahoo = (symbol) => async (dispatch) => {
//     yahooFinance.quote({
//         symbol: symbol,
//         modules: ['price']
//     })
//     .then((data) => {
//         console.log(data)
//         dispatch(getSingleStockCurrentPriceYahooAction(data));
//     })
//     .catch((err) => {
//         console.log('Error fetching stock', err);
//     })
// }


export const resetSingleStockData = () => ({
    type: RESET_SINGLE_STOCK_DATA
});

export const resetEntireSingleStock = () => async (dispatch) => {
    dispatch(resetEntireSingleStockAction());
}

const initialState = {
    allStocks: {
        byId: {},
    },
    singleStock: {
        Info: {},
        CompanyInfo: {},
        CurrentPrice: {},
        YahooCurrentPrice: {},
        Data: {},
        News: {}
    }
};

const stockListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_STOCKS_FROM_DB:
            return {
                ...state,
                allStocks: {
                    ...state.allStocks,
                    byId: action.payload
                }
        }
        case GET_SINGLE_STOCK_DATA:
            console.log('action.payload', action.payload);
            return {
                ...state,
                singleStock: {
                    ...state.singleStock,
                    Data: {
                        meta: action.payload.meta,
                        values: action.payload.values
                    } 
                }
            }
        case GET_SINGLE_STOCK_INFO_FROM_DB:
            return {
                ...state,
                singleStock: {
                    ...state.singleStock,
                    Info: action.payload
                }
            }

        case GET_SINGLE_STOCK_CURRENT_PRICE:
            return {
                ...state,
                singleStock: {
                    ...state.singleStock,
                    CurrentPrice: action.payload
                }
            }

        case GET_SINGLE_STOCK_COMPANY_INFO:
            return {
                ...state,
                singleStock: {
                    ...state.singleStock,
                    CompanyInfo: action.payload
                }
            }

        case GET_SINGLE_STOCK_CURRENT_PRICE_YAHOO:
            return {
                ...state,
                singleStock: {
                    ...state.singleStock,
                    YahooCurrentPrice: action.payload.price
                }
            }
        
        case RESET_SINGLE_STOCK_DATA:
            return {
                ...state,
                singleStock: {
                    ...state.singleStock,
                    Data: {}
                }
            }

        case RESET_ENTIRE_SINGLE_STOCK:
            return {
                ...state,
                singleStock: {
                    Info: {},
                    CompanyInfo: {},
                    CurrentPrice: {},
                    YahooCurrentPrice: {},
                    Data: {},
                    News: {}
                }
            }

    
        default:
            return state;
    }
}

export default stockListReducer;
