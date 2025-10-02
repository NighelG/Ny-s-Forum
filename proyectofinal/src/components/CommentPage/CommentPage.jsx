import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PostServices from '../../services/PostServices'
import UserServices from '../../services/UserServices'
import CommentServices from '../../services/CommentServices'
import CommentMenu from '../../pages/Comments/CommentMenu'
import SideBar from '../../pages/SideBar/SideBar'
import '../CommentPage/CommentPage.css'
import { Await, Link, useNavigate } from 'react-router-dom'

  function CommentPage() {
    /* Const principales */
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [comment, setComment] = useState([])
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [loadingPost, setLoadingPost] = useState(true)
    const [loadingComment, setLoadingComment] = useState(true)
    const [searchName, setSearchName] = useState('')
    const [replyTarget, setReplyTarget] = useState(null)
    /* Const los cuales no encajan en otra categoria */
    const usuarioLog = JSON.parse(localStorage.getItem('logueado'))
    const commentFilter = comment.filter(c => c.userName.toLowerCase().includes(searchName.toLowerCase()))
    /* Este UE es para traer los post/discusiones del db.json */
    useEffect(() => {
        const traerPost = async () => {
        try {
            const posts = await PostServices.getPosts()
            const users = await UserServices.getUsers()
            const postEncontrado = posts.find(p => String(p.id) === String(id))
            if (!postEncontrado) {
            setLoadingPost(false)
            return
            }
            const user = users.find(u => u.id === postEncontrado.userId)
            setPost({
            ...postEncontrado,
            userName: user?.userName || 'Usuario desconocido',
            profileIcon: user?.profileIcon || "/img/defaultPFP.jpg"
            })
        } catch (err) {
            console.error("Error al cargar la discusión:", err)
        } finally {
            setLoadingPost(false)
        }
        }
        traerPost()
    }, [id])
    /* Este se encarga de las respuestas al post en general */
    useEffect(() => {
        const traerComment = async () => {
        try {
            const allComment = await CommentServices.getComments()
            const users = await UserServices.getUsers()
            const commentFiltrados = allComment
            .filter(c => String(c.postId) === String(id))
            .map(c => {
                const user = users.find(u => u.id === c.userId)
                return {
                ...c,
                userName: user?.userName || c.userName || 'Usuario desconocido',
                profileIcon: user?.profileIcon || c.profileIcon || "/img/defaultPFP.jpg",
                replies: (c.replies || []).map(r => {
                const replyUser = users.find(u => u.id === r.userId)
                return {
                    ...r,
                    userName: replyUser?.userName || r.userName || 'Usuario desconocido',
                    profileIcon: replyUser?.profileIcon || r.profileIcon || "/img/defaultPFP.jpg",
                    dateTime: r.dateTime || new Date().toISOString(),
                    response: r.response || r.text || ''
                }
                }),
                likes: c.likes || 0,
                likedUsers: c.likedUsers || []
                }
            })
            setComment(commentFiltrados)
        } catch (err) {
            console.error("Error al cargar los comentarios:", err)
        } finally {
            setLoadingComment(false)
        }
        }
        traerComment()
    }, [id])
    /* Boton para dar like */
    const btnLike = (commentId, userId) => {
        setComment(prev => prev.map(c => {
        if (c.id === commentId) {
            const hasLiked = (c.likedUsers || []).includes(userId)
            const newLike = hasLiked ? c.likes - 1 : c.likes + 1
            const newLikedUsers = hasLiked ? (c.likedUsers || []).filter(u => u !== userId) : [...(c.likedUsers || []), userId]
            CommentServices.patchComment(commentId, { likes: newLike, likedUsers: newLikedUsers })
            .catch(err => console.error("Error al actualizar likes:", err))
            return { ...c, likes: newLike, likedUsers: newLikedUsers }
        }
        return c
        }))
    }
    /* Esto si no me acuerdo para que sirve */
    const handleNewComment = (idOrComment, replies) => {
        if (replies) {
        setComment(prev => prev.map(c => c.id === idOrComment ? { ...c, replies } : c))
        } else if (idOrComment) {
        const saved = idOrComment
        setComment(prev => [...prev, saved])
        }
    }
    /* Esto es para identificar las imagenes y videos de los links */
    const renderMedia = (media) => {
        if (!media) return null
        const mediaArray = Array.isArray(media) ? media : [media]
        return mediaArray.map((link, idx) => {
        if (typeof link !== 'string') return null
        if (link.match(/\.(jpeg|jpg|avif|png|gif|webp)$/i)) return <img key={idx} src={link} className='post-media' alt="media" />
        if (link.match(/\.(mp4|webm|ogg)$/i)) {
            const ext = link.split('.').pop().toLowerCase()
            return <video key={idx} controls className='post-media'><source src={link} type={`video/${ext}`} /></video>
        }
         /* Solo acepta si son de yotub */
        if (link.includes("youtube.com") || link.includes("youtu.be")) {
            let videoId = ""
            try {
            if (link.includes("youtu.be")) videoId = link.split("youtu.be/")[1].split("?")[0]
            else videoId = new URL(link).searchParams.get("v")
            } catch (e) { console.warn("Error parsing YouTube link", link) }
            return <iframe key={idx} className="post-media" src={`https://www.youtube.com/embed/${videoId}`} title="YouTube video" allowFullScreen sandbox="allow-scripts allow-same-origin allow-presentation"></iframe>
        }
        return null
    })
}
  return (
    <div>
    <div className='cabeza'>
        <img className='iconoEsquina' src="/img/NysIcon.png" alt="Ny's Forum" />
        <Link to={"/LobbyPage"}><button className='button'>Volver</button></Link>
    </div>
    
    {loadingPost ? <p>Cargando post...</p> : post ? (
        <div className="Nys-card">
        <div className="Nys-header">
            <img className="Nys-avatar" src={post.profileIcon} alt="pfp" />
            <div className="Nys-user-info">
            <span className="Nys-username">{post.userName}</span>
            <span className="Nys-date">{new Date(post.dateTime).toLocaleString()}</span>
            </div>
        </div>
        <div className="Nys-content">
            <h4 className="Nys-title">{post.title}</h4>
            <p className="Nys-text">{post.discussion}</p>
            <div className="Nys-media">{renderMedia(post.media)}</div>
        </div>
        <button className='button' onClick={() => { setReplyTarget(null); setIsDrawerOpen(true) }}>Responder</button>
        </div>
    ) : <p>Post no encontrado</p>}

    <CommentMenu isOpen={isDrawerOpen} setIsOpen={(open) => { setIsDrawerOpen(open);
        if (!open) setReplyTarget(null) }} postId={id} parentCommentId={replyTarget} onNewComment={handleNewComment}
    />

    <h3>Respuestas</h3>
    <input type="text" placeholder="Buscar por usuario..." value={searchName} onChange={(e) => setSearchName(e.target.value)} className="search"/>
    {loadingComment ? <p>Cargando comentarios...</p> : commentFilter.length > 0 ? commentFilter.map(c => (
        <div key={c.id} className="Nys-card">
        <div className="Nys-header">
            <img className="Nys-avatar" src={c.profileIcon} alt="pfp" />
            <div className="Nys-user-info">
            <span className="Nys-username">{c.userName}</span>
            <span className="Nys-date">{new Date(c.dateTime).toLocaleString()}</span>
            </div>
        </div>
        <div className="Nys-content">
            <p className="Nys-text">{c.response}</p>
            <div className="Nys-media">{renderMedia(c.media)}</div>  
            <div>{(c.likedUsers || []).map(u => <span key={u}>{u} </span>)}</div>
            {c.replies && c.replies.length > 0 && (
            <div className="replies-container">
                {c.replies.map((r, idx) => (
                <div key={idx} className="Nys-card reply-card">
                    <div className="Nys-header">
                    <img className="Nys-avatar" src={r.profileIcon} alt="pfp" />
                    <div className="Nys-user-info">
                        <span className="Nys-username">{r.userName}</span>
                        <span className="Nys-date">{new Date(r.dateTime).toLocaleString()}</span>
                    </div>
                    </div>
                    <div className="Nys-content">
                    <p className="Nys-text">{r.response || r.text}</p>
                    <div className="Nys-media">{renderMedia(r.media)}</div>
                    </div>
                </div>
                ))}
            </div>
            )}
        {usuarioLog && <button className='button' onClick={() => btnLike(c.id, usuarioLog.id)}> { (c.likedUsers || []).includes(usuarioLog.id) ? 'Quitar Like' : 'Like' } {c.likes}</button>}
        </div>
        <br />
        <button className='button' onClick={() => { setReplyTarget(c.id); setIsDrawerOpen(true) }}>Responder</button>
        </div>
    )) : <p>No hay comentarios todavía.</p>}
    </div>
    )
  }
export default CommentPage