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

    const { loading, error, data } = useQuery(GET_GAME, { variables: { gameId } })
      return (
        <div>
        {data !== undefined && (<><p>{data.game.title} hosted by {data.game.host.userName}</p></>)}
        {data !== undefined &&(<p>{data.game.description}</p>)}
        {data !== undefined && sessionUser && (<Link to={`/waitlist/${gameId}`}>Join Waitlist</Link>)}

        {data !== undefined && (<Messages
        />)}
      </div>
      );

}

export default Game;
