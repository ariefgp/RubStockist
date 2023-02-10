import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { getAllStocks,  } from '../../store/stocks';
import { addStockToWatchlistThunk } from '../../store/watchlists';
import './StockList.css';

function StockListSearch({watchlistId}) {
    const dispatch = useDispatch();
    const history = useHistory();

    const [loading, setLoading] = useState(true);
    const [selectedStockId, setSelectedStockId] = useState(0)
    const [selectedStockSymbol, setSelectedStockSymbol] = useState('')

    const stocks = useSelector(state => state.stocks.allStocks.byId);

    useEffect(() => {
        // console.log('BEFORE STOCKS',Object.values(stocks))
        setLoading(true);
        // dispatch(getAllStocks());
        setLoading(false);
        // console.log('AFTER STOCKS',Object.values(stocks))
    }, [dispatch]);

    const handleChange = (e) => {
        e.preventDefault();
        // setSelectedStockId(e.target.value)
        setSelectedStockSymbol(e.target.value)
    }

    const handleStockSearch = (e) => {
        e.preventDefault();

        if(selectedStockSymbol === '') return null;

        setSelectedStockSymbol(selectedStockSymbol.toUpperCase())

        history.push(`/stocks/${selectedStockSymbol}`)
    }

    return (
        <div className='stock-list-container'>
            { (!loading) 
            ?
                <div className='stock-list-container'>
                    <h6>All Stocks List</h6>
                    <form onSubmit={handleStockSearch} >
                        <select onChange={handleChange}>
                            <option value=''>Select a Stock</option>
                            {Object.values(stocks)?.map((stock, idx) => (
                                <option key={stock.id} value={stock.symbol}>
                                    {stock.symbol}
                                    &nbsp;
                                    -
                                    &nbsp;
                                    {stock.company_name}
                                </option>

                            ))}
                        </select>
                        {
                            !watchlistId
                            ?
                            <button type='submit'>Search</button>
                            :
                            // <button onClick={() => handleStockSearch(stock.id)}>Go to Stock Page</button>
                            <></>
                        }
                    </form>
                </div>
            :
                <div></div>
            }
        </div>
    );
}

export default StockListSearch;