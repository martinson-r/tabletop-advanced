import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    useQuery, useLazyQuery
  } from "@apollo/client";
import { GET_PAGINATED_GAMES, GET_RULESETS, GET_GENRES } from "../../gql"
import { v4 as uuidv4 } from 'uuid';
import './browsecategories.css';
import { getArgumentValues } from "graphql/execution/values";

function BrowseCategories() {

    //Grab our session user
    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState("");
    const [offset, setOffset] = useState(0);
    const [ruleSetId, setRuleSetId] = useState(null);
    const [genreId, setGenreId] = useState(null);

    const [paginatedGames, { loading, error, data: browsingData }] = useLazyQuery(GET_PAGINATED_GAMES);
    const { loading: rulesetsLoading, error: rulesetsError, data: rulesetsData } = useQuery(GET_RULESETS);
    const { loading: genresLoading, error: genresError, data: genresData } = useQuery(GET_GENRES);

    //TODO: query to get genres

    useEffect(() => {
        if (sessionUser !== undefined && sessionUser !== null) {
            setUserId(sessionUser.id);
        }
    },[sessionUser]);

    useEffect(() => {
        console.log('offset data', browsingData);
        console.log('ruleset data', rulesetsData);
    },[browsingData])


    useEffect(() => {
        if (offset !== undefined && offset !== null) {
            paginatedGames({variables: { offset: offset }})
        }
    },[]);


    useEffect(() => {

        fetchGames();

    },[offset]);

    useEffect(() => {

        fetchGames();

    },[ruleSetId]);

    useEffect(() => {

        fetchGames();

    },[genreId]);

    let fetchGames = () => {
        if (offset !== undefined && offset !== null) {

            //TODO: replace with switch statement...

            if (ruleSetId && genreId) {

                paginatedGames({variables: { offset: offset, genreId, ruleSetId }})

            } else if (ruleSetId && genreId === null) {
                console.log('Ruleset set to ', ruleSetId)

                paginatedGames({variables: { offset: offset, ruleSetId: ruleSetId }})

            } else if (genreId && ruleSetId === null) {

                paginatedGames({variables: { offset: offset, genreId }})

            } else {
                paginatedGames({variables: { offset: offset }})
            }
        }
    }

    let loadMoreGames = () => {
        setOffset(offset => offset+20);
    }

    let loadPrevGames = () => {
        if (offset >= 20) {
            setOffset(offset => offset-20);
        } else {
            setOffset(0)
        }
    }

    let showRulesets = () => {

        let rulesetsDiv = document.getElementById("rulesets");

        if (rulesetsDiv.classList.contains("hidden")) {
            console.log('click');
            rulesetsDiv.classList.remove("hidden");
        } else {
            rulesetsDiv.classList.add("hidden");
        }

    }


    let showGenres = () => {

        let genresDiv = document.getElementById("genres");

        if (genresDiv.classList.contains("hidden")) {
            console.log('click');
            genresDiv.classList.remove("hidden");
        } else {
            genresDiv.classList.add("hidden");
        }

    }

    return (
        <div>
            <div>
                <div>
                    <h3>Browse All Games</h3>
                    <p onClick={() => {
                    setRuleSetId(null);
                    setGenreId(null);
                    }}>Browse All</p>
                </div>

                <div>
                    <h3 onClick={showRulesets}>Filter by Ruleset</h3>
                    <div id="rulesets" className="hidden">
                    {rulesetsData?.rulesets?.map((ruleset) =>
                        <div onClick={() => {
                            setGenreId(null);
                            setRuleSetId(ruleset.id);
                        }}>
                    {ruleset.ruleset}
                    </div>)}
                    </div>
                </div>

                <div>
                    <h3 onClick={showGenres}>Filter by Genre</h3>
                    <div id="genres" className="hidden">
                    {genresData?.genres?.map((genre) =>
                        <div onClick={() => {
                            setRuleSetId(null);
                            setGenreId(genre.id);
                        }}>
                    {genre.name}
                    </div>)}
                    </div>
                </div>
            </div>

            <div>
                {browsingData
                && browsingData.paginatedGames?.rows?.map(
                    game =>
                    <div><Link to={`/game/${game.id}/gameroom`}>{game.title}</Link> presented by {game.host.userName}</div>)}
                <button onClick={loadPrevGames}>Prev</button>
                <button onClick={loadMoreGames}>Next</button>
            </div>
        </div>
    )

}

export default BrowseCategories
