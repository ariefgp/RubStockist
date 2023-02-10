import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateWatchlist, fetchWatchlists } from '../../store/watchlists';
import { useModal } from '../../context/Modal';
import { Modal } from '../../context/Modal';

import './CreateWatchListModal.css';


const CreateWatchListModal = ({ watchlist }) => {

    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);

    const [edittedWatchlistName, setEdittedWatchlistName] = useState(watchlist.name);

    const [isEditing, setIsEditing] = useState(0);


    const handleWatchlistEdit = async (watchlistId, newName) => {
        setLoading(true);

        if (newName.length < 1) {
            setErrors(['Watchlist name cannot be empty'])
            return;
        }

        dispatch(updateWatchlist(watchlistId, newName));
        setLoading(false);
        setIsEditing(0);
        closeModal();
    }

    return (
        <div className='watchlist-modal-container'>
            <div className='create-watchlist-modal-content'>
                <h3>Edit List</h3>
                <div>
                        {errors.length > 0 && errors.map((error, ind) => (
                            <div key={ind} className='watchlist-modal-error'>{error}</div>
                        ))}
                    </div>
                <form>
                    <input
                        type="text"
                        value={edittedWatchlistName}
                        onChange={event => setEdittedWatchlistName(event.target.value)}
                        minLength="1"
                        maxLength="255"
                        placeholder="Edit Watchlist"
                    />
                    <button className='watchlist-modal-cancel-button' onClick={() => closeModal()}>
                        Cancel
                    </button>
                    <button className='watchlist-modal-submit-button' onClick={() => handleWatchlistEdit(watchlist.id, edittedWatchlistName)}>
                        <i className="fa-solid fa-check"></i>
                    </button>
                </form>
                {/* </div> */}
            </div>
        </div>
    )
}

export default CreateWatchListModal;