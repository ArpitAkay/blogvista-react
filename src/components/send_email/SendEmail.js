import React, { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker';

const SendEmail = (props) => {
    const [email, setEmail] = useState("");
    const [storeEmail, setStoreEmail] = useState("");
    const [timer, setTimer] = useState("");
    const [loading, setLoading] = useState(false);
    const [sendAgainMailBtn, setSendAgainMailBtn] = useState(true);
    const ref = useRef(null);
    const location = useLocation();

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }

    const handleSendMail = async (event) => {
        event.preventDefault();
        setLoading(true);

        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent = process.env.REACT_APP_AUTHENTICATION_ENDPOINT +
            (location.pathname === "/forgetPassword" ? process.env.REACT_APP_SEND_FORGET_PASSWORD_MAIL : process.env.REACT_APP_SEND_EMAIL_VERIFICATION_MAIL);

        const emailReq = {
            email: email
        };

        const response = await WebServiceInvokerRest(
            hostname,
            urlContent,
            "POST",
            null,
            emailReq,
            null
        );

        if (response.status === 200) {
            setStoreEmail(email);
            props.showToast("Success", response.data);
            let time = 60;
            setTimer(time);
            let interval = setInterval(() => {
                time--;
                setTimer(time);
                if (time === 0) {
                    setTimer("");
                    clearInterval(interval);
                    setSendAgainMailBtn(false);
                }
            }, 1000);
            setEmail("");
        }
        else {
            props.showToast("Failed", response.data.detail);
        }
        setLoading(false);
    }

    const handleSendMailAgain = async () => {
        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent = process.env.REACT_APP_AUTHENTICATION_ENDPOINT +
            (location.pathname === "/forgetPassword" ? process.env.REACT_APP_SEND_FORGET_PASSWORD_MAIL : process.env.REACT_APP_SEND_EMAIL_VERIFICATION_MAIL);

        const requestBody = {
            email: storeEmail
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
            ref.current.click();
            props.showToast("Success", response.data);
            setSendAgainMailBtn(true);
            let time = 60;
            setTimer(time);
            let interval = setInterval(() => {
                time--;
                setTimer(time);
                if (time === 0) {
                    setTimer("");
                    clearInterval(interval);
                    setSendAgainMailBtn(false);
                }
            }, 1000);
        }
        else {
            props.showToast("Failed", response.data.detail);
        }
    }

    return (
        <div style={{ width: "100vw", height: "87vh" }}>
            <div className="d-flex flex-row justify-content-center" style={{ position: "relative", top: "20%" }}>
                <div className="border shadow rounded-4 p-5">
                    <form onSubmit={handleSendMail}>
                        <h4 className="text-primary"><i>Please enter your email</i></h4>
                        <div className="my-3">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={handleEmail}
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-sm btn-primary" disabled={email.length === 0 || loading}>
                                <span className={`${loading ? "spinner-border" : ""} spinner-border-sm`} aria-hidden="true"></span>
                                <span className={loading ? "visually-hidden" : ""} role="status"><i>Send</i></span>
                            </button>
                        </div>
                    </form>
                    <div className="d-flex flex-row justify-content-end">
                        <button type="button" className="btn text-primary mt-3 p-0" data-bs-toggle="modal" data-bs-target="#exampleModal" style={{ border: "none" }} disabled={sendAgainMailBtn}>
                            <i>Didn't receive mail? {timer}</i>
                        </button>
                    </div>
                    <div className="modal fade " id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content bg-light">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Didn't receive mail?</h1>
                                    <button ref={ref} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    Send again email to {storeEmail}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                                    <button type="button" className="btn btn-primary" onClick={handleSendMailAgain}>Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SendEmail;