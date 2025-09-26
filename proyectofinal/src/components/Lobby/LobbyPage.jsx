import React, { useEffect, useState } from 'react'
import SideBar from '../../pages/SideBar/SideBar'
import '../Lobby/LobbyPage.css'
import DiscussionPage from '../../pages/Discussion/DiscussionPage'
import PostServices from '../../services/PostServices'
import UserServices from '../../services/UserServices'


function LobbyPage() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [post, setPost] = useState ([])

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
  return (
    <div className='lobbybody'>
        <h1>Ny's Forum</h1>
            <br /><br />
            <SideBar />
        <div>
            <label >
                <input type="search" placeholder='Buscar' />
                <select>
                    <option value="todas">Todas</option>
                    <option value="nuevo">Mas reciente</option>
                    <option value="viejo">Menos reciente</option>
                </select>
            </label>
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
                    <div key={post.id} className='discussion-card'>
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