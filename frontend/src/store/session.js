import { fetch } from './csrf.js';
// import { connect } from 'react-redux';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

export const login = ({ userName, password }) => async (dispatch) => {
console.log('Hit login')
  const res = await fetch('/api/session/login', {
    method: 'POST',
    body: JSON.stringify({ userName, password })
  });
  dispatch(setUser(res.data.user));
  return res;
};

export const restoreUser = () => async (dispatch) => {
    const res = await fetch('/api/session');
    console.log('RES', res);
    dispatch(setUser(res.data.user));
    return res;
  };

export const signup = (user) => async (dispatch) => {
  const { userName, email, password } = user;
  const response = await fetch('/api/session/signup', {
    method: 'POST',
    body: JSON.stringify({
      userName,
      email,
      password
    })
  });

  dispatch(setUser(response.data.user));
  return response;
};

export const logout = () => async (dispatch) => {
  const response = await fetch('/api/session/logout', {
    method: 'DELETE'
  });
  dispatch(removeUser());
  return response;
};

const initialState = { user: null };

function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state, { user: action.payload });
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state, { user: null });
      return newState;
    default:
      return state;
  }
}

export default reducer;
