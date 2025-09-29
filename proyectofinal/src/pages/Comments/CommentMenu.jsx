
import React, { useState } from 'react'
import { Await, Link, useNavigate } from 'react-router-dom'
import CommentServices from '../../services/CommentServices'
import '../Discussion/DiscussionPage.css'

function CommentMenu({ isOpen, setIsOpen }) {
    const [response,setresponse] = useState('')
    const [media,setMedia] = useState('')
    const [errorMsg,setErrorMsg] = useState('')
  
    const nuevaRespuesta = async () => {
      if (!response){
        setErrorMsg("Llena todos los espacios")
        return
      }
      const usuarioLog = JSON.parse(localStorage.getItem('logueado'))
      if (!usuarioLog){
        setErrorMsg("No puedes publicar sin iniciar sesion")
        return
      }
      const mediaLista = media
        .split(',')
        .map((url) => url.trim())
        .filter ((url) => url.length > 0)
  
      const newComment = {
        response,
        media: mediaLista,
        dateTime: new Date().toISOString(),
        userId: usuarioLog.identificacion,
        userName: usuarioLog.usuario,
        likes: 0
      }
      try{
        await CommentServices.postComment(newComment)
        setresponse('')
        setMedia('')
        setErrorMsg('')
        setIsOpen(false)
        window.location.reload()
      }
      catch (error){
        setErrorMsg('Error al publicar')
      }
    }
  return (
    <div>
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
      <div className={`drawer-container ${isOpen ? "open" : ""}`}>
        <div className="drawer-content-wrapper">
          <div className="drawer-header">
            <h2>Empezar discusión</h2>
            <button className="close-btn" onClick={() => setIsOpen(false)}><img className='tinyIcon' src="/img/closemenu.png" alt="X" /></button>
          </div>
          <div className="drawer-content">
            {errorMsg && <p>{errorMsg}</p>}
            <textarea placeholder="Redacta la respuesta" className="textarea" value={response} onChange={(e) => setresponse(e.target.value)} />
            <input type="text" placeholder='Agrega una url de un video o imagen (para agregar multiples utiliza comas)' className='input' value={media} onChange={(e) => setMedia(e.target.value)}  />
            <button className="submit-btn" onClick={nuevaRespuesta}>Publicar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentMenu
