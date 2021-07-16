import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
    useQuery, useLazyQuery, useMutation
  } from "@apollo/client";
import { GET_GAMES, ACCEPT_OFFER, DECLINE_OFFER, GET_USER_NON_GAME_CONVOS, GET_PLAYING_WAITING_GAMES, GET_HOSTED_GAMES } from "../../gql"
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
    const [getPlayingWaitingGames, { loading: loadingPlayingWaiting, error: errorPlayingWaiting, data: dataPlayingWaiting}] = useLazyQuery(GET_PLAYING_WAITING_GAMES);

    const [loadingData, setLoading] = useState([]);
    const [errorData, setError] = useState([]);
    const [openApps, setOpenApps] = useState([]);
    const [notCurrentPlayer, setNotCurrentPlayer] = useState([]);

    const [acceptOffer] = useMutation(ACCEPT_OFFER, { variables: { applicationId, userId, gameId }});
    const [declineOffer] = useMutation(DECLINE_OFFER, { variables: { applicationId }});

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
            getPlayingWaitingGames({ variables: { userId }});
        }
    },[userId]);

    useEffect(() => {
        if (dataPlayingWaiting !== undefined) {
            setPlayingIn(dataPlayingWaiting.getPlayingWaitingGames);
            setAppliedTo(dataPlayingWaiting.getPlayingWaitingGames);
        }
    },[dataPlayingWaiting])

   //Calculate number of apps that have not been accepted or ignored (open apps) & set to our variable.
   //data object is non-extensible, so we can't set it as a key on there.
  useEffect(() => {
      if (dataHosted !== undefined) {
        dataHosted.getGamesHosting.forEach(game => {
            const openApps = game.Applications.filter(app => app.ignored !== true && app.accepted !== true);
            console.log(openApps)
            setOpenApps(openApps.length)
       });
      }
  },[dataHosted]);

  useEffect(() => {
    if (gameId !== null && applicationId !== null) {
        if (acceptDecline.toString() === 'true') {
            acceptOffer({variables: { applicationId, gameId, userId } })
        }
        if (acceptDecline.toString() === 'false') {
            declineOffer({variables: { applicationId } })
        }
    }
  },[gameId, applicationId])


  const [getCurrentNonGameConvos, { loading: nonGameLoading, error: nonGameError, data: nonGameData }] = useLazyQuery(GET_USER_NON_GAME_CONVOS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( </p>;

    if (!data) {
        return (
        <p>No games found. :(</p>
        )
    }

    const acceptOfferButton = (e) => {
        setAcceptDecline(true);
        if (appIdSpanRef !== null) {
            setApplicationId(appIdSpanRef.current.id);
        };
        if (gameIdRef !== null) {
            setGameId(gameIdRef.current.id);
        };
    };

    const declineOfferButton = (e) => {
        setAcceptDecline(false);
        if (appIdSpanRef !== null) {
            setApplicationId(appIdSpanRef.current.id);
        };
        if (gameIdRef !== null) {
            setGameId(gameIdRef.current.id);
        };
    };


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
                {console.log('playing in', playingIn)}
                {dataPlayingWaiting !== undefined && playingIn[0] !== undefined && (
                    playingIn[0].player.map(gameIn => <p><Link to={`/game/${gameIn.id}`}>{gameIn.title}</Link>, hosted by {gameIn.host.userName}</p>)
                    )}
                    {dataPlayingWaiting !== undefined && playingIn.length === 0 && (
                        <p>You are not currently playing in any games.</p>
                    )}
                    </div>
                    <div className="appliedTo">
                <p>Games I've Applied To:</p>
                {appliedTo[0] !== undefined && (console.log('applicant', appliedTo[0].applicant))}
                {/* TODO: filter out games where user is a player */}
                {dataPlayingWaiting !== undefined && appliedTo[0] !== undefined && (
                    appliedTo[0].applicant.map(gameApplied => <div id={gameApplied.id} ref={gameIdRef}><p><Link to={`/game/${gameApplied.id}`}>{gameApplied.title}</Link>, hosted by {gameApplied.host.userName}:</p> <p>{gameApplied.Applications.length} applications: {gameApplied.Applications.map(application => <span><Link to={`/game/${gameApplied.id}/application/${application.id}`}>{application.charName}</Link>: {application.accepted.toString() === 'true' && (<span ref={appIdSpanRef} id={application.id}>Application approved. <button onClick={acceptOfferButton}>Accept offer to join game</button><button onClick={declineOfferButton}>Decline offer to join game</button></span>)}{application.accepted.toString() !== 'true' && (<span>Application pending.</span>)}, </span>)}</p></div>))}
                </div>
                {/* TODO: filter for games declined but they can still accept if they decline accidentally */}
                <div className="following">
                <p>Games I'm Following:</p>
                {/* TODO: ability to follow games */}
                </div>
                <p>Private Conversations:</p>
                {/* TODO: Add multiple users to private convos */}
                {console.log('DATA', nonGameData)}
                {/* We need unique keys for mapped elements so React can keep track of what is what */}
                {nonGameData !== undefined && (nonGameData.getNonGameConvos.map(conversations => <div key={uuidv4()} className="convos-box" >{conversations.recipient.map(conversation => (<p key={uuidv4()} className="private-convo" onClick={() => history.push(`/conversation/${conversation.id}`)}>{conversation.recipient.map(recipient => recipient.userName + ", ")}</p>))}</div>))}
                <p>Active Games:</p>
                {gameData.map(game => <p key={uuidv4()}><Link to={`/game/${game.id}`}>{game.title}</Link> - {game.description}, Hosted by {game.host.userName}</p>)}
            </div>
        )
    }
}

export default Home;
