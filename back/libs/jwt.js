import jwt from "jsonwebtoken";
import 'dotenv/config';  // Importar dotenv
import { mensajes } from "./mensajes.js";

export function crearToken(dato) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            dato,
            process.env.SECRET_TOKEN, // Leer desde variables de entorno
            { expiresIn: "1d" },
            (err, token) => {
                if (err) {
                    reject(mensajes(400, "Error al generar el token"));
                }
                resolve(token);
            }
        );
    });
}
