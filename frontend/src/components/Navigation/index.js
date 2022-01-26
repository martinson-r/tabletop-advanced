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
import { FIND_UNREAD_MESSAGES, GET_USER, GET_FOLLOWED_GAMES, GET_FOLLOWED_VISITED_TIME } from "../../gql";

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const [matchedDates, setMatchedDates] = useState([]);
  const [playerId, setPlayerId] = useState(null);
  const [newGames, setNewGames] = useState(false);
  const [newMessages, setNewMessages] = useState(false);
  const [messageStatus, setMessageStatus] = useState('none');
  const messagesReadStatus = useSelector((state) => state.message);
  const [areThereMessages, setAreThereMessages] = useState(false);




  const { data: gameData, loading: gameLoading } = useQuery(GET_FOLLOWED_GAMES, { variables: { playerId } });
    const { data: visitedDate } = useQuery(GET_FOLLOWED_VISITED_TIME, { variables: { playerId } });
    const { data: unreadData } = useQuery(FIND_UNREAD_MESSAGES);

  const logout = (e) => {
    e.preventDefault();
    //TODO: redux to get log out button to toggle
    Cookies.remove('token');
    setUserId(null);
    dispatch(sessionActions.logout())
    history.push('/login');
  };

  useEffect(() => {
    // if (unreadData !== undefined && unreadData !== null) {
    //   console.log('UNREAD', unreadData);
    //   if (unreadData.findUnreadMessages !== undefined && unreadData.findUnreadMessages !== null) {
    //     if (unreadData.findUnreadMessages.length > 0) {
    //       setNewMessages(true);
    //       setMessageStatus('new');
    //     }
    //   }
    // }
},[unreadData]);

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
        //these are both arrays...

        console.log('followed......', gameData.getFollowedGames)

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
  if (unreadData && messagesReadStatus){
    checkReduxStoreForUnreadMessages();
  }

}, [unreadData, messagesReadStatus])

let checkReduxStoreForUnreadMessages = () => {
  if (unreadData !== undefined && messagesReadStatus !== undefined) {

    console.log('UNREAD DATA', unreadData)
    let messagesRead = [];
    let unreadMessages = [];
    if (messagesReadStatus !== null) {
      for (let readMessage of messagesReadStatus) {
        messagesRead.push(readMessage.conversationId);
      }
      for (let unreadMessage of unreadData.findUnreadMessages) {
        if (messagesRead.indexOf(unreadMessage.conversationId) === -1) {
          console.log('unread message found.');
          setNewMessages(true);
          setMessageStatus('new');
          return;
        }
        setNewMessages(false);
      }
    }

     if (messagesReadStatus.message === null && unreadData !== undefined && unreadData !== null) {
      console.log('UNREAD', unreadData);
      if (unreadData.findUnreadMessages !== undefined && unreadData.findUnreadMessages !== null) {
        if (unreadData.findUnreadMessages.length > 0) {
          setNewMessages(true);
          setMessageStatus('new');
          return;
        }
        setNewMessages(false);
      }
    }

  console.log('Checked store.');
}
}


useEffect(() => {
  let newActivity = matchedDates.filter(game => game.game.Messages[game.game.Messages.length-1] !== undefined
    && game.game.Messages[game.game.Messages.length-1].updatedAt > game.visitDate.visited);

    console.log('NEW...', newActivity);

    if (newActivity.length > 0) {
    setNewGames(true);
  }
}, [matchedDates])

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

      <div className="righthand-nav">
        <SimpleSearch />
        <div><NavLink to="/account">Account</NavLink></div>
        <div><NavLink to="/dashboard">My Games</NavLink></div>{
          newGames == true && (<div id="circle"></div>)}
        <div><NavLink to={`/${userId}/bio`}>My Bio</NavLink></div>
        <div><NavLink to={`/conversations`}><i className={`far fa-envelope messages-${messageStatus}`}></i></NavLink>
        </div>{console.log('rendered nav', newMessages)}{newMessages === true && (<div id="circle2"></div>)}
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
