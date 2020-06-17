import React from 'react'
import './dayCard.styles.css'

export default function DayCard({ day }) {
    return (
        <div className='card-container'>
            <h4>{day.dayName}</h4>
            <span>{`temp: ${day.temp}`}</span><br />
            <span>{day.description}</span>
        </div>
    );
}


