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
            //comma with space
           if (recipient.includes(', ')) {
                const separatedRecipients = recipient.split(', ');
                console.log('separated', separatedRecipients);
                setRecipients([...recipients, ...separatedRecipients]);
            }
            //comma without space
            else if (recipient.includes(',')) {
                const separatedRecipients = recipient.split(',');
                console.log('separated', separatedRecipients);
                setRecipients([...recipients, ...separatedRecipients]);
            }
            //just in case they add a space afterward

            else {
                setRecipients([...recipients, recipient]);
            }
        }

        const removeRecipient = (e) => {
            console.log('target', e.target.id);
            const recipientIndex = recipients.indexOf(e.target.id);
            recipients.splice(recipientIndex, 1);
            setRecipients([...recipients])
        }

    return (
    <div>
        <div>
            <p>Start new private conversation:</p>
        </div>
        <div>
            <p>Recipients:</p>
            <p><i>Recipients can be separated by commas</i></p>
            {/* TODO: autosuggest users from Contact List */}
            {/* TODO: validation - userNames should not contain commas */}
            {recipients.map(recipient => <p>{recipient} <span id={recipient} onClick={removeRecipient}>x</span></p>)}
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
