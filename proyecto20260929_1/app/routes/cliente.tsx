'use client';
import type { Route } from "./+types/home";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function cliente() {
  return <>
  <h1>Cliente side</h1>
  </>;
}
