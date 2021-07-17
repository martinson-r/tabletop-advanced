import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import { PubSub } from 'graphql-subscriptions';
import {
    useLazyQuery, useMutation, useSubscription, InMemoryCache
  } from "@apollo/client";
import { GET_USER, GET_ABOUT,START_NEW_PRIVATE_CHAT } from "../../gql"

function Bio() {
    // Grab our session user
const sessionUser = useSelector((state) => state.session.user);
const currentUserId = sessionUser.id;
const { userId } = useParams();
const recipientId = userId;
console.log(recipientId);
console.log(currentUserId);

const history = useHistory();

const [getAbout, { data, error, loading }] = useLazyQuery(GET_ABOUT);

const [startNewNonGameConversation] = useMutation(START_NEW_PRIVATE_CHAT, { variables: { currentUserId, recipientId }, onCompleted: startNewNonGameConversation => { history.push(`/conversation/${startNewNonGameConversation.startNewNonGameConversation.id}`)} } );

const sendNewMessage = () => {
startNewNonGameConversation({recipientId, currentUserId});
}

console.log('data', data)

useEffect(() => {

    if (userId !== null && userId !== undefined) {
        console.log('id', userId)
        console.log('get data')
        getAbout({ variables: { userId }})
    }
},[userId]);


return (
    <div>
    {data !== undefined && data.about.length &&
    (<div><p>About {data.about[0].User.userName}:</p>
    {/* Conditional edit buttons based on whether user or not */}
    {/* Edit form fields directly */}
    {/* Toggle public display of information */}
    <p>{data.about[0].bio}</p>
    </div>)}
    <button onClick={sendNewMessage}>Send this user a private message</button>
    </div>
)


}

export default Bio;
