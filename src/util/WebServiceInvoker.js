import axios from "axios"

export const WebServiceInvokerRest = async (hostname, urlContent, method, headers, requestBody, requestParams) => {
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

    let response;
    try {
        response = await axios(config);
    }
    catch (err) {
        response =  err.response;
    }

    console.log(response);
    console.log(response.status);

    return response;
}