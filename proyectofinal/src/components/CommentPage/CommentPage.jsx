import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PostServices from '../../services/PostServices'
import UserServices from '../../services/UserServices'
import CommentServices from '../../services/CommentServices'
import CommentMenu from '../../pages/Comments/CommentMenu'
import SideBar from '../../pages/SideBar/SideBar'
import '../CommentPage/CommentPage.css'

function CommentPage() {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [comment, setComment] = useState([])
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [loadingPost, setLoadingPost] = useState(true)
    const [loadingComment, setLoadingComment] = useState(true)

    useEffect(() => {
        const traerPost = async () => {
        try {
            const posts = await PostServices.getPosts()
            const users = await UserServices.getUsers()
            const postEncontrado = posts.find(p => String(p.id) === String(id))
            if (!postEncontrado) {
            console.warn("Post no encontrado con id:", id)
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

    // --- Traer Comentarios ---
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
                userName: user?.userName || 'Usuario desconocido',
                profileIcon: user?.profileIcon || "/img/defaultPFP.jpg"
                }
            })
            console.log("Comentarios filtrados:", commentFiltrados)
            setComment(commentFiltrados)
        } catch (err) {
            console.error("Error al cargar los comentarios:", err)
        } finally {
            setLoadingComment(false)
        }
        }
        traerComment()
    }, [id])

    // --- Render Post Media ---
    const renderLink = () => {
        if (!post?.media) return null
        const mediaArray = Array.isArray(post.media) ? post.media : [post.media]
        return mediaArray.map((link, index) => {
        if (typeof link !== 'string') return null
        if (link.match(/\.(jpeg|jpg|avif|png|gif|webp)$/i)) {
            return <img key={index} src={link} alt="link" className='post-media' />
        }
        if (link.match(/\.(mp4|webm|ogg)$/i)) {
            const ext = link.split('.').pop().toLowerCase()
            return (
            <video key={index} controls className='post-media'>
                <source src={link} type={`video/${ext}`} />
                Archivo no soportado
            </video>
            )
        }
        if (link.includes("youtube.com") || link.includes("youtu.be")) {
            let videoId = ""
            try {
            if (link.includes("youtu.be")) {
                videoId = link.split("youtu.be/")[1].split("?")[0]
            } else {
                const params = new URL(link).searchParams
                videoId = params.get("v")
            }
            } catch (e) {
            console.warn("Error parsing YouTube link", link)
            }
            return (
            <iframe
                key={index}
                className="post-media"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-presentation"
            ></iframe>
            )
        }
        return null
        })
    }

    const renderCommentLink = (c) => {
        if (!c?.media) return null
        const mediaArray = Array.isArray(c.media) ? c.media : [c.media]
        return mediaArray.map((link, index) => {
        if (typeof link !== 'string') return null
        if (link.match(/\.(jpeg|jpg|avif|png|gif|webp)$/i)) {
            return <img key={index} src={link} alt="link" className='comment-media' />
        }
        if (link.match(/\.(mp4|webm|ogg)$/i)) {
            const ext = link.split('.').pop().toLowerCase()
            return (
            <video key={index} controls className='post-media'>
                <source src={link} type={`video/${ext}`} />
                Archivo no soportado
            </video>
            )
        }
        if (link.includes("youtube.com") || link.includes("youtu.be")) {
            let videoId = ""
            try {
            if (link.includes("youtu.be")) {
                videoId = link.split("youtu.be/")[1].split("?")[0]
            } else {
                const params = new URL(link).searchParams
                videoId = params.get("v")
            }
            } catch (e) {
            console.warn("Error parsing YouTube link", link)
            }
            return (
            <iframe
                key={index}
                className="post-media"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-presentation"
            ></iframe>
            )
        }
        return null
        })
    }

  return (
    <div>
        <img className='iconoEsquina' src="/img/NysIcon.png" alt="Ny's Forum" />
        <SideBar />

        {loadingPost ? (
            <p>Cargando post...</p>
        ) : post ? (
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
                <div className="Nys-media">{renderLink()}</div>
            </div>
            <button className='button' onClick={() => setIsDrawerOpen(true)}>Responder</button>
            </div>
        ) : (
            <p>Post no encontrado</p>
        )}

        <CommentMenu isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />

        <h3>Respuestas</h3>
        {loadingComment ? (
            <p>Cargando comentarios...</p>
        ) : comment.length > 0 ? (
            comment.map((c) => (
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
                <div className="Nys-media">{renderCommentLink(c)}</div>
                </div>
            </div>
            ))
        ) : (
            <p>No hay comentarios todavía.</p>
        )}
        </div>
    )
}

export default CommentPage