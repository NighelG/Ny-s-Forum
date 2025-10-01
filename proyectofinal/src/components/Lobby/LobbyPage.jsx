import React, { useEffect, useState } from 'react'
import SideBar from '../../pages/SideBar/SideBar'
import '../Lobby/LobbyPage.css'
import DiscussionPage from '../../pages/Discussion/DiscussionPage'
import PostServices from '../../services/PostServices'
import UserServices from '../../services/UserServices'
import { Navigate, useNavigate } from 'react-router-dom'

function LobbyPage() {
    /* Const principales */
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [post, setPost] = useState ([])
    const [searchName, setSearchName] = useState('')
    const [sortOrder, setSortOrder] = useState('todas') 
    const navigate = useNavigate()
    /* Esto es para el renderizado de los post */
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
    /* Esto es para el filtro */
    const filteredPosts = post
    .filter(p => p.title.toLowerCase().includes(searchName.toLowerCase()))
    .sort((a, b) => {
        if (sortOrder === 'nuevo') {
            return new Date(b.dateTime) - new Date(a.dateTime)
        } else if (sortOrder === 'viejo') {
            return new Date(a.dateTime) - new Date(b.dateTime)
        }
        return 0
    })
  return (
    <div className='lobbybody'>
        <img className='iconoEsquina' src="/img/NysIcon.png" alt="Ny's Forum" />
            <br /><br />
            <SideBar />
        <div>
            <label >
                <input className="search" type="search" placeholder='Buscar' value={searchName} onChange={(e) => setSearchName(e.target.value)}  />
            </label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="todas">---</option>
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
            {filteredPosts.length === 0 ?(
                <p>Sin resultados</p>
            ) : (
                filteredPosts.map((post) =>(
                    <div key={post.id} className='discussion-card' onClick={() => postClick(post.id)}>
                        <div className='user-info'>
                            <img  className='profile-icon' src={post.profileIcon || "/img/defaultPFP.jpg"}   alt="pfp" />
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