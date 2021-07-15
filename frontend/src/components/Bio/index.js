import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import Messages from "../Messages";
import { PubSub } from 'graphql-subscriptions';
import {
    useQuery, useMutation, useSubscription, InMemoryCache
  } from "@apollo/client";
import { GET_USER, GET_ABOUT,START_NEW_PRIVATE_CHAT } from "../../gql"

function Bio() {
    // Grab our session user
const sessionUser = useSelector((state) => state.session.user);
const currentUserId = sessionUser.id;
const { userId } = useParams();
const recipientId = userId;
console.log('id', userId);

const history = useHistory();

const { data, error, loading } = useQuery(GET_ABOUT, { variables: { userId }})

const [startNewNonGameConversation] = useMutation(START_NEW_PRIVATE_CHAT, { variables: { userId, recipientId }, onCompleted: startNewNonGameConversation => { history.pushState(`/conversation/${startNewNonGameConversation.id}`)} } );

const sendNewMessage = () => {
startNewNonGameConversation({recipientId, userId: currentUserId});
}

console.log('data', data)


return (
    <div>
    {data !== undefined && data.about.length && (<div><p>About {data.about[0].User.userName}:</p>
    {/* Conditional edit buttons based on whether user or not */}
    {/* Edit form fields directly */}
    {/* Toggle public display of information */}
    <p>{data.about[0].bio}</p>
    </div>)}
    <p >Send this user a private message</p>
    </div>
)


}

export default Bio;
