//import { fetch } from './csrf.js';
// import { connect } from 'react-redux';

import Cookies from 'js-cookie';

const SET_READ = 'message/setRead';
const HIGHLIGHT_CONVO = 'message/highlightConvo'
const SET_VISITED = 'message/setVisited'
const SET_UNCHECKED = 'message/setUnchecked'
const REMOVE_FROM_UNCHECKED = 'message/removeFromUnchecked'
const SET_NEW_GAMES = 'message/setNewGamesNotification'

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


  export const setUnchecked = (uncheckedGameIds) => ({
    type: SET_UNCHECKED,
    payload: uncheckedGameIds
  });


  //TODO: remove game from unChecked list
  export const removeFromUnchecked = (id) => ({
    type: REMOVE_FROM_UNCHECKED,
    payload: id
  });

  export const setNewGamesNotification = (newGames) => ({
      type: SET_NEW_GAMES,
      payload: newGames
  })

const initialState = { messages: [], conversations: [], games: [], uncheckedGameIds: [], newGames: {newGames: false} };

function messageReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case SET_READ:
        console.log('messages')
    // newState = {...state, messages: [...state.messages, action.payload]};
    newState = {...state, messages: [...action.payload]};
      return newState;
    case HIGHLIGHT_CONVO:
    newState = {...state, conversations: [...action.payload] };
        return newState;
    case SET_VISITED:
    console.log('visited dispatched');
    newState = {...state, games: [...state.games, {...action.payload}]};
        return newState;
    case SET_UNCHECKED:
    newState = {...state, uncheckedGameIds: [...state.uncheckedGameIds, action.payload]};
        return newState;
    case SET_NEW_GAMES:
        console.log('set new games dispatched')
        newState = {...state, newGames: {...state.newGames, ...action.payload}};
            return newState;
    case REMOVE_FROM_UNCHECKED:
        let arrayCopy = state.uncheckedGameIds;
        console.log(action.payload);
        arrayCopy.splice(arrayCopy.indexOf(action.payload), 1);
        newState = {...state, uncheckedGameIds: [...arrayCopy]};
            return newState;
    default:
      return state;
  }
}

export default messageReducer;
