const GET_ALL_STOCKS_FROM_DB = 'stockList/GET_ALL_STOCKS_FROM_DB';

const getAllStocksFromDB = (stocks) => ({
    type: GET_ALL_STOCKS_FROM_DB,
    payload: stocks
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

const initialState = {
    allStocks: [],
    byId: {}
};

const stockListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_STOCKS_FROM_DB:
            return {
                ...state,
                ...action.payload
                
            }
        default:
            return state;
    }
}

export default stockListReducer;
