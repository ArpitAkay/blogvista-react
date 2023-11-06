import React, { useState } from 'react'
import './Login.css'
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateAuth } from '../../redux/slices/AuthSlice.js'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEmail = (event) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
    const emailElem = document.getElementById("email");
    emailValue.match("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[a-zA-Z]{2,}$")
      ? emailElem.classList.add("is-valid")
      : emailElem.classList.remove("is-valid");
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    const loginReq = {
      email: email,
      password: password,
    };

    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_AUTHENTICATION_ENDPOINT + process.env.REACT_APP_LOGIN;

    const response = await WebServiceInvokerRest(
      hostname,
      urlContent,
      "POST",
      null,
      loginReq,
      null
    );

    if (response.status === 200) {
      dispatch(
        updateAuth({
          type: "LoggedIn",
          state: {
            name: response.data.name,
            email: response.data.email,
            authToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            role: response.data.roles[0].roleName
          },
        })
      );
      navigate("/");
    } else {
      props.showToast("Failed", response.data.detail)
    }
    setLoading(false);
  };

  const handleGoogleLogin = async (idTokenString) => {
    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_AUTHENTICATION_ENDPOINT + process.env.REACT_APP_GOOGLE_LOGIN;

    const googleSignInParams = {
      idTokenString: idTokenString,
    };

    const response = await WebServiceInvokerRest(
      hostname,
      urlContent,
      "POST",
      null,
      null,
      googleSignInParams
    );

    if (response.status === 200) {
      dispatch(
        updateAuth({
          type: "LoggedIn",
          state: {
            name: response.data.name,
            email: response.data.email,
            authToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            role: response.data.roles[0].roleName
          },
        })
      );
      navigate("/");
    } else {
      props.showToast("Failed", "Login Failed");
    }
  };

  return (
    <div className="login-div">
      <div className="d-flex flex-row justify-content-center" style={{ position: "relative", top: "15%" }}>
        <form className="border shadow rounded-4 p-5" onSubmit={handleLoginSubmit}>
          <h4 className="text-primary"><i>Login to your account</i></h4>
          <div className="my-3">
            <label htmlFor="email" className="form-label">
              <i>Email</i>
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={handleEmail}
              required
            />
          </div>
          <div className="mb-1">
            <label htmlFor="password" className="form-label">
              <i>Password</i>
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={handlePassword}
              required
            />
          </div>
          <div className="mb-3 d-flex flex-column align-items-end">
            <button type="button" className="btn text-primary p-0" id="forget-password" style={{ border: "none" }} onClick={() => navigate("/forgetPassword")}>
              <i>Forget password?</i>
            </button>
            <button type="button" className="btn text-primary p-0" id="verify-account" style={{ border: "none" }} onClick={() => navigate("/verifyEmail")}>
              <i>Verify your account?</i>
            </button>
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-sm btn-primary" disabled={email.length === 0 || password.length === 0 || loading}>
              <span className={`${loading ? "spinner-border" : ""} spinner-border-sm`} aria-hidden="true"></span>
              <span className={loading ? "visually-hidden" : ""} role="status"><i>Login</i></span>
            </button>
          </div>
          <div className="d-flex flex-column align-items-center">
            <p className="m-2">or</p>
            <GoogleOAuthProvider clientId="645561507231-9h880rl8j5aske5c52c49epfjgukp034.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleGoogleLogin(credentialResponse.credential);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                useOneTap
                auto_select={true}
              />
            </GoogleOAuthProvider>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
