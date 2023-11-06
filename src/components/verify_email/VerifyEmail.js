import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker';

const VerifyEmail = () => {
    const [tokenResponse, setTokenResponse] = useState();
    const location = useLocation();
    const search = location.search;
    const queryParams = new URLSearchParams(search);

    const VerifyEmailToken = async () => {
        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent =
            process.env.REACT_APP_AUTHENTICATION_ENDPOINT +
            process.env.REACT_APP_VERIFY_EMAIL_TOKEN;

        const verifyEmailParams = {
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
            verifyEmailParams
        );
        
        if (response.status === 200) {
            setTokenResponse(response.data);
        }
        else {
            setTokenResponse(response.data.detail);
        }
    }

    useEffect(() => {
        VerifyEmailToken();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ width: "100vw", height: "92.3vh" }}>
            <div className="w-50 border shadow-sm rounded-4 p-4">
                <div className="text-center fst-italic" dangerouslySetInnerHTML={{ __html: tokenResponse }}>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail
