import React from 'react'
import './heder.styles.css'
import { Link } from 'react-router-dom'


export default function Header() {
    return (
        <div className='navbar'>
            <nav> <Link to="/">Home</Link></nav>
            <nav><Link to="/favorites">Favorites</Link></nav>

        </div>
    )
}
