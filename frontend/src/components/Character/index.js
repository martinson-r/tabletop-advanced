import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import { PubSub } from 'graphql-subscriptions';
import {
    useLazyQuery, useMutation, useSubscription, InMemoryCache, useQuery
  } from "@apollo/client";
import { GET_CHARACTER_BY_ID } from "../../gql"

function Character() {
// Grab our session user
const sessionUser = useSelector((state) => state.session.user);
const { characterId } = useParams();

// Note: include user and game so if someone has gone directly to char, they can
// see what user plays them and game they are in
const { loading, error, data } = useQuery(GET_CHARACTER_BY_ID, { variables: { characterId } });
    return (
        <div className="gray-backdrop">
            <div className="container">
            {(data !== undefined && !data.characterById) && (
                <div><p>Sorry, it looks like that character doesn't exist.</p></div>
            )}
            {(data !== undefined && data.characterById !== null) && (<div>
                <img src={data.characterById.imageUrl} />
                <p>Name: {data.characterById.name}, played by: {data.characterById.User.userName} in {data.characterById.Game.title}</p>
            <p>{data.characterById.bio}</p>
            </div>)}


        </div>
        </div>
    )

}

export default Character;
