//import { fetch } from './csrf.js';
// import { connect } from 'react-redux';

import Cookies from 'js-cookie';

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

  dispatch(setUser(data.user));

};

export const restoreUser = (data) => async (dispatch) => {

    if (data) {
      dispatch(setUser(data.user));
    }

  };

export const logout = () => async (dispatch) => {
  dispatch(removeUser());
};

const initialState = { user: null };

function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state, { user: action.payload });
      return newState;
    case REMOVE_USER:
      console.log('removeUser fired')
      newState = { user: null };
      console.log('new state:', newState);
      return newState;
    default:
      return state;
  }
}

export default reducer;
