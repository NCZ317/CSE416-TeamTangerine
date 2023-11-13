import { useContext } from 'react'
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'
import ProfileWrapper from './ProfileWrapper';
import PostWrapper from './PostWrapper';
import HomeWrapper from './HomeWrapper';


//THIS CLASS IS MAINLY USED FOR NAVIGATING BETWEEN DIFFERENT SCREENS BASED ON THE currentScreen VALUE IN GLOBAL STORE

export default function ScreenWrapper() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    
    if (store.currentScreen === "USER") {
        return <ProfileWrapper/>
    } else if (store.currentScreen === "MAP_POST") {
        return <PostWrapper/>
    } else if (store.currentScreen === "EDIT") {
        //RETURN THE MAPEDITOR SCREEN WHERE USER IS EDITING THE CURRENT MAP
    } else {
        return <HomeWrapper/>
    }

}

