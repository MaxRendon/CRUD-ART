import './App.css';
import { Label } from './Componentes/Label';
import { CajaTexto } from './Componentes/CajaTexto';
import { CheckBox } from './Componentes/CheckBox';
import { Contenedor } from './Componentes/Contendor';
import { CajaFecha } from './Componentes/CajaFecha';
import { Botones } from './Componentes/Botones';
import { crearArticulo } from './sevicios';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

//-------------

function App() {
  const obtenerFechaActual = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  const [datos, setDatos] = useState ({
      sku: '',
      articulo: '',
      marcha: '',
      modelo: '',
      departamento: '',
      clase: '',
      familia: '',
      fecha_alta: obtenerFechaActual(),
      stock: '',
      cantidad: '',
      descontinuado: 0,
      fecha_baja: '1900-01-01'
  });


  const [departamentos, setDepartamentos] = useState([]);
  const [clases, setClases] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [camposDeshabilitados, setCamposDeshabilitados] = useState(true);
  

  const actualizarEstado = (e) => {
    const { name, value, type, checked } = e.target;

    // const camposNumericos = ['sku', 'stock', 'cantidad'];
    // if (camposNumericos.includes(name) && isNaN(value)) {
    //   alert(`El campo ${name} solo puede contener números.`);
    //   return;
    // }
    
    if (name === 'cantidad' && parseInt(value) > parseInt(datos.stock)) {
      alert("La cantidad no puede ser mayor que el stock.");
      return; 
    }

    if (type === 'date') {
        setDatos({
            ...datos,
            [name]: value || '' 
        });
    } else {
        setDatos({
            ...datos,
            [name]: type === 'checkbox' ? checked : value
        });
    }
};

  
  const handleDescontinuadoChange = (checked) => {
    setDatos((prevDatos) => ({
        ...prevDatos,
        descontinuado: checked ? 1 : 0,
        fecha_baja: checked ? obtenerFechaActual() : '1900-01-01'
    }));
  };

  const obtenerArticuloPorSku = async (sku) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/articulo/${sku}`);
        const articulo = response.data;
        const fecha_alta = articulo.fecha_alta ? articulo.fecha_alta.split('T')[0] : '';
        const fecha_baja = articulo.fecha_baja ? articulo.fecha_baja.split('T')[0] : '';
        

        setDatos({
            ...articulo,
            fecha_alta: obtenerFechaActual(),
            fecha_baja: '1900-01-01'
        });

        setCamposDeshabilitados(false);

        console.log("Fecha alta antes de asignar:", fecha_alta);
        console.log("Fecha baja antes de asignar:", fecha_baja);
    } catch (error) {
        console.error("Error al consultar el artículo por SKU:", error);
        alert("Artículo no encontrado o error al consultar.");
        setCamposDeshabilitados(false);
    }
  };

  const modificar = async () => {
    console.log('Datos enviados para modificación:', datos);
  
    const datosAEnviar = {
      ...datos,
      fecha_alta: datos.fecha_alta === '' ? null : datos.fecha_alta,
      fecha_baja: datos.fecha_baja === '' ? null : datos.fecha_baja
    };
  
    try {
      const response = await axios.put(`http://localhost:3000/api/articulo/${datos.sku}`, datosAEnviar);
      alert("Artículo actualizado exitosamente.");
    } catch (error) {
      console.error("Error al actualizar el artículo:", error);
      alert("Error al actualizar el artículo.");
    }
  };

  const eliminar = async () => {
    const { sku } = datos;
  
    if (!sku) {
      alert('Por favor, ingresa un SKU válido antes de eliminar.');
      return;
    }
  
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer.");
  
    if (!confirmar) {
      return; 
    }
  
    try {
      await axios.delete(`http://localhost:3000/api/articulo/${sku}`);
      alert("Artículo eliminado exitosamente.");
      setDatos({
        sku: '',
        articulo: '',
        marcha: '',
        modelo: '',
        departamento: '',
        clase: '',
        familia: '',
        fecha_alta: '',
        stock: '',
        cantidad: '',
        descontinuado: 0,
        fecha_baja: ''
      });
      setCamposDeshabilitados(false);
    } catch (error) {
      console.error("Error al eliminar el artículo:", error);
      alert("Error al eliminar el artículo.");
    }
  };
  

  const agregar = async () => {
    console.log('Datos enviados:', datos);

    const datosAEnviar = {
      ...datos,
      fecha_alta: datos.fecha_alta === '' ? null : datos.fecha_alta,
      fecha_baja: datos.fecha_baja === '' ? null : datos.fecha_baja
  };

    try {
      const response = await crearArticulo(datosAEnviar);
      if (response.success) {
        alert("Artículo creado exitosamente.");
      } else {
        alert("Error al crear el artículo: " + response.message);
      }
    } catch (error) {
      console.error("Error al crear artículo:", error);
    }
  };

  useEffect(() => {
    obtenerDepartamentos(); 
  }, []);

  const obtenerDepartamentos = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/departamento'); 
        setDepartamentos(response.data.map((item) => item.id)); 
    } catch (error) {
        console.error("Error al obtener departamentos:", error);
    }
  };
  

  const obtenerClasesPorDepartamento = async (idDepartamento) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/clase/departamento/${idDepartamento}`);
        setClases(response.data.map((item) => item.id)); 
        
    } catch (error) {
        console.error("Error al obtener clases:", error);
    }
  };

  const obtenerFamiliasPorDepartamento = async (idDepartamento) => {
    try {
      const response = await fetch(`http://localhost:3000/api/familia/clase/${idDepartamento}`);
      if (!response.ok) throw new Error("Error al obtener familias");

      const data = await response.json();
      setFamilias(data.map((item) => item.id)); // Solo almacena los IDs
    } catch (error) {
      console.error("Error al obtener familias:", error);
    }
  };

  const descargarCSV = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/exportar-vista', {
            method: 'GET',
            headers: {
                'Content-Type': 'text/csv',
            },
        });

        if (!response.ok) {
            throw new Error('No se pudo descargar el archivo');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vista_departamento_clase_familia.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error al descargar el archivo:', error);
    }
};

  return (
    <>
      <div className='linea'>
        <Label contenido="Sku"/>  
        <CajaTexto name="sku" value={datos.sku} onChange={actualizarEstado} onBlur={() => obtenerArticuloPorSku(datos.sku)} disabled={false}/>
        <div className='linea-check'>
          <CheckBox checked={datos.descontinuado === 1} onChange={handleDescontinuadoChange} disabled={camposDeshabilitados}/>
          <Label contenido="Descontinuado"/> 
        </div>
      </div>
      <div className='linea'>
        <Label contenido="Articulo"/>  
        <CajaTexto name="articulo" value={datos.articulo} onChange={actualizarEstado} disabled={camposDeshabilitados}/>
      </div>
      <div className='linea'>
        <Label contenido="Marca"/>  
        <CajaTexto name="marcha" value={datos.marcha} onChange={actualizarEstado} disabled={camposDeshabilitados}/>
      </div>
      <div className='linea'>
        <Label contenido="Modelo"/>  
        <CajaTexto name="modelo" value={datos.modelo} onChange={actualizarEstado} disabled={camposDeshabilitados}/>
      </div>
      <div className='linea'>
        <Label contenido="Departamento"/>  
        <Contenedor opciones={departamentos} disabled={camposDeshabilitados} value={datos.departamento} onSelect={(id) => {setDatos({...datos, departamento: id}); obtenerClasesPorDepartamento(id)}}/>
      </div>
      <div className='linea'>
        <Label contenido="Clase"/>  
        <Contenedor opciones={clases} disabled={camposDeshabilitados} value={datos.clase} onSelect={(id) => {setDatos({...datos, clase: id}); obtenerFamiliasPorDepartamento(id)}}/>
      </div>
      <div className='linea'>
        <Label contenido="Familia"/>  
        <Contenedor opciones={familias} disabled={camposDeshabilitados} value={datos.familia} onSelect={(id) => setDatos({...datos, familia: id})}/>
      </div>
      <div className='linea'>
        <Label contenido="Stock"/>  
        <CajaTexto name="stock" value={datos.stock} disabled={camposDeshabilitados} onChange={actualizarEstado}/>
        <Label contenido="Cantidad"/>  
        <CajaTexto name="cantidad" value={datos.cantidad} disabled={camposDeshabilitados} onChange={actualizarEstado}/>
      </div>
      <div className='linea'>
        <Label contenido="Fecha Alta"/>  
        <CajaFecha name="fecha_alta" value={datos.fecha_alta} onChange={actualizarEstado} disabled={true}/>
        <Label contenido="Fecha Baja"/>  
        <CajaFecha name="fecha_baja" value={datos.fecha_baja} onChange={actualizarEstado} disabled={true}/>
      </div>
      <div className='linea-botones'>
        <Botones contenido="Agregar" onClick={agregar} disabled={camposDeshabilitados}/>
        <Botones contenido="Modificar" onClick={modificar} disabled={camposDeshabilitados}/>
        <Botones contenido="Eliminar" onClick={eliminar} disabled={camposDeshabilitados}/>
        <Botones contenido="Descargar" onClick={descargarCSV} disabled={camposDeshabilitados}/>
      </div>
    </>
  );
}

export default App;
