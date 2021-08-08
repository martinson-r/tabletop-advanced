import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MessageBox from "../MessageBox";
import SendChatBox from "../SendChatBox";
import { v4 as uuidv4 } from 'uuid';
import './conversation.css';

import {
    useQuery, useMutation
  } from "@apollo/client";
import { ADD_RECIPIENT, SEND_MESSAGE_TO_GAME, GET_NON_GAME_NON_SPEC_MESSAGES, GAME_MESSAGES_SUBSCRIPTION, SEND_NON_GAME_NON_SPEC_MESSAGES } from "../../gql"

function Conversation() {
    const sessionUser = useSelector((state) => state.session.user);
    const [userId, setUserId] = useState(null);
    const [mounted, setMounted] = useState(true);
    const {conversationId} = useParams();
    const messageBoxRef = useRef(null);

    const [newMessage, setNewMessage] = useState(null);
    const [sortedConvos, setSortedConvos] = useState([]);
    const [offset, setOffset] = useState(0)
    const [submittedMessage, setSubmittedMessage] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [messageText, setMessage] = useState('');
    const [errors, setErrors] = useState([]);
    // const [recipients, setRecipients] = useState([]);
    // const [recipient, setRecipient] = useState("");

    // const [updateMessages] = useMutation(SEND_MESSAGE_TO_GAME, { variables: { gameId, userId, messageText, spectatorChat } } );
    const [sendNonGameMessage] = useMutation(SEND_NON_GAME_NON_SPEC_MESSAGES, { variables: { conversationId, userId, messageText } } );

    //Submit messages when user presses Enter
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        handleSpectatorSubmit(e);
      }
    }

    const handleSpectatorSubmit = (e) => {
        e.preventDefault();

        //   this.input.selectionStart = this.input.selectionEnd = start + 1;
        setErrors([]);

          //Offset is fine at this point. No need to do anything with it.
          if (conversationId !== undefined) {
          sendNonGameMessage(conversationId, userId, messageText);
          setSubmittedMessage(true);
          setMessage('');
          }

      }


    let { subscribeToMore, fetchMore, loading, data } = useQuery(
      //add offset
      GET_NON_GAME_NON_SPEC_MESSAGES,
      { variables: { conversationId, offset } }
    );

    useEffect(() => {
        if (sessionUser !== undefined) {
            setUserId(sessionUser.id);
        }
    }, [sessionUser, conversationId]);


    useEffect(() => {

      //Double check to make sure data is not undefined.
      if (data !== undefined) {

        //Don't forget to add your old sorted conversations back in,
        //or you lose them... but you need to dedupe.

        //Also, check to see that your data.convos.rows isn't empty, or you'll
        //blank out your whole array.

        //Ideally, deduping would be done in the cache, but I'm
        //having a hard time with that and want to get this
        //working.

        if (data.getNonGameMessages.rows.length) {

          //Basic dedupe.
          const toDedupe = new Set([...sortedConvos,...data.getNonGameMessages.rows]);

          //Sort it. Sets are unsorted. Must turn it into an array first.
          const convosToSort = [...toDedupe];

          convosToSort.sort(function(x, y){
           return x.createdAt - y.createdAt;
       });

      //I should probably do this with the cache once I figure that out.
      //I'd like to get it working, though.

      //Code below is much more performant than my last solution, although
      //it still flashes briefly on Safari.

      //Find items in array only with unique ids.
      //It's not working for deleted items, though.

      //Make a copy
        const convosRemoved = convosToSort.slice()
        //flip it
        .reverse()
        //filter it. i is index.
        .filter((message,i,convosToSort) =>
        //returns the index of the first element in the array that
        //satisfies the provided testing function
        //(in this case, the first index where the ids match)
        convosToSort.findIndex(messageToCompare => (messageToCompare.id === message.id))===i)
        //flip it back
        .reverse()

        setSortedConvos([...convosRemoved]);
         }
      }
    },[data]);

    // useEffect(() => {
    //   if ( offset !== undefined && offset === 0 && messageBoxRef.current !== null && messageBoxRef.current !== undefined ) {
    //     messageBoxRef.current.scrollTop = 580;
    //   }
    // },[sortedConvos])

    //Subscription for messages
    //This hopefully covers all, edits and deletions included
    useEffect(() => {
      let cancel = false;

      if (!loading && data) {
      subscribeToMore({
        //Name's now confusing - this subscribes to ALL new messages matching
        //filter criteria on backend.

        document: GAME_MESSAGES_SUBSCRIPTION,
        variables: { conversationId },
        updateQuery: (prev, { subscriptionData }) => {
          if (cancel) return;
          if (!subscriptionData.data) return prev;
          const newFeedItem = subscriptionData.data.messageSent;
          setNewMessage(newFeedItem)
          //This really should be done in cache.
          if (!cancel) {return Object.assign({}, prev, {
              getNonGameMessages: {...prev.rows, ...newFeedItem}
            });}

          }
      })
      return () => {
        cancel = true;
      }
    }
      // if (unsubscribe) return () => unsubscribe()
    },[data]);

    // const [errors, setErrors] = useState([]);
    useEffect(() => {
      if (sessionUser !== undefined && sessionUser !== null) {

        setUserId(sessionUser.id);
      }
    },[sessionUser])

  //   useEffect(() => {
  //     //Listen for scroll and provide more chat
  //       messageBoxRef.current.addEventListener('wheel', function scrolled() {
  //         setIsScrolling(true);

  //         //This could be DRYed up.
  //         if (messageBoxRef.current.scrollTop === 0) {
  //           //setTimeout so we don't flood the server with requests.
  //           setTimeout(() => {
  //             if (sortedConvos && data !== undefined) {
  //               if (sortedConvos.length < data.getNonGameMessages.count) {
  //                 setOffset(offset + 20)
  //                 fetchMore({
  //                   variables: {
  //                     conversationId,
  //                     offset
  //                   }
  //                 });
  //            }
  //         }
  //       },300);
  //       if (sortedConvos && data !== undefined) {
  //         messageBoxRef.current.scroll({ top: 0, left: 0, behavior: 'smooth'});

  //         //clean up event listener and getter after repositioning the scrollbar.
  //         messageBoxRef.current.removeEventListener("wheel", scrolled, false);
  //         setIsScrolling(false);
  //         }
  //     }
  //     return () => {
  //       messageBoxRef.current.removeEventListener('wheel', () => {})
  //     }
  //   }, {passive: true});

  //   //Alternatively, users may just drag the scrollbar up to the top...
  //   //If we don't check if they're scrolling instead of using the wheel,
  //   //the server goes nuts.
  //   messageBoxRef.current.addEventListener('scroll', () => {
  //     if (isScrolling === false && messageBoxRef.current !== null) {
  //       //Checking for 0 for now. Eventually check for a higher value
  //       //and maybe use setTimeout
  //       if (messageBoxRef.current.scrollTop === 0) {
  //       if (sortedConvos && data !== undefined) {
  //           if (sortedConvos.length < data.getNonGameMessages.count) {
  //             setOffset(offset + 20)
  //             fetchMore({
  //               variables: {
  //                 conversationId,
  //                 offset
  //               }
  //             });
  //           }
  //        }
  //       }
  //     }
  //   });
  //   return () => {
  //     messageBoxRef.current.removeEventListener('scroll', () => {})
  //   }
  // },[sortedConvos, messageBoxRef])

  //   useEffect(()=> {

  //     //If offset is 0, we haven't loaded any more info.
  //     //We don't want to keep forcing the scrollbar to the bottom every time new
  //     //info loads, but we DO need all of sortedConvos to load before we set
  //     //scrollTop.
  //     if (offset === 0) {
  //       messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
  //     }

  //     //This is weird, but it works.
  //     //Check if there are new sortedConvos that have been rendered (so that I don't get the old messageBox size)
  //     //Then, check to see if this is a case where a message has been submitted.
  //     //If a message was just submitted, force scroll to bottom and reset submittedMessage status.
  //     if (submittedMessage === true) {
  //       messageBoxRef.current.scroll({ top: (messageBoxRef.current.offsetTop + messageBoxRef.current.scrollHeight*100), left: 0, behavior: 'smooth' });
  //     }
  //       setSubmittedMessage(false)
  // },[sortedConvos, messageBoxRef])

  //   useEffect(()=> {

  //     //If offset is 0, we haven't loaded any more info.
  //     //We don't want to keep forcing the scrollbar to the bottom every time new
  //     //info loads, but we DO need all of sortedConvos to load before we set
  //     //scrollTop.
  //     if (offset === 0) {

  //       if (messageBoxRef.current !== null) {
  //         messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
  //       }

  //     }

  //     //This is weird, but it works.
  //     //Check if there are new sortedConvos that have been rendered (so that I don't get the old messageBox size)
  //     //Then, check to see if this is a case where a message has been submitted.
  //     //If a message was just submitted, force scroll to bottom and reset submittedMessage status.
  //     if (submittedMessage === true) {
  //       messageBoxRef.current.scroll({ top: (messageBoxRef.current.offsetTop + messageBoxRef.current.scrollHeight*100), left: 0, behavior: 'smooth' });
  //     }
  //       setSubmittedMessage(false)
  // },[sortedConvos, messageBoxRef])

    // const addRecipients = (e) => {
    //   e.preventDefault();
    //   // setErrors([]);
    //   if (recipient.includes(', ')) {
    //     const separatedRecipients = recipient.split(', ');
    //     setRecipients([...recipients, ...separatedRecipients]);
    // }
    // //comma without space
    // else if (recipient.includes(',')) {
    //     const separatedRecipients = recipient.split(',');
    //     setRecipients([...recipients, ...separatedRecipients]);
    // }
    // //just in case they add a space afterward

    // else {
    //     setRecipients([...recipients, recipient]);
    // }
    // }


    return (
      <div className="nonGameMessagesContainer">

      <div ref={messageBoxRef} className="nonGamesMessageBox game">
       {/* Behaves very strangely if not passed a key. */}
      {sortedConvos && sortedConvos.length !== 0 && sortedConvos.map(message => <MessageBox key={uuidv4()} message={message} userId={userId}/>)}
      </div>

      {sessionUser !== undefined && sessionUser !== null && userId !==undefined && conversationId !== undefined && (
        <div>
      <SendChatBox conversationId={conversationId} userId={userId}/>
         {/* TODO: error message for no blank messages */}
         {/* TODO: messages sent from this chat box are marked Spectator chats */}
       {/* <form onSubmit = {addRecipients}>
            <div className="form-layout"><textarea className="recipients" placeholder="recipient names separated by commas" name="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)}></textarea>
            <button>Add recipient</button></div>
            </form> */}
        </div>
       )}
       </div>
    )
};

export default Conversation;
