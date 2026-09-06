import { type ServiceData } from '../types';
import { defaultServices } from './businessConfig';

/**
 * Niche catalog for the personalized KlierBook demo.
 *
 * Each niche defines:
 * - A Spanish-neutral label and tagline (fallbacks; i18n keys win in the UI).
 * - A primary CSS variable palette (RGB triplets, matching the tailwind
 *   `rgb(var(--color-primary-*) / <alpha-value>)` wiring).
 * - A font family used by the layout shell (`font-sans` | `font-serif` | `font-display`).
 * - Market default services in ARS. The business owner NEVER enters prices,
 *   services or professionals: they are preloaded per niche.
 */
export type NicheId = 'barber' | 'estetica' | 'clinica' | 'nails' | 'gastronomia' | 'sports';

/** RGB triplet string, e.g. "245 158 11" -> rgb(var(--color-primary-500) / <alpha-value>) */
type RgbTriplet = string;

export interface NicheTheme {
  fontFamily: 'sans' | 'serif' | 'display';
  /** Primary palette steps 50..900 as RGB triplets (applied to --color-primary-*) */
  palette: Record<number, RgbTriplet>;
}

export interface Niche {
  id: NicheId;
  /** Spanish-neutral label (fallback when the i18n key is missing) */
  label: string;
  /** i18n key: niche.<id>.label */
  labelKey: string;
  /** Spanish-neutral hero tagline (fallback) */
  tagline: string;
  /** i18n key: niche.<id>.tagline */
  taglineKey: string;
  theme: NicheTheme;
  defaultServices: ServiceData[];
}

/**
 * Tailwind reference palettes (rgb values, 0-255):
 * - barber: amber (dark, masculine barbershop vibe)
 * - estetica: rose (warm aesthetic-center vibe)
 * - clinica: teal (clean clinical vibe)
 * - nails: pink (nail studio vibe)
 */
const AMBER_PALETTE: Record<number, RgbTriplet> = {
  50: '255 251 235',
  100: '254 243 199',
  200: '253 230 138',
  300: '252 211 77',
  400: '251 191 36',
  500: '245 158 11',
  600: '217 119 6',
  700: '180 83 9',
  800: '146 64 14',
  900: '120 53 15',
};

const ROSE_PALETTE: Record<number, RgbTriplet> = {
  50: '255 241 242',
  100: '255 228 230',
  200: '254 205 211',
  300: '253 164 175',
  400: '251 113 133',
  500: '244 63 94',
  600: '225 29 72',
  700: '190 18 60',
  800: '159 18 57',
  900: '136 19 55',
};

const TEAL_PALETTE: Record<number, RgbTriplet> = {
  50: '240 253 250',
  100: '204 251 241',
  200: '153 246 228',
  300: '94 234 212',
  400: '45 212 191',
  500: '20 184 166',
  600: '13 148 136',
  700: '15 118 110',
  800: '17 94 89',
  900: '19 78 74',
};

const PINK_PALETTE: Record<number, RgbTriplet> = {
  50: '253 242 248',
  100: '252 231 243',
  200: '251 207 232',
  300: '249 168 212',
  400: '244 114 182',
  500: '236 72 153',
  600: '219 39 119',
  700: '190 24 93',
  800: '157 23 77',
  900: '131 24 67',
};

const ORANGE_PALETTE: Record<number, RgbTriplet> = {
  50: '255 247 237',
  100: '255 237 213',
  200: '254 215 170',
  300: '253 186 116',
  400: '251 146 60',
  500: '249 115 22',
  600: '234 88 12',
  700: '194 65 12',
  800: '154 52 18',
  900: '124 45 18',
};

const EMERALD_PALETTE: Record<number, RgbTriplet> = {
  50: '236 253 245',
  100: '209 250 229',
  200: '167 243 208',
  300: '110 231 183',
  400: '52 211 153',
  500: '16 185 129',
  600: '5 150 105',
  700: '4 120 87',
  800: '6 95 70',
  900: '6 78 59',
};

/* Image URLs: reuse the ones already used by the repo (proven working) plus
   well-known Unsplash photos per niche. */
const IMG_SPA = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800';
const IMG_FACIAL = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800';
const IMG_CLINIC_CONSULT = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800';
const IMG_CLINIC_TECH = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800';
const IMG_CLINIC_ROOM = 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800';
const IMG_NAILS_MANICURE = 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=800';
const IMG_NAILS_PEDICURE = 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&q=80&w=800';
const IMG_NAILS_GEL = 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=800';

