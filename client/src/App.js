import logo from './logo.svg';
import './App.css';
import { React } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import MapEditorWrapper from './components/MapEditorWrapper';
import ResetPasswordScreen from './components/ResetPasswordScreen'

import {AuthContextProvider} from './auth';
import { GlobalStoreContextProvider } from './store';

const App = () => {
  return (
    <Router>
      <AuthContextProvider>
        <GlobalStoreContextProvider>
          <AppBanner/>
          <Routes>
            <Route path="/" element={<HomeWrapper />} />
            <Route path="/user/:id" element={<ProfileWrapper />} />
            <Route path="/post/:id" element={<PostWrapper />} />
            <Route path="/edit" element={<MapEditorWrapper />} />
            <Route path="/reset" element={<ResetPasswordScreen />} />
          </Routes>
          {/* <ScreenWrapper/> */}
        </GlobalStoreContextProvider>
      </AuthContextProvider>
    </Router>

  );
}

export default App;