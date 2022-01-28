import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import {
    useQuery
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
                    {console.log('data', data)}
                    {data !== null && data !== undefined && data.playercharactersheets.map(
                        sheet => <div key={uuidv4()}>
                            <Link to={`/charactersheets/${sheet.id}`}><div>{sheet.name}</div></Link>
                            <div>Level {sheet.level} {sheet.class}</div>
                            {/* TODO: sheet created on date & time displayed along with character level */}
                            </div>
                    )}
                    <p><Link to="/charactersheets/new">Create a new character sheet</Link></p>
                </div>
            </div>
        )
    }

}

export default CharacterSheetList;
