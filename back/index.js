import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usuariosRutas from "./routes/usuarioRutas.js";
import { conectarBD } from "./db/db.js";
const app = express();
conectarBD();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: true, 
    credentials: true
}));


app.use("/api",usuariosRutas);
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("Servidor express en https://localhost:3000");
})
