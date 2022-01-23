import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import {
    useLazyQuery, useMutation, useQuery
  } from "@apollo/client";
import { GET_FOLLOWED_PLAYERS } from "../../gql"

function FollowedGamesPlayers() {
    let playerId = 1;
    const { data, loading } = useQuery(GET_FOLLOWED_PLAYERS, { variables: { playerId } });

    console.log(data);

 return (
    //  TODO: List of followed games
     <div>Followed Games:</div>
 )
}

export default FollowedGamesPlayers;
