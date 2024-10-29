import React from 'react'
import './CajaFecha.css'

function CajaFecha({ name, value, onChange, disabled}) {
    return (
        <input 
            className='caja'
            type="date"
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
        />
    );
}
export {CajaFecha}