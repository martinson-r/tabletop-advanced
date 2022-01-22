import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    useQuery, useMutation
  } from "@apollo/client";
import { GET_CHARACTER_BY_ID, UPDATE_CHARACTER } from "../../gql"
import './character.css';

function Character() {
// Grab our character
const { characterId } = useParams();
const sessionUser = useSelector((state) => state.session.user);
const [userId, setUserId] = useState(null);
const [name, setName] = useState("");
const [bio, setBio] = useState("");
const [imageUrl, setImageUrl] = useState("");



// Note: include user and game so if someone has gone directly to char, they can
// see what user plays them and game they are in
const { data } = useQuery(GET_CHARACTER_BY_ID, { variables: { characterId } });
const [updateCharacter, { data: updatedData }] = useMutation(UPDATE_CHARACTER);

useEffect(() => {
    setUserId(sessionUser.id);
    if (data !== undefined) {
        if (data.characterById) {
            setName(data.characterById.name);
            setBio(data.characterById.bio);
            setImageUrl(data.characterById.imageUrl);
        }
    }

},[sessionUser, data]);

useEffect(() => {
    if (updatedData) {
        setName(updatedData.updateCharacter.name);
        setBio(updatedData.updateCharacter.bio);
        setImageUrl(updatedData.updateCharacter.imageUrl);
        console.log('name', name)
    }

},[updatedData])

const handleSubmit = (e) => {
    e.preventDefault();
    // setErrors([]);
    updateCharacter({ variables: { characterId, name, bio, imageUrl } });

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
            </div></div>))}
            {(data !== undefined && (parseInt(data.characterById.User.id) === userId) && (<div>

            <button id="edit-button" onClick={edit}>Edit</button>
            {/* TODO: create character form */}
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
                <button type="submit">Save</button>
            </form>
            </div>
            </div>))}
        </div>
        </div>
    )

}

export default Character;
