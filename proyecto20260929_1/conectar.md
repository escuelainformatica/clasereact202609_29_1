# conectar a la base de datos

Para conectarse a la base de datos SQLite en este proyecto, se utiliza el paquete `sqlite3`.

Cree una clase de servicio en typescript, que se conecte a la base de datos SQLite y proporcione métodos para interactuar con ella.

La base de datos esta en data/productos.db

Esta base de datos tiene una tabla llamada `productos` con las siguientes columnas:
- `id` (número)
- `nombre` (cadena de texto)
- `precio` (número)

Esta tabla, tiene una interface llamada `Producto` en el archivo `app/models/Producto.ts`.

