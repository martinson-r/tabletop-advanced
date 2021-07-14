import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Messages from "../Messages";
import { PubSub } from 'graphql-subscriptions';
import {
    useQuery, useMutation, useSubscription, InMemoryCache
  } from "@apollo/client";
import { GET_USER, GET_ABOUT, CHANGE_EMAIL, CHANGE_PASSWORD } from "../../gql"

function Bio() {
    // Grab our session user
const sessionUser = useSelector((state) => state.session.user);
const currentUserId = sessionUser.id;
const { userId } = useParams();

const { data, error, loading } = useQuery(GET_ABOUT, { variables: { userId }})

console.log('user', data)

return (
    <div>
    {data !== undefined && (<div><p>About {data.about[0].User.userName}:</p>
    {/* Conditional edit buttons based on whether user or not */}
    {/* Edit form fields directly */}
    {/* Toggle public display of information */}
    <p>{data.about[0].bio}</p></div>)}
    </div>
)

}

export default Bio;
