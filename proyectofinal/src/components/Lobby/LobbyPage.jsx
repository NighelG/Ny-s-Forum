import React, { useEffect, useState } from 'react'
import SideBar from '../../pages/SideBar/SideBar'
import '../Lobby/LobbyPage.css'
import DiscussionPage from '../../pages/Discussion/DiscussionPage'
import PostServices from '../../services/PostServices'
import UserServices from '../../services/UserServices'
import { Navigate, useNavigate } from 'react-router-dom'

function LobbyPage() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [post, setPost] = useState ([])
    const navigate = useNavigate()

    useEffect(() => {
        const traerPost = async () => {
            try{
                const [postData, usersData] = await Promise.all([
                    PostServices.getPosts(),
                    UserServices.getUsers()
                ])
                const postPfp = postData.map(p => {
                    const user = usersData.find(u => u.id === p.userId)
                    return{...p, profileIcon: user?.profileIcon || null}
                })
                setPost(postPfp)
            }catch(error){
                console.error('error al traer los post', error);
            }
        }
        traerPost()
    },[])
    const postClick = (id) => {
        navigate(`/CommentPage/${id}`)
    }
  return (
    <div className='lobbybody'>
        <img className='iconoEsquina' src="/img/NysIcon.png" alt="Ny's Forum" />
            <br /><br />
            <SideBar />
        <div>
            <label >
                <input type="search" placeholder='Buscar' />
            </label>
                <select>
                    <option value="todas">Todas</option>
                    <option value="nuevo">Mas reciente</option>
                    <option value="viejo">Menos reciente</option>
                </select>
        </div>
        <div>
            <h2>Iniciar nueva discusión</h2>
            <button className='button' onClick={() => setIsDrawerOpen(true)}> <img className='tinymedium' src="/img/discu.png" alt="" /></button>
        </div>
        <br />
        <p>Discusiónes</p>
            <br />
        <div className='posts-container'>
            {post.length === 0 ?(
                <p>Sin resultados</p>
            ) : (
                post.map((post) =>(
                    <div key={post.id} className='discussion-card' onClick={() => postClick(post.id)}>
                        <div className='user-info'>
                            <img className='profile-icon' src={post.profileIcon || "/img/defaultPFP.jpg"}  alt="pfp" />
                            <div className='user-details'>
                                <span className='user-name'>{post.userName}</span>
                                <span>{new Date(post.dateTime).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className='discussion-title-container'>
                            <h3 className="discussion-title">{post.title}</h3>
                        </div>
                    </div>

                ))
            )}
        </div>
        <DiscussionPage isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
    </div>
  )
}

export default LobbyPage