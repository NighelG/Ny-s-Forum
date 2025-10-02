import React, { useState } from 'react'
import { Await, Link, useNavigate } from 'react-router-dom'
import UserServices from '../../services/UserServices'
import './LoginPage.css'

function LoginPage() {
  /* Const principales */
  const [user,setUser] = useState('')
  const [password,setPassword] = useState('')
  const [errorMsg,setErrorMsg] = useState('')
  const navigate = useNavigate()
  /* Esto es para entrar como invitado */
  const handleInvitado = () => {
    localStorage.setItem(
      "logueado",
      JSON.stringify({
        identificacion: "invitado",
        usuario: "Invitado",
        admin: false
      })
    );
    navigate('/LobbyPage')
}
  /* Funcionalidad entera del login */
  const handleLogin = async() => {
    if (!user || !password){
      setErrorMsg("Por favor llena todos los espacios")
      return
    }
    try{
      const users = await UserServices.getUsers()
      const userFound = users.find(
        (u) => u.userName === user && u.password === password
      )
      if (userFound){
        localStorage.setItem(
          "logueado",
          JSON.stringify({
            identificacion: userFound.id,
            usuario: userFound.userName,
            admin: userFound.admin
          })
        );
        setUser('')
        setPassword('')
        navigate('/LobbyPage')
        console.log("Bienvenido")
      }else{
        setErrorMsg("Usuario o contraseña incorrectos")
        } 
      } catch (error) {
        setErrorMsg("Error al iniciar sesión")
    }
  }
  return (
    <div className='loginBody'>
        <img className='icono' src="/img/NysIcon.png" alt="Ny's Forum" />
        <p>Si no tienes una cuenta</p><Link to={"/RegisterPage"}><h3>Registrate</h3></Link>
        <br /><br />
        <h3>Iniciar Sesion</h3>
        <br />
        <div className='inputGroup'>
            <input type="text" placeholder='Usuario' value={user} onChange={(e) => setUser(e.target.value)} />
          <br /><br />
            <input type="password" placeholder='Contraseña' value={password} onChange={(e) => setPassword(e.target.value)} />
          <br /><br />
        </div>
        <button className='button' onClick={handleLogin}>Logearse</button>
        <button className='button' onClick={handleInvitado}>Invitado</button>
        {errorMsg && <h2>{errorMsg}</h2>}
    </div>
  )
}

export default LoginPage