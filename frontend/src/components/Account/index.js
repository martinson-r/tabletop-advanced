import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Messages from "../Messages";
import { PubSub } from 'graphql-subscriptions';
import {
    useQuery, useMutation, useSubscription, InMemoryCache
  } from "@apollo/client";
import { GET_CURRENT_USER, CHANGE_EMAIL } from "../../gql"



function Account() {
    // Grab our session user
const sessionUser = useSelector((state) => state.session.user);
const userId = sessionUser.id;

const { loading, error, data } = useQuery(GET_CURRENT_USER, { variables: { userId } });
console.log('DATA', data)

const [email, setEmail] = useState("");
const [userName, setUserName] = useState("");
const [newEmail, setNewEmail] = useState("")
const [newPassword, setNewPassword] = useState("");

// { setEmail(changeEmail.changeEmail.email) }
const [changeEmail] = useMutation(CHANGE_EMAIL, { variables: { userId, newEmail }, onCompleted: changeEmail => console.log(changeEmail)});

useEffect(() => {
    //Sometimes the page renders before our data comes back.
    //We also may want to enable userName changes later.
    if (data !== undefined) {
        setEmail(data.user.email);
        setUserName(data.user.userName)
    }
    },[data])

const handleEmailSubmit = (e) => {
e.preventDefault();
changeEmail(userId, newEmail);
}

const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
}

    return (

    <div>
    <p>Hello, {userName}!</p>
    <p>Your email: {email}</p>
    <p>Change email:</p>
    <form onSubmit={handleEmailSubmit}>
         {/* <ul>
           {errors.map((error, idx) => (
             <li key={idx}>{error}</li>
           ))}
         </ul> */}
         <label>
           New email address:
           <input
             type="text"
             value={newEmail}
             onChange={(e) => setNewEmail(e.target.value)}
             required
           />
         </label>
         <button type="submit">Change email</button>
        </form>

    <p>Change password:</p>
    </div>
    )

}

export default Account;
