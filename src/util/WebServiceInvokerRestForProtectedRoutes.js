import axios from "axios"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateAuth } from "../redux/slices/AuthSlice.js"

export const WebServiceInvokerRestForProtectedRoutes = async (hostname, urlContent, method, headers, requestBody, requestParams) => {
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const config = {
        method: method,
        url: hostname + urlContent,
    }

    if (headers) {
        config.headers = headers;
    }

    if (requestBody) {
        config.data = requestBody;
    }

    if (requestParams) {
        config.params = requestParams;
    }

    try {
        const response = await axios(config);

        if (response.status === 403 && response.data.detail.startsWith("JWT expired")) {
            const configForNewAccessToken = {
                method: "POST",
                url: process.env.REACT_APP_HOST_AND_PORT + process.env.REACT_APP_AUTHENTICATION_ENDPOINT + process.env.REACT_APP_GENERATE_ACCESS_TOKEN_VIA_REFRESH_TOKEN,
                params: {
                    refreshToken: auth.refreshToken
                }
            }

            let responseWithNewAccessToken;
            try {
                responseWithNewAccessToken = await axios(configForNewAccessToken);
            }
            catch (error) {
                navigate("/login");
                return;
            }

            if (responseWithNewAccessToken.status === 200) {
                dispatch(
                    updateAuth({
                        type: "LoggedIn",
                        state: {
                            name: response.data.name,
                            email: response.data.email,
                            authToken: response.data.accessToken,
                            refreshToken: response.data.refreshToken,
                            role: response.data.roles[0].roleName
                        },
                    })
                );
                const headersNewAccessToken = {
                    Authorization: "Bearer " + auth.authToken
                }
                WebServiceInvokerRestForProtectedRoutes(hostname, urlContent, method, headersNewAccessToken, requestBody, requestParams)
            }
            else {
                navigate("/login");
                return;
            }
        }
        else {
            navigate("/login");
            return;
        }
    }
    catch (err) {
        return err.response;
    }
}