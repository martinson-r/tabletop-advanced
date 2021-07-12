import React, { useState, useEffect, useRef } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import "./messages.css";


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

    const messageBoxRef = useRef(null);

    const { gameId } = useParams();

    let { subscribeToMore, fetchMore, data, loading, error } = useQuery(
      //add offset
      GET_GAME_CONVOS,
      { variables: { gameId, offset } }
    );

    const scrollEvent = (e) => {
      if (e.target.scrollTop === 0) {
        //Let's make sure we're not asking
        //for something that doesn't exist
        //(a perpetually increasing offset)

        //fetchMore will happily try to grab something with an offset
        //that doesn't exist, and overwrite incoming data with
        //an empty array. We need to stop offsetting ASAP.

        //This is complicated by the fact that we may have received more
        //messages via Subscription in the meantime, and possibly sent a few.
        //remember, it's findAndCountAll; you can COUNT what you get back.

        //TODO: check Count to make sure there are more records to fetch
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

console.log('OFFSET', offset);
    }

    useEffect(() => {

      //Double check to make sure data is not undefined.
      if (data !== undefined) {

        //Don't forget to add your old sorted conversations back in,
        //or you lose them... but you need to dedupe.

        //Also, check to see that your data.convos.rows isn't empty, or you'll
        //blank out your whole array.

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

    },[data])

    useEffect(() => {

    //Have to use offset to set the scrollTop initially, because otherwise
    //scrollTop resets every time we get more sortedConvos data.
    if (offset === 0) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  },[data, offset]);



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
      if (sessionUser !== undefined) {
        setUserId(sessionUser.id);
      }
    },[sessionUser])


    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors([]);

        //Offset is fine at this point. No need to do anything with it.
        updateMessages(gameId, userId, messageText);
      }

      //Going to have to get the height of the div once it changes
      //and set the scroll to that, or something
      //trying to get the height and scroll to it just gets you to
      //halfway down, or the old height of the div.

    return (
      <div>

      <div ref={messageBoxRef} onScroll={scrollEvent} id="messageBox">
      {sortedConvos && sortedConvos.map(message => <p className="indivMessage">{message.sender.userName}: {message.messageText}</p>)}
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
