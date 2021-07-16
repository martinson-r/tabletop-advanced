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
import { GET_APPLICATION, APPROVE_APPLICATION, IGNORE_APPLICATION, EDIT_WAITLIST_APP  } from "../../gql";

function ViewApplication() {

    const history = useHistory();

    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState(null);
    const { applicantId } = useParams();
    const { gameId } = useParams();
    const [applicationId, setApplicationId] = useState(null);
    const [application, setApplication] = useState({});
    const [editApplication, setEditApplication] = useState(false);
    const [charName, setCharName] = useState("");
    const [charConcept, setCharConcept] = useState("");
    const [whyJoin, setWhyJoin] = useState("");
    const [experience, setExperience] = useState("");
    const [errors, setErrors] = useState([]);

    const [getApplication, { error, loading, data }] = useLazyQuery(GET_APPLICATION);
    const [approveApplication, {data:approveData}] = useMutation(APPROVE_APPLICATION);
    const [ignoreApplication, {data:ignoreData}] = useMutation(IGNORE_APPLICATION);
    const [editWaitlistApp, {data: editWaitlistData}] = useMutation(EDIT_WAITLIST_APP, { variables: { applicationId, userId, charName, charConcept, experience, whyJoin, gameId } } );


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
            setApplication(data.getApplication[0].applicant[0].Applications[0]);
            setApplicationId(data.getApplication[0].applicant[0].Applications[0].id);
            if (userId === null || (userId.toString() !== applicantId.toString() && userId.toString() !== data.getApplication[0].applicant[0].Applications[0].hostId.toString())) {
                history.push('/')
            }
        }
    },[data]);

    useEffect(() => {
        if (Object.keys(application).length !== 0) {
            setCharName(application.charName);
            setCharConcept(application.charConcept);
            setWhyJoin(application.whyJoin);
            setExperience(application.experience);
        }
    },[application])

    const handleApproveApplication = (e) => {
        approveApplication({ variables: { applicationId }});
    };

    const handleIgnoreApplication = (e) => {
        ignoreApplication({ variables: { applicationId }});
    }

    const editApplicationButton = () => {
        setEditApplication(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        editWaitlistApp(applicationId, userId, charName, charConcept, experience, whyJoin);
        setEditApplication(false);
      };

      console.log('edit data', editWaitlistData)

    return (
        <>
        <p>Application</p>
        {/* TODO: Make this less ugly */}
        {data !== undefined && Object.keys(application).length !== 0 && (<div><p>User name: {application.applicationOwner[0].userName}</p>
        {application.accepted.toString() === 'true' && (<p><i>This application has been approved.</i></p>)}
        {application.ignored.toString() === 'true' && application.accepted.toString() !== 'true' && (<p><i>This application has been ignored.</i></p>)}
        {/* Display text or form depending on if the applicant wishes to edit the application. */}
        {editApplication.toString() === 'false' && (<div>
        <p>Why Join: {application.whyJoin}</p>
        <p>Experience: {application.experience}</p>
        <p>Character Name: {application.charName}</p>
        <p>Character Concept: {application.charConcept}</p>
        <button onClick={editApplicationButton}>Edit Application</button>
        </div>)}
        {editApplication.toString() === 'true' && (
            <form onSubmit={handleSubmit}>
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
            <label>
              Character Name:
              <input
                type="text"
                value={charName}
                onChange={(e) => setCharName(e.target.value)}
                required
              />
            </label>
            <label>
              Character Concept:
              <input
                type="text"
                value={charConcept}
                onChange={(e) => setCharConcept(e.target.value)}
                required
              />
            </label>
            <label>
              Why do you want to join this game?:
              <input
                type="text"
                value={whyJoin}
                onChange={(e) => setWhyJoin(e.target.value)}
                required
              />
            </label>
            <label>
              What kind of tabletop role playing game experience do you have?:
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              />
            </label>
            <button type="submit">Send</button>
          </form>
        )
        }
        {/* Check if user is host before displaying approve/ignore buttons */}
        {userId.toString() === application.hostId.toString() && (
            <div>{application.accepted.toString() !== 'true' && (<button onClick={handleApproveApplication}>Approve</button>)}
            {application.ignored.toString() !== 'true' && application.accepted.toString() !== 'true' && (<button onClick={handleIgnoreApplication}>Ignore</button>)}</div>
        )}
        </div>)}
        </>

    )

}

export default ViewApplication;
