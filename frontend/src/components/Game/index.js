import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { PubSub } from 'graphql-subscriptions';
import { v4 as uuidv4 } from 'uuid';
import {
    useQuery, useSubscription, InMemoryCache
  } from "@apollo/client";
import { GET_GAME } from "../../gql"
import { DateTime } from "../../utils/luxon";

export const pubsub = new PubSub();

//TODO: Refactor so gameId is fed into Game as prop
//Put Game inside of a container component

function Game() {

    // Grab our session user
    const sessionUser = useSelector((state) => state.session.user);
    const [userId, setUserId] = useState(null);
    // Grab our game ID
    const { gameId } = useParams();
    const [displayIgnored, setDisplayIgnored] = useState(false);
    const [displayAccepted, setDisplayAccepted] = useState(false);

    useEffect(() => {
      if (sessionUser !== null && sessionUser !== undefined ) {
        setUserId(sessionUser.id);
      }

    },[sessionUser])


    const changeDisplayIgnored = () => {
      setDisplayIgnored(!displayIgnored)
  }

  const changeDisplayAccepted = () => {
    setDisplayAccepted(!displayAccepted)
}

    const { loading, error, data } = useQuery(GET_GAME, { variables: { gameId } });

      return (
        <div>
        {data !== undefined && (<><p>{data.game.title} hosted by {data.game.host.userName}</p>
        <p>{data.game.description}</p>
        <p>Players:</p>
        {/* This feels a little backwards, but we're grabbing the player associated with the character */}
        {data.game.Characters.map((character) => <p>{character.User.userName} as {character.name}</p>)}
        </>)}
        {data !== undefined && userId !== null && userId !== undefined && data.game.host.id !== userId.toString() && data.game.waitListOpen.toString() !== "false" && (<><Link to={`/waitlist/${gameId}`}>Join Waitlist</Link><br /></>)}
        {data !== undefined && userId !== null && userId !== undefined && data.game.host.id !== userId.toString() && data.game.waitListOpen.toString() === "false" && (<><i>Waitlist closed.</i></>)}
        {data !== undefined && (<Link to={`/game/${gameId}/gameroom`}>Enter game room</Link>)}
        {data !== undefined && userId !== undefined && userId !== null && data.game.host.id && userId.toString() === data.game.host.id && (

        // TODO: Query to see if player is in game

          <>
            <p>Applications:</p>
            <label for="ignored">Show ignored</label>
            <input type="checkbox" name="ignored" checked={displayIgnored} onChange={changeDisplayIgnored}/>
            <label for="accepted">Show accepted</label>
            <input type="checkbox" name="accepted" checked={displayAccepted} onChange={changeDisplayAccepted}/>
            <p>Open Applications:</p>
            {data.game.Applications.map(application => application.accepted.toString() !== 'true' && application.ignored.toString() !== 'true' && (<div key={uuidv4()}><p key={uuidv4()}><Link to={`/game/${gameId}/application/${application.id}`}>{application.charName}</Link>, submitted by <Link to={`/${application.applicationOwner[0].id}/bio/`}>{application.applicationOwner[0].userName}</Link>, submitted on {DateTime.local({millisecond: application.createdAt}).toFormat('MM/dd/yy')} at {DateTime.local({millisecond: application.createdAt}).toFormat('t')}</p></div>))}
            <p>Accepted Applications:</p>
            {displayAccepted.toString() === 'true' &&(<div>{data.game.Applications.map(application => application.accepted.toString() === 'true' && (<div key={uuidv4()}><p key={uuidv4()}><Link to={`/game/${gameId}/application/${application.id}`}>{application.charName}</Link>, submitted by <Link to={`/${application.applicationOwner[0].id}/bio/`}>{application.applicationOwner[0].userName}</Link> on {DateTime.local({millisecond: application.createdAt}).toFormat('MM/dd/yy')} at {DateTime.local({millisecond: application.createdAt}).toFormat('t')}</p></div>))}</div>)}
            {displayIgnored.toString() === 'true' &&(<div><p>Ignored Applications:</p>
            {data.game.Applications.map(application => application.accepted.toString() !== 'true' && application.ignored.toString() === 'true' && (<div key={uuidv4()}><p key={uuidv4()}><Link to={`/game/${gameId}/application/${application.id}`}>{application.charName}</Link>, submitted by <Link to={`/${application.applicationOwner[0].id}/bio/`}>{application.applicationOwner[0].userName}</Link>, submitted on {DateTime.local({millisecond: application.createdAt}).toFormat('MM/dd/yy')} at {DateTime.local({millisecond: application.createdAt}).toFormat('t')}</p></div>))}</div>)}
          </>
        )}
      </div>
      );

}

export default Game;
