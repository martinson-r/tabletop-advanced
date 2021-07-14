import React, { useState, useEffect, useRef } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import "./messages.css";
import { v4 as uuidv4 } from 'uuid';


import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
import { EDIT_MESSAGE, DELETE_MESSAGE, GET_GAME_CONVOS, SEND_MESSAGE_TO_GAME, SEND_NON_GAME_NON_SPEC_CONVOS, GAME_MESSAGES_SUBSCRIPTION } from "../../gql";
import { parseValue } from "graphql";

function Messages() {
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState(null);
    const [messageId, setMessageId] = useState(null)
    const [messageText, setMessage] = useState("");
    const [editDisplay, setEditDisplay] = useState(false);
    const [editMessageText, setEditMessageText] = useState("");
    const [sortedConvos, setSortedConvos] = useState([]);
    const [offset, setOffset] = useState(0)
    const [submittedMessage, setSubmittedMessage] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    const messageBoxRef = useRef(null);

    const { gameId } = useParams();

    let { subscribeToMore, fetchMore, data, loading, error } = useQuery(
      //add offset
      GET_GAME_CONVOS,
      { variables: { gameId, offset } }
    );


    const [updateMessages] = useMutation(SEND_MESSAGE_TO_GAME, { variables: { gameId, userId, messageText } } );
    const [editMessage] = useMutation(EDIT_MESSAGE, { variables: { messageId, userId, editMessageText } } );
    const [deleteMessage] = useMutation(DELETE_MESSAGE, { variables: { messageId, userId } } );

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

        if (data.convos.rows.length) {

          //Basic dedupe.
          const toDedupe = new Set([...sortedConvos,...data.convos.rows]);

          //Sort it. Sets are unsorted. Must turn it into an array first.
          const convosToSort = [...toDedupe];

          convosToSort.sort(function(x, y){
           return x.createdAt - y.createdAt;
       });

       console.log('TO SORT', convosToSort)

      //figure out how to replace edited messages with newer ones
      //and do it in the least-expensive way
      //It's likely more recent messages will be edited, so we can try from the end
      //And work our way backwards.

      //We can also make the assumption that the edited message is the latest one in the array.
      //This is hacky, and the screen flashes on Safari. It occasionally ends up
      //belatedly updating receiving clients with nothing but the edited message...
      for (let i = convosToSort.length-1; i > 0; i--) {
        if (convosToSort[i-1].id === convosToSort[convosToSort.length-1].id) {
          //If it matches, slice it out. Mutate original array.
          convosToSort.splice(i-1, 1);
        }
      }

         setSortedConvos([...convosToSort]);
       }
    }


    },[data]);

    useEffect(() => {
      if ( offset !== undefined && offset === 0 ) {
        messageBoxRef.current.scrollTop = 580;
      }
    },[sortedConvos])

    //Subscription for messages
    //This hopefully covers all, edits and deletions included
    useEffect(() => {
      subscribeToMore({
        document: GAME_MESSAGES_SUBSCRIPTION,
        variables: { gameId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          console.log(subscriptionData.data)
          const newFeedItem = subscriptionData.data.messageSent;
          //const newEdit = subscriptionData.data.messageEdited;

          console.log('SUB', subscriptionData)

          console.log('NEW', newFeedItem)

          console.log('PREV', prev);

          //This part is broken.
          //This really should be done in cache.
            return Object.assign({}, prev, {
              convos: {...prev.rows, ...newFeedItem}
            });
          }
      })
    },[]);

    // //Subscription for edited messages
    // useEffect(() => {
    //   subscribeToMore({
    //     document: EDITED_MESSAGES_SUBSCRIPTION,

    //     //We only need the messageId, it should be unique
    //     //no matter what game.
    //     variables: { messageId, gameId },
    //     updateQuery: (prev, { subscriptionData }) => {
    //       if (!subscriptionData.data) return prev;
    //       console.log(subscriptionData.data)
    //       const newFeedItem = subscriptionData.data.messageEdited;

    //       console.log('SUB', subscriptionData)

    //       console.log('NEW', newFeedItem)

    //       console.log('PREV', prev);

    //       //Find the message and replace its text.
    //       //Kind of "expensive" in terms of operations, but
    //       //I don't think people will do this a lot...

    //       if (data.convos.rows.length) {
    //         console.log('SORTED', sortedConvos)
    //       }


    //       // const messageToEdit = sortedConvos.rows.find(message => message.id === messageId)

    //       // console.log('To edit:', messageToEdit);
    //       //messageToEdit.messageText = newFeedItem.messageText;
    //       }
    // })
    // },[])

    const [errors, setErrors] = useState([]);
    useEffect(() => {
      if (sessionUser !== undefined && sessionUser !== null) {
        setUserId(sessionUser.id);
      }
    },[sessionUser])

    useEffect(() => {
      //Listen for scroll and provide more chat
        messageBoxRef.current.addEventListener('wheel', function scrolled() {
          setIsScrolling(true);

          //This could be DRYed up.
          if (messageBoxRef.current.scrollTop === 0) {
            //setTimeout so we don't flood the server with requests.
            setTimeout(() => {
              if (sortedConvos && data !== undefined) {
                if (sortedConvos.length < data.convos.count) {
                  setOffset(offset + 20)
                  fetchMore({
                    variables: {
                      gameId,
                      offset
                    }
                  });
             }
          }
        },300);
        if (sortedConvos && data !== undefined) {
          messageBoxRef.current.scroll({ top: 0, left: 0, behavior: 'smooth'});

          //clean up event listener and getter after repositioning the scrollbar.
          messageBoxRef.current.removeEventListener("wheel", scrolled, false);
          setIsScrolling(false);
          }
      }
    }, {passive: true});

    //Alternatively, users may just drag the scrollbar up to the top...
    //If we don't check if they're scrolling instead of using the wheel,
    //the server goes nuts.
    messageBoxRef.current.addEventListener('scroll', () => {
      if (isScrolling === false && messageBoxRef.current !== null) {
        //Checking for 0 for now. Eventually check for a higher value
        //and maybe use setTimeout
        if (messageBoxRef.current.scrollTop === 0) {
        if (sortedConvos && data !== undefined) {
            if (sortedConvos.length < data.convos.count) {
              setOffset(offset + 20)
              fetchMore({
                variables: {
                  gameId,
                  offset
                }
              });
            }
         }
        }
      }
    });
  },[sortedConvos])

    useEffect(()=> {

      //If offset is 0, we haven't loaded any more info.
      //We don't want to keep forcing the scrollbar to the bottom every time new
      //info loads, but we DO need all of sortedConvos to load before we set
      //scrollTop.
      if (offset === 0) {
        messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
      }

      //This is weird, but it works.
      //Check if there are new sortedConvos that have been rendered (so that I don't get the old messageBox size)
      //Then, check to see if this is a case where a message has been submitted.
      //If a message was just submitted, force scroll to bottom and reset submittedMessage status.
      if (submittedMessage === true) {
        messageBoxRef.current.scroll({ top: (messageBoxRef.current.offsetTop + messageBoxRef.current.scrollHeight*100), left: 0, behavior: 'smooth' });
      }
        setSubmittedMessage(false)
  },[sortedConvos])

    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors([]);

        //Offset is fine at this point. No need to do anything with it.
        updateMessages(gameId, userId, messageText);
        setSubmittedMessage(true);
    }


    const editMessageSubmit = (e) => {
      setEditDisplay(false);
      if (editMessageText) {
        editMessage(userId, messageId, editMessageText);
      }
    }

    const editMessageBox = (messageText) => (e) => {
      //how to get the messageText...
      console.log('target id', e.target.id)
      setMessageId(e.target.id)
      setEditMessageText(messageText)
      setEditDisplay(true);
    }

    return (
      <div>

      <div ref={messageBoxRef} id="messageBox">

      {/* TODO: Edit messages */}
      {/* TODO: Flag messages deleted/hide */}
      {/*
      Trickier than it sounds. You have to get the updated message back &
      hide it or jam that data in. Matching up id and replacing messageText is
      probably the way to go.

      This also might be a new subscription? Listening for edited
      or deleted messages.
      */}

      {/* Possibly pass message to a subcomponent via props and then set a state indicating
      if it is being edited or not to display the message vs the form */}
      {sortedConvos && sortedConvos.map(message => <p key={uuidv4()} className="indivMessage">{message.sender.userName}: {message.messageText} <button id={message.id} onClick={editMessageBox(message.messageText)}>edit</button></p>)}
      {editDisplay === true && (<form onSubmit={editMessageSubmit}>
      {/* <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul> */}
      {/* TODO: error message for no blank messages */}
      <label>
        Edit Message
        <input
          type="text"
          value={editMessageText}
          onChange={(e) => setEditMessageText(e.target.value)}
          required
        />
      </label>
      <button type="submit">Send</button>
    </form>)}

      </div>

      {!sessionUser && (
        <p>Please log in to send messages.</p>
      )}
      {sessionUser !== undefined && (<form onSubmit={handleSubmit}>
         {/* <ul>
           {errors.map((error, idx) => (
             <li key={idx}>{error}</li>
           ))}
         </ul> */}
         {/* TODO: error message for no blank messages */}
         <label>
           Send Message
           <input
             type="text"
             value={messageText}
             onChange={(e) => setMessage(e.target.value)}
             required
           />
         </label>
         <button type="submit">Send</button>
       </form>)}
       </div>
    )
}

export default Messages;
