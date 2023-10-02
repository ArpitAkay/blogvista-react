import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker';

const ForgetPassword = (props) => {
    const [email, setEmail] = useState("");
    const [storeEmail, setStoreEmail] = useState("");
    const [timer, setTimer] = useState("");
    const navigate = useNavigate("");
    const ref = useRef(null);

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }

    const handleSendMail = async (event) => {
        event.preventDefault();
        const sendMailSpanelem = document.getElementById("send-mail-span");
        sendMailSpanelem.classList.add("visually-hidden");
        const spinnerLoader = document.getElementById("spinner-loader");
        spinnerLoader.classList.add("spinner-border");

        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent = process.env.REACT_APP_AUTHENTICATION_ENDPOINT + process.env.REACT_APP_VERIFY_EMAIL;

        const requestBody = {
            email: email
        };

        const response = await WebServiceInvokerRest(hostname, urlContent, "POST", requestBody, null);
        console.log(response)
        sendMailSpanelem.classList.remove("visually-hidden");
        spinnerLoader.classList.remove("spinner-border");
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
                    const elem = document.getElementById("send-mail-again-btn");
                    elem.disabled = false;
                }
            }, 1000);
        }
        else {
            props.showToast("Failed", response.data.detail);
        }
        setEmail("");
    }

    const handleSendMailAgain = async () => {
        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent = process.env.REACT_APP_AUTHENTICATION_ENDPOINT + process.env.REACT_APP_VERIFY_EMAIL;

        const requestBody = {
            email: storeEmail
        };

        const response = await WebServiceInvokerRest(hostname, urlContent, "POST", requestBody, null);
        console.log(response);
        if (response.status === 200) {
            ref.current.click();
            props.showToast("Success", response.data);
            const elem = document.getElementById("send-mail-again-btn");
            elem.disabled = true;
            let time = 60;
            setTimer(time);
            let interval = setInterval(() => {
                time--;
                setTimer(time);
                if (time === 0) {
                    setTimer("");
                    clearInterval(interval);
                    const elem = document.getElementById("send-mail-again-btn");
                    elem.disabled = false;
                }
            }, 1000);
        }
        else {
            props.showToast("Failed", response.data.detail);
        }
    }

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <div className="d-flex flex-row justify-content-center" style={{ position: "relative", top: "20%" }}>
                <div className="border border-primary rounded-4 p-5">
                    <form onSubmit={handleSendMail}>
                        <div className="mb-2">
                            <button type="button" className="btn text-primary p-0" id="create-account" style={{ border: "none" }} onClick={() => navigate("/login")}>
                                &#8592; Back to login
                            </button>
                        </div>
                        <h4 className="text-primary">Please enter your email</h4>
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
                            <button disabled={email.length === 0 ? true : false} type="submit" className="btn btn-primary">
                                <span class="spinner-border-sm" id="spinner-loader" aria-hidden="true"></span>
                                <span id="send-mail-span" role="status">Send</span>
                            </button>
                        </div>
                    </form>
                    <div className="d-flex flex-row justify-content-end">
                        <button type="button" className="btn text-primary mt-3 p-0" id="send-mail-again-btn" data-bs-toggle="modal" data-bs-target="#exampleModal" style={{ border: "none" }} disabled={true}>
                            Didn't receive mail? {timer}
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

export default ForgetPassword;