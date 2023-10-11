import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker';

const ForgetPassword = (props) => {
    const [isTokenVerified, setIsTokenVerified] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const navigate = useNavigate();
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
            props.showToast("Success", response.data);
        } else {
            props.showToast("Failed", response.data.detail)
        }
    }

    const VerifyForgetPasswordToken = async () => {
        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent =
            process.env.REACT_APP_AUTHENTICATION_ENDPOINT +
            process.env.REACT_APP_VERIFY_FORGET_PASSWORD_TOKEN;

        const requestParams = {
            token: queryParams.get("token")
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
            setIsTokenVerified(true);
        } else {
            const textElem = document.getElementById("modalText");
            textElem.innerHTML = response.data.detail
        }
    }

    useEffect(() => {
        VerifyForgetPasswordToken();
        // eslint-disable-next-line
    }, []);


    if (!isTokenVerified) {
        return (<div className="d-flex flex-row justify-content-center align-items-center" style={{ height: "100vh", width: "100vw" }}>
            <div className="modal fade show " id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" role="dialog" style={{ display: "block" }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border border-primary rounded-4">
                        <div className="modal-body d-flex justify-content-center" id="modalText">
                        </div>
                        <div className="d-flex justify-content-center mt-1 mb-3">
                            <button type="button" className="btn btn-primary" onClick={() => navigate("/login")}>Back to login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
    if(isTokenVerified) {
        return (
            <div className="login-div">
                <div className="d-flex flex-row justify-content-center" style={{ position: "relative", top: "20%" }}>
                    <form className="border border-primary rounded-4 p-5" onSubmit={handleResetPasswordSubmit}>
                        <div className="mb-2">
                            <button type="button" className="btn text-primary p-0" id="create-account" style={{ border: "none" }} onClick={() => navigate("/login")}>
                                &#8592; Back to login
                            </button>
                        </div>
                        <h4 className="text-primary">Reset your password</h4>
                        <div className="my-3">
                            <label htmlFor="email" className="form-label">
                                New Password
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
                                Confirm New Password
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
                            <button type="submit" className="btn btn-primary">
                                <span className="spinner-border-sm" aria-hidden="true"></span>
                                <span role="status">Submit</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default ForgetPassword;
