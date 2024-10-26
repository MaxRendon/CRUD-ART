const express = require('express');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: '123',
    database: 'crud2',
});

client.connect();


app.get('/api/familia', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM familia');
        res.json(result.rows); // Envía los resultados como JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al obtener datos'); // Responde con un error
    }
});


//------------------------Departamento
app.get('/api/departamento/:id', async (req, res) => {
    const id = req.params.id; 

    try {
        const result = await client.query(
            'SELECT * FROM buscar_departamento($1)',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('Departamento no encontrado'); 
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al buscar el departamento'); 
    }
});



//------------------------Clase
app.get('/api/clase/departamento/:id_departamento', async (req, res) => {
    const id_departamento = req.params.id_departamento; 

    try {
        const result = await client.query(
            'SELECT * FROM buscar_clase_por_departamento($1)',
            [id_departamento]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('No se encontraron clases para este departamento'); 
        }

        res.status(200).json(result.rows); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al buscar clases por departamento'); 
    }
});



//------------------------Familia
app.get('/api/familia/departamento/:id_departamento', async (req, res) => {
    const id_departamento = req.params.id_departamento; 

    try {
        const result = await client.query(
            'SELECT * FROM buscar_familia_por_departamento($1)',
            [id_departamento]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('No se encontraron familias para este departamento'); 
        }

        res.status(200).json(result.rows); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al buscar familias por departamento'); 
    }
});



//------------------------Articulos
//--Consultar por sku
app.get('/api/articulo/:sku', async (req, res) => {
    const sku = req.params.sku; // Obtener SKU de los parámetros de la URL
    try {
        const result = await client.query('SELECT * FROM consultar_articulo_por_sku($1)', [sku]);
        
        if (result.rows.length === 0) {
            return res.status(404).send('Artículo no encontrado');
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al consultar el artículo');
    }
});
//--agregar
app.post('/api/articulo', async (req, res) => {
    const {
        sku,
        articulo,
        marcha,
        modelo,
        departamento,
        clase,
        familia,
        fecha_alta,
        stock,
        cantidad,
        descontinuado,
        fecha_baja
    } = req.body; 

    try {
        await client.query('CALL crear_articulo($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [
            sku,
            articulo,
            marcha,
            modelo,
            departamento,
            clase,
            familia,
            fecha_alta,
            stock,
            cantidad,
            descontinuado,
            fecha_baja
        ]);

        res.status(201).json({ message: 'Artículo creado', data: req.body });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al crear el artículo');
    }
});

//--actualizar
app.put('/api/articulo/:sku', async (req, res) => {
    const sku = parseInt(req.params.sku); 
    const { articulo, marcha, modelo, departamento, clase, familia, fecha_alta, stock, cantidad, descontinuado, fecha_baja } = req.body;

    try {
        await client.query(
            'CALL actualizar_articulo($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
            [sku, articulo, marcha, modelo, departamento, clase, familia, fecha_alta, stock, cantidad, descontinuado, fecha_baja]
        );
        res.status(200).send('Artículo actualizado'); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al actualizar el artículo'); 
    }
});

//--eliminar
app.delete('/api/articulo/:sku', async (req, res) => {
    const sku = parseInt(req.params.sku); 

    try {
        await client.query(
            'CALL borrar_articulo($1)',
            [sku]
        );
        res.status(200).send('Artículo borrado'); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al borrar el artículo'); 
    }
});




app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});