const IMG_GASTRO_TABLE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800';
const IMG_GASTRO_MENU = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800';
const IMG_GASTRO_TAKEAWAY = 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&q=80&w=800';

const IMG_SPORTS_PADEL = 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&q=80&w=800';
const IMG_SPORTS_FOOTBALL = 'https://images.unsplash.com/photo-1529900245534-47fbf866b35d?auto=format&fit=crop&q=80&w=800';
const IMG_SPORTS_TRAINING = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800';

/** Gastronomía niche default services (market defaults). */
const GASTRO_SERVICES: ServiceData[] = [
  {
    id: 'GAS-01',
    nombre: 'Reserva de Mesa Salón / Terraza',
    descripcion: 'Reserva anticipada de mesa para almuerzo o cena con confirmación instantánea.',
    precio: 0,
    moneda: 'ARS',
    duracionMinutos: 120,
    imagenUrl: IMG_GASTRO_TABLE,
  },
  {
    id: 'GAS-02',
    nombre: 'Menú Ejecutivo / Degustación',
    descripcion: 'Entrada, plato principal, bebida y postre con reserva preferencial.',
    precio: 14500,
    moneda: 'ARS',
    duracionMinutos: 90,
    imagenUrl: IMG_GASTRO_MENU,
  },
  {
    id: 'GAS-03',
    nombre: 'Pedido Takeaway / Retiro en Local',
    descripcion: 'Preparación programada de tu pedido listo para retirar sin esperas.',
    precio: 9500,
    moneda: 'ARS',
    duracionMinutos: 30,
    imagenUrl: IMG_GASTRO_TAKEAWAY,
  },
];

/** Sports & Canchas niche default services. */
const SPORTS_SERVICES: ServiceData[] = [
  {
    id: 'SPO-01',
    nombre: 'Turno Cancha de Pádel (90 min)',
    descripcion: 'Alquiler de cancha de césped sintético con iluminación LED incluida.',
    precio: 22000,
    moneda: 'ARS',
    duracionMinutos: 90,
    imagenUrl: IMG_SPORTS_PADEL,
  },
  {
    id: 'SPO-02',
    nombre: 'Turno Cancha Fútbol 5 (60 min)',
    descripcion: 'Cancha techada de fútbol 5 con pecheras y pelota reglamentaria.',
    precio: 28000,
    moneda: 'ARS',
    duracionMinutos: 60,
    imagenUrl: IMG_SPORTS_FOOTBALL,
  },
  {
    id: 'SPO-03',
    nombre: 'Clase de Entrenamiento / Funcional',
    descripcion: 'Sesión personalizada de preparación física o clase guiada por profesor.',
    precio: 10000,
    moneda: 'ARS',
    duracionMinutos: 60,
    imagenUrl: IMG_SPORTS_TRAINING,
  },
];

/** Nails niche default services (market ARS defaults). */
const NAILS_SERVICES: ServiceData[] = [
  {
    id: 'NAI-01',
    nombre: 'Manicure clásico',
    descripcion: 'Limpieza, limado, cutículas y esmaltado con color a elección.',
    precio: 8000,
    moneda: 'ARS',
    duracionMinutos: 45,
    imagenUrl: IMG_NAILS_MANICURE,
  },
  {
    id: 'NAI-02',
    nombre: 'Pedicure spa',
    descripcion: 'Exfoliación, hidratación profunda, cutículas y esmaltado con masaje relajante.',
    precio: 12000,
    moneda: 'ARS',
    duracionMinutos: 60,
    imagenUrl: IMG_NAILS_PEDICURE,
  },
  {
    id: 'NAI-03',
    nombre: 'Esculpidas en gel',
    descripcion: 'Uñas esculpidas con tips o moldes en gel, con diseño liso o francesa.',
    precio: 18000,
    moneda: 'ARS',
    duracionMinutos: 90,
    imagenUrl: IMG_NAILS_GEL,
  },
];

/** Estetica niche default services (market ARS defaults). */
const ESTETICA_SERVICES: ServiceData[] = [
  {
    id: 'EST-01',
    nombre: 'Limpieza facial profunda',
    descripcion: 'Diagnóstico de piel, higiene profunda, extracción de impurezas y máscara final.',
    precio: 15000,
    moneda: 'ARS',
    duracionMinutos: 60,
    imagenUrl: IMG_FACIAL,
  },
  {
    id: 'EST-02',
    nombre: 'Masaje descontracturante',
    descripcion: 'Terapia manual de relajación muscular enfocada en zonas de tensión.',
    precio: 18000,
    moneda: 'ARS',
    duracionMinutos: 60,
    imagenUrl: IMG_SPA,
  },
  {
    id: 'EST-03',
    nombre: 'Depilación con cera piernas completas',
    descripcion: 'Depilación con cera tibia, con crema post depilación calmante.',
    precio: 12000,
    moneda: 'ARS',
    duracionMinutos: 45,
    imagenUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=800',
  },
];

