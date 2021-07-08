import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch, NavLink } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Home from "./components/Home";
import Login from "./components/Login";
import Game from "./components/Game";
import Conversations from "./components/Conversations";
import SubmitGame from "./components/SubmitGame";
import Navigation from "./components/Navigation";
import * as sessionActions from "./store/session";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  return (
    <div className="App">
      {sessionUser&&(<div className="logout" onClick={logout}>Log Out</div>)}
      {!sessionUser&&<div><NavLink to="/signup">Sign Up</NavLink></div>}
      {!sessionUser&&<div><NavLink to="/login">Log In</NavLink></div>}
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&(<Switch>
        <Route path="/login" component={Login}></Route>
        <Route path="/game/:gameId" component={Game} exact={true}></Route>
        <Route path="/conversations" component={Conversations} exact={true}></Route>
        <Route path="/submit-game" component={SubmitGame} exact={true}></Route>
        <Route path="/" component={Home}></Route>
      </Switch>)}
    </div>
  );
}

export default App;
