import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, Link } from 'react-router-dom';
import './ViewApplication.css';

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
    const { applicationId } = useParams();
    const { gameId } = useParams();
    const [applicantId, setApplicantId] = useState(null);
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

    useEffect(() => {
        getApplication({ variables: {gameId, applicationId}})
    },[]);

    useEffect(() => {
        if (sessionUser !== undefined && sessionUser !== null) {
            setUserId(sessionUser.id)
        }
    },[sessionUser]);

    useEffect(() => {
        if (data !== undefined) {
            setApplication(data.getApplication[0]);
            // Check if application object is not null, then check if user is host or applicant
            // If not, push them to main page.
            if (Object.keys(application).length !== 0 && applicantId !== undefined && applicantId !== null) {
              if (userId === null || (userId.toString() !== applicantId.toString() && userId.toString() !== application.Games[0].host.id.toString())) {
                history.push('/')
            }
            }
        }
    },[data]);

    useEffect(() => {
        if (Object.keys(application).length !== 0) {
            setCharName(application.charName);
            setCharConcept(application.charConcept);
            setWhyJoin(application.whyJoin);
            setExperience(application.experience);
            setApplicantId(application.applicationOwner[0].id);
        }
    },[application]);

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

    return (
        <div className="container">
          <div className="gray-backdrop">
        {data !== undefined && Object.keys(application).length !== 0 && (<div><Link to={`/game/${application.Games[0].id}/gameroom`}>Back to Game: {application.Games[0].title}</Link>
        <h2><Link to={`/${application.applicationOwner[0].id}/bio`}>{application.applicationOwner[0].userName}'s</Link> Application</h2>
        {/* TODO: Make this less ugly */}

        {application.accepted.toString() === 'true' && (<p><i>This application has been approved.</i></p>)}
        {application.ignored.toString() === 'true' && application.accepted.toString() !== 'true' && (<i>This application has been ignored.</i>)}
        {/* Display text or form depending on if the applicant wishes to edit the application. */}
        {editApplication.toString() === 'false' && (<div>
        <p><b>Why Join:</b> {application.whyJoin}</p>
        <p><b>Experience:</b> {application.experience}</p>
        <p><b>Character Name:</b> {application.charName}</p>
        <p><b>Character Concept:</b> {application.charConcept}</p>
        {application !== undefined && application.applicationOwner[0].id.toString() === userId.toString() && (<button onClick={editApplicationButton}>Edit Application</button>)}
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
        {userId.toString() === application.Games[0].host.id.toString() && (
            <div>{application.accepted.toString() !== 'true' && (<button onClick={handleApproveApplication}>Accept</button>)}
            {application.ignored.toString() !== 'true' && application.accepted.toString() !== 'true' && (<button onClick={handleIgnoreApplication}>Ignore</button>)}</div>
        )}
        </div>)}
        </div>
        </div>

    )

}

export default ViewApplication;
