import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import { PubSub } from 'graphql-subscriptions';
import {
    useLazyQuery, useMutation, useSubscription, InMemoryCache
  } from "@apollo/client";

  function CreateCharacter() {
    // Grab our session user
const sessionUser = useSelector((state) => state.session.user);
const currentUserId = sessionUser.id;
const { userId } = useParams();

    return (
        <div>

        </div>
    )

}

export default CreateCharacter;
