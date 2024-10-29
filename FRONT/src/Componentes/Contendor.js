import React from 'react'
import './Contendor.css'

function Contenedor({opciones, value , onSelect, disabled}){

    return (
        <select value={value} disabled={disabled} onChange={(e) => onSelect(e.target.value)} className="largo">
            <option value="">Selecciona una opción</option>
            {opciones.map((opcion, index) => (
                <option key={index} value={opcion}>
                    {opcion}
                </option>
            ))}
        </select>
    );
}

export {Contenedor}