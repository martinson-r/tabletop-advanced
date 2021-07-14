import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Messages from "../Messages";
import { PubSub } from 'graphql-subscriptions';
import {
    useQuery, useMutation, useSubscription, InMemoryCache
  } from "@apollo/client";
import { GET_CURRENT_USER, CHANGE_EMAIL, CHANGE_PASSWORD } from "../../gql"

function Bio() {
    // Grab our session user
const sessionUser = useSelector((state) => state.session.user);
const userId = sessionUser.id;

return (
    <div>
    <p>About Me:</p>
    {/* Conditional edit buttons based on whether user or not */}
    {/* Edit form fields directly */}
    {/* Toggle public display of information */}
    <p>Display, edit bio etc</p>
    </div>
)

}

export default Bio;
