import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import SimpleSearch from "../SimpleSearch";
// import ProfileButton from './ProfileButton';
// import LoginFormModal from '../LoginFormModal';
// import SearchModal from '../SearchModal';
import './navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    if (sessionUser !== null ) {
      setUserId(sessionUser.id);
    }

  },[sessionUser])


  let sessionLinks;
  if (sessionUser && userId !== null) {
    sessionLinks = (
      <div className="navigation">
      <h1 className="header"><i className="fas fa-dice-d20"></i><NavLink exact to="/">Tabletop Advanced</NavLink></h1>
      <NavLink to="/">Find a Game</NavLink>
      <NavLink to="/start-game">Start a Game</NavLink>
      <NavLink to="/account">Account</NavLink>
      <NavLink to="/dashboard">My Games</NavLink>
      <NavLink to={`${userId}/bio`}>My Bio</NavLink>
      <div className="search-messages">
        <div><NavLink to={`/conversations`}><i className="far fa-envelope"></i></NavLink></div>
        {/* <ProfileButton user={sessionUser} />
        <SearchModal /> */}
        </div>
      </div>
    );
  } else {
    sessionLinks = (
      <div className="navigation">
        <h1 className="header"><i className="fas fa-dice-d20"></i><NavLink exact to="/">Tabletop Advanced</NavLink></h1>
        <NavLink to="/">Find a Game</NavLink>
        <NavLink to="/login">Log In</NavLink>
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
