import { createContext, useContext, useState } from 'react'
// import { useHistory} from 'react-router-dom'
import api, { getMapById } from './store-request-api'
import AuthContext from '../auth'
import { useNavigate } from 'react-router-dom';
import jsTPS from '../common/jsTPS'
import UpdateLayer_Transaction from '../transaction/UpdateLayer_Transaction';

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CLOSE_CURRENT_MAP: "CLOSE_CURRENT_MAP",
    CREATE_NEW_MAP: "CREATE_NEW_MAP",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    LOAD_LIKED_MAP_PAIRS: "LOAD_LIKED_MAP_PAIRS",
    LOAD_CURRENT_MAPS: "LOAD_CURRENT_MAPS",
    MARK_MAP_FOR_DELETION: "MARK_MAP_FOR_DELETION",
    SET_CURRENT_MAP: "SET_CURRENT_MAP",
    EDIT_MAP_LAYER: "EDIT_MAP_LAYER",
    EDIT_MAP_DATA: "EDIT_MAP_DATA",
    EDIT_MAP_DETAILS: "EDIT_MAP_DETAILS",
    EDIT_MAP_GRAPHICS: "EDIT_MAP_GRAPHICS",
    SET_CURRENT_REGION: "SET_CURRENT_REGION",
    DELETE_MAP: "DELETE_MAP",
    DUPLICATE_MAP: "DUPLICATE_MAP",
    HIDE_MODALS: "HIDE_MODALS",
    SET_CURRENT_SCREEN: "SET_CURRENT_SCREEN",
    SET_SEARCH_RESULT: "SET_SEARCH_RESULT",
    SET_SORT: "SET_SORT",
    SET_CURRENT_USER: "SET_CURRENT_USER",
    SET_MAP_TEMPLATE: "SET_MAP_TEMPLATE"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();


const CurrentScreen = {
    HOME: "HOME",
    USER: "USER",
    MAP_POST: "MAP_POST",
    MAP_EDITOR: "MAP_EDITOR"
}


const CurrentModal = {
    NONE : "NONE",
    CREATE_ACCOUNT : "CREATE_ACCOUNT",
    LOGIN: "LOGIN",
    FORGOT_PASSWORD: "FORGOT_PASSWORD",
    CREATE_MAP : "CREATE_MAP",
    DELETE_MAP: "DELETE_MAP",
    EDIT_MAP_DETAILS : "EDIT_MAP_DETAILS",
    ERROR_MODAL : "ERROR_MODAL"
}

const SortMethod = {
    NAME: "NAME",
    DATE: "DATE",
    VIEWS: "VIEWS",
    LIKES: "LIKES",
}

const FilterMethod = {
    TAG: "TAG",
    TYPE: "TYPE"
}

