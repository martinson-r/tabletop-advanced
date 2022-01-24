import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import {
    useLazyQuery, useMutation, useQuery
  } from "@apollo/client";
import { GET_CHARACTERSHEET_BY_ID } from "../../gql"

import "./charactersheet.css";

function CharacterSheet() {

    const { characterSheetId } = useParams();
    const { data, loading } = useQuery(GET_CHARACTERSHEET_BY_ID, { variables: { characterSheetId } });

    console.log('data', data.characterSheet);
    console.log('character sheet id' , characterSheetId);

    if (loading || data === undefined) {
        return (
            <div>Loading...</div>
        )
    }

    if (data !== null && data !== undefined && !loading) {
        return (
            <div className="gray-backdrop">
                <div className="container">
                    <h3>Character Sheet for {data.characterSheet.name}</h3>
                    <p>Name: {data.characterSheet.name}</p>
                    <p>Class: {data.characterSheet.class}</p>
                    {/* TODO: form to edit and save Character Sheet */}
                    {/* TODO: way to hook Character Sheet up to Character */}
                </div>
            </div>
        )
    }
}

export default CharacterSheet;
