import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
    gql, useLazyQuery, useMutation, useSubscription, InMemoryCache
  } from "@apollo/client";
  import { SIMPLE_SEARCH } from "../../gql";

function SearchResults() {
    const { text } = useParams();
    const [searchResults, setSearchResults] = useState("");
    // const dispatch = useDispatch();

    // May have to use redux for this bit
    // try to use Apollo cache
    // const tables = useSelector(state => state.tables.tableList);

    const [simpleSearch, { data, error, loading }] = useLazyQuery(SIMPLE_SEARCH);
    const [dedupedResults, setDedupedResults] = useState([]);



    useEffect(() => {
       simpleSearch( { variables: { text } } );
    },[text]);

    useEffect(() => {
    if (data !== undefined) {
        const elementsToDedupe = data.simpleSearch.wordsArray;
        const map = {};
        for (const element of elementsToDedupe) {
        map[element.id] = element;
        }
        const deduped = Object.values(map);
        setDedupedResults(deduped);
    }
    },[data])

    return (
        <>
        <div className="container">
        {dedupedResults !== undefined && (dedupedResults.map(results => results.map(indivResult => <div><Link to={`/game/${indivResult.id}/gameroom`}>{indivResult.title}</Link> - {indivResult.blurb}</div>)))}
        </div>
        </>
    )
}

export default SearchResults;
