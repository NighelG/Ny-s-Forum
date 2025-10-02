import React, { useEffect, useState } from 'react'
import SideBar from '../../pages/SideBar/SideBar'
import UserServices from '../../services/UserServices'
import PostServices from '../../services/PostServices'
import CommentServices from '../../services/CommentServices'
import { Await, Link, useNavigate } from 'react-router-dom'
import '../AdminPage/AdminPage.css'

function AdminPage() {
    const navigate = useNavigate()
    const usuarioLog = JSON.parse(localStorage.getItem('logueado'))
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (!usuarioLog?.admin) {
        navigate('/LobbyPage')
        }
    }, [usuarioLog, navigate])
    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const allUsers = await UserServices.getUsers()
            setUsers(allUsers.filter(u => u.id !== usuarioLog.identificacion))
        } catch (err) {
            console.error('Error al cargar usuarios', err)
        }
        }
        fetchUsers()
    }, [usuarioLog])
    const toggleAdmin = async (userId, isAdmin) => {
        try {
        await UserServices.patchUser(userId, { admin: !isAdmin })
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, admin: !isAdmin } : u))
        } catch (err) {
        console.error('Error al actualizar admin', err)
        }
    }
    const banUser = async (userId) => {
        try {
        const posts = await PostServices.getPosts()
        const userPosts = posts.filter(p => p.userId === userId)
        for (let p of userPosts) {
            await PostServices.deletePost(p.id)
        }
        const comments = await CommentServices.getComments()
        const userComments = comments.filter(c => c.userId === userId)
        for (let c of userComments) {
            await CommentServices.deleteComment(c.id)
        }
        await UserServices.deleteUser(userId)
        setUsers(prev => prev.filter(u => u.id !== userId))
        } catch (err) {
        console.error('Error al banear usuario', err)
        }
    }
    return (
        <div className="admin-panel">
        <Link to={"/LobbyPage"}><button className='button'>Volver</button></Link>
        <br /><br />
        <h1>Panel de Administración</h1>
        <div className="user-list">
            {users.length === 0 ? (
            <p>No hay usuarios</p>
            ) : (
            users.map(user => (
                <div key={user.id} className="user-card">
                <div className="user-info">
                    <img className="profile-icon" src={user.profileIcon || "/img/defaultPFP.jpg"} alt="pfp" />
                    <span>{user.userName}</span>
                </div>
                <div className="user-actions">
                    <label>
                    Admin:
                    <input type="checkbox" checked={user.admin || false} onChange={() => toggleAdmin(user.id, user.admin || false)} />
                    </label>
                    <button className="sidebar-logout" onClick={() => banUser(user.id)}> Banear </button>
                </div>
                </div>
            ))
            )}
        </div>
        </div>
    )
}

export default AdminPage