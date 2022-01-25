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
import { GET_USER, GET_FOLLOWED_GAMES, GET_FOLLOWED_VISITED_TIME } from "../../gql";

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const [matchedDates, setMatchedDates] = useState([]);
  const [playerId, setPlayerId] = useState(null);
  const [newGames, setNewGames] = useState(false);

  const { data: gameData, loading: gameLoading } = useQuery(GET_FOLLOWED_GAMES, { variables: { playerId } });
    const { data: visitedDate } = useQuery(GET_FOLLOWED_VISITED_TIME, { variables: { playerId } });

  const logout = (e) => {
    e.preventDefault();
    //TODO: redux to get log out button to toggle
    Cookies.remove('token');
    setUserId(null);
    dispatch(sessionActions.logout())
    history.push('/login');
  };

  useEffect(() => {
    if (sessionUser !== null && sessionUser !== undefined ) {
      setUserId(sessionUser.id);
      setPlayerId(sessionUser.id);
    }
  },[sessionUser]);

  let matchUpDates = () => {
    if (gameData !== undefined && visitedDate !== undefined) {
        //these are both arrays...
        let followedGamesArray = gameData.getFollowedGames.followedgame;
        let visitedArray = visitedDate.getFollowedTimeStamps;

        for (let game of followedGamesArray) {
            console.log('ARRAY', followedGamesArray);
            console.log(game.id);
        }

        for (let visitDate of visitedArray) {
            console.log(visitDate);
        }

        for (let game of followedGamesArray) {
            console.log('GAMID', game.id)
            for (let visitDate of visitedArray) {
                console.log('game', game.id);
                console.log('visitdate', visitDate.gameId)
                if (game.id === visitDate.gameId) {
                    setMatchedDates(matchedDates => [{game, visitDate}, ...matchedDates]);
                }
            }
        }
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

  // TODO: red dot on letter when there are messages
  // TODO: red dot on My Games when there are updates
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
        <div><NavLink to={`/conversations`}><i className="far fa-envelope"></i></NavLink></div>
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
