import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
    useQuery, useLazyQuery, useMutation
  } from "@apollo/client";
import { GET_GAMES, GET_CHARACTER, GET_GAMES_PLAYING_IN, ACCEPT_OFFER, DECLINE_OFFER, GET_WAITING_LIST_GAMES,
    GET_USER_NON_GAME_CONVOS, GET_HOSTED_GAMES } from "../../gql"
import "./dashboard.css";
import { v4 as uuidv4 } from 'uuid';
import { assertWrappingType } from "graphql";

function Home() {

    //Grab our session user
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState(null);
    const [applicationId, setApplicationId] = useState(null);
    const [gameId, setGameId] = useState(null);
    const history = useHistory();
    const [playingIn, setPlayingIn] = useState([]);
    const [appliedTo, setAppliedTo] = useState([]);
    const gameIdRef = useRef(null);
    const appIdSpanRef = useRef(null);
    const [acceptDecline, setAcceptDecline] = useState(null);

    //grab all games
    //TODO: Replace with query to grab games only relating to the user
    const { loading, error, data } = useQuery(GET_GAMES);
    const [getHosting, { loading: loadingHosted, error: errorHosted, data: dataHosted}] = useLazyQuery(GET_HOSTED_GAMES);
    const [getWaitlistGames, { loading: loadingWaiting, error: errorWaiting, data: dataWaiting}] = useLazyQuery(GET_WAITING_LIST_GAMES);
    const [getGamesPlayingIn, {loading: loadingPlayingIn, data: playingInData}] = useLazyQuery(GET_GAMES_PLAYING_IN);
    const [character, { data: charData, error: charError, loading: charLoading }] = useLazyQuery(GET_CHARACTER);

    const [loadingData, setLoading] = useState([]);
    const [errorData, setError] = useState([]);
    const [openApps, setOpenApps] = useState([]);

    const [acceptOffer] = useMutation(ACCEPT_OFFER, { variables: { applicationId, userId, gameId }});
    const [declineOffer] = useMutation(DECLINE_OFFER, { variables: { applicationId }});

    const getchar = (userId, gameId) => {
        const char = character({ variables: { userId, gameId }});
        return char;
    }

    useEffect(() => {
        //Make sure we have ALL of our data

        if (loading || nonGameLoading) {
            setLoading(loading);
        }
        if (error || nonGameError) {
            setError(error);
        }
        if (sessionUser) {
            setUserId(sessionUser.id);
        }
    }, []);

    useEffect(() => {
        if (userId !== undefined && userId !== null) {
            getCurrentNonGameConvos({ variables: { userId }});
            getHosting({ variables: { userId } });
            getWaitlistGames({ variables: { userId }});
            getGamesPlayingIn({ variables: { userId }});
        }
    },[userId]);

   //Calculate number of apps that have not been accepted or ignored (open apps) & set to our variable.
   //data object is non-extensible, so we can't set it as a key on there.
  useEffect(() => {
      if (dataHosted !== undefined) {
        dataHosted.getGamesHosting.forEach(game => {
            const openApps = game.Applications.filter(app => app.ignored !== true && app.accepted !== true);
            setOpenApps(openApps.length)
       });
      }
  },[dataHosted]);

  const [getCurrentNonGameConvos, { loading: nonGameLoading, error: nonGameError, data: nonGameData }] = useLazyQuery(GET_USER_NON_GAME_CONVOS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( </p>;

    if (!data) {
        return (
        <p>No games found. :(</p>
        )
    }


    if (data) {

        //Just turning data.games into something easier to work with
        const gameData = data.games;

        return (
            <div>
                <div className="hosting">
                <p>Games I'm Hosting:</p>
                {dataHosted !== undefined && (dataHosted.getGamesHosting.map(game => <p key={uuidv4()}><Link to={`/game/${game.id}`}>{game.title}</Link> - {openApps} open applications</p>))}
                </div>
                <div className="playingIn">
                    {/* REFACTOR. Rework how you pull this data. This is not maintainable. */}
                    {/* Just do 2 separate queries. One for Waiting List (excluding offerAccepted apps), one for games the user is a player in. */}
                <p>Games I'm Playing In:</p>
                {/* Link to character info from character name */}
                {/* Use lazy query */}
                {playingInData !== undefined && (playingInData.getGamesPlayingIn.map(game => <p key={uuidv4()}>{console.log('GAMES', playingInData.getGamesPlayingIn)}<Link to={`/game/${game.id}`}>{game.title}</Link>, hosted by {game.host.userName}, as <Link to={`/characters/${game.player[0].Characters.filter(character => character.gameId === game.id)[0].id}`}>{game.player[0].Characters.filter(character => character.gameId === game.id)[0].name}</Link></p>))}

                {/* TODO: create a character for a game if one doesn't exist */}

                </div>
                <div className="appliedTo">
                <p>Games I've Applied To:</p>
                {dataWaiting !== undefined && appliedTo !== undefined && (
                    <div>
                        {dataWaiting.getWaitlistGames.map(game => <p><Link to={`/game/${game.id}`}>{game.title}</Link>, hosted by {game.host.userName}:</p>)}
                        {/* If offerAccepted is null, they haven't acted on the app */}
                        {/* TODO: Get this to update dynamically */}
                        {dataWaiting.getWaitlistGames.map(game => game.applicant.map(apps => apps.applicationOwner.map(app => app.offerAccepted === null && (<div><p><Link to={`/game/${game.id}/application/${app.id}`}>{app.charName}</Link> - {app.accepted.toString() === 'true' && (<span>Accepted <button onClick={(e) => {acceptOffer({variables: {applicationId: app.id, gameId: game.id, userId} })}}>Confirm participation</button><button onClick={(e) => {declineOffer({variables: { applicationId: app.id}})}}>Decline participation</button></span>)}{app.accepted.toString() === 'false' && (<span>Pending</span>)}</p></div>))))}
                    </div>
                )}
                </div>
                <div className="following">
                <p>Games I'm Following:</p>
                {/* TODO: ability to follow games */}
                </div>
                <p>Private Conversations:</p>
                <p><Link to={'/newmessage'}>Start new conversation</Link></p>
                {/* TODO: Add multiple users to private convos */}
                {/* We need unique keys for mapped elements so React can keep track of what is what */}
                {nonGameData !== undefined && (nonGameData.getNonGameConvos.map(conversations => <div key={uuidv4()} className="convos-box" >{conversations.recipient.map(conversation => (<p key={uuidv4()} className="private-convo" onClick={() => history.push(`/conversation/${conversation.id}`)}>{conversation.recipient.map(recipient => recipient.userName + ", ")}</p>))}</div>))}
            </div>
        )
    }
}

export default Home;
