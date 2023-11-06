import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker';

const ForgetPassword = (props) => {
    const [isTokenVerified, setIsTokenVerified] = useState(false);
    const [tokenResponse, setTokenResponse] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const location = useLocation();
    const search = location.search;
    const queryParams = new URLSearchParams(search);

    const handleNewPassword = (event) => {
        const newPasswordValue = event.target.value;
        setNewPassword(event.target.value);
        const newPasswordElem = document.getElementById("newPassword");
        newPasswordValue.match(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})[a-zA-Z0-9!@#$%^&*]+$"
        )
            ? newPasswordElem.classList.add("is-valid")
            : newPasswordElem.classList.remove("is-valid");
    }

    const handleConfirmNewPassword = (event) => {
        const confirmNewPasswordValue = event.target.value;
        setConfirmNewPassword(event.target.value);
        const confirmNewPasswordElem = document.getElementById("confirmNewPassword");
        confirmNewPasswordValue.match(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})[a-zA-Z0-9!@#$%^&*]+$"
        ) && confirmNewPasswordValue === newPassword
            ? confirmNewPasswordElem.classList.add("is-valid")
            : confirmNewPasswordElem.classList.remove("is-valid");
    }

    const handleResetPasswordSubmit = async (event) => {
        event.preventDefault();
        setSubmitLoading(true);

        const isValid = checkValidationForResetPassword();

        if(isValid) {
            setSubmitLoading(false);
            return;
        }
        
        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent = process.env.REACT_APP_AUTHENTICATION_ENDPOINT +
            process.env.REACT_APP_FORGET_PASSWORD;

        const requestBody = {
            verificationToken: queryParams.get("token"),
            newPassword: newPassword
        };

        const response = await WebServiceInvokerRest(
            hostname,
            urlContent,
            "POST",
            null,
            requestBody,
            null
        );

        if (response.status === 200) {
            setNewPassword("");
            setConfirmNewPassword("");
            props.showToast("Success", response.data);
        } else {
            props.showToast("Failed", response.data.detail)
        }
        setSubmitLoading(false);
    }

    const VerifyForgetPasswordToken = async () => {
        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent = process.env.REACT_APP_AUTHENTICATION_ENDPOINT + process.env.REACT_APP_VERIFY_FORGET_PASSWORD_TOKEN;

        const forgetPasswordParams = {
            token: queryParams.get("token")
        };

        const headers = {
            "Authorization": "Bearer " + queryParams.get("authToken")
        }

        const response = await WebServiceInvokerRest(
            hostname,
            urlContent,
            "POST",
            headers,
            null,
            forgetPasswordParams
        );

        if (response.status === 200) {
            setIsTokenVerified(true);
        } else {
            setTokenResponse(response.data.detail);
        }
    }

    const checkValidationForResetPassword = () => {
        if (!newPassword.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})[a-zA-Z0-9!@#$%^&*]+$")) {
            props.showToast("Failed", "Password should be atleast 10 characters long and should contain atleast 1 lowercase, 1 uppercase, 1 number and 1 special character");
            return true;
        }
        if (!confirmNewPassword.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})[a-zA-Z0-9!@#$%^&*]+$")) {
            props.showToast("Failed", "Password should be atleast 10 characters long and should contain atleast 1 lowercase, 1 uppercase, 1 number and 1 special character");
            return true;
        }
        if (newPassword !== confirmNewPassword) {
            props.showToast("Failed", "New password and confirm new password should match");
            return true;
        }
        return false;
    }

    useEffect(() => {
        VerifyForgetPasswordToken();
        // eslint-disable-next-line
    }, []);

    if (!isTokenVerified) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ width: "100vw", height: "92.3vh" }}>
                <div className="w-50 border shadow-sm rounded-4 p-4">
                    <div className="text-center fst-italic" dangerouslySetInnerHTML={{ __html: tokenResponse }}>
                    </div>
                </div>
            </div>
        )
    }
    if (isTokenVerified) {
        return (
            <div className="login-div">
                <div className="d-flex flex-row justify-content-center" style={{ position: "relative", top: "20%" }}>
                    <form className="border shadow rounded-4 p-5" onSubmit={handleResetPasswordSubmit}>
                        <h4 className="text-primary"><i>Reset your password</i></h4>
                        <div className="my-3">
                            <label htmlFor="email" className="form-label">
                                <i>New Password</i>
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="newPassword"
                                value={newPassword}
                                onChange={handleNewPassword}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="form-label">
                                <i>Confirm New Password</i>
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={handleConfirmNewPassword}
                                required
                            />
                        </div>
                        <div className="mt-4 d-flex justify-content-center">
                            <button type="submit" className="btn btn-sm btn-primary" disabled={submitLoading}>
                                <span className={`${submitLoading ? "spinner-border" : ""} spinner-border-sm`} aria-hidden="true"></span>
                                <span className={submitLoading ? "visually-hidden" : ""} role="status"><i>Submit</i></span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default ForgetPassword;
