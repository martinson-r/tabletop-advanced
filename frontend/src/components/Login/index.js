import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import {
  useLazyQuery, useMutation, useQuery
} from "@apollo/client";
import Cookies from 'js-cookie';

import { LOGIN } from "../../gql";
import { useEffect } from "react";
import ConversationList from "../ConversationList";

function Login() {
    const history = useHistory();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [inputErrors, setInputErrors] = useState([]);

    const [login, { data, loading, error }] = useMutation(LOGIN, { variables: { userName, password }} );

    const setCookie = () => {
      Cookies.set('token', data.login.token);
    }

    //console.log(data);

    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors([]);

      login({variables: { userName, password }}).then((res) => {
        if (res.data.errors) {
            console.log(res.data.errors);
          } else {
            console.log(res.data);
            dispatch(sessionActions.loginUser(res.data));
            history.push('/');
        }
      })

      ;
      // return dispatch(sessionActions.login({ userName, password }))
      // .then((res) => {
      //     if (res.data.errors) {
      //       setErrors(res.data.errors);
      //   } else {

        //}
      //}
      //);
    };

    useEffect(() => {

      if (data !== undefined && data !== null) {
        if (!error) {
          setCookie(data.login.token);
        }
      }
    }, [data])
    console.log(data);
    return (
      <>
      <div className="login-form--body gray-backdrop">
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
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
          <button type="submit">Log In</button>
        </form>
        </div>
      </>
    );
  }

export default Login;
