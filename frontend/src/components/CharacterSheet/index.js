import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import {
    useLazyQuery, useMutation, useQuery
  } from "@apollo/client";
import { GET_CHARACTERSHEET_BY_ID } from "../../gql"

import "./charactersheet.css";

function CharacterSheet() {

    const { charactersheetid } = useParams();
    const { data, loading } = useQuery(GET_CHARACTERSHEET_BY_ID, { variables: { charactersheetid } });

    console.log(data);

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (data && !loading) {
        return (
            <div className="gray-backdrop">
                <div className="container">
                    <h3>Character Sheet for {data.charactersheet.name}</h3>
                    <p>Name: {data.charactersheet.name}</p>
                    <p>Class: {data.charactersheet.class}</p>
                    {/* TODO: form to edit and save Character Sheet */}
                    {/* TODO: way to hook Character Sheet up to Character */}
                </div>
            </div>
        )
    }
}

export default CharacterSheet;
