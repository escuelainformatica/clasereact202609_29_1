# clasereact202609_29_1

* [Proyecto React Route](./proyecto202609_29_1)
* [Proyecto ExpressJS](./proyecto202609_29_2)

# construir el proyecto de react route

```bash
pnpm run build
```

```
✓ 3 assets cleaned from React Router server build.
build\client\assets\logo-dark-pX2395Y0.svg
build\client\assets\logo-light-CVbx2LBR.svg
build\server\assets\server-build-BzTXpK0N.css

computing gzip size...
build/server/.vite/manifest.json                0.57 kB │ gzip: 0.24 kB
build/server/assets/logo-dark-pX2395Y0.svg      6.09 kB │ gzip: 2.42 kB
build/server/assets/logo-light-CVbx2LBR.svg     6.12 kB │ gzip: 2.42 kB
build/server/assets/server-build-BzTXpK0N.css   8.06 kB │ gzip: 2.50 kB
build/server/index.js                          17.01 kB │ gzip: 5.37 kB
```
* 📁 build
     * 📁 /client   --> Servidor Apache, Ngnix, IIS
     * 📁 /server   --> node.js (Expressjs)

## instalar en el servidor node.js

* Primero crear un proyecto express.js
   * y se agrega las librerias necesarias para correrlo

```bash
pnpm init
pnpm add express @react-router/express @react-router/node
```


* luego, se copia el index.js
* y se crea el siguiente archivo:

server.js:
```js
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

```

una vez que tengo el archivo, ejecuta el proyecto como:

```bash
node server.js
```
o sino (npm o pnpm)
```bash
npm start
```

## como se instala del lado del cliente

* Para instalarlo del lado del cliente, se necesita un servidor web (Apache, Nginx, IIS, etc.) que sirva los archivos estáticos generados en `build/client`.
* Copiar todos los archivos de la carpeta build/client al directorio raíz del servidor web.
* Ademas, necesito editar o crear un archivo `index.html` en el directorio raíz del servidor web para que apunte a los assets generados en `build/client`. 
    Por ejemplo:
    ```html
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mi App</title>
        <link rel="stylesheet" href="build/client/main.css">
    </head>
    <body>
        <div id="root"></div>
        <script src="build/client/main.js"></script>
    </body>
    </html>
    ```
* Finalmente, asegúrate de que el servidor web esté configurado para servir los archivos estáticos desde el directorio raíz, donde se copiaron los archivos de `build/client`.


## SSR vs SPA vs CSR

* **SSR (Server-Side Rendering)**: El contenido de la página se genera en el servidor y se envía al cliente ya renderizado. Esto mejora el SEO y el tiempo de carga inicial, pero requiere un servidor que procese las solicitudes.
* **SPA (Single Page Application)**: El contenido de la página se genera en el cliente mediante JavaScript. Esto permite una navegación más rápida dentro de la aplicación, pero el SEO y el tiempo de carga inicial pueden verse afectados.
* **CSR (Client-Side Rendering)**: Similar a SPA, el contenido de la página se genera en el cliente mediante JavaScript. La diferencia principal es que en CSR puro, el HTML inicial enviado por el servidor es mínimo y la mayor parte del contenido se genera dinámicamente en el navegador.

ssr | spa | csr
----|-----|-----
Renderizado en el servidor | Renderizado en el cliente | Renderizado en el cliente
SEO mejorado | SEO limitado | SEO limitado
Tiempo de carga inicial rápido | Tiempo de carga inicial más lento | Tiempo de carga inicial más lento
Interacción rápida después de la carga inicial | Interacción rápida después de la carga inicial | Interacción rápida después de la carga inicial
Dependencia del servidor | Menor dependencia del servidor | Mayor dependencia del servidor

### indicar si se quiere ssr o no

react-router.config
```js
import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
} satisfies Config;

```

# Ejercicio:

* Cree dos nuevos proyectos:
  1. Uno con SSR habilitado.
    - Que se conecte a una base de datos local
    - y obtenga un listado de datos de clientes usando una base de datos sqlite local.
  2. Un proyecto con ExpressJS como servidor.
    - Que ejecute el primer proyecto
    - No olvide copiar la base de datos creada en el primer proyecto

    



