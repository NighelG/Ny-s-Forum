import React, { useState } from 'react'
import SideBar from '../../pages/SideBar/SideBar'
import '../Lobby/LobbyPage.css'
import DiscussionPage from '../../pages/Discussion/DiscussionPage'


function LobbyPage() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className='lobbybody'>
        <h1>Ny's Forum</h1>
            <br /><br />
            <SideBar />
        <div>
            <label >
                <input type="search" placeholder='Buscar' />
                <select>
                    <option value="todas">Todas</option>
                    <option value="nuevo">Mas reciente</option>
                    <option value="viejo">Menos reciente</option>
                </select>
            </label>
        </div>
        <div>
            <h2>Iniciar nueva discusión</h2>
            <button className='button' onClick={() => setIsDrawerOpen(true)}> <img className='tinymedium' src="/img/discu.png" alt="" /></button>
        </div>
        <br />
        <p>Discusiónes</p>
            <br />
        <div>
            
        </div>

        <DiscussionPage isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
    </div>
  )
}

export default LobbyPage