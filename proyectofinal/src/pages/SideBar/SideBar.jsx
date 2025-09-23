import React, { useEffect, useState } from "react"
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import './SideBar.css'

import UserServices from '../../services/UserServices'

function SideBar() {
    /* Const de la sidebar */
    const [isOpen, setIsOpen] = useState(true)
    const [userData, setUserData] = useState(null)
    /* Const de personalizacion */
    const [pfp, setPfp] = useState('')
    const [descripcion, setDescripcion] = useState('')
    /* Const de datos del usuario */
    const [newName,setNewName] = useState('')
    const [newEmail,setNewEmail] = useState('')
    const [newPassword,setNewPassword] = useState('')
    const [oldPassword,setOldPassword] = useState('')
    
    useEffect(() => {
        const logged = JSON.parse(localStorage.getItem("logueado"))
        if (logged){
            UserServices.getUsers().then((users) => {
                const found = users.find((u) => u.id === logged.identificacion)
                if (found) setUserData(found)
            })
        }
    }, [])
    /* Patch de personalizacion */
    async function updateUser() {
        const actualizacion ={}
        if (pfp) actualizacion.profileIcon= pfp
        if (descripcion) actualizacion.description = descripcion
        if (Object.keys(actualizacion).length === 0){
            return
        }
        const uptadeUser = await UserServices.patchUser(userData.id, actualizacion)
        window.location.reload()
    }
    /* Patch de datos del usuario */
    async function updateData() {
        const update ={}
        if (newName) update.userName=newName
        if (newEmail) update.email=newEmail
        if (newPassword) update.password=newPassword
        if (Object.keys(update).length === 0){
            return
        }
        const uptadeData = await UserServices.patchUser(userData.id, update)
        window.location.reload()
    }
    
  return (
    <div>
        <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
            <Sidebar className="sidebar">
                <Menu>
                    <SubMenu label="Usuario">
                        {userData ? (
                            <div className="usuarioInfo">
                                <img className="pfp" src={userData.profileIcon || "/img/defaultPFP.jpg"} alt="pfp" />
                                <p className="username">{userData.userName}</p>
                                <p className="id">id: #{userData.id}</p>
                                <p className="email">correo:{userData.email}</p>
                                <p className="description">{userData.description || "Sin descripcion"}</p>
                            </div>
                        ):(
                            <p>Eu, no deberias de estar aqui sin haberte logueado</p>
                        )}
                    </SubMenu>
                    <SubMenu label="Personalización">
                        <div>
                            <h4>Cambiar foto de perfil</h4>
                            <label >
                                <input className="cambiarPfp" type="url" placeholder="Añade una url valida" value={pfp} onChange={(e) => setPfp(e.target.value)}/>
                                <br />
                                <h4>Descripcion</h4>
                                <input type="text" placeholder="Agrega una descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}/>
                                <br /><br />
                                <button onClick={updateUser}><img className="tinyIcon" src="/img/penciledit.png" alt="" /></button>
                            </label>
                            <br /><br />
                            {/* <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                                {isOpen ? "Cerrar menú" : "Abrir menú"}
                            </button> */}
                        </div>
                    </SubMenu>
                    <SubMenu label="Ajustes de la cuenta">
                            <div>
                                <h4>Modificar datos del usuario</h4>
                                <input type="text" placeholder="Nuevo nombre de usuario" value={newName} onChange={(e) => setNewName(e.target.value)} />
                                <br /><br />
                                <input type="email" placeholder="Nuevo email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}/>
                                <br /><br />
                                <input type="password" placeholder="Nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                                <br /><br />
                                <p>Coloque la contraseña antigua para confirmar los cambios</p>
                                {<input type="password" placeholder="Contraseña antigua" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/> }
                                <br /><br />
                                <button onClick={updateData}>Realizar cambios</button>
                                <br /><br />
                            </div>
                    </SubMenu>
                </Menu>
            </Sidebar>
        </div>
    </div>
  )
}

export default SideBar