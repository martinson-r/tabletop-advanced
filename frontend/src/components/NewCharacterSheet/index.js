import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import {
    useLazyQuery, useMutation, useQuery
  } from "@apollo/client";
import { CREATE_CHARACTERSHEET } from "../../gql"
import "./newcharactersheet.css";

function NewCharacterSheet() {

    const sessionUser = useSelector((state) => state.session.user);
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState("");
    const [characterClass, setCharacterClass] = useState("");

    useEffect(() => {
        setUserId(sessionUser.id);
    },[sessionUser]);

    const [createCharacterSheet, { data }] = useMutation(CREATE_CHARACTERSHEET);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('userId', userId)
        createCharacterSheet({ variables: { name, userId, characterClass } });
        // setErrors([]);
    }

    return (
        <div className="gray-backdrop">
            <div className="container">
                {/* TODO: form to create a new character sheet */}
                <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required/>
                <label>Class</label>
                <input type="text"
                value={characterClass}
                onChange={(e) => setCharacterClass(e.target.value)}
                required/>
                <button type="submit">Save</button>
            </form>
            </div>
        </div>
    )
}

export default NewCharacterSheet;
