import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import {
    useLazyQuery, useMutation, useQuery
  } from "@apollo/client";
import { v4 as uuidv4 } from 'uuid';
import { REMOVE_PLAYER } from "../../gql"

// TODO: Rename component something more appropriate
function RemovePlayer(props) {

    const { character, hostId, gameId, userId } = props;

    console.log(character);
    const [retireNote, setRetireNote] = useState('');
    const [playerId, setPlayerId] = useState(character.User.id);
    const [characterName, setCharacterName] = useState(character.name);

    const [removePlayer] = useMutation(REMOVE_PLAYER, { variables: { playerId, gameId, retireNote, userId }} );

      const submitRemove = (e) => {
        e.preventDefault();
        removePlayer({ variables: { playerId, gameId, retireNote, userId }});
        openRemoveMenu();
      }

    const openRemoveMenu = () => {
        console.log('playerId ', playerId);
        console.log('character name ', characterName)
        let noteDiv = document.getElementsByClassName(characterName)[0];
        if (noteDiv) {
          if (noteDiv.classList.contains('noDisplay')) {
            noteDiv.classList.remove('noDisplay');
            console.log('playerId after display ', playerId);
            console.log('character name after display ', characterName)
          } else {
            noteDiv.classList.add('noDisplay');
            setRetireNote('');
          }
        }
      }

 return (
     <div>
            <span key={uuidv4()} className={`${character.User.userName}`}>
              <Link to={`/${character.User.id}/bio`}>{character.User.userName}</Link>
              as <Link to={`/characters/${character.id}`}>{character.name}</Link>
              {/* TODO: Retired notes displayed for retired characters */}
              {/* <p>{character.retiredNote}</p> */}
              {hostId !== null && userId !== undefined && userId !== null && hostId && userId.toString() === hostId && character.retired === false && (<div><p>Remove this player from the game (this will retire their character as well)</p><button onClick={openRemoveMenu}>Remove</button></div>)}
              {userId !== undefined && userId !== null && userId.toString() === character.User.id && character.retired === false && (<div><p>Leave this game (this will retire their character as well)</p><button onClick={openRemoveMenu}>Leave</button></div>)}
                  {/* TODO: debug closing when typing */}
            </span>
            <div className={`removeForm noDisplay ${characterName}`}>
                <h2>Retire {characterName}</h2>
                <form onSubmit={submitRemove}>
                    <label for="retirenote">Retire Character Note:</label>
                    <input type="text"
                    name="retirenote"
                    value={retireNote}
                    onChange={(e) => setRetireNote(e.target.value)}
                    required
                    ></input>
                    <button type="submit">Submit</button>
                </form>
                </div>
     </div>
 )
}

export default RemovePlayer;
