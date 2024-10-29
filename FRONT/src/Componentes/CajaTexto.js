import React from 'react'
import './CajaTexto.css'

function CajaTexto({ name, value, onChange, onBlur, disabled }) {
    return (
        <input 
            className='caja'
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
        />
    );
}
export {CajaTexto}