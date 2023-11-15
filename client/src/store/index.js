import { createContext, useContext, useState } from 'react'
// import { useHistory} from 'react-router-dom'
import api from './store-request-api'
import AuthContext from '../auth'
import { useNavigate } from 'react-router-dom';



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
// const tps = new jsTPS();


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
                    newMapCounter: store.newMapCounter,
                    mapMarkedForDeletion: null,
                    currentSearchResult: "",
                    currentSortMethod: "",
                });
            }

            default:
                return store;
        }
    }



    //IMPLEMENT THE STORE FUNCTIONS BELOW


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

