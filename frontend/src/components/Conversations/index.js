import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Messages from "../Messages";

import {
    useQuery,
  } from "@apollo/client";
import { GET_NON_GAME_NON_SPEC_CONVOS } from "../../gql"

function Conversation() {
    const sessionUser = useSelector((state) => state.session.user);
    const [userId, setUserId] = useState("");

    const [accounts, setAccount] = useState([]);
    const [loadingData, setLoading] = useState([]);
    const [errorData, setError] = useState([]);

    //grab non-game non-spectator convos
    const { loading: loadConvos, error: nonGameConvosError, data: nonGameConvosData } = useQuery(GET_NON_GAME_NON_SPEC_CONVOS, { variables: { userId } } );

    useEffect(() => {
        //Make sure we have ALL of our data

        if (loadConvos) {
            setLoading(loadConvos);
        }
        if (nonGameConvosError) {
            setError(nonGameConvosError);
        }
        if (nonGameConvosData) {
            setAccount(nonGameConvosData);
        }
        if (sessionUser) {
            setUserId(sessionUser._id);
            console.log('USERID', userId)
        }
    }, []);

    if (loadConvos) return <p>Loading...</p>;
  if (nonGameConvosError) return <p>Error :( </p>;

    if (!nonGameConvosData) {
        return (
        <p>No conversations found.</p>
        )
    }

    if (nonGameConvosData) {

        console.log('Non Game Convos Data', nonGameConvosData)

        return (
            <div>
                <p>TBD: Non Game Conversations</p>
                {/* <p>Game Detail: {gameDetails.description}</p>
                <Messages gameData={gameData} gameConvosData={gameConvosData}></Messages> */}
            </div>
        )
    } else {
        return (
            <p>derp.</p>
        )
    }
};

export default Conversation;
