import sqlite3 from "sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type Producto from "../models/Producto";

/** Ruta de la base de datos, relativa a la raíz del proyecto */
const DB_PATH = resolve("data/productos.db");

/**
 * Servicio de acceso a datos para la tabla `productos`.
 *
 * Envuelve las callbacks de `sqlite3` en Promesas para poder
 * usar los métodos con `async/await` (por ejemplo, en loaders).
 */
export class ProductoService {
  private readonly db: sqlite3.Database;

  constructor(dbPath: string = DB_PATH) {
    // Asegura que la carpeta de la base de datos exista
    mkdirSync(dirname(dbPath), { recursive: true });
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Error al abrir la base de datos:", err.message);
      }
    });
  }

  /** Cierra la conexión con la base de datos */
  close(): Promise<void> {
    return new Promise((res, rej) => {
      this.db.close((err) => (err ? rej(err) : res()));
    });
  }

  /** Devuelve todos los productos */
  getAll(): Promise<Producto[]> {
    return new Promise((res, rej) => {
      this.db.all<Producto>(
        "SELECT id, nombre, precio FROM productos ORDER BY id",
        (err, rows) => (err ? rej(err) : res(rows))
      );
    });
  }

  /** Devuelve un producto por su id, o `null` si no existe */
  getById(id: number): Promise<Producto | null> {
    return new Promise((res, rej) => {
      this.db.get<Producto>(
        "SELECT id, nombre, precio FROM productos WHERE id = ?",
        [id],
        (err, row) => {
          if (err) rej(err);
          else res(row ?? null);
        }
      );
    });
  }

  /** Crea un producto y lo devuelve con el id generado por la base de datos */
  create(data: Omit<Producto, "id">): Promise<Producto> {
    return new Promise((res, rej) => {
      this.db.run(
        "INSERT INTO productos (nombre, precio) VALUES (?, ?)",
        [data.nombre, data.precio],
        function (err) {
          if (err) rej(err);
          else res({ id: this.lastID, ...data });
        }
      );
    });
  }

  /** Actualiza un producto; devuelve el producto actualizado o `null` si no existe */
  update(id: number, data: Omit<Producto, "id">): Promise<Producto | null> {
    return new Promise((res, rej) => {
      this.db.run(
        "UPDATE productos SET nombre = ?, precio = ? WHERE id = ?",
        [data.nombre, data.precio, id],
        function (err) {
          if (err) rej(err);
          else if (this.changes === 0) res(null);
          else res({ id, ...data });
        }
      );
    });
  }

  /** Elimina un producto; devuelve `true` si se eliminó o `false` si no existía */
  remove(id: number): Promise<boolean> {
    return new Promise((res, rej) => {
      this.db.run("DELETE FROM productos WHERE id = ?", [id], function (err) {
        if (err) rej(err);
        else res(this.changes > 0);
      });
    });
  }
}

/** Instancia compartida del servicio (reutiliza la conexión) */
export const productoService = new ProductoService();
