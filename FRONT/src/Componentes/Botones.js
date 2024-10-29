import React from 'react'
import './Botones.css'

function Botones({ contenido, onClick, disabled }) {
    return (
        <button className='Boton' onClick={onClick} disabled={disabled}>{contenido}</button>
    );
}

export {Botones}