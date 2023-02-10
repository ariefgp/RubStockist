import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../../store/session';
import { resetAllHoldings, resetCurrentHolding } from '../../store/holdings';
import { resetWatchlistStore } from '../../store/watchlists';

const LogoutButton = () => {
  const history = useHistory();
  const dispatch = useDispatch()
  const onLogout = async (e) => {
    history.push('/')
    // .then(async () => await dispatch(logout()))
    await dispatch(logout())
    .then(() => history.push('/'))
    .then(() => dispatch(resetAllHoldings()))
    .then(() => dispatch(resetCurrentHolding()))
    .then(() => dispatch(resetWatchlistStore()))
  };

  return <button onClick={onLogout}>Logout</button>;
};

export default LogoutButton;
