//import { fetch } from './csrf.js';
// import { connect } from 'react-redux';

import Cookies from 'js-cookie';

const SET_READ = 'message/setRead';
const HIGHLIGHT_CONVO = 'message/highlightConvo'
const SET_VISITED = 'message/setVisited'
const SET_UNCHECKED = 'message/setUnchecked'
const REMOVE_FROM_UNCHECKED = 'message/removeFromUnchecked'
const REMOVE_FROM_GAMES = 'message/removeFromGames'
const SET_NEW_GAMES = 'message/setNewGamesNotification'
const SET_NEW_ACTIVITY = '/message/setNewGameActivity'

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

  export const loggingOutUser = () => ({
    // type: SET_UNCHECKED,
    // payload: uncheckedGameIds
  });

  //TODO: remove game from unChecked list
  export const removeFromUnchecked = (id) => ({
    type: REMOVE_FROM_UNCHECKED,
    payload: id
  });


  export const removeFromGames = (id) => ({
    type: REMOVE_FROM_GAMES,
    payload: id
  });

  export const setNewGamesNotification = (newGames) => ({
    type: SET_NEW_GAMES,
      payload: newGames
  })

  export const setNewGameActivity = (gameActivity) => ({
      type: SET_NEW_ACTIVITY,
      payload: gameActivity
  })

  export const logoutUser = (data) => async (dispatch) => {
    dispatch(loggingOutUser()) ;
  }

const initialState = { messages: [], conversations: [], games: [], uncheckedGameIds: [], newGames: {newGames: false}, gameActivity: [] };

function messageReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case SET_READ:
    // newState = {...state, messages: [...state.messages, action.payload]};
    newState = {...state, messages: [...action.payload]};
      return newState;
    case HIGHLIGHT_CONVO:
    newState = {...state, conversations: [...action.payload] };
        return newState;
    case SET_VISITED:

    newState = {...state, games: [...state.games, {...action.payload}]};
        return newState;
    case SET_UNCHECKED:
    newState = {...state, uncheckedGameIds: [...state.uncheckedGameIds, {...action.payload}]};
        return newState;
    case SET_NEW_GAMES:
      console.log('notification payload', action.payload)
        newState = {...state, newGames: {...state.newGames, ...action.payload}};
        console.log('new state', newState);
            return newState;
    case SET_NEW_ACTIVITY:

        newState = {...state, gameActivity: [...action.payload]};
            return newState;
    case REMOVE_FROM_GAMES:
        let gamesArrayCopy = [...state.games];

        let filteredArray = gamesArrayCopy.filter(game => game.gameId !== action.payload);

        //figure out which object has the gameId in it and remove it
        newState = {games: [...filteredArray]};
            return newState;

    case REMOVE_FROM_UNCHECKED:
      console.log('state 1', state.uncheckedGameIds)
      let arrayCopy = [...state.uncheckedGameIds];

      //figure out which object has the gameId in it and remove it
      arrayCopy.splice(arrayCopy.indexOf(action.payload), 1);
      newState = {...state, uncheckedGameIds: [...arrayCopy]};
          return newState;

    default:
      return state;
  }
}

export default messageReducer;