const MapTemplate = {
    CHOROPLETH: "CHOROPLETH",
    HEATMAP: "HEATMAP",
    DOT_DENSITY: "DOT_DENSITY",
    GRADUATED_SYMBOL: "GRADUATED_SYMBOL",
    FLOWMAP: "FLOWMAP"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        currentScreen : CurrentScreen.HOME,
        idNamePairs: [],
        likedMapPairs: [],
        currentMaps: [],
        currentMap: null,
        currentMapLayer: null,
        mapTemplate: null,
        newMapCounter: 0,
        mapMarkedForDeletion: null,
        currentSearchResult: "",
        currentSortMethod: "",
        currentRegion: {},
        currentFeatureIndex: null
    });

    const navigate = useNavigate();

    console.log("inside useGlobalStore");
    console.log(store.idNamePairs);

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.SET_CURRENT_SCREEN: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentScreen : payload.screen,
                    idNamePairs: [],
                    likedMapPairs: [],
                    currentMaps: [],
                    currentMap: store.currentMap,
                    currentMapLayer: store.currentMapLayer,
                    mapTemplate: store.mapTemplate,
                    newMapCounter: store.newMapCounter,
                    mapMarkedForDeletion: null,
                    currentSearchResult: "",
                    currentSortMethod: "",
                    currentRegion: null,
                    currentFeatureIndex: null
                });
            }
            case GlobalStoreActionType.CREATE_NEW_MAP: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentScreen : store.currentScreen,
                    idNamePairs: store.idNamePairs,
                    likedMapPairs: store.likedMapPairs,
                    currentMaps: [],
                    currentMap: payload.newMap,
                    currentMapLayer: payload.mapLayer,
                    mapTemplate: payload.newMap.mapType,
                    newMapCounter: store.newMapCounter + 1,
                    mapMarkedForDeletion: null,
                    currentSearchResult: "",
                    currentSortMethod: "",
                    currentRegion: null,
                    currentFeatureIndex: null
                });
            }
            //THIS SHOULD BE CALLED WHEN USER FORKS MAP AND IT WILL REDIRECT TO THEIR PROFILE WITH THE MAP DUPED
            case GlobalStoreActionType.DUPLICATE_MAP: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentScreen : CurrentScreen.USER,
                    idNamePairs: store.idNamePairs,
                    likedMapPairs: store.likedMapPairs,
                    currentMaps: [],
                    currentMap: null,
                    currentMapLayer: null,
                    mapTemplate: null,
                    newMapCounter: store.newMapCounter + 1,
                    mapMarkedForDeletion: null,
                    currentSearchResult: "",
                    currentSortMethod: "",
                    currentRegion: null,
                    currentFeatureIndex: null
                });
            }

            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentScreen : store.currentScreen,
                    idNamePairs: payload,
                    likedMapPairs: store.likedMapPairs,
                    currentMaps: [],
                    currentMap: null,
                    currentMapLayer: null,
                    mapTemplate: null,
                    newMapCounter: store.newMapCounter,
                    mapMarkedForDeletion: null,
                    currentSearchResult: "",
                    currentSortMethod: "",
                    currentRegion: null,
                    currentFeatureIndex: null
                })
            }

            case GlobalStoreActionType.LOAD_LIKED_MAP_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentScreen : store.currentScreen,
                    idNamePairs: store.idNamePairs,
                    likedMapPairs: payload,
                    currentMaps: [],
                    currentMap: null,
                    currentMapLayer: null,
                    mapTemplate: null,
                    newMapCounter: store.newMapCounter,
                    mapMarkedForDeletion: null,
                    currentSearchResult: "",
                    currentSortMethod: "",
                    currentRegion: null,
                    currentFeatureIndex: null
                })
            }

            case GlobalStoreActionType.MARK_MAP_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_MAP,
                    currentScreen : store.currentScreen,
                    idNamePairs: store.idNamePairs,
                    likedMapPairs: store.likedMapPairs,
                    currentMaps: [],
                    currentMap: null,
                    currentMapLayer: null,
                    mapTemplate: null,
                    newMapCounter: store.newMapCounter,
                    mapMarkedForDeletion: payload,
                    currentSearchResult: "",
                    currentSortMethod: "",
                    currentRegion: null,
                    currentFeatureIndex: null
                })
            }

            case GlobalStoreActionType.SET_CURRENT_MAP: {
                console.log(payload);
                return setStore({
                    currentModal : store.currentModal,
                    currentScreen : store.currentScreen,
                    idNamePairs: store.idNamePairs,
                    likedMapPairs: store.likedMapPairs,
                    currentMaps: [],
                    currentMap: payload.map,
                    currentMapLayer: payload.mapLayer,
                    mapTemplate: payload.map.mapType,
                    newMapCounter: store.newMapCounter,
                    mapMarkedForDeletion: null,
                    currentSearchResult: "",
                    currentSortMethod: "",
                    currentRegion: null,
                    currentFeatureIndex: null
                })
            }

            case GlobalStoreActionType.SET_CURRENT_REGION: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentScreen : store.currentScreen,
                    idNamePairs: store.idNamePairs,
                    likedMapPairs: store.likedMapPairs,
                    currentMaps: [],
                    currentMap: store.currentMap,
                    currentMapLayer: store.currentMapLayer,
                    mapTemplate: store.mapTemplate,
                    newMapCounter: store.newMapCounter,
                    mapMarkedForDeletion: null,
                    currentSearchResult: "",
                    currentSortMethod: "",
                    currentRegion: payload.region,
                    currentFeatureIndex: payload.featureIndex
                })
            }

            case GlobalStoreActionType.EDIT_MAP_LAYER: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentScreen : store.currentScreen,
                    idNamePairs: store.idNamePairs,
                    likedMapPairs: store.likedMapPairs,
                    currentMaps: [],
                    currentMap: store.currentMap,
                    currentMapLayer: payload,
                    mapTemplate: store.mapTemplate,
                    newMapCounter: store.newMapCounter,
                    mapMarkedForDeletion: null,
                    currentSearchResult: "",
                    currentSortMethod: "",
                    currentRegion: store.currentRegion,
                    currentFeatureIndex: store.currentFeatureIndex
                })
            }

            case GlobalStoreActionType.EDIT_MAP_DATA: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentScreen : store.currentScreen,
                    idNamePairs: store.idNamePairs,
                    likedMapPairs: store.likedMapPairs,
                    currentMaps: [],
                    currentMap: payload,
                    currentMapLayer: store.currentMapLayer,
                    mapTemplate: store.mapTemplate,
                    newMapCounter: store.newMapCounter,
                    mapMarkedForDeletion: null,
                    currentSearchResult: "",
                    currentSortMethod: "",
                    currentRegion: store.currentRegion,
                    currentFeatureIndex: store.currentFeatureIndex
                })
            }

            default:
                return store;
        }
    }

    //NEED TO MODIFY THIS FUNCTION LATER FOR RETRIEVING THE currentMaps[] FOR EACH SCREEN
    store.setScreen = function (screenType) {
        if (screenType === CurrentScreen.HOME) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_SCREEN,
                payload: {
                    screen: CurrentScreen.HOME
                }
            });
            navigate("/");
            store.loadAllIdNamePairs();
        }
        if (screenType === CurrentScreen.USER) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_SCREEN,
                payload: {
                    screen: CurrentScreen.USER
                }
            });
            navigate("/user/" + auth.userToView.id);
        }
        if (screenType === CurrentScreen.MAP_POST) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_SCREEN,
                payload: {
                    screen: CurrentScreen.MAP_POST
                }
            });
            navigate("/post/" + store.currentMap._id);
        }
        if (screenType === CurrentScreen.MAP_EDITOR) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_SCREEN,
                payload: {
                    screen: CurrentScreen.MAP_EDITOR
                }
            });
            navigate("/edit");
        }

    }

    //Creates a  new map
    store.createNewMap = async function(jsonData, mapTemplate)  {
        let newMapTitle = auth.user.username + " - Untitled (" + store.newMapCounter + ")";
        let response = await api.createMap(newMapTitle, jsonData, mapTemplate, auth.user.email, auth.user.username );
        if(response.status == 201) {
            console.log("MAP CREATED");
            tps.clearAllTransactions();
            let newMap = response.data.map;
            console.log(newMap);
            response = await api.getMapLayerById(newMap.mapLayers, newMap.mapType);
                if (response.data.success) {
                    let mapLayer = response.data.mapLayer;
                    console.log("MAPLAYER----------------------------------------------------");
                    console.log(mapLayer);
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_MAP,
                        payload: {
                            newMap: newMap,
                            mapLayer: mapLayer
                        }
                    });

                }

            // storeReducer({
            //     type: GlobalStoreActionType.CREATE_NEW_MAP,
            //     payload: newMap
            // })
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    //Duplicates a map graphic by creating a new map with same data
    store.duplicateMap = async function(id) {
        async function asyncDuplicateMap(id) {
            let response = await api.getMapById(id);
            if (response.data.success) {
                let mapToCopy = response.data.map;
                let mapTitle = "Copy of " + mapToCopy.title;
                let response2 = await api.createMap(mapTitle, mapToCopy.jsonData, mapToCopy.mapType, auth.user.email, auth.user.username );
                //UPDATE THE MAP LAYER AS WELL
                console.log(store.currentMap.mapLayers)
                console.log(response2.data);
                console.log(store);
                let response3 = await api.updateMapLayerById(response2.data.map.mapLayers, mapToCopy.mapType, store.currentMapLayer);
                if (response2.data.success && response3.data.success) {
                    tps.clearAllTransactions();
                    storeReducer({
                        type: GlobalStoreActionType.DUPLICATE_MAP,
                        payload: response2.data.map
                    });
                }
            }
        }
        asyncDuplicateMap(id)
    }

    //Loads all the Id, Name Pairs to list out the maps
    store.loadIdNamePairs = function() {
        async function asyncLoadIdNamePairs() {
            if (auth.user) {
                let response = await api.getMapPairs();

                if (response.data.success) {
                    let idNamePairs = response.data.idNamePairs;
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: idNamePairs,
                    })
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
            }
            else console.log("USER ISNT LOGGED IN")
        }
        asyncLoadIdNamePairs()
    }

    store.getMapsByUser = function() {
        async function asyncLoadIdNamePairs() {
            if (auth.userToView) {
                let response = await api.getMapsByUser(auth.userToView.email);
                if (response.data.success) {
                    let idNamePairs = response.data.idNamePairs;
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: idNamePairs,
                    })
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
            }  
        }
        asyncLoadIdNamePairs()
    }

    store.loadLikedMapPairs = function() {
        async function asyncLoadLikedNamePairs() {
            let response = await api.getLikedMapPairs();
                       
            if (response.data.success) {
                let idNamePairs = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_LIKED_MAP_PAIRS,
                    payload: idNamePairs,
                })
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadLikedNamePairs()
    }

    store.loadAllIdNamePairs = function() {
        async function asyncLoadIdNamePairs() {
            let response = await api.getAllMapPairs();
                console.log(response); 
                if (response.data.success) {
                    let idNamePairs = response.data.idNamePairs;
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: idNamePairs,
                    })
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
        }
        asyncLoadIdNamePairs()
    }
    //Marks the map that is going to be deleted
    store.markMapForDeletion = function(id) {
        async function asyncMarkMapForDeletion(id) {
            let response = await api.getMapById(id);
            if (response.data.success) {
                let mapToDelete = response.data.map;
                storeReducer({
                    type: GlobalStoreActionType.MARK_MAP_FOR_DELETION,
                    payload: mapToDelete,
                })
            }
            else console.log("FAILED TO MARK MAP FOR DELETION");
        } 
        asyncMarkMapForDeletion(id);
    }
    //Deletes the map marked for deletion Removes map with id from store
    store.deleteMap = function (id) {
        async function processDelete(id) {
            console.log(id);
            let response = await api.deleteMapById(id);
            if (response.data.success) {
                store.loadIdNamePairs(); // Reload the idNamePairs and update the user's maps
            }
            else console.log("FAILED TO DELETE MAP");
        }
        processDelete(id);
    }
    store.deleteMarkedMap = function() {
        store.deleteMap(store.mapMarkedForDeletion._id);
    }

    //Sets the current map that is being edited
    store.setCurrentMap = function (id) {
        async function asyncSetCurrentMap(id) {
            let response = await api.getMapById(id);
            if (response.data.success) {
                let map = response.data.map;
                response = await api.getMapLayerById(map.mapLayers, map.mapType);
                if (response.data.success) {
                    let mapLayer = response.data.mapLayer;
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_MAP,
                        payload: {
                            map: map,
                            mapLayer: mapLayer
                        }
                    });

                }
                // storeReducer({
                //     type: GlobalStoreActionType.SET_CURRENT_MAP,
                //     payload: map,
                // })
                
            }
            else console.log("FAILED TO SET CURRENT MAP");
        }
        asyncSetCurrentMap(id);
    }

    store.updateMapDetailsById = function(id, newTitle, newRegions, newDescription) {
        console.log(id);
        console.log(newTitle);
        console.log(newRegions);
        console.log(newDescription);
        async function asyncUpdateMapDetails(id, newTitle, newRegions, newDescription) {
            let response = await api.getMapById(id);
            if (response.data.success) {
                let map = response.data.map;
                map.title = newTitle;
                map.regions = newRegions;
                map.description = newDescription;
                let response2 = await api.updateMapById(id, map);
                if (response2.data.success) {
                    console.log("API UPDATED DETAILS");
                    store.loadIdNamePairs(); //Show Updates on Page
                }
                else {
                    console.log("API COULDN'T UPDATE DETAILS");
                }
            }
            else {
                console.log("MAP NOT FOUND")
            }
        }
        asyncUpdateMapDetails(id, newTitle, newRegions, newDescription);
    }

    store.updateCurrentMap = function() {
        async function asyncUpdateCurrentMap() {
            let response = await api.updateMapById(store.currentMap._id, store.currentMap);
            if (response.data.success) {
                console.log(response.data);
                //UPDATE THE MAP LAYER AS WELL
                response = await api.updateMapLayerById(store.currentMap.mapLayers, store.currentMap.mapType, store.currentMapLayer);
                if (response.data.success) {
                    tps.clearAllTransactions();
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_MAP,
                        // payload: store.currentMap,
                        payload: {
                            map: store.currentMap,
                            mapLayer: store.currentMapLayer
                        }
                    })
                }
            }
        }
        asyncUpdateCurrentMap();
    }

    store.comment = function(comment) {
        async function commentOnMap(comment) {
            if (store.currentMap) {
                let response = await api.getMapById(store.currentMap._id);
                if (response.data.success) {
                    let map = response.data.map;
                    let user = auth.user.username;
                    map.comments.push({ user, message: comment });
                    let response2 = await api.updateMapById(store.currentMap._id, map);
                    if (response2.data.success) {
                        store.setCurrentMap(map._id);
                    }
                    else {
                        console.log("COULDNT POST COMMENT");
                    }
                }
            }
        }
        commentOnMap(comment);
    }

    store.like = function() {
        async function likeMap() {
            if (store.currentMap) {
                let response = await api.likeMapById(store.currentMap._id);
                if (response.data.success) {
                    console.log("Liked map " + store.currentMap._id);
                }
            }
        }
        likeMap();
    }

    store.unlike = function() {
        async function unlikeMap() {
            console.log(store.currentMap);
            if (store.currentMap) {
                let response = await api.unlikeMapById(store.currentMap._id);
                if (response.data.success) {
                    console.log("Unliked map " + store.currentMap._id);
                }
            }
        }
        unlikeMap()
    }

    store.view = function(id) {
        async function viewMap(id) {
            console.log("viewing Map");
            console.log(id);
            let response = await api.viewMapById(id);
            if (response.data.success) {
                console.log("Viewed map " + id);
            }
        }
        viewMap(id);
    }

    store.publish = function(id) {
        async function asyncPublish(id){
            let response = await api.getMapById(id);
            if (response.data.success) {
                let map = response.data.map;
                map.published = true;
                map.publishedDate = new Date();
                let response2 = await api.updateMapById(id, map);
                if (response2.data.success) {
                    console.log("PUBLISHED");
                    store.loadIdNamePairs(); //Show Updates on Page
                    store.setCurrentMap(map._id);
                    navigate("/post/"+map._id);
                }
            }
        }
        asyncPublish(id);
    }

    store.addUpdateLayerTransaction = function (prevLayer) {
        console.log("ADDING UPDATE LAYER TRANSACTION")
        let transaction = new UpdateLayer_Transaction(store, prevLayer, store.currentMapLayer);
        tps.addTransaction(transaction);
        console.log(tps);
        console.log(store.canUndo());
    }

    store.updateCurrentMapLayer = function(mapLayer) {
        console.log(store.currentMapLayer);
        storeReducer({
            type: GlobalStoreActionType.EDIT_MAP_LAYER,
            payload: mapLayer
        });
    }

    store.setCurrentRegion = function(region, featureIndex) {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_REGION,
            payload: {
                region: region,
                featureIndex: featureIndex
            }
        });
    }

    store.publish = function(id) {
        async function asyncPublish(id){
            let response = await api.getMapById(id);
            if (response.data.success) {
                let map = response.data.map;
                map.published = true;
                map.publishedDate = new Date();
                let response2 = await api.updateMapById(id, map);
                if (response2.data.success) {
                    console.log("PUBLISHED");
                    store.loadIdNamePairs(); //Show Updates on Page
                    store.setCurrentMap(map._id);
                    navigate("/post/"+map._id);
                }
            }
        }
        asyncPublish(id);
    }

    store.updateMapData = function(mapData) {
        storeReducer({
            type: GlobalStoreActionType.EDIT_MAP_DATA,
            payload: mapData
        });
    }    



