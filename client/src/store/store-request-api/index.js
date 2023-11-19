import axios from 'axios'
axios.defaults.withCredentials = true;
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://terratrove-df08dd7fc1f7.herokuapp.com/auth'
  : 'http://localhost:4000/auth';

const api = axios.create({
  baseURL,
});


export const createMap =(title, jsonData, mapType, ownerEmail, username) => {
    return api.post(`map`, {
        title: title,
        description: '',
        ownerEmail: ownerEmail,
        username: username,
        jsonData: jsonData,
        mapType: mapType,
        mapLayers: [],
        likes: 0,
        views: 0,
        comments: [],
        published: false,
        publishedDate: new Date(),
    })
}

export const deleteMapById = (id) => api.delete(`/map/${id}`)

export const getMapById = (id) => api.get(`/map/${id}`)

export const  getMapPairs = () => api.get(`/mappairs/`)

export const updateMapById = (id, map) => {
    return api.put(`/map/${id}`, {
        map: map
    })
} 

export const getMaps = () => api.get(`/maps`)

//GET MAP BY KEYWORD AND USER TO BE DONE LATER

const apis = {

}

export default apis


