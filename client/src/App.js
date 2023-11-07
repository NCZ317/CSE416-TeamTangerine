import logo from './logo.svg';
import './App.css';
import { React } from 'react'
import HomeWrapper from './components/HomeWrapper';
import LoginModal from './components/LoginModal';
import CreateAccountModal from './components/CreateAccountModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import MapCard from './components/MapCard';
import MapDiscovery from './components/MapDiscovery';
import PostWrapper from './components/PostWrapper';
import ProfileWrapper from './components/ProfileWrapper';

const App = () => {
  return (
    <div className="App">
      
      <HomeWrapper />
      {/* <LoginModal/> */}
      {/* <CreateAccountModal/> */}
      {/* <ForgotPasswordModal/> */}
      {/* <PostWrapper /> */}
      {/* <ProfileWrapper /> */}
    </div>
  );
}

export default App;