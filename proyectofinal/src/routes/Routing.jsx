import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import LoginPage from '../components/Login/LoginPage'
import RegisterPage from '../components/Register/RegisterPage'
import LobbyPage from '../components/Lobby/LobbyPage'
import CommentPage from '../components/CommentPage/CommentPage'

function Routing() {
  return (
    <div>
        <Router>
            <Routes>
              <Route path='/' element= {<LoginPage/>} />
              <Route path='/RegisterPage' element= {<RegisterPage/>} />
              <Route path='/LobbyPage' element= {<LobbyPage/>} />
              <Route path='/CommentPage/:id' element= {<CommentPage/>} />
            </Routes>
        </Router>
    </div>
  )
}

export default Routing