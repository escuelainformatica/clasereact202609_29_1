import { type RouteConfig, index,route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("cliente","routes/cliente.tsx"),
    route("listado","routes/listado.tsx")
] satisfies RouteConfig;
