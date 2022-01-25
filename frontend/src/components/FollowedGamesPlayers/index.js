import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import {
    useLazyQuery, useMutation, useQuery
  } from "@apollo/client";
import { GET_FOLLOWED_PLAYERS, GET_FOLLOWED_GAMES, GET_FOLLOWED_VISITED_TIME } from "../../gql"
import { DateTime } from "../../utils/luxon";

function FollowedGamesPlayers() {
    const { playerId } = useParams();
    const sessionUser = useSelector((state) => state.session.user);
    const [userId, setUserId] = useState(null);
    const [matchedDates, setMatchedDates] = useState([]);

    console.log(playerId);
    const { data, loading } = useQuery(GET_FOLLOWED_PLAYERS, { variables: { playerId } });
    const { data: gameData, loading: gameLoading } = useQuery(GET_FOLLOWED_GAMES, { variables: { playerId } });
    const { data: visitedDate } = useQuery(GET_FOLLOWED_VISITED_TIME, { variables: { playerId } });

    let matchUpDates = () => {
        if (gameData !== undefined && visitedDate !== undefined) {
            //these are both arrays...
            let followedGamesArray = gameData.getFollowedGames.followedgame;
            let visitedArray = visitedDate.getFollowedTimeStamps;

            for (let game of followedGamesArray) {
                console.log('ARRAY', followedGamesArray);
                console.log(game.id);
            }

            for (let visitDate of visitedArray) {
                console.log(visitDate);
            }

            for (let game of followedGamesArray) {
                console.log('GAMID', game.id)
                for (let visitDate of visitedArray) {
                    console.log('game', game.id);
                    console.log('visitdate', visitDate.gameId)
                    if (game.id === visitDate.gameId) {
                        setMatchedDates(matchedDates => [{game, visitDate}, ...matchedDates]);
                    }
                }
            }
        }
    }

    useEffect(() => {
        matchUpDates();
        console.log('DATA => ', gameData)
    },[visitedDate, gameData]);

    useEffect(() => {

        console.log('user', sessionUser);
        if (sessionUser !== null && sessionUser !== undefined) {
            setUserId(sessionUser.id);
        }
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
        {matchedDates && matchedDates.map(game =>
        <div>
            <Link to={`/game/${game.game.id}/gameroom`}>{game.game.title}</Link>
            {/* Actually, we need the updated message times for the game */}
            {game.game.Messages[game.game.Messages.length-1] !== undefined
            && game.game.Messages[game.game.Messages.length-1].updatedAt > game.visitDate.visited
            && (<div>New Activity</div>)}
   <div>Updated: Visited: {game.visitDate.visited}</div>
        </div>)}

        {/* TODO: match games up with visited times */}
        {/* TODO: indicate if updated */}
        {/* game updatedAt is greater than followedgame visited */}
        <div>Followed Players:</div>
        {data && data.getFollowedPlayers.followedplayer.map(player => <div><Link to={`/${player.id}/bio`}>{player.userName}</Link></div>)}
     </div>

 )
}
}

export default FollowedGamesPlayers;
