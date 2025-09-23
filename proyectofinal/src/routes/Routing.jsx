import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import LoginPage from '../components/Login/LoginPage'
import RegisterPage from '../components/Register/RegisterPage'
import DiscussionPage from '../components/Discussion/DiscussionPage'
import LobbyPage from '../components/Lobby/LobbyPage'

function Routing() {
  return (
    <div>
        <Router>
            <Routes>
              <Route path='/LoginPage' element= {<LoginPage/>} />
              <Route path='/RegisterPage' element= {<RegisterPage/>} />
              <Route path='/DiscussionPage' element= {<DiscussionPage/>} />
              <Route path='/LobbyPage' element= {<LobbyPage/>} />
            </Routes>
        </Router>
    </div>
  )
}

export default Routing