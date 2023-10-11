import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const search = location.search;
    const queryParams = new URLSearchParams(search);

    const VerifyEmailToken = async () => {
        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent =
        process.env.REACT_APP_AUTHENTICATION_ENDPOINT +
        process.env.REACT_APP_VERIFY_EMAIL_TOKEN;

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

        const textElem = document.getElementById("modalText");
        if (response.status === 200) {
            textElem.innerHTML = response.data
        }
        else {
            textElem.innerHTML = response.data.detail
        }
    }

    useEffect(() => {
        VerifyEmailToken();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="d-flex flex-row justify-content-center align-items-center" style={{ height: "100vh", width: "100vw" }}>
            <div className="modal fade show " id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" role="dialog" style={{display: "block"}}>
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
        </div>
    )
}

export default VerifyEmail
