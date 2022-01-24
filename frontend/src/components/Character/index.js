import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    useQuery, useMutation, useLazyQuery
  } from "@apollo/client";
import { RETIRE_CHARACTER, GET_CHARACTER_BY_ID, UPDATE_CHARACTER, GET_CHARACTERSHEET_LIST_BY_PLAYER } from "../../gql"
import './character.css';
import { v4 as uuidv4 } from 'uuid';

function Character() {
// Grab our character
const { characterId } = useParams();
const sessionUser = useSelector((state) => state.session.user);
const [userId, setUserId] = useState(null);
const [playerId, setPlayerId] = useState(null);
const [name, setName] = useState("");
const [bio, setBio] = useState("");
const [imageUrl, setImageUrl] = useState("");
const [characterSheetId,setCharacterSheetId] = useState(0);
const [characterSheets, setCharacterSheets] = useState([]);
const [retireNote, setRetireNote] = useState('');
const [retireForm, setRetireForm] = useState(false);

const updateCharacterSheetId = (e) => setCharacterSheetId(e.target.value);

const [retireCharacter] = useMutation(RETIRE_CHARACTER, { variables: { userId, characterId, retireNote }} );

// Note: include user and game so if someone has gone directly to char, they can
// see what user plays them and game they are in
const { data } = useQuery(GET_CHARACTER_BY_ID, { variables: { characterId } });
const [updateCharacter, { data: updatedData }] = useMutation(UPDATE_CHARACTER);
const { data: characterSheetData } = useQuery(GET_CHARACTERSHEET_LIST_BY_PLAYER, { variables: { playerId }});

useEffect(() => {
    setUserId(sessionUser.id);
    setPlayerId(sessionUser.id);
    if (data !== undefined) {
        if (data.characterById) {
            setName(data.characterById.name);
            setBio(data.characterById.bio);
            setImageUrl(data.characterById.imageUrl);
            if (data.characterSheetId !== null) {
                setCharacterSheetId(data.characterSheetId);
            }
        }
    }
},[sessionUser, data]);

useEffect(() => {
    if (characterSheetData) {
            setCharacterSheets(characterSheetData.playercharactersheets);
    }
}, [characterSheetData])

useEffect(() => {
    if (updatedData) {
        setName(updatedData.updateCharacter.name);
        setBio(updatedData.updateCharacter.bio);
        setImageUrl(updatedData.updateCharacter.imageUrl);
        setCharacterSheetId(updatedData.updateCharacter.characterSheetId);
    }

},[updatedData]);

const submitRetire = (e) => {
    e.preventDefault();
    console.log('retire submitted')
    console.log(userId, characterId, retireNote);
    retireCharacter({ variables: { userId, characterId, retireNote } });
}

const showRetireForm = () => {
    setRetireForm(!retireForm);
}


const handleSubmit = (e) => {
    e.preventDefault();
    updateCharacter({ variables: { characterId, name, bio, imageUrl, characterSheetId } });


    const description = document.getElementById("character-description");
    const form = document.getElementById("edit-form");
    const button = document.getElementById("edit-button");
    form.classList.add("edit-form-hidden");
    button.classList.remove("edit-form-hidden");
    description.classList.remove("edit-form-hidden");

}

const edit = () => {
const description = document.getElementById("character-description");
const form = document.getElementById("edit-form");
const button = document.getElementById("edit-button");

if (form.classList.contains("edit-form-hidden")) {
    form.classList.remove("edit-form-hidden");
    button.classList.add("edit-form-hidden");
    description.classList.add("edit-form-hidden");
}
}

    return (
        <div className="gray-backdrop">
            <div className="container">

            {/* TODO: way to hook Character Sheet up to Character.
            Maybe a dropdown of player's existing sheets w/ associated character names */}


            {(data !== undefined &&
            (!data.characterById && (
                <div><p>Sorry, it looks like that character doesn't exist.</p></div>
            )
            )
    )}

            {(data !== undefined &&
                (data.characterById !== null && data.characterById !== undefined) && (<div><div id="character-description">
                    <img className="portrait" src={imageUrl} alt="Character portrait" />

                <p>{name}, played by {data.characterById.User.userName} in {data.characterById.Game.title}</p>
            <p>{bio}</p>
            <p><Link to={`/charactersheets/${data.characterById.characterSheetId}`}>Character Sheet</Link></p>
           {/* TODO: Retire Character */}
           {userId === parseInt(data.characterById.User.id) && (<div>
           <button onClick={showRetireForm}>Retire This Character</button>
           {retireForm === true && <form onSubmit={submitRetire}>
               {console.log('character id', characterId)}
                <label>Retire Note:</label>
                <input type="text"
                value={retireNote}
                onChange={(e) => setRetireNote(e.target.value)}
                required/>
                <button type="submit">Submit</button>
            </form>}
            </div>)}

            </div></div>))}
            {(data !== undefined && (parseInt(data.characterById.User.id) === userId) && (<div>

            <button id="edit-button" onClick={edit}>Edit</button>
            {/* TODO: button to create a new character sheet
            if this character does not have one */}
            {/* TODO: dropdown of existing character sheets to select from
            if this character does not have one */}
            <div id="edit-form" className="edit-form-hidden">
            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required/>
                <label>Bio</label>
                <input type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required/>
                <label>Portrait Image URL</label>
                <input type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required/>
                {/* Check to see if there are any character sheets available to choose from */}
                {characterSheets.length > 0 && (<div><label>Available character sheets:</label>
                <select value={characterSheetId} onChange={updateCharacterSheetId}>
                {characterSheets.map(sheet => <option key={uuidv4()} value={sheet.id}>{sheet.name}</option>)}
             </select></div>)}
                {/* TODO: cache user edits so they are not lost when creating new character sheet */}
                <div><Link to="/charactersheets/new">Create New Character Sheet</Link></div>
                <button type="submit">Save</button>
            </form>
            </div>
            </div>))}
        </div>
        </div>
    )

}

export default Character;
