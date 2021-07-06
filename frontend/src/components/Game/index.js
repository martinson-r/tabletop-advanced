import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Messages from "../Messages";

import {
    useQuery,
  } from "@apollo/client";
import { GET_GAME, GET_GAME_CONVOS } from "../../gql"

function Game() {

    // //Grab our session user
    const sessionUser = useSelector((state) => state.session.user);

    const { gameId } = useParams();
    console.log('GAMEID', gameId)

    //grab current game
    const { loading: loadGame, error: gameError, data: gameData } = useQuery(GET_GAME, { variables: { gameId } } );

    //grab game convos
    const { loading: loadConvos, error: gameConvos, data: gameConvosData } = useQuery(GET_GAME_CONVOS, { variables: { gameId } } );

  if (loadGame) return <p>Loading...</p>;
  if (gameError) return <p>Error :( </p>;

    if (!gameData) {
        return (
        <p>No games found. :(</p>
        )
    }

    if (gameData && gameConvosData) {

        console.log('gameData', gameData)

        const gameDetails = gameData.game;

        return (
            <div>
                <p>Game Detail: {gameDetails.description}</p>
                <Messages gameData={gameData} gameConvosData={gameConvosData}></Messages>
            </div>
        )
    } else {
        return (
            <p>derp.</p>
        )
    }
}

export default Game;
