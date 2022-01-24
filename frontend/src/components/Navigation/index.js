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
import { GET_USER } from "../../gql";

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();

  const { loading, error, data } = useQuery(GET_USER);

  const logout = (e) => {
    e.preventDefault();
    //TODO: redux to get log out button to toggle
    Cookies.remove('token');
    setUserId(null);
    dispatch(sessionActions.logout())
    history.push('/login');
  };

  console.log('SESSION USER...', sessionUser)

  useEffect(() => {
    if (sessionUser !== null && sessionUser !== undefined ) {
      setUserId(sessionUser.id);
    }
  },[sessionUser]);

  let sessionLinks;
  if (sessionUser)
 {
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
        <div><NavLink to="/dashboard">My Games</NavLink></div>
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
