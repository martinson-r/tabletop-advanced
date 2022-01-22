import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import {
    useLazyQuery, useMutation, useQuery
  } from "@apollo/client";
import { GET_CHARACTERSHEET_LIST_BY_PLAYER } from "../../gql"
import { v4 as uuidv4 } from 'uuid';

function CharacterSheetList() {

    const { playerId } = useParams();

    const sessionUser = useSelector((state) => state.session.user);
    const [userId, setUserId] = useState(null);
    const { data, loading } = useQuery(GET_CHARACTERSHEET_LIST_BY_PLAYER, { variables: { playerId } });


    useEffect(() => {
        setUserId(sessionUser.id);
    },[sessionUser, data]);

    if (data) {
        console.log(data);
    }

    if (loading) {
        return(
        <div>Loading...</div>
        )
    }

    if (data && !loading) {
        return (
            <div className="gray-backdrop">
                <div className="container">
                    {data.playercharactersheets.map(
                        sheet => <div key={uuidv4()}>
                            <div>{sheet.name}</div>
                            <div>{sheet.class}</div>
                            </div>
                    )}
                </div>
            </div>
        )
    }

}

export default CharacterSheetList;