// //Processes changing to User screen with specified username
// store.setCurrentScreenWithUser = (user)

// //Sets the current user with the specified username
// store.setCurrentUser = (user)...

// //Loads all the maps that contains the keyword
// store.loadMapsByKeyword = (keyword)...

// //Loads all the private maps owned by the user
// store.loadPrivateMaps = ()...

// //Loads all the published maps owned by the user
// store.loadPublishedMaps = ()...

// //Loads all the maps liked by the user
// store.loadLikedMaps = ()...

// //Sorts the current maps by the sort method passed
// store.sortCurrentMaps = (sortMethod)... 

// //Processes closing the currently loaded map
    store.closeCurrentMap = function(){
        store.setScreen(CurrentScreen.HOME);
    }

// //Shows the modal for editing the map details
// store.showMapDetailsModal = (mapToEdit)...

// //Adds a transaction for updating the map
// store.addUpdateMapTransaction = (mapData) => {...


// //Increments the number of "likes" of a map graphic
// store.likeMap = (id)

// //Adds a comment to a map graphic
// store.addComment = (message)...

// //Publishes a map graphic, and makes it no longer editable
// store.publishMap = (id)...

// //Hides all the modal from the view
// store.hideModals = ()...

    //Undo a transaction
    store.undo = function () {
        if (store.currentModal === CurrentModal.NONE) tps.undoTransaction();
    }

    // Do a transaction
    store.redo = function () {
        if (store.currentModal === CurrentModal.NONE) tps.doTransaction();
    }

    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo() && store.currentModal === CurrentModal.NONE);
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo() && store.currentModal === CurrentModal.NONE);
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };

