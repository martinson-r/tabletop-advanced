//import { fetch } from './csrf.js';
// import { connect } from 'react-redux';

// import {
//   useLazyQuery, useMutation, useQuery
// } from "@apollo/client";

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});


export const loginUser = (data) => async (dispatch) => {

  //login({variables: { userName, password }});
  // const res = await fetch('/api/session/login', {
  //   method: 'POST',
  //   body: JSON.stringify({ userName, password })
  // });
  // dispatch(setUser(res.data.user));
  // return res;

  console.log('LOGGED IN USER', data);

  dispatch(setUser(data.login.user));
};

export const restoreUser = (data) => async (dispatch) => {
    const res = await fetch('/api/session');
    dispatch(setUser(data));
    return res;
  };

export const signup = (user) => async (dispatch) => {
  const { userName, email, password, confirmPassword } = user;
  const response = await fetch('/api/session/signup', {
    method: 'POST',
    body: JSON.stringify({
      userName,
      email,
      password,
      confirmPassword
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
