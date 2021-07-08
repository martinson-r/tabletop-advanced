import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";


import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
import { SUBMIT_GAME  } from "../../gql";

function SubmitGame({...props}) {


    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState("");
    const [titleText, setTitle] = useState("");
    const [descriptionText, setDescription] = useState("");

    //const [updateMessages] = useMutation(SEND_MESSAGE_TO_GAME, { variables: { gameId, userId, messageText } } );
    const [submitGame] = useMutation(SUBMIT_GAME, { variables: { titleText, userId, descriptionText } } );

    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors([]);
        submitGame(userId, titleText, descriptionText)
    };

    useEffect(() => {
        if (sessionUser) {
            setUserId(sessionUser._id);
        }
    }, [sessionUser]);

    return (
      <div>
    <p>Derp.</p>

      <form onSubmit={handleSubmit}>
         <ul>
           {errors.map((error, idx) => (
             <li key={idx}>{error}</li>
           ))}
         </ul>
         <label>
           Title:
           <input
             type="text"
             value={titleText}
             onChange={(e) => setTitle(e.target.value)}
             required
           />
         </label>
         <label>
           Description:
           <input
             type="text"
             value={descriptionText}
             onChange={(e) => setDescription(e.target.value)}
             required
           />
         </label>
         <button type="submit">Send</button>
       </form>
       </div>
    )
}

export default SubmitGame;
