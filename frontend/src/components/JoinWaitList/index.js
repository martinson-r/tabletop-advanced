import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";


import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
import { GET_GAME, SUBMIT_WAITLIST_APP, GET_WAITLIST_STATUS  } from "../../gql";

function JoinWaitList({...props}) {


    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState("");
    const [charName, setCharName] = useState("");
    const [charConcept, setCharConcept] = useState("");
    const [whyJoin, setWhyJoin] = useState("");
    const [experience, setExperience] = useState("");

    const { gameId } = useParams();
    console.log('USERID', userId)

    //TODO: Add ability to pass in userId to get back info on if this user has already applied for this game
    const { loading: loadGame, error: gameError, data: gameData } = useQuery(GET_GAME, { variables: { userId, gameId }})
    const { loading: loadWaitlistStatus, error: waitlistError, data: waitlistStatus } = useQuery(GET_WAITLIST_STATUS, { variables: { userId, _id: gameId }})

    const [submitWaitlistApp] = useMutation(SUBMIT_WAITLIST_APP, { variables: { userId, charName, charConcept, experience, whyJoin, gameId } } );

    const [errors, setErrors] = useState([]);

    console.log('WAITLIST', waitlistStatus)

    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors([]);
      submitWaitlistApp(userId, charName, charConcept, experience, whyJoin)
    };

    useEffect(() => {
        if (sessionUser) {
            setUserId(sessionUser._id);
        }
    }, [sessionUser]);

    if (waitlistStatus && waitlistStatus.checkWaitList.length) {
        return (
            <p>You have already applied for this game and are on the waitlist.</p>
        )
    }

    return (
      <div>
    <p>Derp.</p>

    {/* TODO: Conditionally display form or "You are on the waitlist" or "You are a player in this game" or "You are this game's host" */}
    {/* Game Data query should return info on if this user has applied */}

        <form onSubmit={handleSubmit}>
         <ul>
           {errors.map((error, idx) => (
             <li key={idx}>{error}</li>
           ))}
         </ul>
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
       </div>
    )
}

export default JoinWaitList;