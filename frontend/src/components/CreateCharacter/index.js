import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import { PubSub } from 'graphql-subscriptions';
import {
    useLazyQuery, useMutation, useSubscription, InMemoryCache
  } from "@apollo/client";
  import { SUBMIT_CHARACTER_CREATION  } from "../../gql";

  function CreateCharacter() {
    // Grab our session user
const sessionUser = useSelector((state) => state.session.user);
const userId = sessionUser.id;
const [name, setName] = useState("");
const [bio, setBio] = useState("");
const [imageUrl, setImageUrl] = useState("");
const { gameId } = useParams();
const [errors, setErrors] = useState([]);
const history = useHistory();

const [submitCharacterCreation] = useMutation(SUBMIT_CHARACTER_CREATION, { variables: { userId, name, bio, imageUrl, gameId }, onCompleted: submitCharacterCreation => {  history.push(`/characters/${submitCharacterCreation.submitCharacterCreation.id}`) } } );

const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    submitCharacterCreation(userId, gameId, name, bio, imageUrl);
  };

    return (
        <div>
            <p>Create Character:</p>
            {/* TODO: create character form */}
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
                <button type="submit">Submit</button>
            </form>
            {/* TODO: character form changes depending on ruleset selected */}
        </div>
    )

}

export default CreateCharacter;
