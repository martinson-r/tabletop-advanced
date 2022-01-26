//import { fetch } from './csrf.js';
// import { connect } from 'react-redux';

import Cookies from 'js-cookie';

const SET_READ = 'message/setRead';
const HIGHLIGHT_CONVO = 'message/highlightConvo'

export const setRead = (message) => ({
  type: SET_READ,
  payload: message
});

export const highlightConvo = (conversation) => ({
  type: HIGHLIGHT_CONVO,
  payload: conversation
});

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

const initialState = { messages: [], conversations: [] };

function messageReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case SET_READ:
    // newState = {...state, messages: [action.payload]};
    newState = {...state, messages: [...state.messages, ...action.payload]};
      return newState;
    case HIGHLIGHT_CONVO:
    newState = {...state, conversations: [...action.payload] };
        return newState;
    default:
      return state;
  }
}

export default messageReducer;
