//import { fetch } from './csrf.js';
// import { connect } from 'react-redux';

import Cookies from 'js-cookie';

const SET_READ = 'message/setRead';

export const setRead = (message) => ({
  type: SET_READ,
  payload: message
});

// const removeUser = () => ({
//   type: REMOVE_USER
// });

// export const loginUser = (data) => async (dispatch) => {

//   dispatch(setUser(data.user));

// };

// export const restoreUser = (data) => async (dispatch) => {

//     if (data) {
//       dispatch(setUser(data.user));
//     }

//   };

// export const logout = () => async (dispatch) => {
//   dispatch(removeUser());
// };

const initialState = [ { message: null } ];

function messageReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case SET_READ:
    //   newState = Object.assign({}, state, { message: action.payload });
    newState = [...action.payload];
      return newState;
    default:
      return state;
  }
}

export default messageReducer;
