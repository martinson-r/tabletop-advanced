import React, { useState, useEffect } from "react";
// import './Search.css';
import { useSelector, useDispatch } from "react-redux";
import {  useHistory } from "react-router-dom";
import "./SimpleSearch.css"
import {
  useLazyQuery, useMutation, useSubscription, InMemoryCache
} from "@apollo/client";

import { SIMPLE_SEARCH } from "../../gql";


const SimpleSearch = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [query, setQuery] = useState("");
  const updateQuery = (e) => setQuery(e.target.value);
  const [simpleSearch, { data, error, loading }] = useLazyQuery(SIMPLE_SEARCH);

  const submitForm = async (e) => {
    e.preventDefault();

    history.push(`/search/${query}`)
  };

  return (
    <div className="search-modal">
      <form onSubmit={submitForm}>
        <div className="search-bar-container">
        <input type="text" value={query} onChange={updateQuery} required></input>
          <button className="search-button"><i className="fas fa-search"></i></button>
        </div>
      </form>
    </div>
  );
};

export default SimpleSearch;
