import React from 'react'
import { Link } from 'react-router-dom'
import './favorites.styles.css'


export default function Favorites({ favorites, linkToHome }) {


    return (
        <div>
            <h2>Favorites</h2>

            {favorites.map(el => {
                return <Link to="/" className='link' onClick={() => { linkToHome(el.id, el.name) }}
                key={el.id}> <div className='card' >

                <h3>{el.name}</h3>
                <span>{`${el.temp} C`}</span><br />
                <span>{el.description}</span>
                {/* <button onClick={() => { linkToHome(el.id, el.cityName) }}>
                    Forecast for the next five days</button> */}

            </div></Link>
                // return <div className='card' key={el.cityName}>

                //     <h3>{el.cityName}</h3>
                //     <span>{`${el.temp} C`}</span><br />
                //     <span>{el.description}</span>
                //     <Link to="/" > <button onClick={() => { linkToHome(el.id, el.cityName) }}>Forecast for the next five days</button></Link>

                // </div>
            })}



        </div>
    )
}
