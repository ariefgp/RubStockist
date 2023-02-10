// constants
const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';
const GET_USER_SESSION = 'session/GET_USER_SESSION';
const UPDATE_USER_DARK_MODE_PREF = 'session/UPDATE_USER_DARK_MODE_PREF';

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER,
})

const getUserSessionAction = (user) => ({
  type: GET_USER_SESSION,
  payload: user
})

const updateUserDarkModePrefAction = (user) => ({
  type: UPDATE_USER_DARK_MODE_PREF,
  payload: user
})

const initialState = { user: null };

export const authenticate = () => async (dispatch) => {
  const response = await fetch('/api/auth/', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }
  
    dispatch(setUser(data));
  }
}

export const login = (email, password) => async (dispatch) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });
  
  
  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data))
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.']
  }

}

export const logout = () => async (dispatch) => {
  const response = await fetch('/api/auth/logout', {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (response.ok) {
    dispatch(removeUser());
  }
};


export const signUp = (username, email, password) => async (dispatch) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
  
  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data))
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.']
  }
}

export const getUserSession = () => async (dispatch) => {
  const response = await fetch('/api/users/session', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(getUserSessionAction(data));
    if (data.errors) {
      return;
    }
  }
}

export const updateUserDarkModePref = (dark_mode_pref) => async (dispatch) => {
  const response = await fetch('/api/users/session/dark-mode', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      dark_mode_pref
    })
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(updateUserDarkModePrefAction(data));
    if (data.errors) {
      return;
    }
  }
}
 

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { user: action.payload }
    case REMOVE_USER:
      return { user: null }
    case GET_USER_SESSION:
      return { user: action.payload }
    case UPDATE_USER_DARK_MODE_PREF:
      return { user: action.payload }
    default:
      return state;
  }
}