import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { signUp, login } from '../../store/session';
import { isEmail } from '../utility';

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();

    if(isEmail(email) === false) {
      setErrors(['Please enter a valid email address'])
      return;
    }

    if (password === repeatPassword) {
      const data = await dispatch(signUp(username, email, password));
      if (data) {
        // console.log({data})
        // setErrors(data)
        setErrors(['Invalid credentials. Please try again.'])
      }
    } else {
      setErrors(['Confirm Password field must be the same as the Password field'])
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
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

  return (
    <div className='signup-page-container'>
      <div className='signup-page-splash-image-container'>
        <h1>Sign Up</h1>
      </div>
      <div className='signup-form-container'>
        <form onSubmit={onSignUp}>
          <div>
            {errors.map((error, ind) => (
              <div key={ind} className='signup-form-errors'>{error}</div>
            ))}
          </div>
          <div>
            {/* <label>User Name</label> */}
            <input
              type='text'
              name='username'
              placeholder='User Name'
              autocomplete="on"
              onChange={updateUsername}
              value={username}
              minLength='1'
              maxLength='255'
              required
            ></input>
          </div>
          <div>
            {/* <label>Email</label> */}
            <input
              type='text'
              name='email'
              placeholder='Email'
              autocomplete="on"
              onChange={updateEmail}
              value={email}
              minLength='1'
              maxLength='255'
              required
            ></input>
          </div>
          <div>
            {/* <label>Password</label> */}
            <input
              type='password'
              name='password'
              placeholder='Password'
              autocomplete="on"
              onChange={updatePassword}
              value={password}
              minLength='1'
              maxLength='255'
              required
            ></input>
          </div>
          <div>
            {/* <label>Repeat Password</label> */}
            <input
              type='password'
              name='repeat_password'
              placeholder='Confirm Password'
              autocomplete="on"
              onChange={updateRepeatPassword}
              value={repeatPassword}
              required={true}
              minLength='1'
              maxLength='255'
            ></input>
          </div>
          <button type='submit'>Sign Up</button>
          <button onClick={() => handleDemoUserClick()}>Demo User</button>
        </form>

      </div>
    </div>
  );
};

export default SignUpForm;
