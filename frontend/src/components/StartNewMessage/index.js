import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import {
    useLazyQuery, useMutation, useSubscription, InMemoryCache
  } from "@apollo/client";
import { START_NEW_PRIVATE_CHAT } from "../../gql"

function StartNewMessage() {

    const sessionUser = useSelector((state) => state.session.user);
    const currentUserId = sessionUser.id;

    const [recipients, setRecipients] = useState([]);
    const [recipient, setRecipient] = useState("");

    const history = useHistory();

    console.log('recipients', recipients)
    const [startNewNonGameConversation] = useMutation(START_NEW_PRIVATE_CHAT, { variables: { currentUserId, recipients }, onCompleted: startNewNonGameConversation => { history.push(`/conversation/${startNewNonGameConversation.startNewNonGameConversation.id}`)} } );

    const sendNewMessage = () => {
        //TODO: Refactor for multiple recipients in an array
        startNewNonGameConversation({recipients, currentUserId});
        }

        const addRecipient = (e) => {
            e.preventDefault();
            setRecipients([...recipients, recipient]);
        }

    return (
    <div>
        <div>
            <p>Start new private conversation:</p>
        </div>
        <div>
            <p>Recipients:</p>
            {/* TODO: grab & display name */}
            {/* Choices: get name and look up ID by name or else just look up by name */}
            {/* Database constraints ensure userNames are unique */}
            {recipients.map(recipient => <p>{recipient}</p>)}
            <form onSubmit = {addRecipient}>
            <textarea name="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)}></textarea>
            <button>Add recipient</button>
            </form>
        </div>
        <div>
            <button onClick={sendNewMessage}>Send private message</button>
        </div>
    </div>
    )

}

export default StartNewMessage;
