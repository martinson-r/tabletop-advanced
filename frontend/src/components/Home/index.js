import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    useQuery,
  } from "@apollo/client";
import { GET_CURRENT_ACCOUNT } from "../../gql"
import { GET_GAMES } from "../../gql"
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
    const [loadingData, setLoading] = useState([]);
    const [errorData, setError] = useState([]);

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


    if (!data) {
        return (
        <p>No games found. :(</p>
        )
    }

    if (data) {

        //Just turning data.games into something easier to work with
        const gameData = data.games;
        const gameId = 3;

     return (

        <div className="main-container">
            <div className="top-game-display-container">
                <div className="recent-games-list">
                    <label>Show inactive games</label>
                    <input type="checkbox" checked={displayInactive} onChange={changeDisplayInactive}/>
                    <label>Show waitlist closed</label>
                    <input type="checkbox" checked={displayClosedWaitlist} onChange={changeDisplayClosedWaitlist}/>


                    <p>Active Games:</p>
                    {gameData.map((game) =>
                    (game.active === true && (<p key={uuidv4()}><Link to={`/game/${game.id}`}>{game.title}</Link>, hosted by {game.host.userName}</p>))
                    )}

                    {/* Show inactive games conditionally */}
                    {displayInactive === true && (<span><p>Inactive Games:</p>
                    {gameData.map((game) =>
                    (game.active === false && (<p key={uuidv4()}><Link to={`/game/${game.id}`}>{game.title}</Link>, hosted by {game.host.userName}</p>))
                    )}</span>)}
                </div>
                <div className="popular-game-preview">
                    <GameMessages gameId={gameId} />
                </div>
        </div>
        <div className="bottom-game-display-container">
            <div className="game-filters">
                 {/* TODO: a component that fetches/displays by category fed in */}
                <div>
                    <div>
                        <p>Games by Ruleset:</p>
                    </div>
                    {/* TODO: fetch all rulesets from database and map containers */}
                    <div className="game-cards-container">
                        <div className="game-card">
                            <p>Dungeons &amp; Dragons</p>
                        </div>
                        <div className="game-card">
                            <p>Dungeons &amp; Dragons</p>
                        </div>
                        <div className="game-card">
                            <p>Dungeons &amp; Dragons</p>
                        </div>
                        <div className="game-card">
                            <p>Dungeons &amp; Dragons</p>
                        </div>
                        <div className="game-card">
                            <p>Dungeons &amp; Dragons</p>
                        </div>
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
