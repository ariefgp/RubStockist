import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch , Redirect} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import User from './components/User';
import { authenticate } from './store/session';
import HomePage from './components/HomePage';
import StockChart from './components/StockChart';
import StockPage from './components/StockPage';
import Watchlists from './components/WatchLists';
import StockList from './components/StockList';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector(state => state.session.user);

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path='/login' exact={true}>
          <LoginForm />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path='/users' exact={true} >
          <UsersList/>
        </ProtectedRoute>
        <ProtectedRoute path='/users/:userId' exact={true} >
          <User />
        </ProtectedRoute>
        <ProtectedRoute path='/profile' exact={true} >
          <Profile />
        </ProtectedRoute>
        <Route path='/stocks/:symbol' exact={true} >
          <StockPage />
        </Route>
        <Route path='/' exact={true} >
          {
            user ?
            <HomePage />
            :
            <LandingPage />
          }
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
