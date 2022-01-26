import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
    useQuery, useLazyQuery, useMutation
  } from "@apollo/client";
import { GET_GAMES, GET_GAMES_PLAYING_IN, ACCEPT_OFFER, DECLINE_OFFER, GET_WAITING_LIST_GAMES,
    GET_USER_NON_GAME_CONVOS, GET_HOSTED_GAMES, FIND_UNREAD_MESSAGES } from "../../gql"
import { v4 as uuidv4 } from 'uuid';
import './conversation-list.css';

function ConversationList() {
    //must set fetch policy to network-only so we get the latest data on the convo list
    const [getCurrentNonGameConvos, { loading: nonGameLoading, error: nonGameError, data: nonGameData }] = useLazyQuery(GET_USER_NON_GAME_CONVOS, {
        fetchPolicy: "network-only"
      });
    const { data: unreadData } = useQuery(FIND_UNREAD_MESSAGES);

    console.log('CONVOS', nonGameData);
    console.log('UNREAD', unreadData);

    //Grab our session user
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState(null);
    const history = useHistory();
    const [loadingData, setLoading] = useState([]);
    const [errorData, setError] = useState([]);
    const [data, setData] = useState([]);

    //match unreadData to conversations
    const matchAndFilterConvos = () => {
    }

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
    },[userId]);

    if (!sessionUser) {
        return null;
    }

    return (
        <div className="gray-backdrop">
    <p>Private Conversations:</p>
    <p><Link to={'/newmessage'}>Start new conversation</Link></p>
    {/* TODO: Add multiple users to private convos */}
    {/* We need unique keys for mapped elements so React can keep track of what is what */}
    {nonGameData !== undefined && (nonGameData.getNonGameConvos.map(conversations => <div key={uuidv4()} className="convos-box" >{conversations.recipient.map(conversation => (<p key={uuidv4()} className="private-convo" onClick={() => history.push(`/conversation/${conversation.id}`)}>
    {console.log(unreadData.findUnreadMessages.filter(message => message.conversationId === conversation.id).length > 0)}
    {unreadData.findUnreadMessages.filter(message => message.conversationId === conversation.id).length > 0 && (
        <b>{conversation.recipient.map(recipient => recipient.userName + ", ")}</b>
    )}
    {unreadData.findUnreadMessages.filter(message => message.conversationId === conversation.id).length === 0 && (
        <>{conversation.recipient.map(recipient => recipient.userName + ", ")}</>
    )}
    </p>))}</div>))}
    </div>
    )

    }

export default ConversationList;
