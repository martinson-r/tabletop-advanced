import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";


import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
import { GET_GAME, SUBMIT_WAITLIST_APP, GET_WAITLIST_APPLIED  } from "../../gql";

function JoinWaitList({...props}) {


    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState("");
    const [charName, setCharName] = useState("");
    const [charConcept, setCharConcept] = useState("");
    const [whyJoin, setWhyJoin] = useState("");
    const [experience, setExperience] = useState("");
    const [hostId, setHostId] = useState(null);

    const { gameId } = useParams();
    const history = useHistory();

    //TODO: Add ability to pass in userId to get back info on if this user has already applied for this game
    const { loading: loadGame, error: gameError, data: gameData } = useQuery(GET_GAME, { variables: { userId, gameId }})
    const { loading: loadWaitlistStatus, error: waitlistError, data: waitlistStatus } = useQuery(GET_WAITLIST_APPLIED, { variables: { userId, gameId }})

    const [submitWaitlistApp, {error}] = useMutation(SUBMIT_WAITLIST_APP, { variables: { userId, charName, charConcept, experience, whyJoin, gameId, hostId }, errorPolicy: 'all', onCompleted: submitWaitlistApp => { if (submitWaitlistApp.joinWaitlist !== null) {history.push(`/game/${gameId}/application/${submitWaitlistApp.joinWaitlist.id}`)}} } );


    useEffect(() => {
      if (gameData !== undefined) {
        setHostId(gameData.game.host.id);
        console.log('gameData', gameData);
      }
    },[gameData])

    const handleSubmit = (e) => {
      e.preventDefault();

      console.log('USER...', userId);

      submitWaitlistApp(userId, charName, charConcept, experience, whyJoin, hostId)
    };

    useEffect(() => {
        if (sessionUser) {
            setUserId(sessionUser.id);
        }
    }, [sessionUser]);

    {/* Right now, this shows if ANYBODY has applied. Include Players and match ids, or else just
        use a completely different query. */}
    if (waitlistStatus !== undefined && waitlistStatus.checkApplied.length && gameData !== undefined && gameData.game.multipleApplications === false) {
      console.log('gameData', gameData);
        return (
          <div className="gray-backdrop">
            <div className="container">
            <p>You have already applied for this game and are on the waitlist.</p>
            </div>
            </div>
        )
    }

    return (
      <div className="gray-backdrop">
            <div className="container">
    {!userId && (
      //TODO: login link with history push back to initial game page they were
      //looking at
      <p>Please log in to apply for this game.</p>
    )}
    {/* TODO: Conditionally display form or "You are on the waitlist" or "You are a player in this game" or "You are this game's host" */}
    {gameData && gameData.game.host.id === userId.toString() && (
      <p>You are currently hosting this game.</p>
    )}
    {/* Game Data query should return info on if this user has applied */}

        {gameData && gameData.game.host.id !== userId.toString() && (


        <form onSubmit={handleSubmit}>

         {error !== undefined && (console.log(error.graphQLErrors))}
         {error && error !== undefined && (error.graphQLErrors[0].extensions.errors.user)}
         {error && error !== undefined && (error.graphQLErrors[0].extensions.errors.whyJoin)}
         {error && error !== undefined && (error.graphQLErrors[0].extensions.errors.charConcept)}
         {error && error !== undefined && (error.graphQLErrors[0].extensions.errors.charName)}
         {error && error !== undefined && (error.graphQLErrors[0].extensions.errors.experience)}
         <label>
           Character Name:
           <input
             type="text"
             value={charName}
             onChange={(e) => setCharName(e.target.value)}
             required
           />
         </label>
         <label>
           Character Concept:
           <input
             type="text"
             value={charConcept}
             onChange={(e) => setCharConcept(e.target.value)}
             required
           />
         </label>
         <label>
           Why do you want to join this game?:
           <input
             type="text"
             value={whyJoin}
             onChange={(e) => setWhyJoin(e.target.value)}
             required
           />
         </label>
         <label>
           What kind of tabletop role playing game experience do you have?:
           <input
             type="text"
             value={experience}
             onChange={(e) => setExperience(e.target.value)}
             required
           />
         </label>
         <button type="submit">Send</button>
       </form>

       )}
       </div>
       </div>

    )
}

export default JoinWaitList;
