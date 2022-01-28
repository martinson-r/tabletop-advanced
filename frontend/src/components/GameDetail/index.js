import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
    useQuery, useLazyQuery
  } from "@apollo/client";
import { GET_CURRENT_ACCOUNT } from "../../gql"
import { GET_PAGINATED_GAMES, GET_GENRES } from "../../gql"
import { v4 as uuidv4 } from 'uuid';
import './gamedetail.css';

function GameDetail(props) {

    const { game } = props;

    console.log('props', props);

    return (
        <div>
               <div><Link to={`/game/${game.id}/gameroom`}>{game.title}</Link></div>
               <div>presented by {game.host.userName}</div>
               <div>Last Updated At: (mm/dd) 2:05 pm <div className="live-game">Live</div></div>
               <div>{game.blurb}</div>
               <Link className="watch-game" to={`/game/${game.id}/gameroom`}>Watch Game</Link>
        </div>
    )

}

export default GameDetail;
