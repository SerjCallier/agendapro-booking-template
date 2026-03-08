// Shared types used by both n8nService and businessConfig
// This file breaks the circular dependency between those two modules.

export interface ServiceData {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  moneda: string;
  duracionMinutos: number;
  imagenUrl: string;
}

export interface TeamMemberData {
  id: string;
  nombre: string;
  rol: string;
  descripcion: string;
  imagenUrl: string;
}

export interface BlogPostData {
  id: string;
  titulo: string;
  categoria: string;
  extracto: string;
  contenidoHtml: string;
  fecha: string;
  autor: string;
  imagenUrl: string;
}
