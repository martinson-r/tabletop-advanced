import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { PubSub } from 'graphql-subscriptions';
import { v4 as uuidv4 } from 'uuid';
import GameMessages from "../GameMessages";
import './game-page.css';

import { GAME_MESSAGES_SUBSCRIPTION, REMOVE_PLAYER, GET_FOLLOWED_GAMES, FOLLOW_GAME, UNFOLLOW_GAME, GET_GAME, GET_WAITLIST_APPLIED, UPDATE_GAME } from "../../gql";
import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
  import { DateTime } from "../../utils/luxon";
import RemovePlayer from "../RemovePlayer";

function GamePage() {

    const sessionUser = useSelector((state) => state.session.user);
    const [userId, setUserId] = useState(null);
    // Grab our game ID
    const { gameId } = useParams();
    const [displayIgnored, setDisplayIgnored] = useState(false);
    const [displayAccepted, setDisplayAccepted] = useState(true);
    const [details, setDetails] = useState("");
    const [title, setTitle] = useState("");
    const [blurb, setBlurb] = useState("");
    const [waitListOpen, setWaitListOpen] = useState(true);
    const [hostId, setHostId] = useState(null);
    const [filteredApps, setFilteredApps] = useState([]);
    const [active, setActive] = useState(true);
    const [deleted, setDeleted] = useState(false);
    const [isGameFollowed, setIsGameFollowed] = useState(false);
    const [showRemove, setShowRemove] = useState({});
    const [retireNote, setRetireNote] = useState('');
    const [playerId, setPlayerId] = useState(null);

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

const removePlayerFromGame = () => {
  removePlayer({ variables: { playerId, gameId, retireNote}})
}

    const { loading, error, data } = useQuery(GET_GAME, { variables: { gameId }});
    const { data: followData, loading: followLoading } = useQuery(GET_FOLLOWED_GAMES, { variables: { playerId: userId } });
    const { loading: loadWaitlistStatus, error: waitlistError, data: waitlistStatus } = useQuery(GET_WAITLIST_APPLIED, { variables: { userId, gameId }})
    const [updateGame] = useMutation(UPDATE_GAME, { variables: { userId, gameId, title, blurb, details, waitListOpen, active, deleted }, refetchQueries: ["GetSingleGame"] } );
    const [followGame] = useMutation(FOLLOW_GAME, { variables: { userId, gameId }, refetchQueries: ["GetSingleGame"] } );
    const [unFollowGame] = useMutation(UNFOLLOW_GAME, { variables: { userId, gameId }, refetchQueries: ["GetSingleGame"] } );
    const [removePlayer] = useMutation(REMOVE_PLAYER, { variables: { playerId, gameId, retireNote }} );

    useEffect(() => {
      if (data) {
        setHostId(data.game.host.id);
        setBlurb(data.game.blurb);
        setDetails(data.game.description);
        setTitle(data.game.title);

      }
    },[data]);

    const toggleWaitlist = async () => {
      const togglePromise = new Promise((resolve, reject) => resolve(doToggleWaitlist()));
      await togglePromise;
      updateGame(gameId, userId, blurb, title, details, waitListOpen, active, deleted);
    }

    let doToggleWaitlist = () => {
      setWaitListOpen(!waitListOpen);
      return waitListOpen;
    }

    const toggleActive = async () => {
      const togglePromise = new Promise((resolve, reject) => resolve(doToggleActive()));
      await togglePromise;
      updateGame(gameId, userId, blurb, title, details, waitListOpen, active, deleted);
    }

    let doToggleActive = () => {
      setActive(!active);
      return active;
    }

    const toggleDeleted = async () => {
      const togglePromise = new Promise((resolve, reject) => resolve(doToggleDeleted()));
      await togglePromise;
      updateGame(gameId, userId, blurb, title, details, waitListOpen, active, deleted);
    }

    let doToggleDeleted = () => {
      setDeleted(!deleted);
      return deleted;
    }

    useEffect(() => {
      if (followData !== null && !followLoading) {
        //check if the user is following the game
        if (followData.getFollowedGames !== null) {
          let followedArray = followData.getFollowedGames.followedgame.filter(game => game.id === gameId);
          if (followedArray.length > 0) {
            setIsGameFollowed(true);
          }
        }
      }
    },[followData]);



    useEffect(() => {
      if (data !== undefined && userId !== undefined) {
        setWaitListOpen(data.game.waitListOpen);
        setActive(data.game.active);
        setFilteredApps(data.game.Applications.filter(app => app.applicationOwner[0].id == userId));
      }
    },[data, userId]);

    const handleSubmit = (e) => {
      e.preventDefault();
      // setErrors([]);
      updateGame({ variables: { gameId, userId, blurb, title, details, waitListOpen } });

      const description = document.getElementById("edit-details");
      const form = document.getElementById("edit-form");
      const button = document.getElementById("edit-button");
      form.classList.add("edit-hidden");
      button.classList.remove("edit-hidden");
      description.classList.remove("edit-hidden");

      //TODO:Actually update the stuff

  }

  const followThisGame = () => {
    setIsGameFollowed(!isGameFollowed);
    followGame({variables: { userId, gameId }});
  }

  const unFollowThisGame = () => {
    setIsGameFollowed(!isGameFollowed);
    unFollowGame({variables: { userId, gameId }});
  }



  const submitRemove = () => {
    //setPlayerId(characterPlayerId)
    //removePlayer({ variables: { playerId, gameId, retireNote }});
  }

  const edit = () => {
  const description = document.getElementById("edit-details");
  const form = document.getElementById("edit-form");
  const button = document.getElementById("edit-button");

  if (form.classList.contains("edit-hidden")) {
      form.classList.remove("edit-hidden");
      button.classList.add("edit-hidden");
      description.classList.add("edit-hidden");
  }

  else {
      form.classList.add("edit-hidden");
      button.classList.remove("edit-hidden");
      description.classList.remove("edit-hidden");
  }
  }

return (

  <div className="container">
<GameMessages gameId={gameId} />
<div className="gray-backdrop">
<div className="details">
        <div id="edit-details" className="game-content-block">
            <h2>More About This Game</h2>
            {data !== undefined && (<span>{data.game.description}</span>)}
            {/* TODO: Follow Game */}
            {isGameFollowed === false && (<button onClick={followThisGame}>Follow Game</button>)}
            {isGameFollowed === true && (<button onClick={unFollowThisGame}>Unfollow Game</button>)}
        </div>

        <div className="game-content-block">
        <h2>Playing In This Game</h2>
            {/* This feels a little backwards, but we're grabbing the player associated with the character */}
            {/* TODO: GMs can remove characters from game */}
            {data !== undefined && data.game.Characters.map((character) =>
            <RemovePlayer character={character} userId={userId} hostId={hostId} gameId={gameId}></RemovePlayer>
            )}

            {/* Player is able to join waitlist */}
            {hostId !== null && userId !== null && userId !== undefined && hostId.toString() !== userId.toString() && waitListOpen.toString() !== "false" && (<><Link to={`/waitlist/${gameId}`}>Submit a Character to the Waitlist</Link><br /></>)}

            {waitlistStatus && waitlistStatus.checkApplied.length > 0 && (<p>You have already applied to this game, and multiple applications are not allowed by the GM.</p>)}
            {filteredApps.length > 0 && (<p>Your Waitlist Applications:</p>)}
            {filteredApps.map(app => <Link to={`/game/${gameId}/application/${app.id}`}>{app.charName}</Link>)}
            {waitListOpen !== null && hostId !== null && userId !== null && userId !== undefined && hostId !== userId.toString() && waitListOpen.toString() === "false" && (<><i>Waitlist closed.</i></>)}
        </div>

</div>
        {hostId !== null && userId !== undefined && userId !== null && hostId && userId.toString() === hostId && (
          <div>

          <div className="game-content-block">

            <button id="edit-button" onClick={edit}>Edit Game Details</button>
            <div id="edit-form" className="edit-hidden">
        <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required/>
                <label>Details</label>
                <input type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required/>
                 <label>Blurb</label>
                <input type="text"
                value={blurb}
                onChange={(e) => setBlurb(e.target.value)}
                required/>
                <button type="submit" id="save-button" onSubmit={handleSubmit}>Save</button>
            </form>
        </div>
            <h2>Applications:</h2>
            <div className="toggle-flex">
                <div className="toggle">
                    <label >Show ignored</label>
                    <input type="checkbox" name="ignored" checked={displayIgnored} onChange={changeDisplayIgnored}/>
                </div>
                <div className="toggle">
                    <label >Show accepted</label>
                    <input type="checkbox" name="accepted" checked={displayAccepted} onChange={changeDisplayAccepted}/>
                </div>
            </div>
            <h3>Open Applications:</h3>
            {data.game.Applications.map(application => application.accepted.toString() !== 'true' && application.ignored.toString() !== 'true' && (<div key={uuidv4()}><p key={uuidv4()}><Link to={`/game/${gameId}/application/${application.id}`}>{application.charName}</Link>, submitted by <Link to={`/${application.applicationOwner[0].id}/bio/`}>{application.applicationOwner[0].userName}</Link>, submitted on {DateTime.local({millisecond: application.createdAt}).toFormat('MM/dd/yy')} at {DateTime.local({millisecond: application.createdAt}).toFormat('t')}</p></div>))}

            {displayAccepted.toString() === 'true' &&(<div><p>Accepted Applications:</p>{data.game.Applications.map(application => application.accepted.toString() === 'true' && (<div key={uuidv4()}><p key={uuidv4()}><Link to={`/game/${gameId}/application/${application.id}`}>{application.charName}</Link>, submitted by <Link to={`/${application.applicationOwner[0].id}/bio/`}>{application.applicationOwner[0].userName}</Link> on {DateTime.local({millisecond: application.createdAt}).toFormat('MM/dd/yy')} at {DateTime.local({millisecond: application.createdAt}).toFormat('t')}</p></div>))}</div>)}
            {displayIgnored.toString() === 'true' &&(<div><p>Ignored Applications:</p>
            {data.game.Applications.map(application => application.accepted.toString() !== 'true' && application.ignored.toString() === 'true' && (<div key={uuidv4()}><p key={uuidv4()}><Link to={`/game/${gameId}/application/${application.id}`}>{application.charName}</Link>, submitted by <Link to={`/${application.applicationOwner[0].id}/bio/`}>{application.applicationOwner[0].userName}</Link>, submitted on {DateTime.local({millisecond: application.createdAt}).toFormat('MM/dd/yy')} at {DateTime.local({millisecond: application.createdAt}).toFormat('t')}</p></div>))}</div>)}
            {hostId !== null && userId !== undefined && userId !== null && userId.toString() === hostId && waitListOpen &&(<button onClick={toggleWaitlist}>Close Waitlist</button>)}{!waitListOpen && (<button onClick={toggleWaitlist}>Open Waitlist</button>)}
          </div>
          {/* End Campaign (ends game series) */}
          {hostId !== null && userId !== undefined && userId !== null && userId.toString() === hostId && active &&(<button onClick={toggleActive}>End Campaign</button>)}{hostId !== null && userId !== undefined && userId !== null && userId.toString() === hostId && !active &&(<button onClick={toggleActive}>Restart Campaign</button>)}
        {/* Delete Game (hides from search and everyone, including players) */}
        {hostId !== null && userId !== undefined && userId !== null && userId.toString() === hostId && !deleted &&(<button class="delete" onClick={toggleDeleted}>DELETE Campaign</button>)}{hostId !== null && userId !== undefined && userId !== null && userId.toString() === hostId && deleted &&(<button class="delete" onClick={toggleDeleted}>Undelete Campaign</button>)}
        </div>
        )}
      </div>
      </div>
      );
}

export default GamePage;
