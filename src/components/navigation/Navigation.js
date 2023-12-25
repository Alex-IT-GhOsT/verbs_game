import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Navigation.css'

const Navigation = ({isLoggedIn, name}) => {
    
    return (
      <nav className="nav nav-pills nav-fill">
        <Link className="nav-link" to='/'>Home</Link>
        {isLoggedIn ? (
          <>
          <Link className="nav-link" to="/game">Game</Link>
          <Link className="nav-link" to={`/progress/${name}`}><strong>Progress {name}</strong></Link>
          <Link className="nav-link" to="/logOut">Logout</Link>
          </>
        ) : (
          <>
          <Link className="nav-link" to="/registerUser">Register</Link>
          <Link className="nav-link" to="/loginUser">Login</Link>
          </>
        )}
        
      </nav>
      )
}

export default Navigation;