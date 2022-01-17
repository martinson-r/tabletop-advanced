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
  if (error) return <p>Error :( </p>;

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

    if (data && !loading) {

        //Just turning data.games into something easier to work with
        const gameData = data.games;
        console.log('data.rulesets', data);
        let ruleSetsData = [...rulesetsData.rulesets];
        console.log('rulesets', ruleSetsData)
        ruleSetsData.sort(function(a, b){
            console.log('RULESET', a)
if(a.ruleset < b.ruleset) { return -1; }
if(a.ruleset > b.ruleset) { return 1; }
return 0});
        const gameId = 1;

     return (

        <div className="main-container">
            <div className="newest-games-container">
                {/* TODO: grid this, align everything to bottom */}
                <div><b className="newest-title">Newest Games</b>
                <input type="checkbox"  checked={displayInactive} onChange={changeDisplayInactive}/>
                <label>Show inactive games</label></div>

                {/* <label>Show waitlist closed</label>
                <input type="checkbox" checked={displayClosedWaitlist} onChange={changeDisplayClosedWaitlist}/> */}
                <Link className="create-game-button" to="/start-game">Create a Game</Link>
            </div>

                {/* TODO: position and style */}
            <div className="top-game-display-container">
                <div className="recent-games-list">

                    {/* <p>Active Games:</p> */}
                    {gameData && (gameData.map((game) =>
                    (game.active === true && (<div key={uuidv4()} className="gameBox"><p key={uuidv4()}><Link to={`/game/${game.id}/gameroom`}>{game.title}</Link>, presented by {game.host.userName}<br /><span className="premise"><i>{game.blurb}</i></span></p></div>))
                    ))}

                    {/* Show inactive games conditionally */}
                    {displayInactive === true && (<span><p>Inactive Games:</p>
                    {gameData.map((game) =>
                    (game.active === false && (<div key={uuidv4()} className="gameBox"><p key={uuidv4()}><Link to={`/game/${game.id}/gameroom`}>{game.title}</Link>, hosted by {game.host.userName}<br />Premise: {game.blurb}</p></div>))
                    )}</span>)}

                    {/* Show closed waitlist games conditionally */}
                    {/* {displayClosedWaitlist === true && (<span><p>Games With Closed Waitlists:</p>
                    {gameData.map((game) =>
                    (game.waitListOpen === false && (<div class="gameBox"><p key={uuidv4()}><Link to={`/game/${game.id}`}>{game.title}</Link>, hosted by {game.host.userName}</p></div>))
                    )}</span>)} */}

                </div>
                <div className="popular-game-preview">
                    <GameMessages gameId={gameId} />
                </div>
        </div>
        <div className="bottom-game-display-container">
            <div className="game-filters">
                 {/* TODO: a component that fetches/displays by category fed in */}
                <div>
                        <h2 className="game-filters-heading">Games by Ruleset:</h2>
                    {/* TODO: fetch all rulesets from database and map containers */}
                    <div className="game-cards-container">
                       {ruleSetsData !==undefined && (ruleSetsData.map((ruleset) =>  <Link to={`/rulesets/${ruleset.id}`}><div key={uuidv4()} className="game-card">
                       <p>{ruleset.ruleset}</p>
                        </div></Link>))}
                    </div>
                </div>
                <div>
                    {/* TODO: add Genres to database */}
                    {/* <div>
                        <p>Games by Genre:</p>
                    </div>
                    <div className="game-cards-container">
                        <div className="game-card">

                        </div>
                        <div className="game-card">

                        </div>
                        <div className="game-card">

                        </div>
                        <div className="game-card">

                        </div>
                        <div className="game-card">

                        </div>
                    </div> */}

                </div>
            </div>
        </div>
    </div>
     )
     }
    }

export default Home;
