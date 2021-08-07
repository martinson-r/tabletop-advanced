import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import {
    useLazyQuery, useMutation
  } from "@apollo/client";
import { GET_ABOUT,START_NEW_PRIVATE_CHAT } from "../../gql"
import './bio.css';

function Bio() {
    // Grab our session user
const sessionUser = useSelector((state) => state.session.user);
const [currentUserId, setCurrentUserId] = useState(null);
const { userId } = useParams();
const [recipients, setRecipients] = useState([]);

const history = useHistory();

useEffect(() => {
    if (sessionUser !== undefined && sessionUser !== null) {
        setCurrentUserId(sessionUser.id);
    }
},[sessionUser])

const [getAbout, { data }] = useLazyQuery(GET_ABOUT);

const [startNewNonGameConversation] = useMutation(START_NEW_PRIVATE_CHAT, { variables: { currentUserId, recipients }, onCompleted: startNewNonGameConversation => { history.push(`/conversation/${startNewNonGameConversation.startNewNonGameConversation.id}`)} } );

const sendNewMessage = () => {
    //TODO: Refactor for multiple recipients in an array. In this case, there won't be
    //but this makes the resolver reusable for conversations with multiple recipients
startNewNonGameConversation({recipients, currentUserId});
}

useEffect(() => {

    if (userId !== null && userId !== undefined) {
        getAbout({ variables: { userId }})
    }
},[userId, getAbout]);

useEffect(() => {
 if (data !== undefined) {
    if (userId !== null && userId !== undefined) {
     setRecipients([data.about[0].User.userName]);
    }
 }
},[data, userId]);

return (
    <div className="container">
    <div className="gray-backdrop">
    {data !== undefined && data.about[0] !== undefined &&
    (<div><p>About {data.about[0].User.userName}:</p>
    {/* Conditional edit buttons based on whether user or not */}
    {/* Edit form fields directly */}
    {/* Toggle public display of information */}
    <p>{data.about[0].bio}</p>
    </div>)}
    {currentUserId !== null && (<button onClick={sendNewMessage}>Send this user a private message</button>)}
    {currentUserId === null && (<p>Please <Link to={`/login`}>log in</Link> to send this user a message.</p>)}
    </div>
    </div>
)


}

export default Bio;
