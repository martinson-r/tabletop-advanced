import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { PubSub } from 'graphql-subscriptions';
import { v4 as uuidv4 } from 'uuid';
import GameMessages from "../GameMessages";
import './game-page.css';

import { EDIT_MESSAGE, GET_GAME, GET_WAITLIST_APPLIED } from "../../gql";
import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
  import { DateTime } from "../../utils/luxon";

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
    const { loading: loadWaitlistStatus, error: waitlistError, data: waitlistStatus } = useQuery(GET_WAITLIST_APPLIED, { variables: { userId, gameId }})


    const handleSubmit = (e) => {
      e.preventDefault();
      // setErrors([]);
      // updateBio({ variables: { currentUserId, userId, firstName, bio, pronouns, avatarUrl } });

      const description = document.getElementById("edit-details");
      const form = document.getElementById("edit-form");
      const button = document.getElementById("edit-button");
      form.classList.add("edit-hidden");
      button.classList.remove("edit-hidden");
      description.classList.remove("edit-hidden");

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
        </div>

        <div className="game-content-block">
        <h2>Playing In This Game</h2>
            {/* This feels a little backwards, but we're grabbing the player associated with the character */}
            {data !== undefined && data.game.Characters.map((character) => <span key={uuidv4()}><Link to={`/${character.User.id}/bio`}>{character.User.userName}</Link> as <Link to={`/characters/${character.id}`}>{character.name}</Link></span>)}

            {/* Player is able to join waitlist */}
            {data !== undefined && userId !== null && userId !== undefined && data.game.host.id.toString() !== userId.toString() && data.game.waitListOpen.toString() !== "false" && (<><Link to={`/waitlist/${gameId}`}>Submit a Character to the Waitlist</Link><br /></>)}

            {/* TODO: GM is not allowing multiple apps and player has applied */}
            {waitlistStatus && waitlistStatus.checkApplied.length > 0 && (<p>You have already applied to this game, and multiple applications are not allowed by the GM.</p>)}

            {data !== undefined && userId !== null && userId !== undefined && data.game.host.id !== userId.toString() && data.game.waitListOpen.toString() === "false" && (<><i>Waitlist closed.</i></>)}
        </div>

</div>
        {data !== undefined && userId !== undefined && userId !== null && data.game.host.id && userId.toString() === data.game.host.id && (
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
                <button type="submit" id="save-button" onClick={edit}>Save</button>
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
          </div>
        </div>


        )}
      </div>
      </div>
      );
}

export default GamePage;
