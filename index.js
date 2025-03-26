import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usuariosRutas from "./routes/usuarioRutas.js";
import { conectarBD } from "./db/db.js";
import 'dotenv/config'; // Asegurar que dotenv esté cargado

const app = express();

// Conectar a la base de datos
conectarBD();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CORS para permitir solicitudes desde cualquier origen
app.use(cors({
    origin: true, 
    credentials: true
}));

// Rutas de la API
app.use("/api", usuariosRutas);

const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
