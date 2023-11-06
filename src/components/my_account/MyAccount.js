import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker'
import Footer from '../footer/Footer'
import profileIcon from '../../images/profileIcon.png'
import { updateAuth } from '../../redux/slices/AuthSlice';
import Spinner from '../spinner/Spinner'

const MyAccount = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [profilePictureBase64, setProfilePictureBase64] = useState(profileIcon);
    const [userInfo, setUserInfo] = useState({});
    const [update, setUpdate] = useState(false);
    const [isProfilePicChanged, setIsProfilePicChanged] = useState(false);
    const [loading, setLoading] = useState(true);
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();

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
            setLoading(false);
            setUserInfo(response.data);
            setName(response.data.firstName + " " + response.data.lastName);
            setEmail(response.data.email);
            setPhoneNumber(response.data.phoneNumber);
            response.data.profileImageUrl !== null ? setProfilePictureBase64(response.data.profileImageUrl) : setProfilePictureBase64(profileIcon);
        }
        else {
            props.showToast("Failed", "Error loading user info");
        }
    }

    const handleImageClick = () => {
        if (update) {
            document.getElementById("formFile").click();
        }
    }

    const handleProfilePictureUpload = (event) => {
        setIsProfilePicChanged(true);
        const file = event.target.files[0];
        setProfilePicture(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setProfilePictureBase64(reader.result);
        }
    }

    const handleName = (event) => {
        setName(event.target.value);
    }

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }

    const handlePhoneNumber = (event) => {
        setPhoneNumber(event.target.value);
    }

    const handleSaveClick = (event) => {
        setUpdate(false);
        handleUpdateUserInfoSubmit(event);
    }

    const handleUpdateUserInfoSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        const requestBody = {};

        if (name !== (userInfo.firstName + " " + userInfo.lastName)) {
            requestBody.firstName = name.split(" ")[0];
            requestBody.lastName = name.split(" ")[1];
        }
        if (phoneNumber !== userInfo.phoneNumber) requestBody.phoneNumber = phoneNumber;

        if (Object.keys(requestBody).length === 0 && !isProfilePicChanged) {
            props.showToast("Failed", "Nothing to update");
            return;
        }

        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent = process.env.REACT_APP_USER_INFO_ENDPOINT + process.env.REACT_APP_UPDATE_USER_INFO;

        const formData = new FormData();
        formData.append("userInfoRequest", JSON.stringify(requestBody));

        if (isProfilePicChanged) formData.append("profilePicture", profilePicture);

        const headers = {
            "Authorization": "Bearer " + auth.authToken
        }

        const response = await WebServiceInvokerRest(
            hostname,
            urlContent,
            "PATCH",
            headers,
            formData,
            null
        );

        if (response.status === 200) {
            setLoading(false);
            const name = response.data.firstName + " " + response.data.lastName;
            setName(name);
            setEmail(response.data.email);
            setPhoneNumber(response.data.phoneNumber);
            response.data.profileImageUrl !== null ? setProfilePictureBase64(response.data.profileImageUrl) : setProfilePictureBase64(profileIcon);
            dispatch(
                updateAuth({
                    type: "UpdateName",
                    state: {
                        name: name
                    },
                })
            );
            props.showToast("Success", "Account information updated successfully")
        } else {
            props.showToast("Failed", response.data.detail)
        }
    }

    useEffect(() => {
        loadUserInfo();
        // eslint-disable-next-line
    }, []);

    return (
        <div style={{ width: "100vw", height: "93vh" }}>
            {loading && <div>
                <Spinner />
            </div>}
            {!loading && <div className="my-5 mx-4">
                <div className="d-flex justify-content-center align-items-center">
                    <form className="p-5 d-flex flex-column align-items-center shadow rounded-4" onSubmit={handleUpdateUserInfoSubmit}>
                        <div className="mb-4">
                            <img src={profilePictureBase64} className="img-fluid rounded-circle shadow-sm border border-light-subtle object-fit-fill" id="profile-picture" style={{ minWidth: "150px", minHeight: "150px", maxWidth: "150px", maxHeight: "150px", cursor: `${update ? "pointer" : "auto"}` }} onClick={handleImageClick} alt="Error loading" />
                            <input className="form-control" type="file" id="formFile" onChange={handleProfilePictureUpload} accept="image/*" hidden disabled={!update}></input>
                        </div>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <th scope="row"><i>Name</i></th>
                                    <td><input type="text" className={`form-control px-2 py-1 border-0 shadow-none bg-white fst-italic ${update ? "border-bottom": ""}`} value={name} onChange={handleName} disabled={!update} /></td>
                                </tr>
                                <tr>
                                    <th scope="row"><i>Email</i></th>
                                    <td><input type="text" className="form-control px-2 py-1 border-0 shadow-none bg-white fst-italic" value={email} onChange={handleEmail} disabled /></td>
                                </tr>
                                <tr>
                                    <th scope="row"><i>Phone Number</i></th>
                                    <td><input type="text" className={`form-control px-2 py-1 border-0 shadow-none bg-white fst-italic ${update ? "border-bottom": ""}`} value={phoneNumber} onChange={handlePhoneNumber} disabled={!update} /></td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            {!update && <button type="button" className="btn btn-primary btn-sm mx-2" onClick={() => setUpdate(true)}>
                                <i>Update</i>
                            </button>}
                            {update && <button type="button" className="btn btn-danger btn-sm mx-2" onClick={() => setUpdate(false)} disabled={loading}>
                                <i>Cancel</i>
                            </button>}
                            {update && <button type="submit" className="btn btn-success btn-sm mx-2" onClick={handleSaveClick} disabled={loading}>
                                <span className={`spinner-border-sm ${loading ? "spinner-border" : ""}`} aria-hidden="true"></span>
                                <span className={loading ? "visually-hidden" : ""} role="status"><i>Save</i></span>
                            </button>}
                        </div>
                    </form>
                </div>
            </div>}
            <div className="position-sticky" style={{ top: "66%" }}>
                <Footer />
            </div>
        </div>
    )
}

export default MyAccount
