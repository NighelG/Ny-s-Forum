import React, { useEffect, useState } from 'react'
import CommentsServices from '../../services/CommentServices'
import PostServices from '../../services/PostServices'
import UserServices from '../../services/UserServices'
import { useParams } from 'react-router-dom'
import '../CommentPage/CommentPage.css'
import SideBar from '../../pages/SideBar/SideBar'

function CommentPage() {
    const { id } = useParams()
    const [post, setPost] = useState(null)

    useEffect(() => {
        const traerPost = async () => {
            try{
                const post = await PostServices.getPosts()
                const users = await UserServices.getUsers()
                const postEncontrado = post.find (p => String(p.id) === String(id))
                
                if (postEncontrado) {
                    const user = users.find(u => u.id === postEncontrado.userId)
                    setPost({
                        ...postEncontrado,
                        userName: user?.userName || 'Usuario desconocido',
                        profileIcon: user?.profileIcon || "/img/defaultPFP.jpg"
                    })
                }
            } catch (error){
                console.error("Error al cargar la discusión", error);
            }
        }
        traerPost()
    }, [id])
    if (!post) return <p>Cargando...</p>

    const renderLink = () => {
        if (!post.media) return <></>
        const mediaArray= Array.isArray(post.media) ? post.media : [post.media]
        return mediaArray.map((link, index) =>{
            if (link.match(/\.(jpeg|jpg|png|gif|webp)$/i)){
                return <img key={index} src={link} alt="link" className='post-media'/>
            }
            if (link.match(/\.(mp4|webm|ogg)$/i)){
                const ext = link.split('.').pop().toLowerCase()
                return(
                    <video key={index} controls className='post-media'>
                        <source src={link} type={`video/${ext}`} />
                        Archivo no soportado
                    </video>
                )
            }
            if(link.includes("youtube.com")|| link.includes("youtu.be")){
                let videoId = ""
                try {
                if (link.includes("youtu.be")) {
                    videoId = link.split("youtu.be/")[1].split("?")[0]
                } else {
                    const params = new URL(link).searchParams
                    videoId = params.get("v")
                }
                } catch(e) {
                console.warn("Error parsing YouTube link", link)
                }
                return (
                    <iframe key={index} className="post-media" src={`https://www.youtube.com/embed/${videoId}`} title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen sandbox="allow-scripts allow-same-origin allow-presentation"></iframe>
                )
            }
            return null
        })
    }
  return (
    <div>
        <img className='iconoEsquina' src="/img/NysIcon.png" alt="Ny's Forum" />
        <br /><br />
        <SideBar />
        <div className="Nys-card">
            <div className="Nys-header">
                <img className="Nys-avatar" src={post.profileIcon} alt="pfp" />
                <div className="Nys-user-info">
                <span className="Nys-username">{post.userName}</span>
                <span className="Nys-date">
                    {new Date(post.dateTime).toLocaleString()}
                </span>
                </div>
            </div>
            <div className="Nys-content">
                <h4 className="Nys-title">{post.title}</h4>
                <p className="Nys-text">{post.discussion}</p>
                <div className="Nys-media">{renderLink()}</div>
            </div>
        </div>
        <h3>Respuestas</h3>
    </div>
  )
}

export default CommentPage