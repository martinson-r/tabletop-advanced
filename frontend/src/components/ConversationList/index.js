import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
    useQuery, useLazyQuery, useMutation
  } from "@apollo/client";
import { GET_GAMES, GET_GAMES_PLAYING_IN, ACCEPT_OFFER, DECLINE_OFFER, GET_WAITING_LIST_GAMES,
    GET_USER_NON_GAME_CONVOS, GET_HOSTED_GAMES } from "../../gql"
import { v4 as uuidv4 } from 'uuid';
import './conversation-list.css';

function ConversationList() {
    const [getCurrentNonGameConvos, { loading: nonGameLoading, error: nonGameError, data: nonGameData }] = useLazyQuery(GET_USER_NON_GAME_CONVOS);
    //Grab our session user
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState(null);
    const history = useHistory();
    const [loadingData, setLoading] = useState([]);
    const [errorData, setError] = useState([]);

    useEffect(() => {
        //Make sure we have ALL of our data
        if (sessionUser) {
            setUserId(sessionUser.id);
        }
    }, [sessionUser]);

useEffect(() => {
    if (userId !== undefined && userId !== null) {
        getCurrentNonGameConvos({ variables: { userId }});
    }
},[userId, history]);

return (
    <div className="gray-backdrop">
<p>Private Conversations:</p>
<p><Link to={'/newmessage'}>Start new conversation</Link></p>
{/* TODO: Add multiple users to private convos */}
{/* We need unique keys for mapped elements so React can keep track of what is what */}
{nonGameData !== undefined && (nonGameData.getNonGameConvos.map(conversations => <div key={uuidv4()} className="convos-box" >{conversations.recipient.map(conversation => (<p key={uuidv4()} className="private-convo" onClick={() => history.push(`/conversation/${conversation.id}`)}>{conversation.recipient.map(recipient => recipient.userName + ", ")}</p>))}</div>))}
</div>
)

}

export default ConversationList;
