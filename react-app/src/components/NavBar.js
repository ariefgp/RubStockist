
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutButton from './auth/LogoutButton';
import SearchBar from './SearchBar';
import LogoIconComp from './LogoIconComp/LogoIconComp';
import ArcherLogoCrop from '../images/Logo/ArcherLogoCrop.png';
import path200 from '../images/Logo/path200.svg';
import DarkModeToggle from './DarkModeToggle';
// import { isDark } from './DarkModeToggle/index.js';

const NavBar = () => {
  const user = useSelector(state => state.session.user);
  const dark_mode_pref = useSelector(state => state.session.user?.dark_mode_pref);

  return (
    <nav>
      <ul>
        <div className={`navbar-logo-and-name ${ dark_mode_pref ? 'logo-color-light' : 'logo-color-dark' }`}>
          <li>
            <NavLink to='/' exact={true} activeClassName='active'>
              {/* <img src={ArcherLogoCrop}/> */}
              {/* <LogoIconComp /> */}
              {/* <i className='archer-logo'>&#xe900;&#xe901;&#xe902;&#xe903;&#xe904;&#xe905;&#xe906;&#xe907;&#xe908;&#xe909;&#xe90a;&#xe90b;&#xe90c;&#xe90d;&#xe90e;&#xe90f;&#xe910;&#xe911;&#xe912;&#xe913;&#xe914;&#xe915;&#xe916;&#xe917;&#xe918;&#xe919;&#xe91a;&#xe91b;&#xe91c;&#xe91d;&#xe91e;&#xe91f;&#xe920;&#xe921;&#xe922;&#xe923;&#xe924;&#xe925;&#xe926;&#xe927;&#xe928;&#xe929;&#xe92a;&#xe92b;&#xe92c;&#xe92d;&#xe92e;&#xe92f;&#xe930;&#xe931;&#xe932;&#xe933;&#xe934;&#xe935;&#xe936;&#xe937;&#xe938;&#xe939;</i> */}
              {/* <svg src={path200}></svg>
                   */}
              {/* <path200></path200> */}
              <img src={path200} className={`navbar-logo-img`}/>
              
              Archer
            </NavLink>
          </li>
        </div>
        {
          !user
            ?
            <div className='navbar-right-side '>
              {/* <li>
                <DarkModeToggle />
              </li> */}
              <li>
                <NavLink to='/login' exact={true} activeClassName='active'>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to='/sign-up' exact={true} activeClassName='active'>
                  Sign Up
                </NavLink>
              </li>
              {/* <li>
                <NavLink to='/users' exact={true} activeClassName='active'>
                  Users
                </NavLink>
              </li> */}
            </div>
            :
            <>
              {/* <div className='navbar-middle-section'>
                <li> */}
              <SearchBar />
              {/* </li>
              </div> */}
              <div className='navbar-right-side '>
                <li>
                  {/* <button onClick={(e) => e.preventDefault() }> */}
                  <DarkModeToggle />
                  {/* </button> */}
                  {/* <button>
                    <i className="fa-solid fa-moon"></i>
                    <i className="fa-solid fa-sun"></i>
                  </button> */}
                </li>
                <li>
                  <NavLink to='/profile' exact={true} activeClassName='active'>
                    <button>
                      Profile
                    </button>
                  </NavLink>
                </li>
                <li>
                  <LogoutButton />
                </li>
              </div>
            </>

        }

      </ul>
    </nav>
  );
}

export default NavBar;
