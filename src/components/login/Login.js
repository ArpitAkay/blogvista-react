import React, { useState } from "react";
import "./Login.css";
import { WebServiceInvokerRest } from "../../util/WebServiceInvoker";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateAuth } from "../../redux/slices/AuthSlice.js";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    const spinnerElem = document.getElementsByTagName("span")[0];
    const textElem = document.getElementsByTagName("span")[1];
    spinnerElem.classList.add("spinner-border");
    textElem.classList.add("visually-hidden");

    event.preventDefault();
    const requestBody = {
      email: email,
      password: password,
    };

    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent =
      process.env.REACT_APP_AUTHENTICATION_ENDPOINT +
      process.env.REACT_APP_LOGIN;

    const response = await WebServiceInvokerRest(
      hostname,
      urlContent,
      "POST",
      requestBody
    );

    spinnerElem.classList.remove("spinner-border");
    textElem.classList.remove("visually-hidden");

    if (response.status === 200) {
      console.log(response);
      dispatch(
        updateAuth({
          type: "LoggedIn",
          state: {
            name: response.data.name,
            email: response.data.email,
            authToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          },
        })
      );
      navigate("/");
    } else {
      props.showToast("Failed", response.data.detail)
    }
  };

  return (
    <div className="login-div">
      <div className="d-flex flex-row justify-content-center" style={{ position: "relative", top: "20%" }}>
        <form className="border border-primary rounded-4 p-5" onSubmit={handleLoginSubmit}>
          <h4 className="text-primary">Login to your account</h4>
          <div className="my-3">
            <label htmlFor="email" className="form-label">
              Email
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
              Password
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
              Forget password?
            </button>
            <button type="button" className="btn text-primary p-0" id="verify-account" style={{ border: "none" }} onClick={() => navigate("/forgetPassword")}>
              Verify your account?
            </button>
          </div>
          <div className="mb-3 d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">
              <span className="spinner-border-sm" aria-hidden="true"></span>
              <span role="status">Login</span>
            </button>
          </div>
          <div className="d-flex justify-content-center">
            <button type="button" className="btn text-primary p-0" id="create-account" style={{ border: "none" }} onClick={() => navigate("/signup")}>
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
