import { type ServiceData, type TeamMemberData, type BlogPostData } from '../types';
import { defaultServices, businessConfig, defaultTeam } from '../config/businessConfig';

export type { ServiceData, TeamMemberData, BlogPostData };

// URLs de n8n desde variables de entorno
const SERVICES_URL = import.meta.env.VITE_N8N_SERVICES_URL;
const TEAM_URL = import.meta.env.VITE_N8N_TEAM_URL;
const BLOG_URL = import.meta.env.VITE_N8N_BLOG_URL;
const BOOKING_URL = import.meta.env.VITE_N8N_BOOKING_URL;

// Simulando la respuesta de n8n leyendo Google Sheets (Fallback para desarrollo)
export const mockServices: ServiceData[] = defaultServices;

export const mockTeamMembers: TeamMemberData[] = defaultTeam;

export const mockBlogPosts: BlogPostData[] = [
  {
    id: "B01",
    titulo: "Tendencias de cortes para mediados de 2026",
    categoria: "Novedades",
    extracto: "Descubre cuáles son los estilos que más están pidiendo nuestros clientes este mes.",
    contenidoHtml: "<p>Contenido completo del blog...</p>",
    fecha: "2026-02-20",
    autor: "AgendaPro Team",
    imagenUrl: "https://images.unsplash.com/photo-1520338661084-6b998782a176?auto=format&fit=crop&q=80&w=800"
  }
];

/**
 * N8n Data Provider Service
 * Realiza peticiones HTTP a los Webhooks de n8n.
 * Si la URL no está definida o falla, retorna los mocks.
 */
export const fetchServices = async (): Promise<ServiceData[]> => {
  if (!SERVICES_URL) return mockServices;
  try {
    const response = await fetch(SERVICES_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    return mockServices;
  }
};

export const fetchTeamMembers = async (): Promise<TeamMemberData[]> => {
  if (!TEAM_URL) return mockTeamMembers;
  try {
    const response = await fetch(TEAM_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching team members:', error);
    return mockTeamMembers;
  }
};

export const fetchBlogPosts = async (): Promise<BlogPostData[]> => {
  if (!BLOG_URL) return mockBlogPosts;
  try {
    const response = await fetch(BLOG_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return mockBlogPosts;
  }
};

export const createBooking = async (bookingData: any): Promise<{ success: boolean; message: string }> => {
  if (!BOOKING_URL) {
    console.log(`[Demo] Reserva para ${businessConfig.name}:`, bookingData);
    return { success: true, message: 'Turno reservado (Simulado)' };
  }
  
  try {
    const response = await fetch(BOOKING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    
    if (!response.ok) throw new Error('Error en la reserva');
    return { success: true, message: 'Turno reservado con éxito' };
  } catch (error) {
    console.error('Error createBooking:', error);
    return { success: false, message: 'No se pudo procesar la reserva' };
  }
};
