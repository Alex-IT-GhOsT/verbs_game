import React from "react";
import { useState } from "react";
import { BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import Card from "./card/Card.js";
import FormRegister from "./form/Form.js";
import Login from "./login/Login.js";
import AboutCart from "./aboutCart/AboutCart.js";
import Navigation from "./navigation/Navigation.js";
import RestartGame from "./restartGame/RestartGame.js";
import UserSuccess from "./userSuccess/UserSucces.js";
import LogOut from "./logOut/LogOut.js";
import Home from "./home/Home.js";
import Progress from "./progress/Progress.js";

function App() {  

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [isAuthorizationUser, setIsAuthorizationUser] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsAuthorizationUser(true);
  }
  const handleLogOut = () => {
    setIsLoggedIn(false);
  }

  const getName = (name) => {
    setName(name);
  }

  return (
    <div className="mainBlock">
      <div className="container"> 
       <Router>
          <Navigation isLoggedIn={isLoggedIn} name={name} />
          {isAuthorizationUser ? (
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/loginUser" element={<Login handleLogin={handleLogin} getName={getName}/>} />
            <Route path="/registerUser" element={<FormRegister handleLogin={handleLogin} getName={getName} />} />
            <Route path={`/progress/${name}`} element={<Progress />} />
            <Route path="/game" element={<Card />} /> 
            <Route path="/game/About" element={<AboutCart/>} />
            <Route path="/game/At" element={<AboutCart/>} />
            <Route path="/game/Away" element={<AboutCart/>} />
            <Route path="/game/By" element={<AboutCart/>} />
            <Route path="/game/Down" element={<AboutCart/>} />
            <Route path="/game/Off" element={<AboutCart/>} />
            <Route path="/game/Out" element={<AboutCart/>} />
            <Route path="/game/Up" element={<AboutCart/>} />
            <Route path="/isRestartGame" element={<RestartGame />} />
            <Route path="/userSuccess" element={<UserSuccess name={name} />} />
            <Route path="/logOut" element={<LogOut handleLogOut={handleLogOut} />} /> 
          </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/loginUser" element={<Login handleLogin={handleLogin} getName={getName}/>} />
              <Route path="/registerUser" element={<FormRegister handleLogin={handleLogin} getName={getName}/>} />
            </Routes>
          )}
          
        </Router>
      </div>
    </div>
    
  );
}

export default App;
