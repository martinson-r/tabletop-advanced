import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    useQuery, useLazyQuery
  } from "@apollo/client";
import { GET_PAGINATED_GAMES, GET_RULESETS } from "../../gql"
import { v4 as uuidv4 } from 'uuid';
import './browsecategories.css';
import { getArgumentValues } from "graphql/execution/values";

function BrowseCategories() {

    //Grab our session user
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState("");
    const [offset, setOffset] = useState(0);

    const [paginatedGames, { loading, error, data: browsingData }] = useLazyQuery(GET_PAGINATED_GAMES);
    const { loading: rulesetsLoading, error: rulesetsError, data: rulesetsData } = useQuery(GET_RULESETS);

    useEffect(() => {
        if (sessionUser !== undefined && sessionUser !== null) {
            setUserId(sessionUser.id);
        }
    },[sessionUser]);

    useEffect(() => {
        console.log('offset data', browsingData);
    },[browsingData])

    useEffect(() => {
        if (offset !== undefined && offset !== null) {
            paginatedGames({variables: { offset: offset }})
        }
    },[]);


    useEffect(() => {
        if (offset !== undefined && offset !== null) {
            paginatedGames({variables: { offset: offset }})
        }
    },[offset]);

    let loadMoreGames = () => {
        setOffset(offset => offset+2);
    }

    return (
        <div>

            {browsingData && browsingData.paginatedGames.rows?.map(game => <div>{game.title} presented by {game.host.userName}</div>
            )}
            <button onClick={loadMoreGames}>Load more</button>
        </div>
    )

}

export default BrowseCategories
