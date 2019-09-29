import React from 'react'
import './MiniCard.css'
const MiniCard = ({ src, text }) => {
    return (
        <div>
            <img className='MiniCard' src={src}></img>
            {text}
        </div>
    )
}
export default MiniCard