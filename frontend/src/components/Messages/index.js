import React, { useState, useEffect, useRef } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import "./messages.css";
import { v4 as uuidv4 } from 'uuid';


import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
import { GET_GAME, GET_GAME_CONVOS, SEND_MESSAGE_TO_GAME, SEND_NON_GAME_NON_SPEC_CONVOS, GAME_MESSAGES_SUBSCRIPTION  } from "../../gql";
import { parseValue } from "graphql";

function Messages() {
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState(null);
    const [messageText, setMessage] = useState("");
    const [sortedConvos, setSortedConvos] = useState([]);
    const [offset, setOffset] = useState(0)
    const [submittedMessage, setSubmittedMessage] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    const convoStatus = useRef(sortedConvos);

    const messageBoxRef = useRef(null);
    const scrollDiv = useRef(null)

    const { gameId } = useParams();

    let { subscribeToMore, fetchMore, data, loading, error } = useQuery(
      //add offset
      GET_GAME_CONVOS,
      { variables: { gameId, offset } }
    );

    // const scrollEvent = (e) => {

    //   if (e.target.scrollTop === 0) {
    //     //Let's make sure we're not asking
    //     //for something that doesn't exist
    //     //(a perpetually increasing offset)

    //     //fetchMore will happily try to grab something with an offset
    //     //that doesn't exist, and overwrite incoming data with
    //     //an empty array. We need to stop offsetting ASAP.

    //     //This is complicated by the fact that we may have received more
    //     //messages via Subscription in the meantime, and possibly sent a few.
    //     //remember, it's findAndCountAll; you can COUNT what you get back.

    //     if (sortedConvos.length < data.convos.count) {
    //     setOffset(offset + 20)
    //     fetchMore({
    //       variables: {
    //         gameId,
    //         offset
    //       }
    //       });
    //     }
    //     }
    // }

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
          const toDedupe = new Set([...sortedConvos,...data.convos.rows]);

          //Sort it. Sets are unsorted. Must turn it into an array first.
          const convosToSort = [...toDedupe]
          convosToSort.sort(function(x, y){
           return x.createdAt - y.createdAt;
       });

         setSortedConvos([...convosToSort]);
       }
    }


    },[data]);

    useEffect(() => {
      if ( offset !== undefined && offset === 0 ) {
        messageBoxRef.current.scrollTop = 580;
      }
    },[sortedConvos])

    useEffect(() => {
      subscribeToMore({
        document: GAME_MESSAGES_SUBSCRIPTION,
        variables: { gameId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          console.log(subscriptionData.data)
          const newFeedItem = subscriptionData.data.messageSent;

          console.log('SUB', subscriptionData)

          console.log('NEW', newFeedItem)

          //For whatever reason, this breaks when scrollTop is 0.
          //Possibly because we previously fetched and published something that
          //was undefined?

          console.log('PREV', prev);

          //This part is broken.

          return Object.assign({}, prev, {
            convos: {...prev.rows, ...newFeedItem}
          });
          }
      })
    },[])


    const [updateMessages] = useMutation(SEND_MESSAGE_TO_GAME, { variables: { gameId, userId, messageText } } );

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
      if (isScrolling === false) {
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

    return (
      <div>

      <div ref={messageBoxRef} id="messageBox">
      {sortedConvos && sortedConvos.map(message => <p key={uuidv4()} className="indivMessage">{message.sender.userName}: {message.messageText}</p>)}
      {sortedConvos && (<div ref={scrollDiv}></div>)}
      </div>

      {!sessionUser && (
        <p>Please log in to send messages.</p>
      )}
      {sessionUser !== undefined && (<form onSubmit={handleSubmit}>
         <ul>
           {errors.map((error, idx) => (
             <li key={idx}>{error}</li>
           ))}
         </ul>
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
       {/* <form onSubmit={getMore}>
         <button type="submit">Get more</button>
       </form> */}
       </div>
    )
}

export default Messages;
