'use client';
import type { Route } from "./+types/home";
import { productoService } from "~/services/ProductoService.server";
import { useLoaderData } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}
 

export async function loader() {
  return { productos: await productoService.getAll() };
}
  
export default function cliente() {
  const { productos } = useLoaderData<typeof loader>();
  return <>
  <h1>Cliente side</h1>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Precio</th>
      </tr>
    </thead>
    <tbody>
      {productos.map((producto) => (
        <tr key={producto.id}>
          <td>{producto.id}</td>
          <td>{producto.nombre}</td>
          <td>{producto.precio}</td>
        </tr>
      ))}
    </tbody>
  </table>
  </>;
}
