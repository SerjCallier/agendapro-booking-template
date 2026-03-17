import { type ServiceData, type TeamMemberData } from '../types';

export interface BusinessConfig {
  name: string;
  tagline: string;
  logoSvg: string;
  // Theme
  theme: {
    primaryLight: string; // Hex for light mode
    primaryDark: string;  // Hex for dark mode
    fontFamily: 'sans' | 'serif' | 'display';
  };
  contact: {
    phone: string;
    whatsapp: string; // Full URL or phone number
    address: string;
    addressLink: string;
    email: string;
  };
  social: {
    instagram?: string;
    facebook?: string;
  };
}

export interface Schedule {
  start: string; // "09:00"
  end: string;   // "18:00"
  days: number[]; // [1, 2, 3, 4, 5] (1=Mon, 7=Sun)
}

export interface TeamMemberWithSchedule extends TeamMemberData {
  schedule: Schedule;
}

export const businessConfig: BusinessConfig = {
  name: "KlierBook",
  tagline: "Agenda tu turno fácil y rápido",
  logoSvg: "M6 4v16 M17 4l-11 8 11 8 M6 4h5.5c2.5 0 4.5 1.5 4.5 4s-2 4-4.5 4H6 M6 12h6.5c2.5 0 5.5 1.5 5.5 4s-3 4-5.5 4H6",
  theme: {
    primaryLight: "#9A56EE", // KlierNav Purple
    primaryDark: "#4F8FDD",  // KlierNav Blue/Cyan vibe
    fontFamily: 'sans'
  },
  contact: {
    phone: "+54 9 11 2233 4455",
    whatsapp: "https://wa.me/5491122334455",
    address: "Palermo Soho, Buenos Aires, Argentina",
    addressLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13136.06685000989!2d-58.43574825946571!3d-34.58882012017772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5818987b2fd%3A0x6bba3dd2cc08f58b!2sPalermo%20Soho%2C%20CABA!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar",
    email: "hola@klierbook.com"
  },
  social: {
    instagram: "https://instagram.com/kliernav"
  }
};

export const defaultTeam: TeamMemberWithSchedule[] = [
  {
    id: "E01",
    nombre: "Ana García",
    rol: "Estilista Principal",
    descripcion: "Especialista en colorimetría, visagismo y diseño de autor.",
    imagenUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    schedule: { start: "09:00", end: "15:00", days: [1, 2, 3, 4, 5] }
  },
  {
    id: "E02",
    nombre: "Carlos Ruiz",
    rol: "Barbero Senior",
    descripcion: "Más de 10 años de experiencia en cortes clásicos y perfilado tradicional.",
    imagenUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
    schedule: { start: "12:00", end: "20:00", days: [2, 3, 4, 5, 6] }
  },
  {
    id: "E03",
    nombre: "Lucía Fernández",
    rol: "Cosmetóloga",
    descripcion: "Experta en cuidado de la piel y tratamientos faciales rejuvenecedores.",
    imagenUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    schedule: { start: "10:00", end: "18:00", days: [1, 3, 5] }
  }
];

// Fallback services if n8n is not connected
export const defaultServices: ServiceData[] = [
  {
    id: "S01",
    nombre: "Corte y Perfilado Asesorado",
    descripcion: "Corte clásico o moderno con perfilado de barba preciso. Incluye lavado.",
    precio: 6500,
    moneda: "ARS",
    duracionMinutos: 45,
    imagenUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "S02",
    nombre: "Tratamiento VIP y Relax",
    descripcion: "Experiencia completa: corte, spa capilar, limpieza facial y tragos de cortesía.",
    precio: 15000,
    moneda: "ARS",
    duracionMinutos: 90,
    imagenUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "S03",
    nombre: "Limpieza Facial Exprés",
    descripcion: "Tratamiento de piel rápido para iluminar y limpiar poros antes de un evento.",
    precio: 4000,
    moneda: "ARS",
    duracionMinutos: 30,
    imagenUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800"
  }
];
