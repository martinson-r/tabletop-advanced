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
    const { gameId } = useParams();
    const userId = sessionUser.id;

    const { loading, error, data } = useQuery(GET_GAME, { variables: { gameId } });

    console.log('DATA', data);

      return (
        <div>
        {data !== undefined && (<><p>{data.game.title} hosted by {data.game.host.userName}</p></>)}
        {data !== undefined &&(<p>{data.game.description}</p>)}
        {data !== undefined && sessionUser && data.game.host.id !== userId.toString() && (<><Link to={`/waitlist/${gameId}`}>Join Waitlist</Link><br /></>)}
        {data !== undefined && (<Link to={`/game/${gameId}/gameroom`}>Enter game room</Link>)}
      </div>
      );

}

export default Game;
