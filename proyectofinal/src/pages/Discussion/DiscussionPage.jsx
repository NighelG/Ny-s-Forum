import React, { useState } from 'react'
import { Await, Link, useNavigate } from 'react-router-dom'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import './DiscussionPage.css'

function DiscussionPage({ isOpen, setIsOpen }) {
  
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
            <input type="text" placeholder="Título" className="input" />
            <textarea placeholder="Redacta la discusión" className="textarea" />
            <button className="submit-btn">Publicar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscussionPage