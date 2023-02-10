const GET_USER_HOLDINGS_FROM_DB = "holding/GET_USER_HOLDINGS_FROM_DB";
const CREATE_NEW_HOLDING = "holding/CREATE_NEW_HOLDING";
const UPDATE_HOLDING = "holding/UPDATE_HOLDING";
const DELETE_HOLDING = "holding/DELETE_HOLDING";
const GET_HOLDING_BY_ID = "holding/GET_HOLDING_BY_ID";
const GET_HOLDING_BY_STOCK_SYMBOL = "holding/GET_HOLDING_BY_STOCK_ID";
const RESET_CURRENT_HOLDING = "holding/RESET_CURRENT_HOLDING";
const GET_HOLDING_STOCK_DATA = "holding/GET_HOLDING_STOCK_DATA";
const RESET_ALL_HOLDINGS = "holding/RESET_ALL_HOLDINGS";
const GET_HOLDING_CURRENT_PRICE_FINNHUB = "holding/GET_HOLDING_CURRENT_PRICE";

const getUserHoldingsFromDBAction = (holdings) => ({
  type: GET_USER_HOLDINGS_FROM_DB,
  payload: holdings,
});

const createNewHoldingAction = (holding) => ({
  type: CREATE_NEW_HOLDING,
  payload: holding,
});

const updateHoldingAction = (holding) => ({
  type: UPDATE_HOLDING,
  payload: holding,
});

const deleteHoldingAction = (holdingId) => ({
  type: DELETE_HOLDING,
  payload: holdingId,
});

const getHoldingByIdAction = (holding) => ({
  type: GET_HOLDING_BY_ID,
  payload: holding,
});

const getHoldingByStockSymbolAction = (holding) => ({
  type: GET_HOLDING_BY_STOCK_SYMBOL,
  payload: holding,
});

const getHoldingStockDataAction = (stockData) => ({
  type: GET_HOLDING_STOCK_DATA,
  payload: stockData,
});

const getHoldingCurrentPriceFinnHubAction = (currentPrice) => ({
  type: GET_HOLDING_CURRENT_PRICE_FINNHUB,
  payload: currentPrice,
});

const resetCurrentHoldingAction = () => ({
  type: RESET_CURRENT_HOLDING,
});

const resetAllHoldingsAction = () => ({
  type: RESET_ALL_HOLDINGS,
});

export const getAllUserHoldings = () => async (dispatch) => {
  const response = await fetch("/api/holdings/");
  if (response.ok) {
    const data = await response.json();
    dispatch(getUserHoldingsFromDBAction(data.holdings));
  } else {
    console.log("Error fetching holdings");
  }
};

export const createNewHolding =
  (symbol, quantity, stockCurrentPrice) => async (dispatch) => {
    const getStockId = await fetch(`/api/stocks/search/db/${symbol}`);
    const stockId = await getStockId.json();

    const response = await fetch("/api/holdings/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stock_id: stockId.id,
        quantity,
        stock_price: stockCurrentPrice,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("THUNK", data);
      dispatch(createNewHoldingAction(data));
    } else {
      console.log("Error creating new holding");
    }
  };

export const updateHolding =
  (holdingId, quantity, stockCurrentPrice) => async (dispatch) => {
    const response = await fetch(`/api/holdings/${holdingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity,
        stock_price: stockCurrentPrice,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(updateHoldingAction(data));
    } else {
      console.log("Error updating holding");
    }
  };

export const deleteHolding =
  (holdingId, quantity, stockCurrentPrice) => async (dispatch) => {
    const response = await fetch(`/api/holdings/${holdingId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: quantity,
        stock_price: stockCurrentPrice,
      }),
    });
    if (response.ok) {
      dispatch(deleteHoldingAction(holdingId));
    } else {
      console.log("Error deleting holding");
    }
  };

export const getHoldingById = (holdingId) => async (dispatch) => {
  const response = await fetch(`/api/holdings/${holdingId}`);
  if (response.ok && response.status !== 204) {
    const data = await response.json();
    dispatch(getHoldingByIdAction(data.holding));
  } else {
    console.log("Error fetching holding");
  }
};

export const getHoldingByStockSymbol = (stockSymbol) => async (dispatch) => {
  const response = await fetch(`/api/holdings/symbol/${stockSymbol}`);
  if (response.ok && response.status !== 204) {
    const data = await response.json();
    dispatch(getHoldingByStockSymbolAction(data));
  } else {
    console.log("Error fetching holding");
    return {};
  }
};

export const getHoldingStockData = (stockSymbol) => async (dispatch) => {
  console.log("HOLDINGS STOCK THUNK TOp -", stockSymbol);
  try {
    const response = await fetch(
      `/api/stocks/data/time-series/${stockSymbol}/1D`
    );
    // debugger
    if (response.ok && response.status !== 429) {
      const data = await response.json();

      console.log("HOLDINGS STOCK THUNK", data);
      dispatch(getHoldingStockDataAction(data));
      return data;
    } else {
      console.log("Error fetching stock data");
    }
  } catch (e) {
    console.log("Error fetching stock data", e);
  }
};

export const getHoldingCurrentPriceFinnHub = (symbol) => async (dispatch) => {
  if (!symbol) return;
  if (typeof symbol !== "string") return;

  const response = await fetch(`api/stocks/data/finn-hub/current/${symbol}`);
  if (response.ok && response.status !== 204 && response.status !== 429) {
    const data = await response.json();
    if (typeof data["message"] === "string") {
      console.log("Error fetching watchlist stock data", data);
      return;
    }
    console.log("FINNHUB DATA", data);
    dispatch(getHoldingCurrentPriceFinnHubAction({ ...data, symbol }));
    return { ...data, symbol };
  } else {
    console.log("Error fetching watchlist stock data");
  }
};

// export const getHoldingStockDataBatch = (stockSymbols) => async (dispatch) => {
//     const response = await fetch(`/api/stocks/data/time-series/${stockSymbols}/1D`);
//     if (response.ok) {
//         const data = await response.json();
//         dispatch(getHoldingStockDataAction(data));
//         return data;
//     } else {
//         console.log('Error fetching stock data');
//     }
// }

export const resetCurrentHolding = () => async (dispatch) => {
  dispatch(resetCurrentHoldingAction());
};

export const resetAllHoldings = () => async (dispatch) => {
  dispatch(resetAllHoldingsAction());
};

const initialState = {
  allHoldings: [],
  currentHolding: {},
  stockData: {},
};

const holdingReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_HOLDINGS_FROM_DB:
      return {
        ...state,
        allHoldings: action.payload,
      };
    case CREATE_NEW_HOLDING:
      return {
        ...state,
        allHoldings: [...state.allHoldings, action.payload.id],
        currentHolding: {
          [action.payload.id]: action.payload,
        },
      };
    case UPDATE_HOLDING:
      return {
        ...state,
        currentHolding: { [action.payload.id]: action.payload },
      };
    case DELETE_HOLDING:
      const newState = { ...state };
      delete newState.currentHolding[action.payload];
      newState.allHoldings = newState.allHoldings.filter(
        (id) => id !== action.payload
      );
      return newState;
    case GET_HOLDING_BY_ID:
      return {
        ...state,
        currentHolding: { [action.payload.id]: action.payload },
      };
    case GET_HOLDING_BY_STOCK_SYMBOL:
      return {
        ...state,
        currentHolding: { [action.payload.id]: action.payload },
      };
    case GET_HOLDING_STOCK_DATA:
      return {
        ...state,
        stockData: {
          ...state.stockData,
          [action.payload.meta.symbol]: {
            ...state.stockData[action.payload.meta.symbol],
            ...action.payload,
          }
        },
      };
    case GET_HOLDING_CURRENT_PRICE_FINNHUB:
        return {
            ...state,
            stockData: {
                ...state.stockData,
                [action.payload.symbol]: {
                    ...state.stockData[action.payload.symbol],
                    currentPrice: action.payload
                }
            }
        }
        
    case RESET_CURRENT_HOLDING:
      return {
        ...state,
        currentHolding: {},
      };
    case RESET_ALL_HOLDINGS:
      return {
        ...state,
        allHoldings: [],
        currentHolding: {},
        stockData: {},
      };
    default:
      return state;
  }
};

export default holdingReducer;
