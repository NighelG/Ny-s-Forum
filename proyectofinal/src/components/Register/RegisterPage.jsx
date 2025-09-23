import React, { useState } from 'react'
import { Await, Link, useNavigate } from 'react-router-dom'
import UserServices from '../../services/UserServices'

function RegisterPage() {
  /* Const Principales*/
  const [user,setUser] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirmarPassword,setConfirmarPassword] = useState('')
  const [errorMsg,setErrorMsg] = useState('')
  const navigate = useNavigate()

  const handleRegistro = async()=>{
    if (!user || !email || !password || !confirmarPassword) {
      setErrorMsg("Por favor, llena todos los espacios")
      return
    }
    if (password !== confirmarPassword){
      setErrorMsg("Las contraseñas no son iguales")
      return
    }
    const newUser = {
      userName: user,
      email: email,
      password: password,
      profileIcon:"",
      description:""
    }

    try{
      await UserServices.postUser(newUser)
      navigate('/LoginPage')
    } catch (error) {
      setErrorMsg("Error al registrar el usuario")
    }
  }
  return (
    <div>
      <h1>Ny's Forum</h1> 
      <br />
      <h2>Registro</h2>
      <p>Completa los siguientes espacios</p>
      <br /><br />

      <label >
        <input type="text" placeholder='Nombre del Usuario' value={user} onChange={(e) => setUser(e.target.value)}/>
      </label>
      <br /><br />

      <label >
        <input type="email" placeholder='Correo' value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br /><br />

      <label >
        <input type="password" placeholder='Contraseña' value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
        <br /><br />

      <label >
        <input type="password" placeholder='Confirmar Contraseña' value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} />
      </label>
      <br /><br />
      <button onClick={handleRegistro}>Registrarse</button>

      {errorMsg && <h2>{errorMsg}</h2>}

    </div>
  )
}

export default RegisterPage