import { useParams } from "react-router-dom";
import {
    useQuery
  } from "@apollo/client";
import { GET_CHARACTER_BY_ID } from "../../gql"
import './character.css';

function Character() {
// Grab our character
const { characterId } = useParams();

// Note: include user and game so if someone has gone directly to char, they can
// see what user plays them and game they are in
const { data } = useQuery(GET_CHARACTER_BY_ID, { variables: { characterId } });
    return (
        <div className="gray-backdrop">
            <div className="container">
            {(data !== undefined && !data.characterById) && (
                <div><p>Sorry, it looks like that character doesn't exist.</p></div>
            )}
            {(data !== undefined && data.characterById !== null) && (<div>
                <img src={data.characterById.imageUrl} alt="Character portrait" />
                <p>{data.characterById.name}, played by {data.characterById.User.userName} in {data.characterById.Game.title}</p>
            <p>{data.characterById.bio}</p>
            </div>)}
        </div>
        </div>
    )

}

export default Character;
