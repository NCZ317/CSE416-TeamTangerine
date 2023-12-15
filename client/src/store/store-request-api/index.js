import axios from 'axios'
axios.defaults.withCredentials = true;
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://terratrove-df08dd7fc1f7.herokuapp.com/api'
  : 'http://localhost:4000/api';

const api = axios.create({
  baseURL,
});


export const createMap =(title, jsonData, mapType, ownerEmail, username) => {
    return api.post(`/map/`, {
        title: title,
        description: "Add a description",
        ownerEmail: ownerEmail,
        username: username,
        jsonData: jsonData,
        mapType: mapType,
        mapLayers: null,
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

export const getLikedMapPairs = () => api.get(`/likedmappairs`)

export const updateMapById = (id, map) => {
    return api.put(`/map/${id}`, {
        map: map
    })
} 

export const getMaps = () => api.get(`/maps`)

export const getAllMapPairs = () => api.get(`/allmappairs`)

export const getMapsByUser = (email) => api.get(`/maps/${email}`, {email: email})

// BACKEND REQUESTS FOR MAPLAYER
export const getMapLayerById = (id, mapType) => api.get(`/maplayer/${id}`, { params: { mapType } });

export const updateMapLayerById = (id, mapType, mapLayer) => {
    return api.put(`/maplayer/${id}`, {
        mapType: mapType,
        mapLayer: mapLayer
    })
};

export const likeMapById = (id) => api.post(`/map/${id}/like`);

export const unlikeMapById = (id) => api.post(`/map/${id}/unlike`);

export const viewMapById = (id) => api.post(`/map/${id}/view`);


const apis = {
    createMap,
    deleteMapById,
    getMapById,
    getMapPairs,
    getLikedMapPairs,
    updateMapById,
    getMaps,
    getAllMapPairs,
    getMapsByUser,
    getMapLayerById,
    updateMapLayerById,
    likeMapById,
    unlikeMapById,
    viewMapById
}

export default apis


