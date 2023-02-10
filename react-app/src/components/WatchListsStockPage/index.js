import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWatchlists, createNewWatchlist, deleteWatchlist, fetchWatchlistById, updateWatchlist, addStockToWatchlistThunk, removeStockFromWatchlistThunk } from '../../store/watchlists';
import { getAllStocks } from '../../store/stockList';
import { useModal } from '../../context/Modal';
import StockList from '../StockList';
import './WatchListsStockPage.css';

const WatchlistsStockPage = () => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);

    const [isEditing, setIsEditing] = useState(0);
    const [edittedWatchlistName, setEdittedWatchlistName] = useState('');
    const { closeModal } = useModal();

    const [newWatchlistName, setNewWatchlistName] = useState('');
    const [selectedWatchlists, setSelectedWatchlists] = useState({});
    const [preCheckedWatchlists, setPreCheckedWatchlists] = useState({});

    const watchlists = useSelector(state => state.watchlists.allWatchlists);

    const stockId = useSelector(state => state.stocks.singleStock.Info.id);
    const state = useSelector(state => state);

    const getDataAndPrecheck = async () => {
        setLoading(true);
        await dispatch(fetchWatchlists());
        await dispatch(getAllStocks());
        preCheckWatchlists(stockId);
        setLoading(false);
    }

    useEffect(() => {
        getDataAndPrecheck();
    }, [dispatch]);

    // useEffect(() => {
    //     console.log(selectedWatchlists)
    // }, [selectedWatchlists])


    const handleWatchlistCreate = async (e) => {
        e.preventDefault();

        setLoading(true);

        if (newWatchlistName.length < 1) {
            setErrors(['Watchlist name cannot be empty'])
            setLoading(false);
            return;
        }

        await dispatch(createNewWatchlist(newWatchlistName))
            .then(() => dispatch(fetchWatchlists()))

        setNewWatchlistName('');
        setLoading(false);
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

    const handleListSelectionChange = (e) => {
        const { value } = e.target;
        setSelectedWatchlists({
            ...selectedWatchlists,
            [value]: !selectedWatchlists[value]
        });
        console.log('selectedWatchlists, ', selectedWatchlists)
    };

    const handleAddStockToWatchlistSubmit = async (e) => {
        e.preventDefault();
        Object.keys(selectedWatchlists).forEach(watchlistId => {
            if (selectedWatchlists[watchlistId]) {
                dispatch(addStockToWatchlistThunk(watchlistId, stockId));
            } else if (!selectedWatchlists[watchlistId] && preCheckedWatchlists[watchlistId]){
                dispatch(removeStockFromWatchlistThunk(watchlistId, stockId));
            } else {
                return;
            }
        });
        dispatch(fetchWatchlists());
        closeModal();
    };


    // a function that will precheck all the checkboxes that the stock is already in, and then when the user clicks add stock, it will add the stock to all the watchlists that are checked. If the user unchecks a box that the stock was previously in, it will remove the stock from that watchlist.

    const preCheckWatchlists = (stockId) => {
        let preChecked = {};
        watchlists.forEach(watchlist => {
            let watchlistId = watchlist.id;
            preChecked[watchlistId] = false;
            watchlist?.stocks.forEach(stock => {
                if (stock?.id === stockId) {
                    preChecked[watchlistId] = true;
                }
            });
        });
        setSelectedWatchlists(preChecked);
        setPreCheckedWatchlists(preChecked);
    };



    return (
        <div className='watchlist-modal-container'>
            <p>Lists</p>
            <div className='watchlist-modal-create-errors'>
                {errors.length > 0 && errors.map(error => <p key={error}>{error}</p>)}
            </div>
            <div className='watchlist-modal-create-watchlist-stock-page-button-and-input-container'>
                <form onSubmit={(e) => handleWatchlistCreate(e)}>
                    <button type="submit">
                        <i className="fa-solid fa-plus"></i>
                    </button>
                    <input
                        type="text"
                        value={newWatchlistName}
                        onChange={event => setNewWatchlistName(event.target.value)}
                        minLength="1"
                        maxLength="255"
                        placeholder="Create Watchlist"
                    />
                </form>
            </div>
            <div>
                <form onSubmit={(e) => handleAddStockToWatchlistSubmit(e)}>
                    <>
                        {(watchlists.length > 0) &&
                            watchlists?.map(watchlist => (
                                <>
                                    {
                                        (!loading && watchlist?.id !== undefined && watchlist?.id !== null && watchlist?.id !== 0)
                                            ?
                                            <div key={watchlist.id} className='stock-page-watchlist-modal-watchlist-individual'>

                                                <label>
                                                    <input
                                                        type='checkbox'
                                                        id={watchlist.id}
                                                        value={watchlist.id} className='watchlist-modal-individual-checkbox'
                                                        onChange={handleListSelectionChange}
                                                        checked={selectedWatchlists[watchlist.id]}
                                                    // checked={selectedWatchlists.includes(watchlist.id)}
                                                    />
                                                    {watchlist.name}
                                                </label>
                                                {/* <button>Add Stock</button> */}

                                            </div>
                                            :
                                            <></>

                                    }
                                </>
                            ))}
                    </>
                    <button>Update Watchlists</button>
                </form>

            </div>
        </div>
    );
};

export default WatchlistsStockPage;