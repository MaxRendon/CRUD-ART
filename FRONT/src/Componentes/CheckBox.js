import React from 'react'
import './CheckBox.css'

function CheckBox({ onChange, checked, disabled }) {
    return (
        <input
            className='check'
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked ? 1 : 0)}
            disabled={disabled}
        />
    );
}

export {CheckBox}