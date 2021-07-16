import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
    useQuery, useLazyQuery
  } from "@apollo/client";
import { GET_GAMES, GET_USER_NON_GAME_CONVOS, GET_PLAYING_WAITING_GAMES, GET_HOSTED_GAMES } from "../../gql"
import "./dashboard.css";
import { v4 as uuidv4 } from 'uuid';
import { assertWrappingType } from "graphql";

function Home() {


    //Grab our session user
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState(null);
    const history = useHistory();

    //grab all games
    //TODO: Replace with query to grab games only relating to the user
    const { loading, error, data } = useQuery(GET_GAMES);
    const [getHosting, { loading: loadingHosted, error: errorHosted, data: dataHosted}] = useLazyQuery(GET_HOSTED_GAMES);
    const [getPlayingWaiting, { loading: loadingPlayingWaiting, error: errorPlayingWaiting, data: dataPlayingWaiting}] = useLazyQuery(GET_PLAYING_WAITING_GAMES);

    const [loadingData, setLoading] = useState([]);
    const [errorData, setError] = useState([]);
    const [openApps, setOpenApps] = useState([]);

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
        }
    },[userId]);

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
  },[dataHosted])


  //bad POST requests are coming from here because of userId not being set for a bit.
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
                <p>Games I'm Hosting:</p>
                {/* Show "X new applications" for apps not ignored or accepted */}
                {/* Game details page for hosts provides additional info on players & open apps */}
                {dataHosted !== undefined && (dataHosted.getGamesHosting.map(game => <p key={uuidv4()}><Link to={`/game/${game.id}`}>{game.title}</Link> - {openApps} open applications</p>))}
                <p>Games I'm Playing In:</p>
                <p>Games I'm Following:</p>
                <p>My Waitlist:</p>
                {/* TODO: Load games user is hosting and playing in */}
                {/* TODO: icon/highlight when games user is hosting have waitlist apps */}
                {/* TODO: icon/highlight when games user is playing in have new activity */}
                <p>Private Conversations:</p>
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
