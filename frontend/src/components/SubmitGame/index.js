import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';


import {
    useQuery, useMutation, useSubscription
  } from "@apollo/client";
import { SUBMIT_GAME, GET_GAME_CREATION_INFO  } from "../../gql";

function SubmitGame() {


    const sessionUser = useSelector(state => state.session.user);
    const [userId, setUserId] = useState("");
    const history = useHistory();

    //Actual user selections
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [gameTypeId, setGameTypeId] = useState(1);
    const [gameLanguageId, setGameLanguageId] = useState(1);
    const [gameRulesetId, setGameRulesetId] = useState(1);

    //Info to populate form fields
    const [gameLanguages, setGameLanguages] = useState([]);
    const [gameRulesets, setGameRulesets] = useState([]);
    const [gameTypes, setGameTypes] = useState([]);
    const updateGameTypeId = (e) => setGameTypeId(e.target.value);
    const updateGameLanguageId = (e) => setGameLanguageId(e.target.value);
    const updateGameRulesetId = (e) => setGameRulesetId(e.target.value);

     //grab available gameType, language, etc info from database
     const { loading, error, data } = useQuery(GET_GAME_CREATION_INFO);

     //We also need to grab the data GraphQL returns.
     //We have to use a callback to get that sweet, sweet data out.
     //Then, we redirect the user to their new game.
    const [submitGame] = useMutation(SUBMIT_GAME, { variables: { userId, title, description, gameLanguageId, gameRulesetId, gameTypeId }, onCompleted: submitGame => { history.push(`/game/${submitGame.submitGame.id}`) }});


    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors([]);
      submitGame(userId, title, description, gameLanguageId, gameRulesetId, gameTypeId);
      //history.push(`/game/${submitGame.id}`)
    };

    useEffect(() => {
        if (sessionUser !== undefined && sessionUser !== null) {
            setUserId(sessionUser.id);
        }
        if (data !== undefined) {
        setGameLanguages(data.getGameCreationInfo.languages);
        setGameRulesets(data.getGameCreationInfo.rulesets);
        setGameTypes(data.getGameCreationInfo.gameTypes);
        }
    }, [sessionUser, data]);

    return (
      <div>
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
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             required
           />
         </label>
         <label>
           Description:
           <input
             type="text"
             value={description}
             onChange={(e) => setDescription(e.target.value)}
             required
           />
         </label>
         <label>
           Game Type:
           {/* {console.log('TYPES', gameTypes)} */}
           <select value={gameTypeId} onChange={updateGameTypeId}>
            {gameTypes.map(gameType => <option key={uuidv4()} value={1}>{gameType.type}</option>)}
            </select>
         </label>
         <label>
           Ruleset:
           <select value={gameRulesetId} onChange={updateGameRulesetId}>
             {gameRulesets.map(ruleset => <option key={uuidv4()} alue={ruleset.id}>{ruleset.ruleset}</option>)}
             </select>
         </label>
         <label>
           Language:
           <select value={gameLanguageId} onChange={updateGameLanguageId}>
             {gameLanguages.map(language => <option key={uuidv4()} value={language.id}>{language.language}</option>)}
             </select>
         </label>
         <button type="submit">Send</button>
       </form>}
       </div>
    )
}

export default SubmitGame;
