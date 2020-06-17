import React from 'react'
import { Link } from 'react-router-dom'
import './favorites.styles.css'


export default function Favorites({ favorites, remove, favorCity }) {


    return (
        <div>
            <h2>Favorites</h2>

            {favorites.map(el => {
                return <div className='card' key={el.cityName}>
                   
                        <h3>{el.cityName}</h3>
                        <span>{`${el.temp} C`}</span><br />
                        <span>{el.description}</span>
                    
                    <button onClick={() => { remove(el.cityName) }}>Remove from favorites</button>
                    <Link to="/" > <button onClick={() => { favorCity(el.id,el.cityName) }}>Forecast for the next five days</button></Link>

                </div>
            })}



        </div>
    )
}
