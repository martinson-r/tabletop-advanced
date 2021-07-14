import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    useQuery,
  } from "@apollo/client";
import { GET_CURRENT_ACCOUNT } from "../../gql"
import { GET_GAMES } from "../../gql"

function Home() {


    //Grab our session user
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState("");

    //grab our account
    // const { loading, error, data } = useQuery(GET_CURRENT_ACCOUNT, { variables: { userId } }, );

    //grab all games
    //TODO: Replace with query to grab games only relating to the user
    const { loading, error, data } = useQuery(GET_GAMES);
    const [loadingData, setLoading] = useState([]);
    const [errorData, setError] = useState([]);

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
                <p>Games I'm Playing In:</p>
                <p>Games I'm Following:</p>
                <p>My Waitlist:</p>
                {/* TODO: Load games user is hosting and playing in */}
                {/* TODO: icon/highlight when games user is hosting have waitlist apps */}
                {/* TODO: icon/highlight when games user is playing in have new activity */}
                <p>Private Conversations:</p>
                <p>Active Games:</p>
                {gameData.map(game => <p key={game.id}><Link to={`/game/${game.id}`}>{game.title}</Link> - {game.description}, Hosted by {game.host.userName}</p>)}
            </div>
        )
    }
}

export default Home;
