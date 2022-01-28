import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    useQuery,
  } from "@apollo/client";
import { GET_CURRENT_ACCOUNT } from "../../gql"
import { GET_GAMES, GET_RULESETS } from "../../gql"
import { v4 as uuidv4 } from 'uuid';
import './home.css';
import GameMessages from "../GameMessages";

function Home() {



    //Grab our session user
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState("");

    //grab our account
    // const { loading, error, data } = useQuery(GET_CURRENT_ACCOUNT, { variables: { userId } }, );

    //grab all games
    const { loading, error, data } = useQuery(GET_GAMES);
    const { loading: rulesetsLoading, error: rulesetsError, data: rulesetsData } = useQuery(GET_RULESETS);
    const [loadingData, setLoading] = useState([]);
    const [errorData, setError] = useState([]);
    const [sortedData, setSortedData] = useState([]);

    //TODO: Grab most recent/popular game and feed it into GameMessages
    //out of games updated in last 3 days, w/ most followers

    //TODO: Grab rulesets for display

    //This needs to be more complicated than simple toggles since
    //multiple conditions can exist
    const [displayInactive, setDisplayInactive] = useState(false);
    const [displayClosedWaitlist, setDisplayClosedWaitlist] = useState(false);
    //TOGGLE: homebrew
    //TOGGLE: houserules


    useEffect(() => {
        //Make sure we have ALL of our data

        if (loading) {
            setLoading(loading);
        }
        if (error) {
            setError(error);
        }
        if (sessionUser) {
            setUserId(sessionUser.id);
        }
    }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {console.log(error)}</p>;

    const changeDisplayInactive = () => {
        setDisplayInactive(!displayInactive)
    }

    const changeDisplayClosedWaitlist = () => {
        setDisplayClosedWaitlist(!displayClosedWaitlist)
    }


    if (!data && loading) {
        return (
        <p>No games found. :(</p>
        )
    }

    {console.log('gameData', data)}

    if (data && !loading) {

        //Just turning data.games into something easier to work with
        const gameData = data.games;



        //make copy of ruleSetsData so that we are able to sort it

            let ruleSetsData;

            if (rulesetsData !== undefined ) {
                //Sort rulesets alphabetically
                ruleSetsData = [...rulesetsData.rulesets];
                ruleSetsData.sort(function(a, b){
                if(a.ruleset < b.ruleset) { return -1; }
                if(a.ruleset > b.ruleset) { return 1; }
                return 0});

            }

        const gameId = 1;

     return (



        <div className="main-container">

            <h3>Tabletop Advanced</h3>
            <p>Play games online with your friends</p>
            <Link to="/signup">Start Playing</Link>
            {/* TODO: search users */}
            <Link to="#">Find Friends</Link>

            <p>Keep up with the community and follow along with popular games</p>
            {/* <p>Cause mayhem, comment, and play along in DM-approved in-game events and community-choice polls</p> */}
            <p>Join in the adventure and play in a campaign or host one yourself</p>

            {/* TODO: randomize from top 20 games */}
            <p>Still on the fence? <Link to={`/game/1/gameroom`}>See a demo</Link></p>
            <Link to="/signup">Start your adventure now</Link>

            {/* <div className="newest-games-container">


                <div><b className="newest-title">Newest Games</b>
                <input type="checkbox"  checked={displayInactive} onChange={changeDisplayInactive}/>
                <label>Show inactive games</label></div>


                <Link className="create-game-button" to="/start-game">Create a Game</Link>
            </div> */}


            {/* <div className="top-game-display-container">
                <div className="recent-games-list"> */}

                    {/* Top Games: */}
                    {/* TODO: display "top" 20-50 games
                    (for now... games with most followers, in order by
                    followers and then by updatedAt).
                    Button 'see more' directs to a dedicated page
                    with pagination (next and prev buttons) */}
                    {/* {gameData && (gameData.map((game) =>
                    (game.active === true && (<div key={uuidv4()} className="gameBox"><p key={uuidv4()}><Link to={`/game/${game.id}/gameroom`}>{game.title}</Link>, presented by {game.host.userName}<br /><span className="premise"><i>{game.blurb}</i></span></p></div>))
                    ))} */}
                    {/* See More - links to GamesList */}

                    {/* Show inactive games conditionally */}
                    {/* TODO: this may be irrelevant & can be removeFromUnchecked
                    from the home page */}
                    {/* {displayInactive === true && (<span><p>Inactive Games:</p>
                    {gameData.map((game) =>
                    (game.active === false && game.deleted === false && (<div key={uuidv4()} className="gameBox"><p key={uuidv4()}><Link to={`/game/${game.id}/gameroom`}>{game.title}</Link>, hosted by {game.host.userName}<br />Premise: {game.blurb}</p></div>))
                    )}</span>)} */}

                    {/* Show closed waitlist games conditionally */}
                    {/* {displayClosedWaitlist === true && (<span><p>Games With Closed Waitlists:</p>
                    {gameData.map((game) =>
                    (game.waitListOpen === false && (<div class="gameBox"><p key={uuidv4()}><Link to={`/game/${game.id}`}>{game.title}</Link>, hosted by {game.host.userName}</p></div>))
                    )}</span>)} */}

                {/* </div> */}

                {/* TODO: remove from Home. Demo button can just go to
                a random popular game. */}
                {/* <div className="popular-game-preview">
                    <GameMessages gameId={gameId} />
                </div> */}
        {/* </div> */}
        {/* <div className="bottom-game-display-container">
            <div className="game-filters">

                <div>
                        <h2 className="game-filters-heading">Games by Ruleset:</h2>

                    <div className="game-cards-container">

                       {ruleSetsData !==undefined && (ruleSetsData.map((ruleset) =>  <Link key={uuidv4()} to={`/rulesets/${ruleset.id}`}><div key={uuidv4()} className="game-card">
                       <p>{ruleset.ruleset}</p>
                        </div></Link>))}
                    </div>
                </div>
                <div>

                </div>
            </div>
        </div> */}
    </div>
     )
     }
    }

export default Home;
