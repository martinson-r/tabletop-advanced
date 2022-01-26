//import { fetch } from './csrf.js';
// import { connect } from 'react-redux';

import Cookies from 'js-cookie';

const SET_READ = 'message/setRead';
const HIGHLIGHT_CONVO = 'message/highlightConvo'
const SET_VISITED = 'message/setVisited'

export const setRead = (message) => ({
  type: SET_READ,
  payload: message
});

export const highlightConvo = (conversation) => ({
  type: HIGHLIGHT_CONVO,
  payload: conversation
});

export const setVisited = (game) => ({
    type: SET_VISITED,
    payload: game
  });

const initialState = { messages: [], conversations: [], games: [] };

function messageReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case SET_READ:
    newState = {...state, messages: [...state.messages, ...action.payload]};
      return newState;
    case HIGHLIGHT_CONVO:
    newState = {...state, conversations: [...action.payload] };
        return newState;
    case SET_VISITED:
    newState = {...state, games: [...state.games, {...action.payload}]};
        return newState;
    default:
      return state;
  }
}

export default messageReducer;
