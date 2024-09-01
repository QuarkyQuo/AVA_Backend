const axios = require('axios');
const BACKEND_URI2 = "http://127.0.0.1:3100";
exports.api= (token) => {
    let token_data = token;
    if (typeof token_data === "string" && token_data.split(".").length === 3)
        return axios.create({
            baseURL: `${BACKEND_URI2}/`,
            headers: { "x-auth-token": token_data },
        });
    else
        return axios.create({
            baseURL: `${BACKEND_URI2}/`,
        });
};

exports.handleResponse = (res) => {
    try {
        const data = res.data;
        if (res.data.error) {
            const error = data.message ? data.message : data.error;
            return Promise.reject(error);
        }
        return data;
    } catch (error) {
        console.log("handle response: ", error);
    }
};

exports.handleError = (err) => {
    console.log("handle error: ", err);
    return null;
};