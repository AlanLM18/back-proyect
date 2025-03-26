import User from "../models/usuarioModelo.js";
import { encriptarPassword, validarPassword } from "../middlewares/funcionesPassword.js";
import { mensajes } from "../libs/mensajes.js";
import { crearToken } from "../libs/jwt.js";

export async function register({ username, email, password }) {
    try {
        const usuarioExistente = await User.findOne({ username });
        const emailExistente = await User.findOne({ email });
        if (usuarioExistente || emailExistente) {
            return mensajes(400, "usuario duplicado");
        }

        const { hash, salt } = encriptarPassword(password);
        const data = new User({ username, email, password: hash, salt });

        var respuesta = await data.save();

        const token = await crearToken({
            id: respuesta._id || "",
            username: respuesta.username || "",
            email: respuesta.email || "",
            tipoUsuario: respuesta.tipoUsuario || "usuario"
        });

        return mensajes(200, respuesta.tipoUsuario || "usuario", "", token);
    } catch (error) {
        return mensajes(400, "Error al registrar al usuario", error);
    }
}

export const login = async ({ username, password }) => {
    try {
        const usuarioCorrecto = await User.findOne({ username });
        if (!usuarioCorrecto) {
            return mensajes(400, "Datos incorrectos, usuario");
        }

        const passwordCorrecto = validarPassword(password, usuarioCorrecto.salt, usuarioCorrecto.password);
        if (!passwordCorrecto) {
            return mensajes(400, "Datos incorrectos, password");
        }

        const tipoUsuario = usuarioCorrecto.tipoUsuario || "usuario";

        const token = await crearToken({
            id: usuarioCorrecto._id.toString(),
            username: usuarioCorrecto.username,
            email: usuarioCorrecto.email,
            tipoUsuario: tipoUsuario
        });

        // Aquí se incluye tipoUsuario en la respuesta
        const respuesta = mensajes(200, tipoUsuario, "", token);
        console.log("📌 Respuesta enviada al frontend:", JSON.stringify(respuesta, null, 2));
        
        return {
            status: respuesta.status,
            tipoUsuario: tipoUsuario,  // Incluir tipoUsuario aquí
            token: token,
            mensajeUsuario: respuesta.mensajeUsuario
        };
    } catch (error) {
        console.error("⚠️ Error en el login:", error);
        return mensajes(400, "Error en el inicio de sesión", error);
    }
};





export const obtenerUsuarioPorId = async (id) => {
    try {
        const usuario = await User.findById(id);
        if (!usuario) {
            return mensajes(404, "Usuario no encontrado");
        }
        return mensajes(200, "Usuario obtenido correctamente", usuario);
    } catch (error) {
        return mensajes(400, "Error al obtener usuario", error);
    }
};
