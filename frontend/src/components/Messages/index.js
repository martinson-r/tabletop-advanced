import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";


import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
import { GET_GAME, GET_GAME_CONVOS, SEND_MESSAGE_TO_GAME, SEND_NON_GAME_NON_SPEC_CONVOS, GAME_MESSAGES_SUBSCRIPTION  } from "../../gql";

function Messages() {
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState(null);
    const [messageText, setMessage] = useState("");
    const { gameId } = useParams();

    const { subscribeToMore, data, loading, error } = useQuery(
      GET_GAME_CONVOS,
      { variables: { gameId } }
    );

    useEffect(() => {
      subscribeToMore({
        document: GAME_MESSAGES_SUBSCRIPTION,
        variables: { gameId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const newFeedItem = subscriptionData.data.messageSent;
          return Object.assign({}, prev, {
              convos: [...prev.convos, newFeedItem]
          });
        }
      })
    },[data])


    const [updateMessages] = useMutation(SEND_MESSAGE_TO_GAME, { variables: { gameId, userId, messageText } } );

    const [errors, setErrors] = useState([]);
    useEffect(() => {
      if (sessionUser !== undefined) {
        setUserId(sessionUser.id);
      }
    },[sessionUser])


    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors([]);
      updateMessages(gameId, userId, messageText)
    };

    return (
      <div>
      {data && data.convos.map(message => <p>{message.sender.userName}: {message.messageText}</p>)}
      {!sessionUser && (
        <p>Please log in to send messages.</p>
      )}
      {sessionUser !== undefined && (<form onSubmit={handleSubmit}>
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
       </form>)}
       </div>
    )
}

export default Messages;
