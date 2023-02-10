import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { login } from '../../store/session';
import { isEmail } from '../utility';

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const onLogin = async (e) => {
    e.preventDefault();

    if(isEmail(email) === false) {
      setErrors(['Please enter a valid email address'])
      return;
    }

    const data = await dispatch(login(email, password));
    if (data) {
      // setErrors(data);
      setErrors(['Invalid credentials. Please try again.'])
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  const handleDemoUserClick = async () => {
    const data = await dispatch(login('demo@aa.io', 'password'));
    if (data) {
      setErrors(data);
    }
  };

  const handleSignUpClick = () => {
    history.push('/sign-up')
  };

  return (
    <div className='login-form-page'>
      <div className='login-page-splash-image-container'>

      </div>
      <div className='login-form-form-container'>
        <form onSubmit={onLogin}>
          <div>
            {errors.map((error, ind) => (
              <div key={ind}>{error}</div>
            ))}
          </div>
          <div>
            {/* <label htmlFor='email'>Email</label> */}
            <input
              name='email'
              type='text'
              placeholder='Email'
              autocomplete="on"
              value={email}
              onChange={updateEmail}
              required={true}
            />
          </div>
          <div>
            {/* <label htmlFor='password'>Password</label> */}
            <input
              name='password'
              type='password'
              placeholder='Password'
              autocomplete="on"
              value={password}
              onChange={updatePassword}
              required={true}
            />
            <button type='submit'>Login</button>
          </div>
        <button onClick={() => handleSignUpClick()}>Sign Up</button>
        <button onClick={() => handleDemoUserClick()}>Demo User</button>
        </form>
      </div>
    </div>

  );
};

export default LoginForm;
