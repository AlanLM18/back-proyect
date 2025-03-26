import { Router } from "express";
import { login, register } from "../db/usuariosBD.js";
import { usuarioAutorizado, adminAutorizado } from "../middlewares/funcionesPassword.js";

const router = Router();

// Registro de usuario
router.post("/registro", async (req, res) => {
    try {
        console.log("Datos recibidos en registro:", req.body);
        
        // Aseguramos que se usa "password" en lugar de "contraseña"
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
        }

        const respuesta = await register({ username, email, password });
        console.log("Respuesta del registro:", respuesta);

        res.status(respuesta.status).json({
            mensaje: respuesta.mensajeUsuario,
            token: respuesta.token // Enviar el token en el JSON
        });

    } catch (error) {
        console.error("Error en /registro:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

// Inicio de sesión
router.post("/inicioSesion", async (req, res) => {
    try {
        console.log("BODY RECIBIDO EN LOGIN:", req.body);
        
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
        }

        const respuesta = await login({ username, password });

        res.status(respuesta.status).json({
            mensaje: respuesta.mensajeUsuario,
            token: respuesta.token // Enviar el token en el JSON
        });

    } catch (error) {
        console.error("Error en /inicioSesion:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

// Cerrar sesión
router.get("/cerrarSesion", (req, res) => {
    res.status(200).json({ mensaje: "Sesión cerrada correctamente" });
});

// Verificar usuario logueado
router.get("/usuariosLogueados", (req, res) => {
    try {
        const respuesta = usuarioAutorizado(req.cookies.token, req);
        console.log("Usuario logueado:", req.usuario);
        res.status(respuesta.status).json(respuesta.mensajeUsuario);
    } catch (error) {
        res.status(401).json({ mensaje: "No autorizado" });
    }
});

// Verificar administradores
router.get("/administradores", async (req, res) => {
    try {
        const respuesta = await adminAutorizado(req);
        res.status(respuesta.status).json(respuesta.mensajeUsuario);
    } catch (error) {
        res.status(401).json({ mensaje: "No autorizado" });
    }
});

// Ruta pública
router.get("/libre", (req, res) => {
    res.json("Aquí puedes entrar sin estar logueado");
});

export default router;
