import { Route, Switch, } from "react-router-dom";
import React, { useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
// import Game from "./components/Game";
import GamePage from "./components/GamePage";
import SubmitGame from "./components/SubmitGame";
import JoinWaitList from "./components/JoinWaitList";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import Account from "./components/Account";
import SearchResults from "./components/SearchResults";
import Bio from "./components/Bio";
import Conversation from "./components/Conversation";
import ConversationList from "./components/ConversationList";
import Character from "./components/Character";
import CreateCharacter from "./components/CreateCharacter";
import ViewApplication from "./components/ViewApplication";
import StartNewMessage from "./components/StartNewMessage"
import RuleSetPage from "./components/RuleSetPage";
import * as sessionActions from "./store/session";
import CharacterSheetList from "./components/CharacterSheetList";
import CharacterSheet from "./components/CharacterSheet";
import NewCharacterSheet from "./components/NewCharacterSheet";
import FollowedGamesPlayers from "./components/FollowedGamesPlayers";
import BrowseCategories from "./components/BrowseCategories";

import { GET_USER } from "./gql";
import {
  useLazyQuery, useMutation, useQuery
} from "@apollo/client";

function App() {
  const dispatch = useDispatch();
  const { data, loading, error } = useQuery(GET_USER);
  const [isLoaded, setIsLoaded] = useState(false);

  console.log('DATA APP', data);

  useEffect(() => {
      dispatch(sessionActions.restoreUser(data)).then(() => setIsLoaded(true));
  }, [dispatch, data]);

  return (
    <div className="App">
      {/* {sessionUser&&(<div className="logout" onClick={logout}>Log Out</div>)} */}
      {/* {!sessionUser&&<div></div>} */}
      {/* {!sessionUser&&<div><NavLink to="/signup">Sign Up</NavLink><NavLink to="/login">Log In</NavLink></div>} */}
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (<Switch>
        <Route path="/login" component={Login}></Route>
        <Route path="/signup" component={SignUp}></Route>
        <Route path="/game/:gameId/gameroom" name="GamePage" component={GamePage} exact={true}></Route>
        {/* <Route path="/game/:gameId" component={Game} exact={true}></Route> */}
        <Route path="/start-game" component={SubmitGame} exact={true}></Route>
        <Route path="/dashboard" component={Dashboard} exact={true}></Route>
        <Route path="/account" component={Account} exact={true}></Route>
        <Route path="/:userId/bio" component={Bio} exact={true}></Route>
        <Route path="/conversation/:conversationId" component={Conversation} exact={true}></Route>
        <Route path="/newmessage" component={StartNewMessage} exact={true}></Route>
        <Route path="/waitlist/:gameId" component={JoinWaitList} exact={true}></Route>
        <Route path="/characters/:characterId" component={Character} exact={true}></Route>
        <Route path="/game/:gameId/application/:applicationId" component={ViewApplication} exact={true}></Route>
        <Route path="/game/:gameId/create-character" component={CreateCharacter} exact={true}></Route>
        <Route path="/search/:text" component={SearchResults} exact={true}></Route>
        <Route path="/conversations" component={ConversationList}></Route>
        <Route path="/rulesets/:rulesetid" component={RuleSetPage}></Route>
        <Route path="/charactersheets/new" component={NewCharacterSheet}></Route>
        <Route path="/charactersheets/list/:playerId" component={CharacterSheetList}></Route>
        <Route path="/charactersheets/:characterSheetId" component={CharacterSheet}></Route>
        <Route path="/:playerId/followed" component={FollowedGamesPlayers}></Route>
        <Route path="/browse" component={BrowseCategories}></Route>
        <Route path="/" component={Home}></Route>
      </Switch>)}
    </div>
  );
}

export default App;
