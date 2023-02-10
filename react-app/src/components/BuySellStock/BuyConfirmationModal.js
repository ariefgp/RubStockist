import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserSession } from "../../store/session";
import { getAllUserHoldings, createNewHolding, updateHolding, deleteHolding, getHoldingByStockSymbol, resetCurrentHolding } from "../../store/holdings";
import { isObjectEmpty } from '../utility';

import { useModal } from '../../context/Modal';
import { Modal } from '../../context/Modal';

// import './CreateWatchListModal.css';


const BuyConfirmationModal = ({ purchaseInfo, stockInfo }) => {

    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [loading, setLoading] = useState(true);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
    }

    const currentHolding = useSelector(state => state.holdings.currentHolding);
    const buyingPower = useSelector(state => state.session.user.buying_power);
    const quantity = purchaseInfo.quantity;
    const stockCurrentPrice = purchaseInfo.stockCurrentPrice;


    const handleBuy = async () => {
        // console.log('buying')
        if (quantity > 0) {
            if (quantity * stockCurrentPrice <= buyingPower) {
                if (!isObjectEmpty(currentHolding)) {
                    // console.log('updating holding', Object.values(currentHolding)[0].id)
                    await dispatch(updateHolding(Object.values(currentHolding)[0].id, quantity, stockCurrentPrice))
                    await dispatch(getHoldingByStockSymbol(stockInfo.symbol))
                    await dispatch(getAllUserHoldings())
                    await dispatch(getUserSession())
                    closeModal()
                } else {
                    await dispatch(createNewHolding(stockInfo.symbol, quantity, stockCurrentPrice))
                    await dispatch(getAllUserHoldings())
                    await dispatch(getHoldingByStockSymbol(stockInfo.symbol))
                    await dispatch(getUserSession())
                    closeModal()
                }
            } else {
                alert('Not enough buying power')
            }
        } else {
            alert('Quantity must be greater than 0')
        }
    }

    return (
        <div className='watchlist-modal-container'>
            <div className='create-watchlist-modal-content'>
                <h3>Confirm Purchase</h3>
                {/* <div className='watchlist-individual-header'> */}
                    <form onSubmit={handleFormSubmit}>
                        <button className='watchlist-modal-cancel-button' onClick={() => closeModal()}>
                            Cancel
                        </button>
                        <button className='watchlist-modal-submit-button' onClick={() => handleBuy()}>
                            Confirm
                        </button>
                    </form>
                {/* </div> */}
            </div>
        </div>
    )
}

export default BuyConfirmationModal;