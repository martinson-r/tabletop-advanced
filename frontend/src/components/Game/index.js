import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Messages from "../Messages";
import { PubSub } from 'graphql-subscriptions';
import {
    useQuery, useSubscription, InMemoryCache
  } from "@apollo/client";
import { GET_GAME, GET_GAME_CONVOS, GAME_MESSAGES_SUBSCRIPTION } from "../../gql"
export const pubsub = new PubSub();

function Game() {
  const { gameId } = useParams();

//   if (!gameData) {
//     return (
//     <p>No games found. :(</p>
//     )
// }
    // Grab our session user
    const sessionUser = useSelector((state) => state.session.user);


    // Grab our game ID

    //grab current game using game ID
    const { loading: loadGame, error: gameError, data: gameData } = useQuery(GET_GAME, { variables: { gameId } } );

      const { subscribeToMore, ...result } = useQuery(
        GET_GAME_CONVOS,
        { variables: { gameId } }
      );
      const gameDetails = gameData.game;

      return (
        (<div>
         {gameDetails && (<div><p>Game Title: {gameDetails.title}</p>
            <p>Game Detail: {gameDetails.description}</p>
            <p>Host: {gameDetails.host.email}</p>
            <p><Link to={`/waitlist/${gameDetails._id}`}>Apply To Waitlist</Link></p></div>)}
        <Messages
          {...result}
          subscribeToNewComments={() =>
            subscribeToMore({
              document: GAME_MESSAGES_SUBSCRIPTION,
              variables: { gameId },
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newFeedItem = subscriptionData.data.messageSent;
                return Object.assign({}, prev, {
                  post: {
                    comments: [newFeedItem, ...prev.messageText]
                  }
                });
              }
            })
          }
        ></Messages>
        </div>
      ))
    }

export default Game;
