import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch, NavLink } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Game from "./components/Game";
import SubmitGame from "./components/SubmitGame";
import JoinWaitList from "./components/JoinWaitList";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import Account from "./components/Account";
import GameMessages from "./components/GameMessages";
import Bio from "./components/Bio";
import Conversation from "./components/Conversation";
import ViewApplication from "./components/ViewApplication";
import StartNewMessage from "./components/StartNewMessage"
import * as sessionActions from "./store/session";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/login');
  };

  return (
    <div className="App">
      {sessionUser&&(<div className="logout" onClick={logout}>Log Out</div>)}
      {!sessionUser&&<div></div>}
      {!sessionUser&&<div><NavLink to="/signup">Sign Up</NavLink><NavLink to="/login">Log In</NavLink></div>}
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (<Switch>
        <Route path="/login" component={Login}></Route>
        <Route path="/signup" component={SignUp}></Route>
        <Route path="/game/:gameId/gameroom/" name="GameMessages" component={GameMessages} exact={true}></Route>
        <Route path="/game/:gameId" component={Game} exact={true}></Route>
        <Route path="/start-game" component={SubmitGame} exact={true}></Route>
        <Route path="/dashboard" component={Dashboard} exact={true}></Route>
        <Route path="/account" component={Account} exact={true}></Route>
        <Route path="/:userId/bio" component={Bio} exact={true}></Route>
        <Route path="/conversation/:conversationId" component={Conversation} exact={true}></Route>
        <Route path="/newmessage" component={StartNewMessage} exact={true}></Route>
        <Route path="/waitlist/:gameId" component={JoinWaitList} exact={true}></Route>
        <Route path="/game/:gameId/application/:applicationId" component={ViewApplication} exact={true}></Route>
        <Route path="/" component={Home}></Route>
      </Switch>)}
    </div>
  );
}

export default App;
