
import axios from 'axios'
axios.defaults.withCredentials = true;
// const api = axios.create({
//     // baseURL: 'https://terratrove-df08dd7fc1f7.herokuapp.com/api'
//     baseURL: 'http://localhost:4000/api'
// })
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://terratrove-df08dd7fc1f7.herokuapp.com/api'
  : 'http://localhost:4000/api';


//CREATE ALL THE REQUESTS
 //Process getting information from server
    //Process getting maps from server, returns array of ids
        /* store.getMaps = async function() {
            try {
                const response = await api.loginUser(email, password);
                if (response.status === 200) {
                    authReducer({
                        type: GlobalStoreActionType.LOAD_CURRENT_MAPS,
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
        } */
    //Process getting users from server
        //store.getUsers = function()

const apis = {

}

export default apis


