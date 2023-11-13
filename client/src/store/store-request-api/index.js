
import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    // baseURL: 'https://terratrove-df08dd7fc1f7.herokuapp.com/api'
    baseURL: 'http://localhost:4000/api'
})


//CREATE ALL THE REQUESTS


const apis = {

}

export default apis


