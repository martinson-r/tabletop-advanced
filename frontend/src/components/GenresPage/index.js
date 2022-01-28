import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
    useQuery, useLazyQuery
  } from "@apollo/client";
import { GET_CURRENT_ACCOUNT } from "../../gql"
import { GET_PAGINATED_GAMES, GET_GENRES } from "../../gql"
import GameDetail from "../GameDetail";
import { v4 as uuidv4 } from 'uuid';
import './genrespage.css';

function GenresPage() {

    const { genreId } = useParams();

    console.log('genreid', genreId)
    const [offset, setOffset] = useState(0);

    const [paginatedGames, { loading, error, data }] = useLazyQuery(GET_PAGINATED_GAMES);
    const { loading: genresLoading, error: genresError, data: genresData } = useQuery(GET_GENRES)
    useEffect(() => {
        if (offset !== undefined && offset !== null && genreId) {
            paginatedGames({variables: { offset: offset, genreId: genreId }})
        }

        console.log('genres data', genresData)
    },[]);

    useEffect(() => {
        if (offset !== undefined && offset !== null && genreId) {
            paginatedGames({variables: { offset: offset, genreId: genreId }})
        }
    },[offset]);

    useEffect(() => {

        paginatedGames({variables: { offset: offset, genreId: genreId }})

    },[genreId]);


    //TODO: Query to get all games with ruleset matching ID from params
    return (
        //TODO: map of all games from returned data
        // <div>
        //     <h3>Switch Genre</h3>
        //     {genresData?.genres?.map(genre =>

        //     <div>
        //         {genre.name}{console.log('genre data', genresData)}
        //     </div>)}
        // </div>
        <div>
            {data?.paginatedGames?.rows.map(game =>
            <GameDetail game={ game }></GameDetail>
            )}
        </div>
    )
}

export default GenresPage;
