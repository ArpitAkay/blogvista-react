import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker';

const MyAccount = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);

    const loadUserInfo = async () => {
        const requestParams = {
            email: auth.email
        }

        const headers = {
            "Authorization": "Bearer " + auth.authToken
        };

        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent = process.env.REACT_APP_USER_INFO_ENDPOINT + process.env.REACT_APP_GET_USER_INFO;

        const response = await WebServiceInvokerRest(
            hostname,
            urlContent,
            "GET",
            headers,
            null,
            requestParams
        );

        if (response.status === 200) {
            console.log(response);
            setName(response.data.firstName + " " + response.data.lastName);
            setEmail(response.data.email);
            setPhoneNumber(response.data.phoneNumber);
        }
        else {
            props.showToast("Failed", "Error loading user info");
        }
    }

    useEffect(() => {
        loadUserInfo();
        // eslint-disable-next-line
    }, []);

    const handleUpdateInformationClick = () => {
    }

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <div className="h-100 d-flex justify-content-center align-items-center">
                <div className="p-5 d-flex flex-column align-items-end border border-primary rounded-4">
                    <div>
                        <div className="mb-3">
                            <button type="button" className="btn text-primary p-0" id="create-account" style={{ border: "none" }} onClick={() => navigate("/")}>
                                &#8592; Back to home
                            </button>
                        </div>
                        <table class="table table-bordered border-primary">
                            <tbody>
                                <tr>
                                    <th scope="row">Name</th>
                                    <td><input type="text" className="form-control px-2 py-1 border-0 shadow-none bg-white" value={name} disabled /></td>
                                </tr>
                                <tr>
                                    <th scope="row">Email</th>
                                    <td>{email}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Password</th>
                                    <td>{email}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Phone Number</th>
                                    <td>{phoneNumber}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <button type="button" className="btn text-primary" id="forget-password" style={{ border: "none" }} onClick={handleUpdateInformationClick}>
                            Update information
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyAccount
