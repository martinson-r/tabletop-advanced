import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SimpleSearch from "../SimpleSearch";
// import ProfileButton from './ProfileButton';
// import LoginFormModal from '../LoginFormModal';
import SearchModal from '../SearchModal';
import './navigation.css';
import * as sessionActions from "../../store/session";
import {
  useLazyQuery, useMutation, useQuery
} from "@apollo/client";
import Cookies from 'js-cookie';
import { FIND_UNREAD_MESSAGES, GET_GAME_CONVOS, GET_USER, GET_FOLLOWED_GAMES, GET_FOLLOWED_VISITED_TIME } from "../../gql";
import { setUnchecked, setVisited, setNewGamesNotification, setNewGameActivity, setRead } from '../../store/message';
import { DateTime } from "../../utils/luxon";

function Navigation({ isLoaded }){
  const dispatch = useDispatch();

  const sessionUser = useSelector(state => state.session.user);
  const areNewGames = useSelector(state => state.newGames);
  const isNewGamesNotification = useSelector(state => state.message.newGames.newGames);
  const messagesReadStatus = useSelector((state) => state.message);
  const gamesCheckedStatus = useSelector((state) => state.message.games);

  const [userId, setUserId] = useState(null);
  const history = useHistory();
  const [matchedDates, setMatchedDates] = useState([]);
  const [playerId, setPlayerId] = useState(null);
  const [newGames, setNewGames] = useState(false);
  const [newMessages, setNewMessages] = useState(false);
  const [messageStatus, setMessageStatus] = useState('none');
  const [newGameStatus, setNewGameStatus] = useState([]);

  const [newActivity, setNewActivity] = useState({});
  const [justVisited, setJustVisited] = useState(null);
  const { data: gameData, loading: gameLoading } = useQuery(GET_FOLLOWED_GAMES, { variables: { playerId } });
  const { data: visitedDate, loading: visitedLoading } = useQuery(GET_FOLLOWED_VISITED_TIME, { variables: { playerId } });
  const { data: unreadData, loading: unreadLoading } = useQuery(FIND_UNREAD_MESSAGES);



  const logout = (e) => {
    e.preventDefault();
    //TODO: redux to get log out button to toggle
    Cookies.remove('token');
    setUserId(null);
    dispatch(sessionActions.logout())
    history.push('/login');
  };

  useEffect(() => {
    console.log('notify', isNewGamesNotification)
    if (isNewGamesNotification.newGames === false) {
      setNewGames(false)
      console.log('set false')
    };
    if (isNewGamesNotification. newGames === true) {
      setNewGames(true);
      console.log('set true')
    }
  },[isNewGamesNotification])

  useEffect(() => {
    if (gamesCheckedStatus !== undefined
      && gameData !== undefined
      &&  visitedDate !== undefined) {

  let uncheckedGames = [];

    visitedDate.getFollowedTimeStamps?.forEach((timeStamp) => {

      gameData.getFollowedGames.followedgame?.forEach((game) => {


        if (timeStamp.gameId === game.id) {


          if (timeStamp.visited < game.Messages[game.Messages?.length - 1].updatedAt) {
            uncheckedGames.push(game);
          }
        }

      })
    })

    setNewGameStatus([...newGameStatus, ...uncheckedGames]);

    if (uncheckedGames.length > 0) {
      (console.log('new notification set 1'))
      dispatch(setNewGamesNotification(true));
    }
    if (uncheckedGames.length === 0) {
      (console.log('new notification set 2'))
      dispatch(setNewGamesNotification(false));
    }

    }
},[gamesCheckedStatus, gameData, visitedDate]);


  useEffect(() => {
    if (sessionUser !== null && sessionUser !== undefined ) {
      setUserId(sessionUser.id);
      setPlayerId(sessionUser.id);
    }
  },[sessionUser]);

  let matchUpDates = () => {
    if (!gameLoading && !visitedLoading) {

        if (gameData.getFollowedGames !== null && gameData.getFollowedGames !== undefined){
          let followedGamesArray = gameData.getFollowedGames.followedgame;
        let visitedArray = visitedDate.getFollowedTimeStamps;

        console.log(console.log('followed games', followedGamesArray));

        let storeMatchedDates = [];

        for (let game of followedGamesArray) {
            for (let visitDate of visitedArray) {
                if (game.id === visitDate.gameId) {
                  console.log('match!');
                    storeMatchedDates.push({game, visitDate})
                }
            }
          }
          setMatchedDates(storeMatchedDates);
        }

    }
    console.log('matched', matchedDates);
}

useEffect(() => {

  if (areNewGames !== undefined) {
    setNewGames(areNewGames.newGames)
  }
},[areNewGames]);

useEffect(() => {
  if (!unreadLoading && messagesReadStatus !== undefined){

    //checkReduxStoreForUnreadMessages();
    if (unreadData?.length === 0) {
      setNewMessages(false);
      return;
    }

    if (messagesReadStatus !== null
      && messagesReadStatus !== undefined
      // && unreadData.findUnreadMessages !== null
      // && unreadData.findUnreadMessages !== undefined
      ) {

        if (unreadData.findUnreadMessages?.length === 0 && messagesReadStatus.messages?.length === 0) {

          setNewMessages(false);

        }

        if (unreadData.findUnreadMessages?.length > messagesReadStatus.messages?.length) {

          setNewMessages(true);
        }
      }
  }

}, [messagesReadStatus, unreadData])

let checkReduxStoreForUnreadMessages = () => {
  if (unreadData.findUnreadMessages !== null && unreadData !== undefined && messagesReadStatus !== undefined) {

    if (unreadData.length === 0) {
      setNewMessages(false);
      return;
    }

    if (messagesReadStatus !== null
      && messagesReadStatus !== undefined
      && unreadData !== null
      && unreadData !== undefined) {

        if (unreadData.findUnreadMessages.length === 0 && messagesReadStatus.messages.length === 0) {
          setNewMessages(false);
        }

        if (unreadData.findUnreadMessages.length > messagesReadStatus.messages.length) {
          setNewMessages(true);
        }

//         for (let readMessage of messagesReadStatus) {
//           console.log(
//             'readMessage', readMessage
//           )
//         messagesRead.push(readMessage.conversationId);
//         }

//         console.log('messagesRead', messagesRead);

//       for (let unreadMessage of unreadData.findUnreadMessages) {
//         console.log('unreadMessage', unreadMessage)
//         console.log('all read messages', messagesRead);

//         if (messagesRead.indexOf(unreadMessage.conversationId) === -1) {

//           setNewMessages(true);
//           setMessageStatus('new');
//           console.log('there are new messages')
//           return;
//         }
//       }
//       setNewMessages(false);
//     }

//      if (messagesReadStatus === null && unreadData !== undefined && unreadData !== null) {

//       if (unreadData.findUnreadMessages !== undefined && unreadData.findUnreadMessages !== null) {
//         if (unreadData.findUnreadMessages.length > 0) {
//           setNewMessages(true);
//           setMessageStatus('new');
//           console.log('there are new messages')
//           return;
//         }
//         setNewMessages(false);
//         console.log('no new messages')
//       }
     }
 }
}


useEffect(() => {
console.log('notification fired');
},[isNewGamesNotification])

useEffect(() => {
  let newActivity = matchedDates.filter(game => game.game.Messages[game.game.Messages.length-1] !== undefined && game.game.Messages[game.game.Messages.length-1].updatedAt > game.visitDate.visited);
  console.log('matched', matchedDates)
  console.log('new activity', newActivity);
    if (newActivity.length > 0) {
    dispatch(setNewGamesNotification({newGames: true}));
    setNewGames(true);
    dispatch(setNewGameActivity(newActivity));
    console.log('new activity, dispatching', newActivity)
    newActivity.map(newActivity => dispatch(setUnchecked(newActivity)));
  }
}, [matchedDates]);

//check visited games for newActivity
// check gameId and double check visit time

useEffect(() => {
  let gamesChecked = [];
  let gameActivity = [];

  // if (newActivity.length === 0) {
  //   setNewGames(false);
  //   return;
  // }



  if (newActivity[0] !== undefined) {
    for (let activity of newActivity) {
      gameActivity.push(activity.visitDate.gameId);
      for (let game of gamesCheckedStatus) {
      if (game.gameId === activity.visitDate.gameId) {
      if (game.visited > activity.game.Messages[activity.game.Messages.length - 1].updatedAt) {
          setJustVisited(game);

          gamesChecked.push(game.gameId);
      }
    }
  }
}
}

if (gameActivity.length === 0){
      setNewGames(false);
      console.log('set notification to false');
      dispatch(setNewGamesNotification(false));
      return;
}

  for (let game of gameActivity) {
    if (gamesChecked.indexOf(game) === -1) {

      setNewGames(true);
      console.log('set notification to true')
      dispatch(setNewGamesNotification(true));
    } else {

      setNewGames(false);
      console.log('set notification to false')
      dispatch(setNewGamesNotification(false));
    }
}


let filteredGames = gameActivity.filter((game) => {
  return gamesChecked.indexOf(game) === -1
});



},[gamesCheckedStatus])


useEffect(() => {
  if (sessionUser !== null && sessionUser !== undefined) {
    matchUpDates();
  }
},[visitedDate, gameData]);

  let sessionLinks;
  if (sessionUser)
 {
  // TODO: check Visited in games list against last updated for that game
  // TODO: check seen status of messages
    sessionLinks = (
      <div className="navigation">
      <div className="lefthand-nav">
        <div><i className="fas fa-dice-d20 logo"></i></div>
        <div><NavLink exact to="/">Tabletop Advanced</NavLink></div>
        {/* <div><p>Hello, {sessionUser.userName}!</p></div> */}

      </div>

      <div className={`righthand-nav`}>
        <SimpleSearch />
        <div><NavLink to="/account">Account</NavLink></div>
        <div><NavLink to="/dashboard">My Games</NavLink></div>


        {console.log('notification', isNewGamesNotification, newGames)}
        {newGames && (<div id="circle">{console.log('newGames inside div', newGames)}</div>)}
        <div><NavLink to={`/${userId}/bio`}>My Bio</NavLink></div>
        <div><NavLink to={`/conversations`}><i className={`far fa-envelope messages-${messageStatus}`}></i></NavLink>
        </div>
        {messagesReadStatus.messages !== undefined && unreadData !== undefined
        && unreadData.findUnreadMessages !== null && unreadData.findUnreadMessages !== undefined
        && unreadData.findUnreadMessages.length > messagesReadStatus.messages?.length
        && (<div id="circle2" ></div>)}
        <div onClick={logout}>Log Out</div>
        {/* <ProfileButton user={sessionUser} />
        <SearchModal /> */}
        </div>
      </div>
    );
  } else {
    sessionLinks = (

      <div className="navigation">
        <div className="lefthand-nav">
        <div><i className="fas fa-dice-d20"></i><NavLink exact to="/">Tabletop Advanced</NavLink></div>
      </div>
      <div className="righthand-nav">
        <SimpleSearch />
        <NavLink to="/login">Log In</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
      </div>

        {/* <SearchModal /> */}
      </div>
    );
  }

  return (
   <>
        {isLoaded && sessionLinks}
   </>
  );
}

export default Navigation;
