import React from 'react'
import './CajaTexto.css'

function CajaTexto({ name, value, onChange, onBlur, disabled, longitud }) {
    return (
        <input 
            className='caja'
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            maxLength={longitud}
        />
    );
}
export {CajaTexto}