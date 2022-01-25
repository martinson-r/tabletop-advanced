import React, { useState, useEffect, useRef } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import "./game-messages.css";
import MessageBox from "../MessageBox";
import SendChatBox from "../SendChatBox";
import { v4 as uuidv4 } from 'uuid';
import InfiniteScroll from 'react-infinite-scroll-component';


import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
import { GET_GAME, GET_WAITLIST_APPLIED, GET_GAME_CONVOS, GET_SPECTATOR_CONVOS, SEND_MESSAGE_TO_GAME, GAME_MESSAGES_SUBSCRIPTION, SPECTATOR_MESSAGES_SUBSCRIPTION } from "../../gql";
import { DateTime } from "../../utils/luxon";

function GameMessages(props) {
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState(null);
    const [isPlayer, setIsPlayer] = useState(false);
    const [newMessage, setNewMessage] = useState(null);
    const [newSpectatorMessage, setNewSpectatorMessage] = useState(null);
    const [sortedConvos, setSortedConvos] = useState([]);
    const [sortedSpectatorConvos, setSortedSpectatorConvos] = useState([]);
    const [offset, setOffset] = useState(0)
    const [submittedMessage, setSubmittedMessage] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [spectatorChat, setSpectatorChat] = useState(false);
    const [hideSpectatorChat, setHideSpectatorChat] = useState(false);
    const [isAction, setAction] = useState(false);
    const [isEvent, setEvent] = useState(false);
    const [isGmChat, setGmChat] = useState(false);

    const { gameId } = props;

    const { loading: gameLoading, error: gameError, data: gameData } = useQuery(GET_GAME, { variables: { gameId } });

    const toggleAction = () => {
      setAction(!isAction);
      setEvent(false);
    }

    const toggleEvent = () => {
      setEvent(!isEvent);
      setAction(false);
    }

    useEffect(() => {
      if (sessionUser !== undefined && sessionUser !== null) {
        setUserId(sessionUser.id);
      }
    },[sessionUser]);

    useEffect(() => {
      if (userId !== null && userId !== undefined && gameData !== undefined) {
        if (userId === gameData.game.host.id) {
          setGmChat(true);
        }
      }
    }, [userId, gameData])

    useEffect(() => {
        try {

          //See if the user is a player in this game
          const isPlayer = gameData.game.player.filter((player) => player.id === userId)

          if (isPlayer.length > 0) {
            setIsPlayer(true);
          }
        } catch {
          return ( <div>Loading...</div>)
        }
    },[gameId, gameData, userId]);

    let { subscribeToMore, fetchMore, data, loading, error } = useQuery(
      //add offset
      GET_GAME_CONVOS,
      { variables: { gameId, offset } }
    );


    let { subscribeToMore: spectatorSubscribe, fetchMore: spectatorFetchMore, data: spectatorData, loading: spectatorLoading, error: spectatorError } = useQuery(
      //add offset
      GET_SPECTATOR_CONVOS,
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


    //Double check to make sure data is not undefined.
    if (spectatorData !== undefined) {


      //Don't forget to add your old sorted conversations back in,
      //or you lose them... but you need to dedupe.

      //Also, check to see that your data.convos.rows isn't empty, or you'll
      //blank out your whole array.

      //Ideally, deduping would be done in the cache, but I'm
      //having a hard time with that and want to get this
      //working.

      if (spectatorData.spectatorConvos.rows.length) {
        //Basic dedupe.
        const toDedupe = new Set([...sortedSpectatorConvos,...spectatorData.spectatorConvos.rows]);

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

    setSortedSpectatorConvos([...convosRemoved]);
     }
  }


    },[data, spectatorData, newMessage]);

    //Subscription for messages
    //This hopefully covers all, edits and deletions included
    useEffect(() => {

      if (data !== undefined) {
        subscribeToMore({
          document: GAME_MESSAGES_SUBSCRIPTION,
          variables: { gameId },
          updateQuery: (prev, { subscriptionData }) => {

            console.log('SUB DATA...', subscriptionData);

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
      }

      console.log('SPEC DATA', spectatorData);

      if (spectatorData !== undefined) {
        spectatorSubscribe({
        document: SPECTATOR_MESSAGES_SUBSCRIPTION,
        variables: { gameId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const newFeedItem = subscriptionData.data.spectatorMessageSent;
          setNewSpectatorMessage(newFeedItem)

          //This part is broken.
          //This really should be done in cache.
            return Object.assign({}, prev, {
              spectatorConvos: {...prev.rows, ...newFeedItem}
            });
          }
      });
    }

    },[data, spectatorData]);

    const [errors, setErrors] = useState([]);
    useEffect(() => {
      if (sessionUser !== undefined && sessionUser !== null) {
        setUserId(sessionUser.id);
      }
    },[sessionUser])

    const toggleHideSpectatorChat = () => {
      setHideSpectatorChat(!hideSpectatorChat);
    }

const fetchAndOffset = () => {
  setOffset(offset + 20);

  fetchMore({
    variables: {
      gameId,
      offset
    }
  });

}

const spectatorFetchAndOffset = () => {
  setOffset(offset + 20);

  console.log('spec offset', offset);

  spectatorFetchMore({
    variables: {
      gameId,
      offset
    }
  });

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

      <div className="messagesContainer">
      <div className="messageListing"  data-status={hideSpectatorChat}>
      {console.log('GAME DATA ', gameData, 'IS PLAYER ', isPlayer, 'SESSION USER ', sessionUser)}
      {sessionUser !== undefined && userId !== null && gameData !== undefined && (isPlayer === false && gameData.game.host.id !== userId.toString()) && (
          <div className="notification spectator">You are a spectator</div>)}
      <div
  id="scrollableDivGameChat"

  // className="messageBox game"
  style={{
    height: 300,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column-reverse',
    flexGrow: 2
  }}
>
  {/*Put the scroll bar always on the bottom*/}
  <InfiniteScroll
    dataLength={sortedConvos.length}
    next={fetchAndOffset}
    style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }} //To put endMessage and loader to the top.
    inverse={true} //
    hasMore={true}
    // loader={<h4>Loading...</h4>}
    scrollableTarget="scrollableDivGameChat"
  >

    {/* this is blank */}
    {console.log('SORTED: ', sortedConvos)}
    {sortedConvos && sortedConvos.length !== 0 && sortedConvos.map(message =>
            message.spectatorChat !== true && <MessageBox key={uuidv4()} message={message}
            userId={userId} gameId={gameId} gameData={gameData}/>)}
            <div className="spacer">&nbsp;</div>
  </InfiniteScroll>
</div>

{/* TODO: buttons to flag messages as Actions, Metagame, or Events */}
{/* Regex for quick chat commands (//action, //event, //metagame) */}
{/* Events are limited to GM */}
          {sessionUser !== undefined && userId !== null && gameData !== undefined && (isPlayer === true || gameData.game.host.id === userId.toString()) &&
          (<div>
            <div class="actionBox">

              {console.log('GAME DATA...', gameData)}

            { userId === gameData.game.host.id && (<div><input
              name="event"
              type="checkbox"
              checked={isEvent}
              onChange={toggleEvent} />
              <label>This is an event</label></div>)}

              <div><input
              name="action"
              type="checkbox"
              checked={isAction}
              onChange={toggleAction} />
              <label>This is an action</label>
              </div>
            </div>
            <div className="sendChatBox">
              {console.log('GM Chat?', isGmChat)}
          <SendChatBox gameId={gameId} userId={userId} spectatorChat={false} isAction={isAction} isEvent={isEvent} isGmChat={isGmChat} />
          </div>

          </div>)}

{!sessionUser && (
        <div className="notification">Please <Link to={`/login`}>log in</Link> to participate.
        </div>
      )}

          {/* {userId === null && gameData !== undefined && (
          <div className="notification">You are a spectator</div>)} */}

    </div>

    {hideSpectatorChat.toString() === "false" && (<div className="messageListing">

      <div
  id="scrollableDiv"
  // className="messageBox game"
  style={{
    height: 300,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column-reverse',
    flexGrow: 2
  }}
>
  {/*Put the scroll bar always on the bottom*/}
  <InfiniteScroll
    dataLength={sortedSpectatorConvos.length}
    next={spectatorFetchAndOffset}
    style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }} //To put endMessage and loader to the top.
    inverse={true} //
    hasMore={true}
    // loader={<h4>Loading...</h4>}
    scrollableTarget="scrollableDiv"
  >
    {sortedSpectatorConvos && sortedSpectatorConvos.length !== 0 && sortedSpectatorConvos.map(message =>
          message.spectatorChat === true && (<MessageBox key={uuidv4()} message={message}
          userId={userId} gameId={gameId} gameData={gameData} />))}
          <div className="spacer">&nbsp;</div>
  </InfiniteScroll>
</div>



       {/* {gameData !== undefined && gameData.game.active !== true && (
         <p>This game is no longer active.</p>
       )} */}

      {sessionUser !== undefined && sessionUser !== null && gameData !== undefined && (<div className="sendChatBox">
      <SendChatBox gameId={gameId} userId={userId} spectatorChat={true} isAction={isAction} isEvent={isEvent} isGmChat={isGmChat} /></div>)}

      {!sessionUser && (
        <div className="notification">
        &nbsp;
        </div>
      )}
      </div>)}
      </div>
      </div>


    )
}

export default GameMessages;
