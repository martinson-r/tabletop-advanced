import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
    useQuery,
  } from "@apollo/client";
import { GET_CURRENT_ACCOUNT } from "../../gql"
import { GET_GAMES_WITH_RULESET } from "../../gql"
import { v4 as uuidv4 } from 'uuid';
import GameDetail from "../GameDetail";
import './rulesetpage.css';

function RuleSetPage() {

    const { rulesetid } = useParams();


    const { loading, error, data } = useQuery(GET_GAMES_WITH_RULESET, { variables: { rulesetid }});

    //TODO: Query to get all games with ruleset matching ID from params
    return (
        //TODO: map of all games from returned data
        <div>{data && !loading && (data.gamesWithRuleset.map(game =>
            <GameDetail game={ game }></GameDetail>
            ))}</div>
    )
}

export default RuleSetPage;
