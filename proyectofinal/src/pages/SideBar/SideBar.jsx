import React, { useEffect, useState } from "react"
import { Await, Link, useNavigate } from 'react-router-dom'
import './SideBar.css'
import UserServices from '../../services/UserServices'

function SideBar() {
    const navigate = useNavigate()
    /* Const de la sidebar */
    const [isOpen, setIsOpen] = useState(true)
    const [userData, setUserData] = useState(null)
    const [activeMenu, setActiveMenu] = useState(null)
    const [pfp, setPfp] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [newName,setNewName] = useState('')
    const [newEmail,setNewEmail] = useState('')
    const [newPassword,setNewPassword] = useState('')
    const [oldPassword,setOldPassword] = useState('')
    const [errorMsg,setErrorMsg] = useState('')
    const usuarioLog = JSON.parse(localStorage.getItem('logueado'))
    /* Esta funcion es para encontrar el usuario y obtener su informacion con localStorage y un get */
    useEffect(() => {
        const logged = JSON.parse(localStorage.getItem("logueado"))
        if (logged){
            UserServices.getUsers().then((users) => {
                const found = users.find((u) => u.id === logged.identificacion)
                if (found) setUserData(found)
            })
        }
    }, [])
    /* Esto es para verificar que el correo sea valido */
    function validarCorreo(correo) {
        const dirrecPopular = /^[a-zA-Z0-9._%+-]+@(gmail\.com|googlemail\.com|hotmail\.com|outlook\.com|live\.com|yahoo\.com|yahoo\.es)$/i;
        if (!dirrecPopular.test(correo)) {
        console.log("Correo no válido");
        return false;
        }
        return true;
    }
    /* Patch de personalizacion */
    const imgLocal = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => setPfp(reader.result)
        reader.readAsDataURL(file)
        };
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
        if (oldPassword !== userData.password){
            /* Este log es un placeholder, sigue aqui es que se me olvido sacarlo */
            setErrorMsg("contraseña antigua no valida");
            return
        }
        if (!validarCorreo(newEmail)) {
        setErrorMsg("Por favor ingresa un correo válido")
        return
        }
        if (newName) update.userName=newName
        if (newEmail) update.email=newEmail
        if (newPassword) update.password=newPassword
        if (Object.keys(update).length === 0){
            return
        }
        const uptadeData = await UserServices.patchUser(userData.id, update)
        window.location.reload()
    }
    /* Boton de cerrar sesion */
        function logOut(){
            localStorage.removeItem('logueado')
            navigate('/')
            console.log("Sesion cerrada")
        }
    /* Esto es solo para la sidebar+ */
    const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu)
    }
    /* Esto prerenderiza ciertos datos */
    useEffect(() => {
    if (userData) {
        setNewName(userData.userName)
        setNewEmail(userData.email)
        setDescripcion(userData.description)
    }
    }, [userData])
  return (
    <div>
        <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
            <div className="sidebar">
                <div className="sidebar-submenu">
                    <div className="sidebar-submenu-label" onClick={() => toggleMenu("usuario")}>
                        Usuario
                    </div>
                    <div className={`sidebar-submenu-content ${activeMenu === "usuario" ? "open" : ""}`}>
                        {userData ? (
                        <div className="sidebar-usuarioInfo">
                            <img className="sidebar-pfp" src={userData.profileIcon || "/img/defaultPFP.jpg"} alt="pfp"/>
                            <h2 className="sidebar-username">{userData.userName}</h2>
                            <p className="sidebar-description">{userData.description || "Sin descripcion"}</p>
                            <p className="sidebar-email">{userData.email}</p>
                        </div>
                        ) : (
                        <p>Eu, no deberías de estar aquí sin haberte logueado</p>
                        )}
                    </div>
                </div>
                <div className="sidebar-submenu">
                    <div className="sidebar-submenu-label" onClick={() => toggleMenu("personalizacion")}>
                        Personalización
                    </div>
                    <div className={`sidebar-submenu-content ${activeMenu === "personalizacion" ? "open" : ""}`}>
                        <h4>Cambiar foto de perfil</h4>
                        <p>Utiliza una url o subela localmente</p>
                        <input className="sidebar-input" type="url" placeholder="Añade una url válida" value={pfp} onChange={(e) => setPfp(e.target.value)} />
                        <br /><br />
                        <input className="sidebar-input" type="file" accept="image/*" onChange={imgLocal}  />
                        <h4>Descripción</h4>
                        <textarea className="textarea" type="text" placeholder="Agrega una descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                            <br /><br />
                        <button className="sidebar-button" onClick={updateUser}> <img className="sidebar-tinyIcon" src="/img/penciledit.png" alt="" /> </button>
                    </div>
                </div>
                <div className="sidebar-submenu">
                    <div className="sidebar-submenu-label" onClick={() => toggleMenu("ajustes")}>
                        Ajustes de la cuenta
                    </div>
                    <div className={`sidebar-submenu-content ${activeMenu === "ajustes" ? "open" : ""}`}>
                        <h4>Modificar datos del usuario</h4>
                        <input className="sidebar-input" type="text" minLength="3" maxLength="20" placeholder="Nuevo nombre de usuario" value={newName} onChange={(e) => setNewName(e.target.value)} />
                        <input className="sidebar-input" type="email" placeholder="Nuevo email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} /> 
                        <p>Coloque la contraseña antigua para confirmar los cambios</p>
                        <input className="sidebar-input" type="password" placeholder="Contraseña antigua" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />                     
                        <input className="sidebar-input" type="password" minLength="8" maxLength="15" placeholder="Nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <button className="sidebar-button" onClick={updateData}>Realizar cambios</button>
                    </div>
                </div>
                {errorMsg && <h2>{errorMsg}</h2>}
                <button className="sidebar-logout" onClick={logOut}>Cerrar sesión</button>
                {usuarioLog?.admin && (
                    <button className="button" onClick={() => navigate("/AdminPage")}>Panel Admin</button>
                )}
            </div>
        </div>
    </div>
  )
}

export default SideBar