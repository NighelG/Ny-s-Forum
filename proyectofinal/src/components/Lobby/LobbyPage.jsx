import React from 'react'
import { Await, Link, useNavigate } from 'react-router-dom'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import UserServices from '../../services/UserServices'
import SideBar from '../../pages/SideBar/SideBar'
import '../Lobby/LobbyPage.css'


function LobbyPage() {
  return (
    <div>
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
            <h2>Iniciar nueva discusion</h2>
            <button><img src="/img/discu.png" alt="" /></button>
        </div>
        <br />
        <p>Discusiónes</p>
            <br />
        <div>
            
        </div>
    </div>
  )
}

export default LobbyPage