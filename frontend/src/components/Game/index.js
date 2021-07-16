import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Messages from "../Messages";
import { PubSub } from 'graphql-subscriptions';
import { v4 as uuidv4 } from 'uuid';
import {
    useQuery, useSubscription, InMemoryCache
  } from "@apollo/client";
import { GET_GAME } from "../../gql"
import { DateTime } from "../../utils/luxon";

export const pubsub = new PubSub();

function Game() {

    // Grab our session user
    const sessionUser = useSelector((state) => state.session.user);
    const [userId, setUserId] = useState(null);
    // Grab our game ID
    const { gameId } = useParams();
    useEffect(() => {
      if (sessionUser !== null && sessionUser !== undefined ) {
        setUserId(sessionUser.id);
      }

    },[sessionUser])




    const { loading, error, data } = useQuery(GET_GAME, { variables: { gameId } });

    console.log('DATA', data);

      return (
        <div>
        {data !== undefined && (<><p>{data.game.title} hosted by {data.game.host.userName}</p>
        <p>{data.game.description}</p></>)}
        {data !== undefined && userId !== null && userId !== undefined && data.game.host.id !== userId.toString() && (<><Link to={`/waitlist/${gameId}`}>Join Waitlist</Link><br /></>)}
        {data !== undefined && (<Link to={`/game/${gameId}/gameroom`}>Enter game room</Link>)}
        {data !== undefined && userId !== undefined && userId !== null && data.game.host.id && userId.toString() === data.game.host.id && (
          <>
          <p>Applications:</p>
          <p>Open Applications:</p>
          {/* TODO: make date format not garbage. Luxon? */}

          {data.game.Applications.map(application => <div><p key={uuidv4()}><Link to={`/applications/${gameId}/applicants/${application.applicationOwner[0].id}`}>{application.applicationOwner[0].userName}</Link>, submitted on {DateTime.local({millisecond: application.createdAt}).toFormat('MM/dd/yy')} at {DateTime.local({millisecond: application.createdAt}).toFormat('t')}</p></div>)}
          <p>Accepted Applications:</p>
          <p>Ignored Applications:</p>
          </>
        )}
      </div>
      );

}

export default Game;
