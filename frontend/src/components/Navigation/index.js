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
import { setUnchecked, setVisited, setNewGamesNotification } from '../../store/message';
import { DateTime } from "../../utils/luxon";

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const areNewGames = useSelector(state => state.newGames)
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const [matchedDates, setMatchedDates] = useState([]);
  const [playerId, setPlayerId] = useState(null);
  const [newGames, setNewGames] = useState(false);
  const [newMessages, setNewMessages] = useState(false);
  const [messageStatus, setMessageStatus] = useState('none');
  const [newGameStatus, setNewGameStatus] = useState('none');
  const messagesReadStatus = useSelector((state) => state.message);
  const gamesCheckedStatus = useSelector((state) => state.message.games)
  const [areThereMessages, setAreThereMessages] = useState(false);
  const [newActivity, setNewActivity] = useState({});
  const [justVisited, setJustVisited] = useState(null);
  const [uncheckedMessages, setUncheckedMessages] = useState([]);
  const { data: gameData, loading: gameLoading } = useQuery(GET_FOLLOWED_GAMES, { variables: { playerId } });
  const { data: visitedDate } = useQuery(GET_FOLLOWED_VISITED_TIME, { variables: { playerId } });
  const { data: unreadData } = useQuery(FIND_UNREAD_MESSAGES);

  console.log('unreadData', unreadData);

  const logout = (e) => {
    e.preventDefault();
    //TODO: redux to get log out button to toggle
    Cookies.remove('token');
    setUserId(null);
    dispatch(sessionActions.logout())
    history.push('/login');
  };

//   useEffect(() => {
//     if (gamesCheckedStatus !== undefined) {

//       //TODO: compare visitedDate with game's last update
//       //and update Redux store
//       console.log('GAMEDATA', gameData);
//       console.log('visited date', visitedDate);
//   let uncheckedGames = [];

//   visitedDate.getFollowedTimeStamps.forEach((timeStamp) => {
//     gameData.getFollowedGames.followedgame.forEach((game) => {
//       if (timeStamp.gameId === game.gameId) {
//         if (timeStamp.visited < game.Messages[game.Messages.length - 1].updatedAt) {
//           uncheckedGames.push(timeStamp.gameId);
//         }
//       }
//     })
//   })

//   console.log('unchecked games', uncheckedGames);

//     }
// },[gamesCheckedStatus]);

useEffect(() => {
 if (messagesReadStatus !== undefined) {
   console.log('READ STATUS', messagesReadStatus)
 }
}, [messagesReadStatus])

  useEffect(() => {
    if (sessionUser !== null && sessionUser !== undefined ) {
      setUserId(sessionUser.id);
      setPlayerId(sessionUser.id);
    }
  },[sessionUser]);

  let matchUpDates = () => {
    if (gameData !== undefined && gameData !== null && visitedDate !== undefined) {

        if (gameData.getFollowedGames !== null && gameData.getFollowedGames !== undefined){
          let followedGamesArray = gameData.getFollowedGames.followedgame;
        let visitedArray = visitedDate.getFollowedTimeStamps;

        for (let game of followedGamesArray) {
            for (let visitDate of visitedArray) {
                if (game.id === visitDate.gameId) {
                    setMatchedDates(matchedDates => [{game, visitDate}, ...matchedDates]);
                }
            }
        }
        }
    }
}

useEffect(() => {

  if (areNewGames !== undefined) {
    setNewGames(areNewGames.newGames)
  }
},[areNewGames]);

useEffect(() => {
  if (unreadData !== undefined && messagesReadStatus !== undefined){
    console.log('messagesReadStatus', messagesReadStatus)
    //checkReduxStoreForUnreadMessages();
    if (unreadData.length === 0) {
      console.log('setting false 1')
      setNewMessages(false);
      return;
    }

    if (messagesReadStatus !== null
      && messagesReadStatus !== undefined
      && unreadData !== null
      && unreadData !== undefined) {

        if (unreadData.findUnreadMessages.length === 0 && messagesReadStatus.messages.length === 0) {
          console.log('setting false 2')
          setNewMessages(false);
        }

        if (unreadData.findUnreadMessages.length > messagesReadStatus.messages.length) {
          console.log('setting true')
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
  let newActivity = matchedDates.filter(game => game.game.Messages[game.game.Messages.length-1] !== undefined && game.game.Messages[game.game.Messages.length-1].updatedAt > game.visitDate.visited);
     console.log('new activity useEffect', newActivity)
    if (newActivity.length > 0) {
    dispatch(setNewGamesNotification({newGames: true}));
    setNewGames(true);
    setNewGameStatus('new');
    setNewActivity(newActivity);
    newActivity.map(game => dispatch(setUnchecked(game)));
  }

  console.log('NewActivity', newActivity);

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

      console.log('ids', game.gameId === activity.visitDate.gameId)
      console.log('times', game.visited > activity.game.Messages[newActivity[0].game.Messages.length - 1].updatedAt)

      if (game.gameId === activity.visitDate.gameId) {
      console.log('TIME', activity.game.Messages[activity.game.Messages.length - 1].updatedAt)
        console.log('GAME VISITED', game.visited);

      if (game.visited > activity.game.Messages[activity.game.Messages.length - 1].updatedAt) {
          setJustVisited(game);
           console.log('push gameId ', game.gameId)
          gamesChecked.push(game.gameId);
      }
    }
  }
}
}
console.log('ACTIVITY....', gameActivity, gamesChecked)
  for (let game of gameActivity) {
    if (gamesChecked.indexOf(game) === -1) {
      console.log('new games');
      console.log(gameActivity, gamesChecked, game)
      setNewGames(true);
      setNewGamesNotification({newGames: true})
    } else {
      console.log('no new games');
      setNewGames(false);
      setNewGamesNotification({newGames: false})
    }
}


let filteredGames = gameActivity.filter((game) => {
  return gamesChecked.indexOf(game) === -1
});

console.log('filtered games', filteredGames);


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
        {console.log('unchecked', uncheckedMessages)}
      </div>

      <div className={`righthand-nav`}>
        <SimpleSearch />
        <div><NavLink to="/account">Account</NavLink></div>
        <div><NavLink to="/dashboard">My Games</NavLink></div>

        {newGames !== undefined && newGames !== null && newGames == true && (<div id="circle"></div>)}
        <div><NavLink to={`/${userId}/bio`}>My Bio</NavLink></div>
        <div><NavLink to={`/conversations`}>{console.log('matched dates', matchedDates)}<i className={`far fa-envelope messages-${messageStatus}`}></i></NavLink>
        </div>
        {unreadData !== undefined && unreadData.findUnreadMessages.length > messagesReadStatus.messages && (<div id="circle2" ></div>)}
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
