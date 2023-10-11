import React, { useState } from "react";
import { WebServiceInvokerRest } from "../../util/WebServiceInvoker";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateAuth } from "../../redux/slices/AuthSlice";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import "./Signup.css";

const Signup = (props) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFirstName = (event) => {
        const firstNameValue = event.target.value;
        setFirstName(firstNameValue);
        const firstNameElem = document.getElementById("firstName");
        firstNameValue.match("^[A-Za-z]{3,}$")
            ? firstNameElem.classList.add("is-valid")
            : firstNameElem.classList.remove("is-valid");
    };

    const handleLastName = (event) => {
        const lastNameValue = event.target.value;
        setLastName(lastNameValue);
        const lastNameElem = document.getElementById("lastName");
        lastNameValue.match("^[A-Za-z]{3,}$")
            ? lastNameElem.classList.add("is-valid")
            : lastNameElem.classList.remove("is-valid");
    };

    const handlePhoneNumber = (value) => {
        setPhoneNumber(value);
    };

    const handleEmail = (event) => {
        const emailValue = event.target.value;
        setEmail(emailValue);
        const emailElem = document.getElementById("email");
        emailValue.match("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[a-zA-Z]{2,}$")
            ? emailElem.classList.add("is-valid")
            : emailElem.classList.remove("is-valid");
    };

    const handlePassword = (event) => {
        const passwordValue = event.target.value;
        setPassword(passwordValue);
        const passwordElem = document.getElementById("password");
        passwordValue.match(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})[a-zA-Z0-9!@#$%^&*]+$"
        )
            ? passwordElem.classList.add("is-valid")
            : passwordElem.classList.remove("is-valid");
    };

    const handleCPassword = (event) => {
        const cPasswordValue = event.target.value;
        setCPassword(cPasswordValue);
        const cPasswordElem = document.getElementById("cPassword");
        cPasswordValue.match(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})[a-zA-Z0-9!@#$%^&*]+$"
        ) && cPasswordValue === password
            ? cPasswordElem.classList.add("is-valid")
            : cPasswordElem.classList.remove("is-valid");
    };

    const handleSignUpSubmit = async (event) => {
        event.preventDefault();
        const spinnerElem = document.getElementsByTagName("span")[0];
        const textElem = document.getElementsByTagName("span")[1];
        spinnerElem.classList.add("spinner-border");
        textElem.classList.add("visually-hidden");

        let validationBoolean = await checkValidationsForSignup();

        if (validationBoolean) {
            spinnerElem.classList.remove("spinner-border");
            textElem.classList.remove("visually-hidden");
            return;
        }

        const requestBody = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            phoneNumber: phoneNumber,
        };
        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent =
            process.env.REACT_APP_AUTHENTICATION_ENDPOINT +
            process.env.REACT_APP_SIGN_UP;
        const response = await WebServiceInvokerRest(
            hostname,
            urlContent,
            "POST",
            null,
            requestBody,
            null
        );

        spinnerElem.classList.remove("spinner-border");
        textElem.classList.remove("visually-hidden");

        if (response.status === 201) {
            setFirstName("");
            setLastName("");
            setPhoneNumber("");
            setEmail("");
            setPassword("");
            setCPassword("");
            document.getElementById("firstName").classList.remove("is-valid");
            document.getElementById("lastName").classList.remove("is-valid");
            document.getElementById("email").classList.remove("is-valid");
            document.getElementById("password").classList.remove("is-valid");
            document.getElementById("cPassword").classList.remove("is-valid");
            props.showToast("Success", "Signup successful");
        }
        else {
            props.showToast("Failed", response.data.detail);
        }
    };

    const checkValidationsForSignup = async () => {
        if (!firstName.match("^[A-Za-z]{3,}$")) {
            props.showToast("Failed", "First name should be atleast 3 characters long");
            return true;
        }
        if (!lastName.match("^[A-Za-z]{3,}$")) {
            props.showToast("Failed", "Last name should be atleast 3 characters long");
            return true;
        }
        if (phoneNumber.length !== 12) {
            props.showToast("Failed", "Invalid phone number");
            return true;
        }
        if (!email.match("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[a-zA-Z]{2,}$")) {
            props.showToast("Failed", "Invalid email");
            return true;
        }
        if (!password.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})[a-zA-Z0-9!@#$%^&*]+$")) {
            props.showToast("Failed", "Password should be atleast 10 characters long and should contain atleast 1 lowercase, 1 uppercase, 1 number and 1 special character");
            return true;
        }
        if (!cPassword.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})[a-zA-Z0-9!@#$%^&*]+$")) {
            props.showToast("Failed", "Password should be atleast 10 characters long and should contain atleast 1 lowercase, 1 uppercase, 1 number and 1 special character");
            return true;
        }
        if (password !== cPassword) {
            props.showToast("Failed", "Password and confirm password should match");
            return true;
        }
        return false;
    }

    const handleGoogleLogin = async (idTokenString) => {
        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent =
            process.env.REACT_APP_AUTHENTICATION_ENDPOINT +
            process.env.REACT_APP_GOOGLE_LOGIN;

        const requestParams = {
            idTokenString: idTokenString,
        };

        const response = await WebServiceInvokerRest(
            hostname,
            urlContent,
            "POST",
            null,
            null,
            requestParams
        );

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
        }
    };

    const handleShowPassword = () => {
        const passwordElem = document.getElementById("password");
        const cPasswordElem = document.getElementById("cPassword");

        if (passwordElem.type === "password") {
            passwordElem.type = "text";
            cPasswordElem.type = "text";
        }
        else {
            passwordElem.type = "password";
            cPasswordElem.type = "password";
        }
    }

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <div className="d-flex flex-row justify-content-center" style={{ position: "relative", top: "7%" }}>
                <form className="border border-primary rounded-4 p-5" onSubmit={handleSignUpSubmit}>
                    <div className="mb-2">
                        <button type="button" className="btn text-primary p-0" id="create-account" style={{ border: "none" }} onClick={() => navigate("/login")}>
                            &#8592; Back to login
                        </button>
                    </div>
                    <h4 className="text-primary">Create your account</h4>
                    <div className="d-flex flex-row">
                        <div className="mb-3 me-2">
                            <label htmlFor="firstName" className="form-label">
                                First Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                value={firstName}
                                onChange={handleFirstName}
                                aria-describedby="firstName"
                                required
                            />
                        </div>
                        <div className="mb-3 ms-2">
                            <label htmlFor="lastName" className="form-label">
                                Last Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                value={lastName}
                                onChange={handleLastName}
                                aria-describedby="lastName"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phoneNumber" className="form-label">
                            Phone Number
                        </label>
                        <PhoneInput
                            country={'in'}
                            onlyCountries={['in']}
                            countryCodeEditable={false}
                            enableSearch={true}
                            disableSearchIcon={true}
                            placeholder="+91 1234567890"
                            value={phoneNumber}
                            onChange={handlePhoneNumber}
                            inputProps={{
                                id: 'phoneNumber',
                                required: true,
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={handleEmail}
                            aria-describedby="email"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={handlePassword}
                            aria-describedby="password"
                            required
                        />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="cPassword" className="form-label">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="cPassword"
                            value={cPassword}
                            onChange={handleCPassword}
                            aria-describedby="cPassword"
                            required
                        />
                    </div>
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={handleShowPassword} />
                        <label class="form-check-label" for="flexCheckDefault">
                            Show Password
                        </label>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary">
                            <span className="spinner-border-sm" aria-hidden="true"></span>
                            <span role="status">Sign up</span>
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

export default Signup;
