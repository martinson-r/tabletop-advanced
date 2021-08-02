import React, { useState, useEffect, useRef } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import './message-box.css';

import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
import { EDIT_MESSAGE, DELETE_MESSAGE, GET_GAME_CONVOS, SEND_MESSAGE_TO_GAME, SEND_NON_GAME_NON_SPEC_CONVOS, GAME_MESSAGES_SUBSCRIPTION } from "../../gql";

//Behavior is very unreliable right now in both Chrome and Safari.

function MessageBox(props) {

    const message = props.message;
    const userId = props.userId;
    const gameId = props.gameId;
    const gameData = props.gameData;

    const [messageId, setMessageId] = useState(null);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [messageText, setMessage] = useState("");
    const [newMessage, setNewMessage] = useState(null);
    const [editDisplay, setEditDisplay] = useState(false);
    const [editMessageText, setEditMessageText] = useState("");

    const [editMessage] = useMutation(EDIT_MESSAGE, { variables: { messageId, userId, editMessageText } } );
    const [deleteMessage] = useMutation(DELETE_MESSAGE, { variables: { messageId: messageToDelete, userId } } );

    const editMessageSubmit = (e) => {
        if (editMessageText) {
          editMessage(userId, messageId, editMessageText);
        }
        setEditDisplay(false);
      }

      const editMessageBox = (messageText) => (e) => {
        setMessageId(e.target.id)
        setEditMessageText(messageText)
        setEditDisplay(true);
      }

    //Have to set this in a setter and listen to it due to race condition.
    useEffect(() => {
        if (messageToDelete !== null) {
          deleteMessage(messageToDelete, userId);
        }
      },[messageToDelete])


      //attempting to pass in more than one variable breaks this.
      const deleteMessageBox = (messageToDeleteId) => (e) => {
          setMessageToDelete(messageToDeleteId);
          console.log('TO DELETE', messageToDelete)
      }

      if (editDisplay === true) return (
        <div className="indivMessageBox">
        <p key={uuidv4()} className="indivMessage">{message.sender.userName}: </p>
        <form onSubmit={editMessageSubmit}>
         {/* <ul>
           {errors.map((error, idx) => (
             <li key={idx}>{error}</li>
           ))}
         </ul> */}
         {/* TODO: error message for no blank messages */}
         <label style={{visibility:"hidden"}}>
           Edit Message
           </label>
           <input
             type="text"
             value={editMessageText}
             onChange={(e) => setEditMessageText(e.target.value)}
             required></input>
         <button type="submit">Send</button>
       </form>
       </div>
      )

    return (
      <div className="avatarAndMessages">
          <div className="avatarBox">
            <div className="avatar-position">

            </div>
            <div className="avatar">

            </div>
        </div>
        <div className="indivMessageBox">
          <p key={uuidv4()} className="indivMessage"><Link to={`/${message.sender.id}/bio`}>{message.sender.userName}</Link>: {message.deleted !== true &&
            (<span>{message.messageText} {userId !== null && message.sender.id === userId.toString() && (<><button id={message.id} onClick={editMessageBox(message.messageText)}>edit</button>
            <button onClick={deleteMessageBox(message.id, userId)}>delete</button></>)}</span>)} {message.deleted === true && (<i>message deleted</i>)}</p></div>
        </div>

            )

}

export default MessageBox;
