import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";

import {
    useQuery, useMutation
  } from "@apollo/client";
import { GET_GAME, GET_GAME_CONVOS, SEND_MESSAGE_TO_GAME } from "../../gql"

function Messages({gameData, gameConvosData, nonGameConvosData}) {

    const dispatch = useDispatch();
    console.log('NON GAME CONVOS:', nonGameConvosData)
    console.log('GAME CONVOS:', gameConvosData)
    console.log('gameData', gameData)
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState("");
    const [gameId, setGameId] = useState("");
    const [messageText, setMessage] = useState("");

    const [updateMessages] = useMutation(SEND_MESSAGE_TO_GAME, { variables: { gameId, userId, messageText } } );
    // const [updateNonGameMessages] = useMutation(SEND_NON_GAME_NON_SPEC_CONVOS, { variables: { userId, messageText, _id } } );

    // const [accounts, setAccount] = useState([]);
    // const [loadingData, setLoading] = useState([]);
    // const [errorData, setErrors] = useState([]);

    //TODO: subscribe to new message creation for this game

    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors([]);
        updateMessages(gameId, userId, messageText)
    };

    useEffect(() => {
        //Make sure we have ALL of our data

        // if (loading) {
        //     setLoading(loading);
        // }
        // if (error) {
        //     setErrors(error);
        // }
        // if (data) {
        //     setAccount(data);
        //}
        if (gameData) {
            setGameId(gameData.game._id);
        }
        if (sessionUser) {
            setUserId(sessionUser._id);
        }
    }, []);

    return (
        <>
        <p>Derp.</p>
            {gameConvosData && (<p>Message: {gameConvosData.convos.map(convo => convo.messages.map(message => <>{message.userId.email}: {message.messageText} </>))}</p>)}
            {nonGameConvosData && (<p>Conversations: {nonGameConvosData.getNonGameMessages.map(convo => convo.recipients.map(recipient => <>{recipient.email} </>))}</p>)}
            {gameConvosData && ( <div>
        <form onSubmit={handleSubmit}>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          <label>
            Send Message
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>
          <button type="submit">Send</button>
        </form>
        </div>)}
      </>
    )
}

export default Messages;
