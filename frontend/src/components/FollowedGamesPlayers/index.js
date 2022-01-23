import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import {
    useLazyQuery, useMutation, useQuery
  } from "@apollo/client";
import { GET_FOLLOWED_PLAYERS, GET_FOLLOWED_GAMES } from "../../gql"

function FollowedGamesPlayers() {
    const { playerId } = useParams();
    const sessionUser = useSelector((state) => state.session.user);
    const [userId, setUserId] = useState(null);

    console.log(playerId);
    const { data, loading } = useQuery(GET_FOLLOWED_PLAYERS, { variables: { playerId } });
    const { data: gameData, loading: gameLoading } = useQuery(GET_FOLLOWED_GAMES, { variables: { playerId } });

    useEffect(() => {
        setUserId(sessionUser.id);
    },[sessionUser, data]);

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (data && !loading) {
 return (
    //  TODO: List of followed games
     <div>
        <div>Followed Games:</div>
        {gameData && gameData.getFollowedGames.followedgame.map(game => <div><Link to={`/game/${game.id}/gameroom`}>{game.title}</Link></div>)}
        <div>Followed Players:</div>
        {data && data.getFollowedPlayers.followedplayer.map(player => <div><Link to={`/${player.id}/bio`}>{player.userName}</Link></div>)}
     </div>

 )
}
}

export default FollowedGamesPlayers;
