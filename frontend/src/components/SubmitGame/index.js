import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";


import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
import { SUBMIT_GAME, GET_GAME_CREATION_INFO  } from "../../gql";

function SubmitGame() {

    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState("");
    const [titleText, setTitle] = useState("");
    const [descriptionText, setDescription] = useState("");
    const [gameTypeId, setGameTypeId] = useState(1);
    const [gameLanguageId, setGameLanguageId] = useState(1);
    const [gameRulesetId, setGameRulesetId] = useState(1);
    const [gameLanguages, setGameLanguages] = useState([]);
    const [gameRulesets, setGameRulesets] = useState([]);
    const [gameTypes, setGameTypes] = useState([]);
    const updateGameTypeId = (e) => setGameTypeId(e.target.value);
    const updateGameLanguageId = (e) => setGameLanguageId(e.target.value);
    const updateGameRulesetId = (e) => setGameRulesetId(e.target.value);

     //grab available gameType, language, etc info from database
     const { loading, error, data } = useQuery(GET_GAME_CREATION_INFO);
     console.log('INFO:', data);


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
        if (data !== undefined) {
          console.log('DATA?', data)
          setGameLanguages(data.getGameCreationInfo.languages);
        setGameRulesets(data.getGameCreationInfo.rulesets);
        setGameTypes(data.getGameCreationInfo.gameTypes);
        }
    }, [sessionUser, data]);

    return (
      <div>
    <p>Derp.</p>

    {console.log('TYPES', gameTypes)}

      {data && <form onSubmit={handleSubmit}>
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
         <label>
           Game Type:
           {/* {console.log('TYPES', gameTypes)} */}
           <select value={gameTypeId} onChange={updateGameTypeId}>
            {gameTypes.map(gameType => <option value={1}>{gameType.type}</option>)}
            </select>
         </label>
         <label>
           Ruleset:
           <select value={gameRulesetId} onChange={updateGameRulesetId}>
             {gameRulesets.map(ruleset => <option value={ruleset.id}>{ruleset.ruleset}</option>)}
             </select>
         </label>
         <label>
           Language:
           <select value={gameLanguageId} onChange={updateGameLanguageId}>
             {gameLanguages.map(language => <option value={language.id}>{language.language}</option>)}
             </select>
         </label>
         <button type="submit">Send</button>
       </form>}
       </div>
    )
}

export default SubmitGame;
