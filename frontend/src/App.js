import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch, NavLink } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Home from "./components/Home";
import Login from "./components/Login";
import * as sessionActions from "./store/session";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="App">
    {!sessionUser&&<div><NavLink to="/signup">Sign Up</NavLink></div>}
        {isLoaded &&(<Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/" component={Home}></Route>
        </Switch>)}
    </div>
  );
}

export default App;
