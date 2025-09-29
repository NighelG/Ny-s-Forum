import React, { useState } from 'react'
import { Await, Link, useNavigate } from 'react-router-dom'
import PostServices from '../../services/PostServices'
import './DiscussionPage.css'

function DiscussionPage({ isOpen, setIsOpen }) {
  const [title,setTitle] = useState('')
  const [discussion,setDiscussion] = useState('')
  const [media,setMedia] = useState('')
  const [errorMsg,setErrorMsg] = useState('')

  const nuevaDiscusion = async () => {
    if (!title || !discussion){
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

    const newPost = {
      title,
      discussion,
      media: mediaLista,
      dateTime: new Date().toISOString(),
      userId: usuarioLog.identificacion,
      userName: usuarioLog.usuario,
      likes: 0
    }
    try{
      await PostServices.postPost(newPost)
      setTitle('')
      setDiscussion('')
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
            <input type="text" placeholder="Título" className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Redacta la discusión" className="textarea" value={discussion} onChange={(e) => setDiscussion(e.target.value)} />
            <input type="text" placeholder='Agrega una url de un video o imagen (para agregar multiples utiliza comas)' className='input' value={media} onChange={(e) => setMedia(e.target.value)}  />
            <button className="submit-btn" onClick={nuevaDiscusion}>Publicar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscussionPage