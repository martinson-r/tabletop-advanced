import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";


import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
import { GET_GAME, GET_GAME_CONVOS, SEND_MESSAGE_TO_GAME, SEND_NON_GAME_NON_SPEC_CONVOS, GAME_MESSAGES_SUBSCRIPTION  } from "../../gql";

function Messages({...props}) {

    const dispatch = useDispatch();
    const nonGameConvosData = props.nonGameConvosData;
    const gameConvosData = props.convos;
    const gameData = props.game;
    const subscribeToNewMessages = props.subscribeToNewMessages;
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState("");
    const [gameId, setGameId] = useState("");
    const [messageText, setMessage] = useState("");

    const [updateMessages] = useMutation(SEND_MESSAGE_TO_GAME, { variables: { gameId, userId, messageText } } );
    // const [updateNonGameMessages] = useMutation(SEND_NON_GAME_NON_SPEC_CONVOS, { variables: { userId, messageText, _id } } );

    // const [accounts, setAccount] = useState([]);
    // const [loadingData, setLoading] = useState([]);
    // const [errorData, setErrors] = useState([]);

    //TODO: research subscribeToMore for pagination
    // function LatestGameMessage({ gameId }) {
    //     const { data: { messageAdded }, loading } = useSubscription(
    //       GAME_MESSAGES_SUBSCRIPTION,
    //       { variables: { gameId } }
    //     );
    //     return <h4>New comment: {!loading && messageAdded.content}</h4>;
    // }

    // pubsub.publish('commentAdded', payload);



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
            setGameId(gameData._id);
        }
        if (sessionUser) {
            setUserId(sessionUser._id);
        }
    }, []);



    return (
      <div><p>Derp.</p>
      {gameConvosData && (<div>
        {gameConvosData.map(convo => <div>{convo.messages.map(message => <p>{message.userId.email}: {message.messageText}</p>)}</div>)}
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


      //   <>
      //   <p>Derp.</p>
      //       {gameConvosData && (
      //         <div>
      //           <p>Message:</p>
      //         {/* <p>{gameConvosData.map(convo => {convo.messages.map(message => console.log(message.userId.email))})})} */}
      //         {nonGameConvosData && (<p>Conversations: {nonGameConvosData.getNonGameMessages.map(convo => convo.recipients.map(recipient => <>{recipient.email} </>))})}</p>
      //         </div>

      //      {gameConvosData && (
      //  <form onSubmit={handleSubmit}>
      //    <ul>
      //      {errors.map((error, idx) => (
      //     //       <li key={idx}>{error}</li>
      //     //     ))}
      //     //   </ul>
      //     //   <label>
      //     //     Send Message
      //     //     <input
      //     //       type="text"
      //     //       value={messageText}
      //     //       onChange={(e) => setMessage(e.target.value)}
      //     //       required
      //     //     />
      //     //   </label>
      //     //   <button type="submit">Send</button>
      //     // </form>)
      //       //}
      //  </>
    )
}

export default Messages;
