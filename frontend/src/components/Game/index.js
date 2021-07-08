import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Messages from "../Messages";
import { PubSub } from 'graphql-subscriptions';
import {
    useQuery, useSubscription, InMemoryCache
  } from "@apollo/client";
import { GET_GAME, GET_GAME_CONVOS, GAME_MESSAGES_SUBSCRIPTION } from "../../gql"
export const pubsub = new PubSub();

function Game() {

    // Grab our session user
    const sessionUser = useSelector((state) => state.session.user);

    // Grab our game ID
    const { gameId } = useParams();

    //grab current game using game ID
     const { loading: loadGame, error: gameError, data: gameData } = useQuery(GET_GAME, { variables: { gameId } } );
    //  const { loading, error, data } = useSubscription(GAME_MESSAGES_SUBSCRIPTION, { variables: { gameId }});
     //Note: Whenever a query returns a result in Apollo Client, that result includes a subscribeToMore function
     const { subscribeToMore, data: gameConvosData } = useQuery(
        GET_GAME_CONVOS,
        { variables: { gameId } }
      );

      useEffect(() => {
      //subscribe when initial GET_GAME Query is made
      //Avoid a race condition by checking to see if game convo data has loaded before trying to
      //subscribe to it.
        subscribeToMore({
          document: GAME_MESSAGES_SUBSCRIPTION,
          variables: { gameId },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const newMessage = subscriptionData.data.messageAdded;
            console.log(subscriptionData.data)

            //Populate new messages
            if (prev.convos) {
              return Object.assign({}, prev, {
                convos: [prev.convos[0].messages]
            });
            }

            else {
              return {
                convos: [newMessage]
              }
            }
          }
        });
      }, [])

    if (!gameData) {
        return (
        <p>No games found. :(</p>
        )
    }


    const gameDetails = gameData.game;

    console.log(gameDetails)

        return (
            <>
            <p>Game Title: {gameDetails.title}</p>
            <p>Game Detail: {gameDetails.description}</p>
            <p>Host: {gameDetails.host.email}</p>
            <Messages
              {...gameConvosData} {...gameData }
              ></Messages>

        </>
    );
}

export default Game;
