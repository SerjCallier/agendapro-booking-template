import { useSyncExternalStore } from 'react';
import { isNicheId, type NicheId } from '../config/niches';

/**
 * Business state for the personalized demo, persisted in localStorage.
 *
 * CRITICAL NUMBER RULE:
 * - The REAL WhatsApp number (5491123899167) is used ONLY by the offer CTA
 *   (meeting 1-1 with the KlierBook bot). See OFFER_WHATSAPP_* below.
 * - The reservation demo NEVER uses the real number (zero legal risk).
 */
export const OFFER_WHATSAPP_NUMBER = '5491123899167';
export const OFFER_WHATSAPP_URL = `https://wa.me/${OFFER_WHATSAPP_NUMBER}`;

/** Builds a wa.me link to the REAL number with a pre-filled message (offer CTA only). */
export const offerWhatsAppUrl = (message?: string): string =>
  message && message.trim() ? `${OFFER_WHATSAPP_URL}?text=${encodeURIComponent(message.trim())}` : OFFER_WHATSAPP_URL;

export interface BusinessState {
  nicheId: NicheId;
  name: string;
  phone: string;
  address: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export type BusinessStateInput = Pick<BusinessState, 'nicheId' | 'name' | 'phone' | 'address'> &
  Partial<Pick<BusinessState, 'email'>>;

const STORAGE_KEY = 'klierbook:business-state';

function createEmptyState(): BusinessState {
  const now = new Date().toISOString();
  return {
    nicheId: 'barber',
    name: '',
    phone: '',
    address: '',
    email: '',
    createdAt: now,
    updatedAt: now,
  };
}

/** Validates a parsed object before trusting it as persisted state. */
function isValidState(value: unknown): value is BusinessState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<BusinessState>;
  return (
    isNicheId(candidate.nicheId) &&
    typeof candidate.name === 'string' &&
    candidate.name.trim().length > 0 &&
    typeof candidate.phone === 'string' &&
    typeof candidate.address === 'string' &&
    (candidate.email === undefined || typeof candidate.email === 'string')
  );
}

// --- minimal external store (no new dependencies) ---

let cached: BusinessState | null | undefined;

const listeners = new Set<() => void>();

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

function readPersistedState(): BusinessState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidState(parsed) ? parsed : null;
  } catch (error) {
    console.error('Error reading business state from localStorage:', error);
    return null;
  }
}

export const getBusinessState = (): BusinessState | null => {
  if (cached !== undefined) return cached;
  cached = readPersistedState();
  return cached;
};

export const subscribeBusinessState = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** React hook that re-renders when the business state changes (localStorage updates). */
export const useBusinessState = (): BusinessState | null =>
  useSyncExternalStore(subscribeBusinessState, getBusinessState, getBusinessState);

/** Persists the business state and notifies subscribers. */
export const saveBusinessState = (input: BusinessStateInput): BusinessState => {
  const previous = getBusinessState();
  const now = new Date().toISOString();
  const next: BusinessState = {
    ...createEmptyState(),
    ...(previous ?? {}),
    ...input,
    updatedAt: now,
    createdAt: previous?.createdAt ?? now,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.error('Error saving business state to localStorage:', error);
  }
  cached = next;
  notifyListeners();
  return next;
};

/** Clears the personalized demo and restores the generic KlierBook demo. */
export const clearBusinessState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing business state from localStorage:', error);
  }
  cached = null;
  notifyListeners();
};