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

    // //Grab our session user
    const sessionUser = useSelector((state) => state.session.user);

    const { gameId } = useParams();

    //grab current game
     const { loading: loadGame, error: gameError, data: gameData } = useQuery(GET_GAME, { variables: { gameId } } );
     const { loading, error, data } = useSubscription(GAME_MESSAGES_SUBSCRIPTION, { variables: { gameId }});
     //Note: Whenever a query returns a result in Apollo Client, that result includes a subscribeToMore function
     const { subscribeToMore, data: gameConvosData } = useQuery(
        GET_GAME_CONVOS,
        { variables: { gameId } }
      );

      subscribeToMore({
        document: GAME_MESSAGES_SUBSCRIPTION,
        variables: { gameId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const newMessage = subscriptionData.data.messageAdded;
          console.log('NEWMESSAGE', newMessage)
          const messages = newMessage.messages
          return Object.assign({}, prev, {

              convos: messages

          });
        }
      })

    if (!gameData) {
        return (
        <p>No games found. :(</p>
        )
    }


    const gameDetails = gameData.game;

        return (
            <>
            <p>Game Title: {gameDetails.title}</p>
            <p>Game Detail: {gameDetails.description}</p>
            {gameConvosData && (<Messages
              {...gameConvosData} {...gameData }
              ></Messages>)}

        </>
    );
}

export default Game;
