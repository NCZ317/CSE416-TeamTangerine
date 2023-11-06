import logo from './logo.svg';
import './App.css';
import { React } from 'react'
import HomeWrapper from './components/HomeWrapper';
import LoginModal from './components/LoginModal';
import CreateAccountModal from './components/CreateAccountModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import MapCard from './components/MapCard';
import MapWrapper from './components/MapWrapper';

const App = () => {
  return (
    <div className="App">
      {<MapWrapper/>}
      {/* {<LoginModal/>} */}
    </div>
  );
}

export default App;