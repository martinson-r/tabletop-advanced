import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import {
  useLazyQuery, useMutation, useQuery
} from "@apollo/client";
import Cookies from 'js-cookie';

import { SIGNUP } from "../../gql";
import './signup.css';

function SignUp() {
    const history = useHistory();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState([]);

    const [registerUser, { data, loading, error }] = useMutation(SIGNUP, { variables: { userName, password, confirmPassword, email }} );

    console.log(data);

    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors([]);

      registerUser({ variables: { userName, email, password, confirmPassword }})
      .then((res) => {
        if (res.data.errors) {
                setErrors(res.data.errors)
              } else {
                console.log(res.data.registerUser)
                dispatch(sessionActions.loginUser(res.data.registerUser));
                history.push('/')
              }
      })

      //get errors to display
      //TODO: Errors for feedback about userName having to be unique
      // return dispatch(sessionActions.signup({ email, userName, password, confirmPassword }))
      //   .then(res => {
      //     if (res.data.errors) {
      //       setErrors(res.data.errors)
      //     } else {
      //       history.push('/')
      //     }
      //   });
  }

    return (
      <>
      <div className="login-form--body gray-backdrop">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          <label>
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Username
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Sign Up</button>
        </form>
        </div>
      </>
    );
  }

export default SignUp;
