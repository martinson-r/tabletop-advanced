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
const [recipients, setRecipients] = useState([]);

const history = useHistory();

const [getAbout, { data, error, loading }] = useLazyQuery(GET_ABOUT);

const [startNewNonGameConversation] = useMutation(START_NEW_PRIVATE_CHAT, { variables: { currentUserId, recipients }, onCompleted: startNewNonGameConversation => { history.push(`/conversation/${startNewNonGameConversation.startNewNonGameConversation.id}`)} } );

const sendNewMessage = () => {
    //TODO: Refactor for multiple recipients in an array. In this case, there won't be
    //but this makes the resolver reusable for conversations with multiple recipients
startNewNonGameConversation({recipients, currentUserId});
}

console.log(data);
console.log(userId)

useEffect(() => {

    if (userId !== null && userId !== undefined) {
        getAbout({ variables: { userId }})
    }
},[userId]);

useEffect(() => {
 if (data !== undefined) {
    if (userId !== null && userId !== undefined) {
     setRecipients([data.about[0].User.userName]);
    }
 }
},[data])


return (
    // Edge case: user has no bio
    // Solution: user has an 'empty' bio created for them upon signup
    <div>
    {data !== undefined && data.about !== undefined &&
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
