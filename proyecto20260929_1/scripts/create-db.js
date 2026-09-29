import sqlite3 from "sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const DB_PATH = resolve("data/productos.db");

// Asegura que la carpeta 'data' exista
mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Error al abrir la base de datos:", err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  // Recrea la tabla desde cero (útil para regenerar datos de ejemplo)
  db.run("DROP TABLE IF EXISTS productos");

  db.run(`
    CREATE TABLE productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      precio REAL NOT NULL
    )
  `);

  const productos = [
    ["Laptop Lenovo ThinkPad", 18500.0],
    ["Mouse inalámbrico Logitech", 349.99],
    ["Teclado mecánico Redragon", 1290.5],
    ["Monitor LG 24 pulgadas", 3200.75],
    ["Audífonos Sony inalámbricos", 5999.0],
    ["Webcam Full HD", 899.99],
    ["SSD Kingston 1TB", 1450.0],
    ["Memoria RAM 16GB DDR4", 899.0],
    ["Impresora Epson EcoTank", 4500.0],
    ["Cable HDMI 2 metros", 150.0],
  ];

  const stmt = db.prepare("INSERT INTO productos (nombre, precio) VALUES (?, ?)");
  for (const [nombre, precio] of productos) {
    stmt.run(nombre, precio);
  }
  stmt.finalize();

  db.all("SELECT id, nombre, precio FROM productos ORDER BY id", (err, rows) => {
    if (err) {
      console.error("Error al consultar:", err.message);
      return;
    }
    console.log("Productos insertados:");
    for (const row of rows) {
      console.log(`  ${row.id}. ${row.nombre} — $${row.precio.toFixed(2)}`);
    }
  });
});

db.close((err) => {
  if (err) {
    console.error("Error al cerrar la base de datos:", err.message);
  } else {
    console.log(`\nBase de datos creada en: ${DB_PATH}`);
  }
});
