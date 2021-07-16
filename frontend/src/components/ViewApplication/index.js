import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from 'react-router-dom';

//Query to get app.
//Display edit fields conditionally if app belongs to user.
//Don't display if user is not authorized (not GM or applicant)

import {
    useQuery, useMutation, useSubscription, useLazyQuery
  } from "@apollo/client";
import { GET_APPLICATION  } from "../../gql";

function ViewApplication() {

    const { applicantId } = useParams();
    const { gameId } = useParams();

    const { error, loading, data } = useQuery(GET_APPLICATION, { variables: {gameId, applicantId}});

    return (
        <>
        <p>Application</p>
        {data !== undefined && (<div><p>User name: {data.getApplication[0].applicant.userName}</p>
        <p>Why Join: {data.getApplication[0].whyJoin}</p>
        <p>Experience: {data.getApplication[0].experience}</p>
        <p>Character Name: {data.getApplication[0].charName}</p>
        <p>Character Concept: {data.getApplication[0].charConcept}</p>
        <button>Accept</button><button>Ignore</button>
        </div>)}
        </>

    )

}

export default ViewApplication;
