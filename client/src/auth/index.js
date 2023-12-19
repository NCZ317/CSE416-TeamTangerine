import React, { createContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import api from './auth-request-api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    SEND_EMAIL: "SEND_EMAIL",
    ERROR: "ERROR",
    ERROR2: "ERROR2", //for when there is an error but the user stays logged in 
    GET_USER_TO_VIEW: "GET_USER_TO_VIEW",
    EDIT_USER: "EDIT_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: "",
        userToView: null
    });

    const navigate = useNavigate();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: "",
                    userToView: auth.userToView
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: "",
                    userToView: auth.userToView
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: "",
                    userToView: null
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: "",
                    userToView: auth.userToView
                })
            }
            case AuthActionType.ERROR: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: payload.errorMessage,
                    userToView: null
                })
            }
            case AuthActionType.ERROR2: {
                return setAuth({
                    user: auth.user,
                    loggedIn: auth.loggedIn,
                    errorMessage: payload.errorMessage,
                    userToView: auth.userToView
                })
            }
            case AuthActionType.GET_USER_TO_VIEW: {
                return setAuth({
                    user: auth.user,
                    loggedIn: auth.loggedIn,
                    errorMessage: auth.errorMessage,
                    userToView: payload.user
                })
            }
            case AuthActionType.EDIT_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: "",
                    userToView: payload.user
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.loginUser = async function(email, password) {
        try {
            const response = await api.loginUser(email, password);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                navigate("/");
                // history.push("/");
            }
        } catch (error) {
            console.log(error.response.data.errorMessage);
            authReducer({
                type: AuthActionType.ERROR,
                payload: {
                    errorMessage: error.response.data.errorMessage
                }
            });
        }
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            navigate("/");
            // history.push("/");
        }
    }

    auth.registerUser = async function(firstName, lastName, email, username, password, passwordVerify) {
        try {
            const response = await api.registerUser(firstName, lastName, email, username, password, passwordVerify);
            console.log(response);      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                auth.loginUser(email,password);
                navigate("/")
                // history.push('/login');
            }
        } catch (error) {
            console.log(error.response.data.errorMessage);
            authReducer({
                type: AuthActionType.ERROR,
                payload: {
                    errorMessage: error.response.data.errorMessage
                }
            });
        }
    }

    auth.editUser = async function (email, username, bio, password) {
        try{
            const response = await api.editUser(auth.user.id, email, username, bio, password);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.EDIT_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                // history.push('/login');
            }else alert("FAILED");
        }catch (error){
            authReducer({
                type: AuthActionType.ERROR2,
                payload: {
                    errorMessage: error.response.data.errorMessage
                }
            });
        }
    }

    auth.changeUserPassword = async function (oldPass, newPass, confirmNewPass) {
        try{
            const response = await api.changeUserPassword(auth.user.id, oldPass, newPass, confirmNewPass);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                // history.push('/login');
            }else alert("FAILED");
        }catch (error){
            authReducer({
                type: AuthActionType.ERROR2,
                payload: {
                    errorMessage: error.response.data.errorMessage
                }
            });
        }
    }
    auth.sendEmail = async function(email, password, confirmPassword) {
        try {
            const response = await api.sendEmail(email, password, confirmPassword);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.SEND_EMAIL,
                    payload: {
                        user: response.data.user
                    }
                })
            }
        } catch (error) {
            authReducer({
                type: AuthActionType.ERROR,
                payload: {
                    errorMessage: error.response.data.errorMessage
                }
            });
        }
    }
    auth.resetPassword = async function(email, verifyPass, password, confirmPassword){
        try{
            const response = await api.resetPassword(email,verifyPass, password,  confirmPassword);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                // history.push('/login');
            }else alert("FAILED");
        }catch (error){
            authReducer({
                type: AuthActionType.ERROR2,
                payload: {
                    errorMessage: error.response.data.errorMessage
                }
            });
        }
    }
    auth.getAuthorInfo =  async function(username) {
        try{
            const response = await api.getAuthorByUsername(username);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.VIEW_OTHER_USER,
                    payload: {
                        viewAuthor: response.data.user
                    }
                })
            }
        }catch (error) {
            console.log(error.response.data.errorMessage);
            authReducer({
                type: AuthActionType.ERROR2,
                payload: {
                    errorMessage: error.response.data.errorMessage
                }
            });
        }
    }

    auth.hideModal = () => {
        authReducer({
            type: AuthActionType.ERROR2,
            payload: {
                errorMessage: ""
            }
        });
    }

    auth.isErrorModalOpen = () => {
        return auth.errorMessage !== "";
    }

    auth.viewUser = function (email)  {
        async function asyncViewUser(email) {
            try{
                let response = await api.getUserByEmail(email);
                if (response.status == 200) {
                    authReducer({
                        type: AuthActionType.GET_USER_TO_VIEW,
                        payload: response.data
                    });
                }
            } catch (error){
                authReducer({
                    type: AuthActionType.ERROR2,
                    payload: {
                        errorMessage: error.response.data.errorMessage
                    }
                });
            }
        }
        asyncViewUser(email);
    }

    auth.viewUserById = function (userID)  {
        async function asyncViewUser(userID) {
            try{
                console.log("FIND USER ", userID);
                let response = await api.getUserById(userID);
                console.log(response);
                if (response.status == 200) {
                    authReducer({
                        type: AuthActionType.GET_USER_TO_VIEW,
                        payload: response.data
                    });
                }
            } catch (error){
                authReducer({
                    type: AuthActionType.ERROR2,
                    payload: {
                        errorMessage: error.response.data.errorMessage
                    }
                });
            }
        }
        asyncViewUser(userID);
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        return initials;
    }

    auth.getUserInitialsProfile = function() {
        let initials = "";
        if (auth.viewAuthor){
            initials += auth.viewAuthor.firstName.charAt(0);
            initials += auth.viewAuthor.lastName.charAt(0);
        }else if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        return initials;
    }
    auth.getUserEmail = function() {
        if (auth.user) {
            return auth.user.email;
        }
    }

    auth.getUsername = function(){
        if(auth.user){
            return auth.user.username;
        }
    }

    auth.getUserFirstName = function(){
        if(auth.user){
            return auth.user.firstName;
        }
    }

    auth.getUserLastName = function(){
        if(auth.user){
            return auth.user.lastName;
        }
    }

    auth.getUserBio = function(){
        if(auth.user){
            return auth.user.bio;
        }
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };