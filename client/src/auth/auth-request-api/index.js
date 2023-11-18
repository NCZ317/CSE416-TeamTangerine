import axios from 'axios'
axios.defaults.withCredentials = true;
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://terratrove-df08dd7fc1f7.herokuapp.com/auth'
  : 'http://localhost:4000/auth';

const api = axios.create({
  baseURL,
});

// 'https://terratrove-df08dd7fc1f7.herokuapp.com/auth'
// 'http://localhost:4000/auth'

//WHEN DEPLOYING TO HEROKU, USE THE HEROKU URL LISTED ABOOVE.
//WHEN WORKING LOCALLY, USING THE LOCALHOST URL LISTED ABOVE.
//MAKE SURE TO CHANGE IT TO THE HEROKU URL BEFORE PUSHING TO GITHUB


export const getLoggedIn = () => api.get(`/loggedIn/`);
export const loginUser = (email, password) => {
    return api.post(`/login/`, {
        email : email,
        password : password
    })
}
export const logoutUser = () => api.get(`/logout/`)
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
export const editUser = (id, email, username) => {
    return api.post('/edit', {
        userId : id,
        newEmail : email,
        newUsername : username,
    })
}
const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    editUser
}

export default apis