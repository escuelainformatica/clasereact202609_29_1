import sqlite3 from "sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const DB_PATH = resolve("data/productos.db");
mkdirSync(dirname(DB_PATH), { recursive: true });

const productos = [
  { nombre: "Teclado mecánico", precio: 89.9 },
  { nombre: "Mouse inalámbrico", precio: 29.5 },
  { nombre: 'Monitor 27"', precio: 249.99 },
];

const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL
  )`);

  db.all("SELECT id FROM productos", (err, rows) => {
    if (err) {
      console.error("Error al leer la base de datos:", err.message);
      db.close();
      process.exit(1);
    }

    if (rows.length > 0) {
      console.log("La base de datos ya tiene datos, no se insertaron filas.");
      db.close(() => console.log(`Base de datos lista en ${DB_PATH}`));
      return;
    }

    const stmt = db.prepare("INSERT INTO productos (nombre, precio) VALUES (?, ?)");
    for (const p of productos) stmt.run(p.nombre, p.precio);
    stmt.finalize(() =>
      db.close(() => console.log(`Base de datos creada con ${productos.length} productos en ${DB_PATH}`))
    );
  });
});
