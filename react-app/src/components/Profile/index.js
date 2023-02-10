import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUserHoldings } from '../../store/holdings';
import { formatToCurrency } from '../utility';
import './ProfileHoldings';
import './ProfileNewsFeed'
import './Profile.css';
import ProfileNewsFeed from './ProfileNewsFeed';
import ProfileHoldings from './ProfileHoldings';


const Profile = () => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    const user = useSelector(state => state.session.user);
    const holdings = useSelector(state => state.holdings.allHoldings);

    useEffect(() => {
        setLoading(true);
        dispatch(getAllUserHoldings(user.id));
        setLoading(false);
        console.log('profile, holdings: ', holdings)
    }, [dispatch, user.id]);

    return (
        <>
            {
                !loading ?
                    <div className='profile-page-container'>
                        <h1>Profile</h1>
                        <h2>
                            <i className="fa-solid fa-circle-user"></i>
                            &nbsp;
                            {user.username}
                        </h2>
                        <h3>
                            Holdings
                        </h3>
                        <br></br>
                        <ProfileHoldings/>
                        <br></br>
                        <ProfileNewsFeed />
                    </div>
                    :
                    <></>
            }
        </>
    );
}

export default Profile;