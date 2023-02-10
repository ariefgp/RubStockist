import React from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';
import phone_hero_image from '../../images/LandingPage/phone_hero_image.png';
import crypto_hero_image from '../../images/LandingPage/crypto_hero_image.png';

const LandingPage = () => {
    const history = useHistory();

    const handleSignUp = () => {
        history.push('/sign-up');
    }

    const handleLogin = () => {
        history.push('/login');
    }

    return (
        <div className="landing-page-container">
            <div className="landing-page-content">
                <div className='landing-page-splash-container'>
                    <h1>Welcome to Archer</h1>
                    <h2>The ultimate trading platform for the modern investor</h2>
                </div >
                <div className='landing-page-splash-card-1'>
                    <img src={phone_hero_image} />
                    <ul>
                        <li>Real-time stock market data and insights</li>
                        <li>Easy-to-use interface for buying and selling stocks</li>
                        <li>Commission-free trading on a wide range of stocks and ETFs</li>
                    </ul>
                </div>
                <div className='landing-page-splash-card-2'>
                    <ul>
                        <li>Advanced charting tools for technical analysis</li>
                        <li>Customizable watchlists to track your favorite stocks</li>
                    </ul>
                    <img src={crypto_hero_image} />
                </div>
                <button className="sign-up-button" onClick={() => handleSignUp()}>Sign Up</button>
                <p>Already have an account? 
                    &nbsp;
                    <a onClick={() => handleLogin()}>Log in</a>
                </p>
            </div>
        </div>
    );
};

export default LandingPage;
