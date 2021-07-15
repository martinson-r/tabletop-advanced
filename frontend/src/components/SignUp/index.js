import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';


function SignUp() {
    const history = useHistory();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors([]);

      //get errors to display
      return dispatch(sessionActions.signup({ email, userName, password, confirmPassword }))
        .then(res => {
          if (res.data.errors) {
            setErrors(res.data.errors)
          } else {
            history.push('/')
          }
        });

  }

    return (
      <>
      <div className="login-form--body">
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
          {console.log('errors', errors)}
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
          <button type="submit">Log In</button>
        </form>
        </div>
      </>
    );
  }

export default SignUp;
