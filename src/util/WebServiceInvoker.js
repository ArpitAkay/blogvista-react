import axios from "axios"

export const WebServiceInvokerRest = async (hostname, urlContent, method, requestBody, requestParams) => {
    const config = {
        method: method,
        url: hostname + urlContent,
    }

    if (requestBody) {
        config.data = requestBody;
    }

    if (requestParams) {
        config.params = requestParams;
    }

    try {
        return await axios(config);
    }
    catch(err) {
        return err.response;
    }
}