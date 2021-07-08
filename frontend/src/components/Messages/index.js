import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";


import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
import { GET_GAME, GET_GAME_CONVOS, SEND_MESSAGE_TO_GAME, SEND_NON_GAME_NON_SPEC_CONVOS, GAME_MESSAGES_SUBSCRIPTION  } from "../../gql";

function Messages({...props}) {

    const nonGameConvosData = props.nonGameConvosData;
    const gameConvosData = props.convos;
    const gameData = props.game;
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState("");
    const [gameId, setGameId] = useState("");
    const [messageText, setMessage] = useState("");

    const [updateMessages] = useMutation(SEND_MESSAGE_TO_GAME, { variables: { gameId, userId, messageText } } );

    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors([]);
        updateMessages(gameId, userId, messageText)
    };

    useEffect(() => {
        if (gameData) {
            setGameId(gameData._id);
        }
        if (sessionUser) {
            setUserId(sessionUser._id);
        }
    }, [gameData, sessionUser]);



    return (
      <div><p>Derp.</p>
     {gameConvosData && (<div>
      {console.log('DATA', gameConvosData)}
     {gameConvosData.map(message => <div key={message._id}>{message.messages.map(message => <p key={message._id}>{message.userId.email}: {message.messageText}</p>)}</div>)}
      </div>)}

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
       </div>
    )
}

export default Messages;
