import React, { useState, useEffect, useRef } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import "./messages.css";


import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
import { GET_GAME, GET_GAME_CONVOS, SEND_MESSAGE_TO_GAME, SEND_NON_GAME_NON_SPEC_CONVOS, GAME_MESSAGES_SUBSCRIPTION  } from "../../gql";

function Messages() {
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState(null);
    const [messageText, setMessage] = useState("");
    const [sortedConvos, setSortedConvos] = useState([]);
    const [offset, setOffset] = useState(0)

    const messageBoxRef = useRef(null);
    const messagesRef = useRef(null);

    const scrollRef = useRef(null);

    const { gameId } = useParams();

    let { subscribeToMore, fetchMore, data, loading, error } = useQuery(
      //add offset
      GET_GAME_CONVOS,
      { variables: { gameId, offset } }
    );

    const scrollEvent = (e) => {
      console.log('current top', e.target.scrollTop)
      if (e.target.scrollTop < 50) {
        setOffset(offset + 20)
          fetchMore({
            variables: {
              gameId,
              offset
            }
            });
          }
    }

    useEffect(() => {


      //Double check to make sure data is not undefined.
      if (data !== undefined) {

        //Must make a copy. Apollo gets angry otherwise.
        let convosToSort = [...data.convos];

        //Sort the copy.
        convosToSort.sort(function(x, y){
          return x.createdAt - y.createdAt;
      });

      //set sortedConvos to the sorted copy.
      setSortedConvos(convosToSort);
      }

    },[data])

    useEffect(() => {

    //Have to use offset to set the scrollTop initially, because otherwise
    //scrollTop resets every time we get more sortedConvos data.
    if (sortedConvos !== undefined && offset === 0) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }

      },[sortedConvos, offset]);



    useEffect(() => {

      //For some reason, if I have reached the end of pagination,
      //and try to send a message,
      //this craps out.

      subscribeToMore({
        document: GAME_MESSAGES_SUBSCRIPTION,
        variables: { gameId },
        updateQuery: (prev, { subscriptionData }) => {
          console.log('PREV', prev)
          if (!subscriptionData.data) return prev;
          const newFeedItem = subscriptionData.data.messageSent;
          console.log('NEW SUBSCRIPTION ITEM', newFeedItem)
          let convosToSort = [...prev.convos];
          convosToSort.sort(function(x, y){
            return x.createdAt - y.createdAt;
        });


        messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;


        //goes blank. May be a caching issue. convosToSort and newFeedItem both look good to me.
        //no idea what the problem is right now.
          return Object.assign({}, prev, {
              convos: [...convosToSort, ...newFeedItem]
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
      //scrollRef.current.scrollIntoView({behavior: "smooth"})
      updateMessages(gameId, userId, messageText)

    };

    return (
      <div>

      <div ref={messageBoxRef} onScroll={scrollEvent} id="messageBox">
      {data && sortedConvos.map(message => <p ref={messagesRef} className="indivMessage">{message.sender.userName}: {message.messageText}</p>)}
      <div ref={scrollRef} />
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
