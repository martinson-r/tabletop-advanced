import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import SimpleSearch from "../SimpleSearch";
// import ProfileButton from './ProfileButton';
// import LoginFormModal from '../LoginFormModal';
// import SearchModal from '../SearchModal';
import './navigation.css';
import * as sessionActions from "../../store/session";

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/login');
  };

  useEffect(() => {
    if (sessionUser !== null && sessionUser !== undefined ) {
      setUserId(sessionUser.id);
    }

  },[sessionUser])


  let sessionLinks;
  if (sessionUser && userId !== null) {
    sessionLinks = (
      <div className="navigation">
      <p><i className="fas fa-dice-d20"></i><NavLink exact to="/">Tabletop Advanced</NavLink></p>
      <NavLink to="/">Find a Game</NavLink>
      <NavLink to="/account">Account</NavLink>
      <NavLink to="/dashboard">My Games</NavLink>
      <NavLink to={`${userId}/bio`}>My Bio</NavLink>
      <div onClick={logout}>Log Out</div>
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
        <p><i className="fas fa-dice-d20"></i><NavLink exact to="/">Tabletop Advanced</NavLink></p>
        <NavLink to="/">Find a Game</NavLink>
        <NavLink to="/login">Log In</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
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
