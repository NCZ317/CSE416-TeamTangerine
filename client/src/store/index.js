import { createContext, useContext, useState } from 'react'
// import { useHistory} from 'react-router-dom'
import api from './store-request-api'
import AuthContext from '../auth'
import { useNavigate } from 'react-router-dom';
import { json } from 'body-parser';



// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CLOSE_CURRENT_MAP: "CLOSE_CURRENT_MAP",
    CREATE_NEW_MAP: "CREATE_NEW_MAP",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    LOAD_CURRENT_MAPS: "LOAD_CURRENT_MAPS",
    MARK_MAP_FOR_DELETION: "MARK_MAP_FOR_DELETION",
    SET_CURRENT_MAP: "SET_CURRENT_MAP",
    EDIT_MAP_DETAILS: "EDIT_MAP_DETAILS",
    EDIT_MAP_GRAPHICS: "EDIT_MAP_GRAPHICS",
    MARK_MAP_FOR_DELETION: "MARK_MAP_FOR_DELETION",
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
        currentMaps: [],
        currentMap: null,
        mapTemplate: null,
        newMapCounter: 0,
        mapMarkedForDeletion: null,
        currentSearchResult: "",
        currentSortMethod: "",
    });

    const navigate = useNavigate();

    console.log("inside useGlobalStore");

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
                    currentMaps: [],
                    currentMap: null,
                    mapTemplate: null,
                    newMapCounter: store.newMapCounter,
                    mapMarkedForDeletion: null,
                    currentSearchResult: "",
                    currentSortMethod: "",
                });
            }
            case GlobalStoreActionType.CREATE_NEW_MAP: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentScreen : payload.screen,
                    idNamePairs: [],
                    currentMaps: [],
                    currentMap: payload,
                    mapTemplate: payload.mapType,
                    newMapCounter: store.newMapCounter + 1,
                    mapMarkedForDeletion: null,
                    currentSearchResult: "",
                    currentSortMethod: "",
                });
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
            
        }
        if (screenType === CurrentScreen.USER) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_SCREEN,
                payload: {
                    screen: CurrentScreen.USER
                }
            });
            navigate("/user");
        }
        if (screenType === CurrentScreen.MAP_POST) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_SCREEN,
                payload: {
                    screen: CurrentScreen.MAP_POST
                }
            });
            navigate("/post");
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
        const response = await api.createMap(newMapTitle, jsonData, mapTemplate, auth.user.email, auth.user.username );
        console.log(response);
        if(response.status == 201) {
            tps.clearAllTransactions();
            let newMap = response.data.map;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_MAP,
                payload: newMap
            })
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }


// //Processes changing to User screen with specified username
// store.setCurrentScreenWithUser = (user)

// //Sets the current user with the specified username
// store.setCurrentUser = (user)...

// //Loads all the Id, Name Pairs to list out the maps
// store.loadIdNamePairs = ()...

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

// //Sets the current map that is being edited
// store.setCurrentMap  =(id) => {}

// //Shows the modal for editing the map details
// store.showMapDetailsModal = (mapToEdit)...

// //Adds a transaction for updating the map
// store.addUpdateMapTransaction = (mapData) => {...

// //Updates the map data of the current map
// store.updateMap = (mapData)...

// //Marks the map that is going to be deleted
// store.markMapForDeletion = (id)...

// //Deletes the map marked for deletion
//Removes map with id from store
// store.deleteMap = (id)...

// //Increments the number of "likes" of a map graphic
// store.likeMap = (id)

// //Adds a comment to a map graphic
// store.addComment = (message)...

// //Duplicates a map graphic by creating a new map with same data
// store.duplicateMap = (id)...

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

