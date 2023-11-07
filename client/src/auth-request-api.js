

import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://terratrove-df08dd7fc1f7.herokuapp.com/auth'
})


// 'https://terratrove-df08dd7fc1f7.herokuapp.com/auth'
// 'http://localhost:5000/auth'

export const registerUser = (firstName, lastName, email, username, password, passwordVerify) => {
    return api.post(`/register`, {
        firstName : firstName,
        lastName : lastName,
        email : email,
        username: username,
        password : password,
        passwordVerify : passwordVerify
    })
}

export const getRegisteredUser = (email) => api.get(`/user/${email}`);


const apis = {
    registerUser,
    getRegisteredUser
}

export default apis
