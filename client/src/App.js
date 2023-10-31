import logo from './logo.svg';
import './App.css';
import { React } from 'react'
import HomeWrapper from './components/HomeWrapper';
import LoginModal from './components/LoginModal';

const App = () => {
  return (
    <div className="App">
      <HomeWrapper/>
      {/* <LoginModal/> */}
    </div>
  );
}

export default App;