import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteWatchlist, fetchWatchlists } from '../../store/watchlists';
import { useModal } from '../../context/Modal';
import { Modal } from '../../context/Modal';

import './CreateWatchListModal.css';


const DeleteWatchListModal = ({ watchlist }) => {

    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [loading, setLoading] = useState(true);

    const handleWatchlistDelete = async (watchlistId) => {
        setLoading(true);
        await dispatch(deleteWatchlist(watchlistId));
        await dispatch(fetchWatchlists());
        setLoading(false);
        closeModal();
    };

    return (
        <div className='watchlist-modal-container'>
            <div className='create-watchlist-modal-content'>
                <h3>Confirm Deletion</h3>
                {/* <div className='watchlist-individual-header'> */}
                    <form>
                        <button className='watchlist-modal-cancel-button' onClick={() => closeModal()}>
                            Cancel
                        </button>
                        <button className='watchlist-modal-submit-button' onClick={() => handleWatchlistDelete(watchlist.id)}>
                            Delete
                        </button>
                    </form>
                {/* </div> */}
            </div>
        </div>
    )
}

export default DeleteWatchListModal;