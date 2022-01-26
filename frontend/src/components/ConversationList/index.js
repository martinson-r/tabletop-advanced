import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
    useQuery, useLazyQuery, useMutation
  } from "@apollo/client";
import { GET_GAMES, GET_GAMES_PLAYING_IN, ACCEPT_OFFER, DECLINE_OFFER, GET_WAITING_LIST_GAMES,
    GET_USER_NON_GAME_CONVOS, GET_HOSTED_GAMES, FIND_UNREAD_MESSAGES } from "../../gql"
import { v4 as uuidv4 } from 'uuid';
import './conversation-list.css';
import { highlightConvo } from '../../store/message'

function ConversationList() {
    //must set fetch policy to network-only so we get the latest data on the convo list
    const [getCurrentNonGameConvos, { loading: nonGameLoading, error: nonGameError, data: nonGameData }] = useLazyQuery(GET_USER_NON_GAME_CONVOS, {
        fetchPolicy: "network-only"
      });
    const { data: unreadData } = useQuery(FIND_UNREAD_MESSAGES);
    const dispatch = useDispatch();

    console.log('CONVOS', nonGameData);
    console.log('UNREAD', unreadData);

    //TODO:
    //create an object to put in redux store that has:
    //conversation id, recipient names, and read status (bolded or not bolded)
    //set css class to read status, more flexible that way

    //Grab our session user
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState(null);
    const history = useHistory();
    const [loadingData, setLoading] = useState([]);
    const [errorData, setError] = useState([]);
    const [data, setData] = useState([]);
    const convoHighlighted = useSelector(state => state.message.conversations)
    const readMessages = useSelector(state => state.message.messages);
    const [conversations, setConversations] = useState()

    //match unreadData to conversations
    const matchAndFilterConvos = () => {
        if (nonGameData !== undefined && unreadData !== undefined) {
        let arrayOfConversations = [];
        let arrayOfUnreadIds = [];
        let arrayOfReadConversations = [];

        let collectionOfConversations = [];
        nonGameData.getNonGameConvos[0].recipient.forEach(recipient => {
            arrayOfConversations.push(recipient);
        });

        unreadData.findUnreadMessages.forEach(unreadMessage => {
            arrayOfUnreadIds.push(unreadMessage.conversationId);
        });

        readMessages.forEach(readMessage => {
            arrayOfReadConversations.push(readMessage.conversationId);
        })

        console.log('unread ids', arrayOfUnreadIds);
        console.log('read convos array', arrayOfReadConversations);

        for (let conversation of arrayOfConversations) {
            // if index > -1 then it exists
            if (arrayOfUnreadIds.indexOf(conversation.id) > -1 && arrayOfReadConversations.indexOf(conversation.id) === -1) {

                console.log('found one');
                collectionOfConversations.push({ ['conversationId']: conversation.id,
                      ['recipients']: [...conversation.recipient], ['highlighted']: 'highlight' })
                } else {
                    collectionOfConversations.push({ ['conversationId']: conversation.id,
                      ['recipients']: [...conversation.recipient], ['highlighted']: 'noHighlight' })
                }
            }
            console.log('collection', collectionOfConversations)
        dispatch(highlightConvo(collectionOfConversations));
        }
    }

    useEffect(() =>  {
            if (nonGameData !== undefined && unreadData !== undefined) {
                matchAndFilterConvos();
        }
    },[nonGameData, unreadData])

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
    {console.log('hl', convoHighlighted)}
    {convoHighlighted !== undefined && convoHighlighted.map(recipients =>
        (<p key={uuidv4()} className={`private-convo ${recipients.highlighted}`}
        onClick={() => history.push(`/conversation/${recipients.conversationId}`)}>
        {recipients.recipients.map(recipient =><span>{recipient.userName}, </span> )}
        </p>))}


    {/* TODO: Add multiple users to private convos */}
    {/* We need unique keys for mapped elements so React can keep track of what is what */}
    {/* {nonGameData !== undefined && (nonGameData.getNonGameConvos.map(conversations =>
            <div key={uuidv4()} className="convos-box" >
            {conversations.recipient.map(conversation =>
            (<p key={uuidv4()} className="private-convo"
            onClick={() => history.push(`/conversation/${conversation.id}`)}> */}






            {/* {unreadData.findUnreadMessages.filter(message => message.conversationId === conversation.id).length === 0 && (
            <>{conversation.recipient.map(recipient => recipient.userName + ", ")}</> */}
        {/* )} */}
    {/* </p>))} */}
    {/* </div>))} */}
    </div>
    )

    }

export default ConversationList;
