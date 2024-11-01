//---------------------------------------Anadir articulo

import axios from 'axios';

export const crearArticulo = async (formData) => {
    console.log('Fecha', formData)
    try {
        const response = await axios.post('http://localhost:3000/api/articulo', formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error en la solicitud de crear artículo:', error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al crear el artículo'
        };
    }
};