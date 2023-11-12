import logo from './logo.svg';
import './App.css';
import { React } from 'react'
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


import {AuthContextProvider} from './auth';


const App = () => {
  return (

    <AuthContextProvider>
      <HomeWrapper/>
    </AuthContextProvider>

  );
}

export default App;