import React, { useState, useEffect, useRef } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import "./game-messages.css";
import MessageBox from "../MessageBox";
import SendChatBox from "../SendChatBox";
import { v4 as uuidv4 } from 'uuid';


import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
import { GET_GAME, GET_WAITLIST_APPLIED, GET_GAME_CONVOS, SEND_MESSAGE_TO_GAME, GAME_MESSAGES_SUBSCRIPTION, SPECTATOR_MESSAGES_SUBSCRIPTION } from "../../gql";
import { DateTime } from "../../utils/luxon";

function GameMessages(props) {
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState(null);
    const [isPlayer, setIsPlayer] = useState(false);
    const [newMessage, setNewMessage] = useState(null);
    const [newSpectatorMessage, setNewSpectatorMessage] = useState(null);
    const [sortedConvos, setSortedConvos] = useState([]);
    const [offset, setOffset] = useState(0)
    const [submittedMessage, setSubmittedMessage] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [spectatorChat, setSpectatorChat] = useState(false);
    const [hideSpectatorChat, setHideSpectatorChat] = useState(false);

    const messageBoxRef = useRef(null);

    const gameId = props.gameId;

    const { loading: gameLoading, error: gameError, data: gameData } = useQuery(GET_GAME, { variables: { gameId } });

    useEffect(() => {
      if (gameData !== undefined && userId !== null) {
        gameData.game.player.forEach((player) => {
          if (player.id.toString() === userId.toString()) {
              setIsPlayer(true);
          }
        });
      }
    },[gameData, userId]);

    let { subscribeToMore, fetchMore, data, loading, error } = useQuery(
      //add offset
      GET_GAME_CONVOS,
      { variables: { gameId, offset } }
    );

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
      .filter((message,i,convosToSort)=>
      //returns the index of the first element in the array that
      //satisfies the provided testing function
      //(in this case, the first index where the ids match)
      convosToSort.findIndex(messageToCompare=>(messageToCompare.id === message.id))===i)
      //flip it back
      .reverse()

      setSortedConvos([...convosRemoved]);
       }
    }
    },[data, newMessage]);

    useEffect(() => {
      if ( offset !== undefined && offset === 0 && messageBoxRef.current !== null && messageBoxRef.current !== undefined ) {
        messageBoxRef.current.scrollTop = 580;
      }
    },[sortedConvos])

    //Subscription for messages
    //This hopefully covers all, edits and deletions included
    useEffect(() => {

      let unsubscribe;

      unsubscribe = subscribeToMore({
        document: GAME_MESSAGES_SUBSCRIPTION,
        variables: { gameId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const newFeedItem = subscriptionData.data.messageSent;
          setNewMessage(newFeedItem)

          //This part is broken.
          //This really should be done in cache.
            return Object.assign({}, prev, {
              convos: {...prev.rows, ...newFeedItem}
            });
          }
      });

      if (unsubscribe) return () => unsubscribe()

      let unsubscribeSpectator

      unsubscribeSpectator = subscribeToMore({
        document: SPECTATOR_MESSAGES_SUBSCRIPTION,
        variables: { gameId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const newFeedItem = subscriptionData.data.messageSent;
          setNewSpectatorMessage(newFeedItem)

          //This part is broken.
          //This really should be done in cache.
            return Object.assign({}, prev, {
              convos: {...prev.rows, ...newFeedItem}
            });
          }
      });

      if (unsubscribeSpectator) return () => unsubscribe()

    },[subscribeToMore]);

    const [errors, setErrors] = useState([]);
    useEffect(() => {
      if (sessionUser !== undefined && sessionUser !== null) {
        setUserId(sessionUser.id);
      }
    },[sessionUser])

    useEffect(() => {
      //Listen for scroll and provide more chat
      if (messageBoxRef.current !== null )
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
    messageBoxRef.current !== null && messageBoxRef.current.addEventListener('scroll', () => {
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
      if (messageBoxRef.current !== null && offset === 0) {
        messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
      }

      //This is weird, but it works.
      //Check if there are new sortedConvos that have been rendered (so that I don't get the old messageBox size)
      //Then, check to see if this is a case where a message has been submitted.
      //If a message was just submitted, force scroll to bottom and reset submittedMessage status.
      if (messageBoxRef.current !== null && submittedMessage === true ) {
        messageBoxRef.current.scroll({ top: (messageBoxRef.current.offsetTop + messageBoxRef.current.scrollHeight*100), left: 0, behavior: 'smooth' });
      }
        setSubmittedMessage(false)
  },[sortedConvos])

    const toggleHideSpectatorChat = () => {
      setHideSpectatorChat(!hideSpectatorChat);
    }


    return (
      <div>
        <div className="gameDetails">
          <div className="hideSpectators">
            <input type="checkbox" name="hideSpectatorChat" checked={hideSpectatorChat} onChange={toggleHideSpectatorChat} />
            <label>Hide spectator chat</label>
          </div>
          {gameData !== undefined && (<div><p><Link to={`/game/${gameData.game.id}`}>{gameData.game.title}</Link> presented by {gameData.game.host.userName}</p>
          <p><i>{gameData.game.blurb}</i></p>
          </div>)}
        </div>

      <div ref={messageBoxRef} className="messagesContainer">
      {/* TODO: Query to see if player is in game */}
      <div className="messageListing" data-status={hideSpectatorChat}>
      {sessionUser !== undefined && userId !== null && gameData !== undefined && (isPlayer === false && gameData.game.host.id !== userId.toString()) && (
          <div className="notification spectator">You are a spectator</div>)}

        <div className="messageBox game">

          {/* Hack to get flexbox to space items properly */}
          <div className="spacer"></div>

          {/* Behaves very strangely if not passed a key. */}
          {sortedConvos && sortedConvos.length !== 0 && sortedConvos.map(message =>
            message.spectatorChat !== true && <MessageBox key={uuidv4()} message={message}
            userId={userId} gameId={gameId} gameData={gameData}/>)}

        </div>

        {/* <div className="sendChatBoxes"> */}
          {sessionUser !== undefined && userId !== null && gameData !== undefined && (isPlayer === true || gameData.game.host.id === userId.toString()) && (<div className="sendChatBox">
          <SendChatBox gameId={gameId} userId={userId} spectatorChat={false} /></div>)}

{!sessionUser && (
        <div className="notification">Please <Link to={`/login`}>log in</Link> to participate.
        </div>
      )}

          {/* {userId === null && gameData !== undefined && (
          <div className="notification">You are a spectator</div>)} */}

    </div>

    {hideSpectatorChat.toString() === "false" && (<div className="messageListing">

    <div className="messageBox game">
        <div className="spacer"></div>
        {/* Behaves very strangely if not passed a key. */}

        {sortedConvos && sortedConvos.length !== 0 && sortedConvos.map(message =>
          message.spectatorChat === true && (<MessageBox key={uuidv4()} message={message}
          userId={userId} gameId={gameId} gameData={gameData}/>))}

      </div>

      {/* <div className="sendChatBoxes"> */}

       {/* {!sessionUser && (
        <div className="notification">
        <p>Please log in to send in-game messages.</p>
        </div>
      )} */}
      {/* {sessionUser !== undefined && userId !== null && gameData !== undefined && (isPlayer !== true && gameData.game.host.id !== userId.toString()) && (<div>You must be a player to send an in-game chat</div>)} */}



       {/* {gameData !== undefined && gameData.game.active !== true && (
         <p>This game is no longer active.</p>
       )} */}

      {sessionUser !== undefined && sessionUser !== null && gameData !== undefined && (<div className="sendChatBox">
      <SendChatBox gameId={gameId} userId={userId} spectatorChat={true} /></div>)}

      {!sessionUser && (
        <div className="notification">
        &nbsp;
        </div>
      )}
      {/* </div> */}
      </div>)}
      </div>
      </div>


    )
}

export default GameMessages;
