import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usuariosRutas from "./routes/usuarioRutas.js";
import { conectarBD } from "./db/db.js";
import { client as mqttClient } from "./mqtt/mqtt.js";
import 'dotenv/config'; // Cargar variables de entorno

const app = express();

// Conectar a la base de datos
conectarBD();

// Configuración de middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CORS para permitir solicitudes con credenciales
app.use(cors({
    origin: true,
    credentials: true
}));

// Hacer disponible el cliente MQTT en las rutas
app.use((req, res, next) => {
    req.mqttClient = mqttClient;
    next();
});

// Rutas
app.use("/api", usuariosRutas);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express en http://localhost:${PORT}`);
});

// Manejar el cierre apropiado del cliente MQTT
process.on("SIGINT", () => {
    console.log("Cerrando conexión MQTT...");
    mqttClient.end();
    process.exit();
});
