import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createNewWatchlist, fetchWatchlists } from '../../store/watchlists';
import { useModal } from '../../context/Modal';
import { Modal } from '../../context/Modal';

import './CreateWatchListModal.css';


const CreateWatchListModal = () => {

    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [errors, setErrors] = useState([]);

    const [newWatchlistName, setNewWatchlistName] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);


    const handleWatchlistCreate = async (e) => {
        e.preventDefault();

        setLoading(true);
        setIsAdding(true)

        if (newWatchlistName.length < 1) {
            setErrors(['Watchlist name cannot be empty'])
            return;
        }

        await dispatch(createNewWatchlist(newWatchlistName))
            .then(async () => await dispatch(fetchWatchlists()))

        setNewWatchlistName('');
        setLoading(false);
        setIsAdding(false)

        closeModal();
    };

    return (
        <div className='watchlist-modal-container'>
            <div className='create-watchlist-modal-content'>
                <h3>Create List</h3>
                <form onSubmit={(e) => handleWatchlistCreate(e)}>
                    <div>
                        {errors.length > 0 && errors.map((error, ind) => (
                            <div key={ind} className='watchlist-modal-error'>{error}</div>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={newWatchlistName}
                        onChange={event => setNewWatchlistName(event.target.value)}
                        minLength="1"
                        maxLength="255"
                        placeholder="Create Watchlist"
                    />
                    <button type="submit">
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateWatchListModal;