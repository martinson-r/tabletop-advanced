import React, { useEffect, prevState, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import SimpleSearch from "../SimpleSearch";
// import ProfileButton from './ProfileButton';
// import LoginFormModal from '../LoginFormModal';
// import SearchModal from '../SearchModal';
// import './navigation.css';
import * as sessionActions from "../../store/session";

import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
import { GET_GAME, GET_GAME_CONVOS, SEND_MESSAGE_TO_GAME, SEND_NON_GAME_NON_SPEC_MESSAGES, GAME_MESSAGES_SUBSCRIPTION, SPECTATOR_MESSAGES_SUBSCRIPTION } from "../../gql";

function SendChatBox(props){

    const [messageText, setMessage] = useState("");
    const {gameId, conversationId, userId, spectatorChat, isAction, isEvent, isGmChat} = props;
    const [submittedMessage, setSubmittedMessage] = useState(false);
    const [metaGameMessageTypeId, setMetaGameMessageTypeId] = useState(null);

    const [updateMessages, {error: gameMessageError}] = useMutation(SEND_MESSAGE_TO_GAME, { variables: { gameId, userId, messageText, spectatorChat, metaGameMessageTypeId }, errorPolicy: 'all' } );
    const [sendNonGameMessage, {error}] = useMutation(SEND_NON_GAME_NON_SPEC_MESSAGES, { variables: { conversationId, userId, messageText, metaGameMessageTypeId }, errorPolicy: 'all' } );

    console.log('PROPS', props);

    useEffect(() => {

      if (isAction === true) {
        setMetaGameMessageTypeId(6);
      }

    },[props]);

    useEffect(() => {

      if (isEvent === true) {
        setMetaGameMessageTypeId(7);
      }

    },[props]);

    useEffect(() => {
      if (isGmChat !== undefined){
        if (isGmChat === true && isAction === false && isEvent === false) {
          setMetaGameMessageTypeId(1);
        }
      }
    },[props])


    //Submit messages when user presses Enter
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        handleSpectatorSubmit(e);
      }
    }

    const handleSpectatorSubmit = (e) => {
        e.preventDefault();

          //Offset is fine at this point. No need to do anything with it.
          if (gameId !== undefined) {
          console.log('METAGAME ID: ', metaGameMessageTypeId);
          updateMessages(gameId, userId, messageText, spectatorChat, metaGameMessageTypeId);
          setSubmittedMessage(true);
          setMessage('');
          }
          else if (conversationId !== undefined) {
          sendNonGameMessage(conversationId, userId, messageText, metaGameMessageTypeId);
          setSubmittedMessage(true);
          setMessage('');

          }

      }

 return (
     <>

     {(<form onSubmit={handleSpectatorSubmit}>
      {console.log('META TYPE', metaGameMessageTypeId)}
      {gameMessageError && gameMessageError !== undefined && (
      <span>{gameMessageError.toString()}</span>)}
      {error && error !== undefined && (
      <span>{error.toString()}</span>)}
         {/* TODO: error message for no blank messages */}

         {/* TODO: messages sent from this chat box are marked Spectator chats */}
         <label hidden>
           Send Message
           </label>
           <textarea
             className="chat-input"
             rows="6"
             value={messageText}
             placeholder="Type your message here"
             onChange={(e) => setMessage(e.target.value)}
             onKeyDown={handleKeyDown}
             required
           ></textarea>
         <button className="submitButton" type="submit">Send</button>
       </form>)}
      </>
 )
}

export default SendChatBox;
