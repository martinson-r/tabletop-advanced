import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from 'react-router-dom';


//Query to get app.
//Display edit fields conditionally if app belongs to user.
//Don't display if user is not authorized (not GM or applicant)

import {
    useQuery, useLazyQuery, useMutation, useSubscription
  } from "@apollo/client";
import { GET_APPLICATION, APPROVE_APPLICATION, IGNORE_APPLICATION  } from "../../gql";

function ViewApplication() {

    const history = useHistory();

    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState(null);
    const { applicantId } = useParams();
    const { gameId } = useParams();
    const [applicationId, setApplicationId] = useState(null);
    const [application, setApplication] = useState({});
    const [applicationHandled, setApplicationHandled] = useState(false);

    const [getApplication, { error, loading, data }] = useLazyQuery(GET_APPLICATION);
    const [approveApplication, {data:approveData}] = useMutation(APPROVE_APPLICATION);
    const [ignoreApplication, {data:ignoreData}] = useMutation(IGNORE_APPLICATION);


    //TODO: Update on approval or ignore, whyyyy doesn't anything I try work
    //It's coming back false even though it is true in Postgres

    useEffect(() => {
        getApplication({ variables: {gameId, applicantId}})
    },[]);

    useEffect(() => {
        if (sessionUser !== undefined && sessionUser !== null) {
            setUserId(sessionUser.id)
        }
    },[sessionUser])

    useEffect(() => {
        if (data !== undefined) {
            setApplication(data.getApplication[0].applicant[0].Applications[0])
            setApplicationId(data.getApplication[0].applicant[0].Applications[0].id)
            console.log(userId)
            console.log(data.getApplication[0].applicant[0].Applications[0].hostId)
            if (userId === null || (userId.toString() !== applicantId.toString() && userId.toString() !== data.getApplication[0].applicant[0].Applications[0].hostId.toString())) {
                console.log('boop')
                history.push('/')
            }
        }
    },[data]);

    const handleApproveApplication = (e) => {
        approveApplication({ variables: { applicationId }});
        setApplicationHandled(true)
        console.log(applicationHandled)
    };

    const handleIgnoreApplication = (e) => {
        ignoreApplication({ variables: { applicationId }});
        setApplicationHandled(true)
        console.log(applicationHandled)
    }

    console.log(data)
    console.log(approveData)
    return (
        <>
        <p>Application</p>
        {data !== undefined && application !== undefined && (<div><p>User name: {data.getApplication[0].applicant[0].Applications[0].applicationOwner[0].userName}</p>
        {console.log(data.getApplication[0].applicant[0].Applications[0].ignored)}
        {data.getApplication[0].applicant[0].Applications[0].accepted.toString() === 'true' && (<p><i>This application has been approved.</i></p>)}
        {data.getApplication[0].applicant[0].Applications[0].ignored.toString() === 'true' && data.getApplication[0].applicant[0].Applications[0].accepted.toString() !== 'true' && (<p><i>This application has been ignored.</i></p>)}
        <p>Why Join: {application.whyJoin}</p>
        <p>Experience: {application.experience}</p>
        <p>Character Name: {application.charName}</p>
        <p>Character Concept: {application.charConcept}</p>

        {/* TODO: Buttons only visible to host */}
        {data.getApplication[0].applicant[0].Applications[0].accepted.toString() !== 'true' && (<button onClick={handleApproveApplication}>Approve</button>)}
        {data.getApplication[0].applicant[0].Applications[0].ignored.toString() !== 'true' && data.getApplication[0].applicant[0].Applications[0].accepted.toString() !== 'true' && (<button onClick={handleIgnoreApplication}>Ignore</button>)}
        </div>)}
        </>

    )

}

export default ViewApplication;
