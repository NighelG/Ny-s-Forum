import React, { useState } from 'react'
import { Await, Link, useNavigate } from 'react-router-dom'
import UserServices from '../../services/UserServices'
import './RegisterPage.css'

function RegisterPage() {
  /* Const Principales*/
  const [user,setUser] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirmarPassword,setConfirmarPassword] = useState('')
  const [errorMsg,setErrorMsg] = useState('')
  const navigate = useNavigate()

  /* Esto es solo para subir los datos al db.json */
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
      /* Estos 2 estan vacios a proposito ya que despues se utilizan */
      profileIcon:"",
      description:""
    }
    try{
      /* Esto es una libertad creativa, en lugar de dar a entender al usuario que su registro fue exitoso con un mensaje lo hago con una reubicacion en el sitio */
      await UserServices.postUser(newUser)
      navigate('/')
      console.log("Registrado con exito");
      
    } catch (error) {
      setErrorMsg("Error al registrar el usuario")
    }
  }
  return (
    <div className='registerBody'>
      <h1>Ny's Forum</h1> 
      <br />
      <h2>Registro</h2>
      <p>Completa los siguientes espacios</p>
      <br /><br />
      <label >
        <input type="text" placeholder='Nombre del Usuario' minLength={"3"} maxLength={"20"} value={user} onChange={(e) => setUser(e.target.value)}/>
      </label>
      <br /><br />
      <label >
        <input type="email" placeholder='Correo' value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br /><br />
      <label >
        <input type="password" placeholder='Contraseña' minLength={"8"} maxLength={"15"} value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
        <br /><br />
      <label >
        <input type="password" placeholder='Confirmar Contraseña' value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} />
      </label>
      <br /><br />
      <button className='button' onClick={handleRegistro}>Registrarse</button>

      {errorMsg && <h2>{errorMsg}</h2>}

    </div>
  )
}

export default RegisterPage