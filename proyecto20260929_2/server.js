import express from "express";
import { createRequestHandler } from "@react-router/express";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

const PORT = process.env.PORT || 3000;

const app = express();

const CLIENT_BUILD = resolve("build/client");

// Sirve los assets del build del cliente (JS/CSS) si existen
app.use(express.static(CLIENT_BUILD, { maxAge: "1h", index: false }));

// Si un asset no se encuentra en build/client, responde 404 en lugar de
// delegar la petición al router (que lanzaría "No route matches URL")
app.use("/assets", (req, res) => {
  res.status(404).send(`Asset no encontrado: ${join(CLIENT_BUILD, req.path)}. Falta la carpeta build/client (build del cliente).`);
});

// Delega todas las peticiones al servidor de React Router (index.js)
app.use(
  createRequestHandler({
    build: () => import("./index.js"),
  })
);

// Manejo de errores: evita que un error del handler tumbe el proceso
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err.message);
  if (res.headersSent) return next(err);
  res.status(500).send("Error interno del servidor");
});

if (!existsSync(CLIENT_BUILD)) {
  console.warn(`Aviso: no existe la carpeta ${CLIENT_BUILD}.`);
  console.warn("El SSR funciona, pero los assets del cliente (/assets/*.js) devolverán 404.");
  console.warn("Copia el build del cliente en build/client para habilitar la hidratación.");
}

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});
