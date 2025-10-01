import React, { useState, useEffect } from 'react'
import CommentServices from '../../services/CommentServices'
import '../Discussion/DiscussionPage.css'

function CommentMenu({ isOpen, setIsOpen, postId, parentCommentId = null, onNewComment }) {
  const [response, setResponse] = useState('')
  const [media, setMedia] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

    const usuarioLog = JSON.parse(localStorage.getItem('logueado'))
    if (!usuarioLog){
      setErrorMsg("No puedes publicar sin iniciar sesion")
      return
    }

  const clearAndClose = () => {
    setResponse('')
    setMedia('')
    setErrorMsg('')
    setIsOpen(false)
  }

  const nuevaRespuesta = async () => {
    if (!response) {
      setErrorMsg("Llena todos los espacios")
      return
    }
    if (!usuarioLog) {
      setErrorMsg("No puedes publicar sin iniciar sesión")
      return
    }
    
    const mediaLista = media
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0)

    const newComment = {
      postId,
      response,
      media: mediaLista,
      dateTime: new Date().toISOString(),
      userId: usuarioLog.identificacion,
      userName: usuarioLog.usuario,
      likes: 0,
      likedUsers: [],
      replies: [],
      profileIcon: usuarioLog.profileIcon || "/img/defaultPFP.jpg"
    }

    try {
      if (parentCommentId) {
        const allComments = await CommentServices.getComments()
        const parent = allComments.find(c => String(c.id) === String(parentCommentId))
        if (!parent) throw new Error("Comentario padre no encontrado")
        const newReply = {
          userId: usuarioLog.identificacion,
          userName: usuarioLog.usuario,
          profileIcon: usuarioLog.profileIcon || "/img/defaultPFP.jpg",
          response,
          text: response,
          media: mediaLista,
          dateTime: new Date().toISOString()
        }
        const updatedReplies = [...(parent.replies || []), newReply]
        const patched = await CommentServices.patchComment(parentCommentId, { replies: updatedReplies })
        if (onNewComment) onNewComment(parentCommentId, patched.replies || updatedReplies)
        clearAndClose()
      } else {
        const saved = await CommentServices.postComment(newComment)
        if (onNewComment) onNewComment(saved)
        clearAndClose()
      }
    } catch (err) {
      console.error("Error al publicar:", err)
      setErrorMsg('Error al publicar')
    }
  }

  return (
    <div>
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
      <div className={`drawer-container ${isOpen ? "open" : ""}`}>
        <div className="drawer-content-wrapper">
          <div className="drawer-header">
            <h2>{parentCommentId ? "Responder comentario" : "Empezar discusión"}</h2>
            <button className="close-btn" onClick={() => { setIsOpen(false) }}><img className='tinyIcon' src="/img/closemenu.png" alt="X" /></button>
          </div>
          <div className="drawer-content">
            {errorMsg && <p>{errorMsg}</p>}
            <textarea placeholder="Redacta la respuesta" className="textarea" value={response} onChange={(e) => setResponse(e.target.value)} />
            <input type="text" placeholder='Agrega una url de un video o imagen (para agregar multiples utiliza comas)' className='input' value={media} onChange={(e) => setMedia(e.target.value)}  />
            <button className="submit-btn" onClick={nuevaRespuesta}>Publicar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentMenu