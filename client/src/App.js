import logo from './logo.svg';
import './App.css';
import { React } from 'react'
import AppBanner from './components/AppBanner';
import HomeWrapper from './components/HomeWrapper';
import LoginModal from './components/LoginModal';
import CreateAccountModal from './components/CreateAccountModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import CreateMapModal from './components/CreateMapModal';
import EditDetailsModal from './components/EditDetailsModal';
import DeleteMapModal from './components/DeleteMapModal';
import MapCard from './components/MapCard';
import MapDiscovery from './components/MapDiscovery';
import PostWrapper from './components/PostWrapper';
import ProfileWrapper from './components/ProfileWrapper';
import MapWrapper from './components/MapWrapper';
import ScreenWrapper from './components/ScreenWrapper';


import {AuthContextProvider} from './auth';
import { GlobalStoreContextProvider } from './store';


const App = () => {
  return (

    <AuthContextProvider>
      <GlobalStoreContextProvider>
        <AppBanner/>
        <ScreenWrapper/>
      </GlobalStoreContextProvider>
    </AuthContextProvider>

  );
}

export default App;