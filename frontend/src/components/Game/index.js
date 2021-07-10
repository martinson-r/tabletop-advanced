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
    // Grab our session user
    const sessionUser = useSelector((state) => state.session.user);
    // Grab our game ID
    const gameId = useParams();

    const { loading, error, data } = useQuery(GET_GAME, { variables: { gameId } })
    console.log('DATA', data);

      const { subscribeToMore, ...result } = useQuery(
        GET_GAME_CONVOS,
        { variables: { gameId } }
      );

      return (
        <div>
        {data && data.games.map(game => <p>{game.title}, hosted by {game.host.userName}</p>)}
        <Messages
          {...result}
          subscribeToNewMessages={() =>
            subscribeToMore({
              document: GAME_MESSAGES_SUBSCRIPTION,
              variables: { gameId },
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newFeedItem = subscriptionData.data.messageSent;
                console.log('NFI', newFeedItem)
                console.log('PREV', prev)
                return Object.assign({}, prev, {
                  post: {
                    comments: [newFeedItem, ...prev.post.comments]
                  }
                });
              }
            })
          }
        />
      </div>
      );


    // return (
    //   <div>
    //     {data.games.map(game => <p>{game.title}, hosted by {game.host.userName}</p>)}
    //   </div>
    // )
}

export default Game;
