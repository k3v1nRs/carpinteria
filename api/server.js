require('dotenv').config(); // Carga la cadena de conexión PG_CONNECTION_STRING desde .env
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Cliente de PostgreSQL

const app = express();
const port = 3000; 

// =================================================================
// 1. CONFIGURACIÓN DE LA CONEXIÓN A POSTGRESQL (NEON)
// =================================================================

// Utilizamos la única variable PG_CONNECTION_STRING del .env
const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING, 
    
    // Necesario para la conexión segura (SSL) a servicios en la nube como Neon
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(cors());
app.use(express.json());

// =================================================================
// 2. CREACIÓN INICIAL DE LA TABLA
// =================================================================

// Función para asegurar que la tabla existe
async function ensureTableExists() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS cotizaciones (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            telefono VARCHAR(20),
            descripcion TEXT NOT NULL,
            fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            estado VARCHAR(50) DEFAULT 'Pendiente'
        );
    `;
    try {
        await pool.query(createTableQuery);
        console.log("✅ Tabla 'cotizaciones' verificada/creada exitosamente.");
    } catch (err) {
        console.error("❌ Error al crear/verificar la tabla:", err);
    }
}

// =================================================================
// 3. CONEXIÓN A DB E INICIO DEL SERVIDOR
// =================================================================

pool.connect()
    .then(client => {
        console.log("✅ Conectado exitosamente a PostgreSQL.");
        client.release(); // Libera el cliente
        return ensureTableExists(); // Asegura la existencia de la tabla
    })
    .then(() => {
        // ** RUTA PARA RECIBIR COTIZACIONES **
        app.post('/api/cotizaciones', async (req, res) => {
            const { nombre, email, telefono, descripcion } = req.body;

            if (!nombre || !descripcion || !email) {
                return res.status(400).send({ message: 'Faltan campos obligatorios: nombre, email y descripción.' });
            }

            const insertQuery = `
                INSERT INTO cotizaciones (nombre, email, telefono, descripcion)
                VALUES ($1, $2, $3, $4) RETURNING id;
            `;
            const values = [nombre, email, telefono, descripcion];

            try {
                const result = await pool.query(insertQuery, values);
                const newId = result.rows[0].id;
                
                console.log(`Cotización guardada con ID: ${newId}`);
                res.status(201).send({ 
                    message: 'Cotización recibida y guardada en PostgreSQL.', 
                    id: newId 
                });
            } catch (error) {
                console.error('❌ Error al insertar la cotización:', error);
                res.status(500).send({ message: 'Error interno del servidor.' });
            }
        });

        // 2. Iniciar el servidor Express
        app.listen(port, () => {
            console.log(`Servidor API escuchando en http://localhost:${port}`);
            console.log("Frontend URL (para prueba): http://localhost:3000/api/cotizaciones");
        });

    })
    .catch(err => {
        console.error("❌ Error FATAL al conectar a la base de datos:", err);
        process.exit(1);
    });