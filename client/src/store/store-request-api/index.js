import axios from 'axios'
axios.defaults.withCredentials = true;
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://terratrove-df08dd7fc1f7.herokuapp.com/api'
  : 'http://localhost:4000/api';
const api = axios.create({
    baseURL,
});
export const createMap = (title, jsonData, mapType, ownerEmail) => {
    return api.post('/map', {
        title : String,
        description : String,
        ownerEmail : String,
        username : String,
        jsonData : Object,
        mapType : String,
        mapLayers : [],
        likes: 0,
        views: 0,
        comments: {
            user: String,
            message: String },
        published: Boolean,
        publishedDate: Date 
    })
}
export const deleteMapById=(id) =>{
    return api.delete('/map/delete/${id}',{
        _id: Object
    })
}
export const getMapById=(id) =>{
    return api.get('/map/${id}',{
        _id: Object
    })
}
export const getMapPairs=() =>{
    return api.get('map/pairs',{})
}
export const updateMapById=(id) =>{
    return api.put('/map/update/${id}',{
           map: JSON,
           _id: Object
     })
}
export const getMapsByKeyword=(keyword) =>{
    return api.get('/map/keyword/${keyword}',{ 
          keyword: String
    })
}
export const getMapsByUser=(username) =>{
     return api.get('/maps/username/${username',{})
}
export const getMaps=() =>{
     return api.get('/maps',{})
}
const apis = {
    createMap,
    deleteMapById,
    getMapById,
    getMapPairs,
    updateMapById,
    getMapsByKeyword,
    getMapsByUser,
    getMaps,
}
export default apis
//CREATE ALL THE REQUESTS


