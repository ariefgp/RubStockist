import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchWatchlists, createNewWatchlist, deleteWatchlist, fetchWatchlistById, updateWatchlist, addStockToWatchlistThunk, removeStockFromWatchlistThunk, getWatchlistStockData, getWatchlistStockDataDaily, getStockCurrentPriceFinnHub } from '../../store/watchlists';
// import {getSingleStockCurrentPriceYahoo} from '../../store/stocks';
import { getAllStocks } from '../../store/stockList';
import StockList from '../StockList';
import WatchListStockChartMini from '../WatchListsStockChartMini';
import OpenModalButton from '../OpenModalButton';
import CreateWatchListModal from './CreateWatchListModal';
import EditWatchListModal from './EditWatchListModal';
import DeleteWatchListModal from './DeleteWatchListModal';
import './WatchLists.css';

const Watchlists = () => {
    const [loading, setLoading] = useState(true);
    const [isCalling, setIsCalling] = useState(false);

    const [isAdding, setIsAdding] = useState(false);
    const [showStocks, setShowStocks] = useState(0);

    const [isEditing, setIsEditing] = useState(0);
    const [edittedWatchlistName, setEdittedWatchlistName] = useState('');

    const [newWatchlistName, setNewWatchlistName] = useState('');
    const dispatch = useDispatch();
    const watchlists = useSelector(state => state.watchlists.allWatchlists);
    const watchListStockData = useSelector(state => state.watchlists.watchlistStockData);
    const state = useSelector(state => state);

    const hitAPI = async () => {
        if (watchlists.length > 0) {
            watchlists.forEach(watchlist => {
                watchlist?.stocks?.forEach(async (stock) => {
                    // console.log(stock.symbol)
                    if (!watchListStockData[stock.symbol] && !isCalling) {
                        setIsCalling(true);

                        await dispatch(getStockCurrentPriceFinnHub(stock.symbol))

                        // await dispatch(getWatchlistStockData(stock.symbol))
                        if (typeof watchListStockData[stock.symbol]?.dailyData === 'undefined') {
                            await dispatch(getWatchlistStockDataDaily(stock.symbol))
                                .then(() => setIsCalling(false))
                        } else {
                            setIsCalling(false)
                        }
                    }
                })
            })
        }
    }

    useEffect(() => {
        setLoading(true);

        dispatch(fetchWatchlists());
        dispatch(getAllStocks());

        // const timer = setTimeout(() => {
        //     hitAPI();
        // }, 7000);

        // console.log(state)
        setLoading(false);

        // return () => clearTimeout(timer);
    }, [dispatch]);

    useEffect(() => {
        if (!loading && watchlists.length > 0 && !isCalling) {
            hitAPI();
        }
    }, [watchlists]);


    const formatWatchlistStockData = async (watchlistStockSymbol) => {
        let stockCurrentPrice = 0;
        let stockCurrentPercentageChange = 0;
        if (!loading && !watchListStockData[watchlistStockSymbol].dailyData) {
            await dispatch(getWatchlistStockDataDaily(watchlistStockSymbol))
                .then((res) => {
                    stockCurrentPrice = res.close
                    return res
                })
                .then((res) => {
                    stockCurrentPercentageChange = res.percent_change
                    return res
                })
            // stockCurrentPrice = watchListStockData[watchlistStockSymbol]?.close;
            // stockCurrentPercentageChange = watchListStockData[watchlistStockSymbol]?.percent_change;
        }
        // console.log('watchlistStockSymbol: ', watchlistStockSymbol)
        // console.log('watchListStockData: ', watchListStockData)
        // console.log('stockCurrentPrice: ', stockCurrentPrice)
        // console.log('stockCurrentPercentageChange: ', stockCurrentPercentageChange)
        return [stockCurrentPrice, stockCurrentPercentageChange]
    }



    const handleWatchlistCreate = async (e) => {
        e.preventDefault();

        setLoading(true);
        setIsAdding(true)

        await dispatch(createNewWatchlist(newWatchlistName))
            .then(async () => await dispatch(fetchWatchlists()))

        setNewWatchlistName('');
        setLoading(false);
        setIsAdding(false)
    };

    const handleWatchlistDelete = async (watchlistId) => {
        setLoading(true);
        dispatch(deleteWatchlist(watchlistId));
        dispatch(fetchWatchlists());
        setLoading(false);
    };

    const handleWatchlistEdit = async (watchlistId, newName) => {
        setLoading(true);
        dispatch(updateWatchlist(watchlistId, newName));
        setLoading(false);
        setIsEditing(0);
    }

    const handleWatchlistStockDelete = async (watchlistId, stockId) => {
        setLoading(true);
        // dispatch(deleteWatchlist(watchlistId));
        dispatch(removeStockFromWatchlistThunk(watchlistId, stockId));
        dispatch(fetchWatchlists());
        setLoading(false);
    };

    return (
        <div className='watchlist-container'>
            <div className='watchlist-container-main-header'>
                <h3>
                    Lists
                    &nbsp;
                </h3>
                <span>
                    <OpenModalButton
                        modalComponent={<CreateWatchListModal />}
                        className='watchlist-create-button'
                        faIcon={'fa-solid fa-plus'}
                    // buttonText={'Create Watchlist'}
                    />
                </span>
            </div>
            <div className='watchlist-all-watchlists-container'>
                {(watchlists.length > 0) &&
                    watchlists?.map((watchlist, idx) => (
                        <>
                            {
                                (!loading && !isAdding && watchlist?.id !== undefined && watchlist?.id !== null && watchlist?.id !== 0)
                                    ?
                                    <div key={watchlist.id} className='watchlist-individual'>
                                        <div className='watchlist-individual-name-buttons'>
                                            {
                                                (isEditing !== watchlist.id) ?
                                                    <>
                                                        <h4 className='watchlist-individual-header'>{watchlist.name}</h4>
                                                    </>
                                                    :
                                                    <div className='watchlist-individual-header'>
                                                        <input
                                                            type="text"
                                                            value={edittedWatchlistName}
                                                            onChange={event => setEdittedWatchlistName(event.target.value)}
                                                            minLength="1"
                                                            maxLength="255"
                                                            placeholder="Edit Watchlist"
                                                        />
                                                        <button className='watchlist-individual-button' onClick={() => handleWatchlistEdit(watchlist.id, edittedWatchlistName)}>
                                                            <i className="fa-solid fa-check"></i>
                                                        </button>
                                                    </div>
                                            }
                                            <div className='watchlist-individual-header-buttons-container'>
                                                <div className='watchlist-individual-header watchlist-individual-button'>

                                                    <OpenModalButton
                                                        modalComponent={<EditWatchListModal watchlist={watchlist} />}
                                                        className='watchlist-individual-header watchlist-individual-button'
                                                        faIcon={'fa-regular fa-pen-to-square'}
                                                    // buttonText={'Create Watchlist'}
                                                    />
                                                </div>

                                                <div className='watchlist-individual-header watchlist-individual-button'>

                                                    <OpenModalButton
                                                        modalComponent={<DeleteWatchListModal watchlist={watchlist} />}
                                                        className='watchlist-individual-header watchlist-individual-button'
                                                        faIcon={'fa-solid fa-trash-can'}
                                                    // buttonText={'Create Watchlist'}
                                                    />
                                                </div>
                                                <button>
                                                    {
                                                        (showStocks === watchlist.id) ?
                                                            <i className="fa-solid fa-angle-down" onClick={(() => setShowStocks(0))}></i>
                                                            :
                                                            <i className="fa-solid fa-angle-right" onClick={() => setShowStocks(watchlist.id)}></i>
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                        {showStocks === watchlist.id &&
                                            <div className='watchlist-stock-list'>
                                                {watchlist?.stocks?.map(stock => (
                                                    <div key={stock.id} value={stock.id} className='watchlist-stock-individual'>
                                                        <div className='watchlist-stock-individual-symbol'>
                                                            <div className='watchlist-stock-individual-symbol'>
                                                                <Link to={`/stocks/${stock.symbol}`} >
                                                                    {stock.symbol}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        <div className='watchlist-stock-individual-chart'>
                                                            <div>
                                                                {
                                                                    (watchListStockData[stock.symbol]?.dailyData?.length > 1) ?
                                                                        <WatchListStockChartMini stockSymbol={stock.symbol} />
                                                                        :
                                                                        <p>Loading...</p>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className='watchlist-stock-individual-price-and-change'>
                                                            <>
                                                                {
                                                                    watchListStockData[stock.symbol] ?
                                                                        <div>
                                                                            <div>
                                                                                {
                                                                                    <div>
                                                                                        {/* ${parseFloat(watchListStockData[stock.symbol]?.Info?.close).toFixed(2)} */}
                                                                                        {
                                                                                            watchListStockData[stock.symbol]?.currentPrice?.c > 0 ?
                                                                                                <>
                                                                                                    ${parseFloat(watchListStockData[stock.symbol]?.currentPrice?.c).toFixed(2)}
                                                                                                </>
                                                                                                :
                                                                                                <>
                                                                                                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                                                                                                </>

                                                                                        }
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                            <div>
                                                                                {
                                                                                    !isNaN(watchListStockData[stock.symbol]?.currentPrice?.dp) ?
                                                                                        <>
                                                                                            <>
                                                                                                {
                                                                                                    watchListStockData[stock.symbol]?.currentPrice?.dp > 0 && (
                                                                                                        <div className='watchlist-stock-individual-price-and-change-positive'>
                                                                                                            +{parseFloat(watchListStockData[stock.symbol]?.currentPrice?.dp).toFixed(2)}%
                                                                                                        </div>
                                                                                                    )
                                                                                                }
                                                                                            </>
                                                                                            <>
                                                                                                {
                                                                                                    watchListStockData[stock.symbol]?.currentPrice?.dp < 0 &&
                                                                                                    <div className='watchlist-stock-individual-price-and-change-negative'>
                                                                                                        {/* {parseFloat(watchListStockData[stock.symbol]?.Info?.percent_change).toFixed(2)}% */}
                                                                                                        {parseFloat(watchListStockData[stock.symbol]?.currentPrice?.dp).toFixed(2)}%
                                                                                                    </div>
                                                                                                }
                                                                                            </>
                                                                                        </>
                                                                                        :
                                                                                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        <div className='watchlist-stock-individual-delete-button'>
                                                                            <button onClick={() => formatWatchlistStockData(stock.symbol)}>
                                                                                <i className="fa-solid fa-sync"></i>
                                                                            </button>
                                                                        </div>
                                                                }
                                                            </>
                                                        </div>
                                                        <div>
                                                            <button className='watchlist-stock-individual-button' onClick={() => handleWatchlistStockDelete(watchlist.id, stock.id)}>
                                                                <i className="fa-solid fa-xmark"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        }
                                    </div>
                                    :
                                    <></>

                            }
                        </>

                    ))}
            </div>
        </div>
    );
};

export default Watchlists;