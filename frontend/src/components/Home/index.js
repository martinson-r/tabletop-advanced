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
    const { loading, error, data } = useQuery(GET_GAMES);

    const [accounts, setAccount] = useState([]);
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
        if (data) {
            setAccount(data);
        }
        if (sessionUser) {
            setUserId(sessionUser._id);
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
                <p>Games:</p>
                {gameData.map(game => <p key={game._id}><Link to={`/game/${game._id}`}>{game.title}</Link> - {game.description}, Hosted by {game.host.email}</p>)}
            </div>
        )
    }
}

export default Home;
