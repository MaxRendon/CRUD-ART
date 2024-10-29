import React from 'react'
import './Label.css'

function Label({contenido}){
    return (
        <p className='Letras'>{contenido}</p>
    );
}

export {Label}