/** Clinica niche default services (market ARS defaults). */
const CLINICA_SERVICES: ServiceData[] = [
  {
    id: 'CLI-01',
    nombre: 'Consulta inicial de estética clínica',
    descripcion: 'Evaluación profesional, diagnóstico y plan de tratamiento personalizado.',
    precio: 20000,
    moneda: 'ARS',
    duracionMinutos: 30,
    imagenUrl: IMG_CLINIC_CONSULT,
  },
  {
    id: 'CLI-02',
    nombre: 'Sesión de radiofrecuencia facial',
    descripcion: 'Reafirmación facial no invasiva con tecnología de radiofrecuencia.',
    precio: 28000,
    moneda: 'ARS',
    duracionMinutos: 45,
    imagenUrl: IMG_CLINIC_TECH,
  },
  {
    id: 'CLI-03',
    nombre: 'Peeling químico superficial',
    descripcion: 'Renovación celular para luminosidad, manchas y textura de la piel.',
    precio: 30000,
    moneda: 'ARS',
    duracionMinutos: 40,
    imagenUrl: IMG_CLINIC_ROOM,
  },
];

export const NICHES: Niche[] = [
  {
    id: 'barber',
    label: 'Barbería',
    labelKey: 'niche.barber.label',
    tagline: 'Cortes clásicos y modernos con turno online. Reserva en segundos y asegura tu lugar.',
    taglineKey: 'niche.barber.tagline',
    theme: {
      fontFamily: 'display',
      palette: AMBER_PALETTE,
    },
    // The existing repo defaults (corte/perfilado) are the barber niche fallback.
    defaultServices: defaultServices,
  },
  {
    id: 'estetica',
    label: 'Centro de estética',
    labelKey: 'niche.estetica.label',
    tagline: 'Tratamientos de estética y relax. Agenda tu turno online con seña incluida.',
    taglineKey: 'niche.estetica.tagline',
    theme: {
      fontFamily: 'serif',
      palette: ROSE_PALETTE,
    },
    defaultServices: ESTETICA_SERVICES,
  },
  {
    id: 'clinica',
    label: 'Clínica estética',
    labelKey: 'niche.clinica.label',
    tagline: 'Medicina y estética clínica con gestión profesional de turnos y recordatorios.',
    taglineKey: 'niche.clinica.tagline',
    theme: {
      fontFamily: 'sans',
      palette: TEAL_PALETTE,
    },
    defaultServices: CLINICA_SERVICES,
  },
  {
    id: 'nails',
    label: 'Uñas y manos',
    labelKey: 'niche.nails.label',
    tagline: 'Manicure, pedicure y esculpidas. Reserva tu turno online al instante.',
    taglineKey: 'niche.nails.tagline',
    theme: {
      fontFamily: 'display',
      palette: PINK_PALETTE,
    },
    defaultServices: NAILS_SERVICES,
  },
  {
    id: 'gastronomia',
    label: 'Restaurante y Gastronomía',
    labelKey: 'niche.gastronomia.label',
    tagline: 'Menú digital interactivo, reserva de mesas y pedidos takeaway directo a tu WhatsApp.',
    taglineKey: 'niche.gastronomia.tagline',
    theme: {
      fontFamily: 'sans',
      palette: ORANGE_PALETTE,
    },
    defaultServices: GASTRO_SERVICES,
  },
  {
    id: 'sports',
    label: 'Complejo Deportivo y Pádel',
    labelKey: 'niche.sports.label',
    tagline: 'Alquiler de canchas y clases de pádel / fútbol con seña automática 24/7.',
    taglineKey: 'niche.sports.tagline',
    theme: {
      fontFamily: 'display',
      palette: EMERALD_PALETTE,
    },
    defaultServices: SPORTS_SERVICES,
  },
];

export const getNicheById = (id: NicheId | undefined | null): Niche | undefined =>
  NICHES.find((niche) => niche.id === id);

export const isNicheId = (value: unknown): value is NicheId =>
  typeof value === 'string' && NICHES.some((niche) => niche.id === value);