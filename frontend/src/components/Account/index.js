import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Messages from "../Messages";
import { PubSub } from 'graphql-subscriptions';
import {
    useQuery, useMutation, useSubscription, InMemoryCache
  } from "@apollo/client";
import { GET_CURRENT_USER, CHANGE_EMAIL, CHANGE_PASSWORD } from "../../gql"

function Account() {
    // Grab our session user
const sessionUser = useSelector((state) => state.session.user);
const userId = sessionUser.id;

const { loading, data } = useQuery(GET_CURRENT_USER, { variables: { userId } });

const [email, setEmail] = useState("");
const [userName, setUserName] = useState("");
const [newEmail, setNewEmail] = useState("")
const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [changeEmailPassword, setChangeEmailPassword] = useState("");
const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
const [inputErrors, setInputErrors] = useState([]);

const [changeEmail, {error: emailError}] = useMutation(CHANGE_EMAIL, { variables: { userId, newEmail, changeEmailPassword }, errorPolicy: 'all'});

//errorpolicy must be set correctly for us to grab the errors and use them while still
//displaying the page.
const [changePassword, { error }] = useMutation(CHANGE_PASSWORD, { variables: { userId, oldPassword, newPassword }, errorPolicy: 'all'});

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
changeEmail(userId, newEmail, changeEmailPassword);
}

const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword === newPasswordConfirm) {
            changePassword(userId, newPassword, oldPassword);
    } else {
        setInputErrors([{message: "Password confirmation must match."}]);
        console.log("Password confirmation must match.")
    }
    e.preventDefault();
}

    return (
    <div>
    <p>Hello, {userName}!</p>
    <p>Your email: {email}</p>
    <p>Change email:</p>
    <form onSubmit={handleEmailSubmit}>
        <ul>
           {/* Make sure we have errors in order to avoid race conditions */}
           {emailError && emailError.graphQLErrors.map(({ message }, i) => (
         <li key={i}>{message}</li>
           ))}
           {inputErrors && inputErrors.map(({ message }, i) => (
        <li key={i}>{message}</li>
           ))}
         </ul>
         <label>
           New email address:
           <input
             type="text"
             value={newEmail}
             onChange={(e) => setNewEmail(e.target.value)}
             required
           />
         </label>
         <label>
           Confirm password:
           <input
             type="password"
             onChange={(e) => setChangeEmailPassword(e.target.value)}
             required
           />
         </label>
         <button type="submit">Change email</button>
        </form>

    <p>Change password:</p>
    <form onSubmit={handleNewPasswordSubmit}>
        <ul>
           {/* Make sure we have errors in order to avoid race conditions */}
           {error && error.graphQLErrors.map(({ message }, i) => (
        <li key={i}>{message}</li>
           ))}
           {inputErrors && inputErrors.map(({ message }, i) => (
        <li key={i}>{message}</li>
           ))}
         </ul>
         <label>
           Confirm old password:
           <input
             type="password"
             onChange={(e) => setOldPassword(e.target.value)}
             required
           />
         </label>
         <label>
           Enter new password:
           <input
             type="password"
             onChange={(e) => setNewPassword(e.target.value)}
             required
           />
         </label>
         <label>
           Confirm new password:
           <input
             type="password"
             onChange={(e) => setNewPasswordConfirm(e.target.value)}
             required
           />
         </label>
         <button type="submit">Change password</button>
        </form>
    </div>
    )

}

export default Account;
