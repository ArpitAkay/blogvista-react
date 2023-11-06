import React, { useState } from 'react'
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import './Signup.css'

const Signup = (props) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const [loading, setLoading] = useState(false);

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
        const phoneNumberElem = document.getElementById("phoneNumber");
        if (value.length === 12) {
            document.getElementsByClassName("flag-dropdown")[0].classList.add("border-success");
            phoneNumberElem.classList.add("is-valid", "border-success");
        }
        else {
            document.getElementsByClassName("flag-dropdown")[0].classList.remove("border-success");
            phoneNumberElem.classList.remove("is-valid", "border-success");
        }
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
        setLoading(true);

        const validationBoolean = await checkValidationsForSignup();

        if (validationBoolean) {
            setLoading(false);
            return;
        }

        const signUpReq = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            phoneNumber: phoneNumber,
        };

        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent = process.env.REACT_APP_AUTHENTICATION_ENDPOINT + process.env.REACT_APP_SIGN_UP;
        const response = await WebServiceInvokerRest(
            hostname,
            urlContent,
            "POST",
            null,
            signUpReq,
            null
        );

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
        setLoading(false);
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
        <div style={{ width: "100vw", height: "87vh" }}>
            <div className="d-flex flex-row justify-content-center" style={{ position: "relative", top: "5%" }}>
                <form className="border shadow rounded-4 p-5" onSubmit={handleSignUpSubmit}>
                    <h4 className="text-primary my-3"><i>Create your account</i></h4>
                    <div className="d-flex flex-row">
                        <div className="mb-3 me-2">
                            <label htmlFor="firstName" className="form-label">
                                <i>First Name</i>
                            </label>
                            <input
                                type="text"
                                className="form-control pe-5"
                                id="firstName"
                                value={firstName}
                                onChange={handleFirstName}
                                required
                            />
                        </div>
                        <div className="mb-3 ms-2">
                            <label htmlFor="lastName" className="form-label">
                                <i>Last Name</i>
                            </label>
                            <input
                                type="text"
                                className="form-control pe-5"
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
                            <i>Phone Number</i>
                        </label>
                        <div className="border-success is-valid">
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
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            <i>Email address</i>
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
                            <i>Password</i>
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
                            <i>Confirm Password</i>
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
                    <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={handleShowPassword} />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            <i>Show Password</i>
                        </label>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-sm btn-primary">
                            <span className={`${loading ? "spinner-border" : ""} spinner-border-sm`} aria-hidden="true"></span>
                            <span className={loading ? "visually-hidden" : ""} role="status"><i>Sign up</i></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
