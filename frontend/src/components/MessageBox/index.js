import React, { useState, useEffect, useRef } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import './message-box.css';

import {
    useQuery, useMutation, useLazyQuery, useSubscription
  } from "@apollo/client";
import { EDIT_MESSAGE, DELETE_MESSAGE, GET_CHARACTER, GET_GAME_CONVOS, SEND_MESSAGE_TO_GAME, SEND_NON_GAME_NON_SPEC_CONVOS, GAME_MESSAGES_SUBSCRIPTION } from "../../gql";
import { MessageTypes } from "subscriptions-transport-ws";

function MessageBox(props) {

  const { message, userId, gameId, gameData, conversationId } = props;

    const [messageId, setMessageId] = useState(null);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [messageText, setMessage] = useState("");
    const [newMessage, setNewMessage] = useState(null);
    const [senderId, setSenderId] = useState(null);
    const [editDisplay, setEditDisplay] = useState(false);
    const [editMessageText, setEditMessageText] = useState("");
    const [isGame, setIsGame] = useState(true);
    const dropdownButton = useRef(null);
    const editDropdown = useRef(null);
    const isMounted = useRef(true);

    const [editMessage] = useMutation(EDIT_MESSAGE, { variables: { messageId, userId, editMessageText } } );
    const [deleteMessage] = useMutation(DELETE_MESSAGE, { variables: { messageId: messageToDelete, userId } } );
    // const { loading, error, data } = useQuery(GET_CHARACTER, { variables: { userId: message.sender.id, gameId } });


// const [character, { data }] = useLazyQuery(GET_CHARACTER);

// useEffect(() => {
//     character({ variables: { userId: message.sender.id, gameId } });
// },[isMounted])

   useEffect(() => {
    //  If there's no gameId, it's not a game
    if (gameId === undefined) {
      setIsGame(false);
    }
   },[gameId]);

  //  useEffect(() => {
  //    setSenderId(message.sender.id);
  //  },[messageId]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  },[])

    const editMessageSubmit = (e) => {
        if (editMessageText !== "") {
          editMessage(userId, messageId, editMessageText);
        }
        setEditDisplay(false);
      }

      const cancelMessageSubmit = (e) => {
        setEditDisplay(false);
      }

      const editMessageBox = (messageText) => (e) => {
        isMounted = true;
        setMessageId(e.target.id)
        setEditMessageText(messageText)
        setEditDisplay(true);
      }

    //Have to set this in a setter and listen to it due to race condition.
    useEffect(() => {
        if (messageToDelete !== null) {
          isMounted = true;
          deleteMessage(messageToDelete, userId);
        }
      },[messageToDelete])


      //attempting to pass in more than one variable breaks this.
      const deleteMessageBox = (messageToDeleteId) => (e) => {
          setMessageToDelete(messageToDeleteId);
      }

      const displayEditCancel = (e) => {
        if (dropdownButton.current !== null && editDropdown.current.classList.contains('dropdown-content-hidden')) {
          editDropdown.current.classList.remove('dropdown-content-hidden')
        } else {
          editDropdown.current.classList.add('dropdown-content-hidden')
        }
      }

      if (isMounted.current && message !== undefined && message !== null && editDisplay === true && userId !== undefined && userId !== null) return (
        <div className="indivMessageBox">
        <p key={uuidv4()} className="indivMessage">{message.sender.userName}: </p>
        <form className="edit-message-form" onSubmit={editMessageSubmit}>
         {/* <ul>
           {errors.map((error, idx) => (
             <li key={idx}>{error}</li>
           ))}
         </ul> */}
         {/* TODO: error message for no blank messages */}
           <textarea
             value={editMessageText}
             onChange={(e) => setEditMessageText(e.target.value)}
             required />
         <button type="submit">Send</button>
         <button className="cancel" onClick={cancelMessageSubmit}>Cancel</button>
       </form>
       </div>
      )

      if (isMounted.current &&  message !== undefined && message !== null) return (
      <div className="avatarAndMessages">
          <div className="avatarBox">
            <div className="avatar-position">

            </div>
            {/* Display default user avatars if not a game chat. */}
            {isGame.toString() === "false" && (<div className="avatar" style={{backgroundImage: "url(" + "../../images/dragon-face.png"+ ")"}}>
            </div>)}

            {/* Display default DM avatar (DM has no character). DM will have a userId and be able to chat,
            but will not have a character. */}
            {message.sender.Characters !== undefined && message.sender.Characters.length === 0 && (<div className="avatar" style={{backgroundImage: "url(" + "../../images/dragon-face.png"+ ")"}}>
            </div>)}

            {/* Display default DM avatar if there is no user at all.
            This is just to keep it from crapping out if there's a null userId. */}
            {userId === null || userId === undefined && (<div className="avatar" style={{backgroundImage: "url(" + "../../images/dragon-face.png"+ ")"}}>
            </div>)}

            {/* Display character avatars by character */}
            {message.sender.Characters !== undefined && message.sender.Characters.length > 0 && (<div className="avatar" style={{backgroundImage: "url(" + message.sender.Characters[0].imageUrl + ")"}}>
            </div>)}
        </div>

        {message !== null && message !==undefined && message.sender.id !== null && message.sender.id !== undefined &&
        (<div className="indivMessageBox status" game-status={isGame.toString()} data-status={parseInt(message.sender.id)===userId}>

          <span key={uuidv4()} className="indivMessage">
          <span className="character-box">

              {/* Display character name only if sender has a character */}
              {gameData !== undefined && message.sender.Characters !== undefined && message.sender.Characters.length > 0 && (<span>{message.sender.Characters[0].name}</span>)}

              {/* Display DM user name (they have no character) */}
              {gameData !== undefined && message.sender.Characters !== undefined && message.sender.Characters.length === 0 && (<span>{message.sender.userName}</span>)}

              {/* Display sender name if they have a character */}
              {gameData !== undefined && message.sender.Characters !== undefined && message.sender.Characters.length > 0 && (<p className="sender-name">{message.sender.userName}</p>)}

              {/* Display tool tip if they are Game Master */}
              {gameData !== undefined && message.sender.Characters !== undefined && message.sender.Characters.length === 0 && message.sender.id === gameData.game.host.id && (<p className="sender-name">Game Master</p>)}

              {/* Display spectator hover tool tip if they are a spectator */}
              {gameData !== undefined && message.sender.Characters !== undefined && message.sender.Characters.length === 0 && message.sender.id !== gameData.game.host.id && (<p className="sender-name">Spectator</p>)}

          </span>
            {message !== null && message !==undefined && parseInt(message.sender.id) === userId && (
            <div className="dropdown" >
              <div className="btncontainer" onClick={displayEditCancel} ref={dropdownButton}>
                <p className="dropbtn" >...</p></div>
              <div ref={editDropdown} className="dropdown-content-hidden dropdown-box">
               <span><p id={message.id} onClick={editMessageBox(message.messageText)}>edit</p></span>
                <p onClick={deleteMessageBox(message.id, userId)}>delete</p>
              </div>
            </div>)}

            {/* Display message content */}
            {message.deleted !== true &&
            (<span className="message-text">{message.messageText} </span>)}
            {message.deleted === true && (<i>message deleted</i>)}</span></div>)}
            {/* {userId === null && (<div className="indivMessageBox status" game-status={isGame.toString()} data-status={false}>


          <p key={uuidv4()} className="indivMessage"><Link to={`/${message.sender.id}/bio`}>{message !== undefined && message.Characters !== undefined && (<span>{message.Characters[0].name} &#40;</span>)}{message.sender.userName}{message !== undefined && message.Characters !== undefined && (<span>&#41;</span>)}</Link>:<br /> {message.deleted !== true &&
            (<span>{message.messageText} </span>)} {message.deleted === true && (<i>message deleted</i>)}</p></div>)} */}
        </div>
            )

}

export default MessageBox;
