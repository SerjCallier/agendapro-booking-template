import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Loader2, ExternalLink } from 'lucide-react';

interface LocationMapProps {
  address: string;
  title?: string;
}

interface GeocodedPlace {
  lat: number;
  lon: number;
  displayName: string;
  boundingbox: [string, string, string, string];
}

/** Raw Nominatim response shape (snake_case keys come from the API). */
interface NominatimResult {
  lat?: string;
  lon?: string;
  display_name?: string;
  boundingbox?: string[];
}

const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';
const GEOCODING_TIMEOUT_MS = 10000;

/**
 * Custom-pin map for the business address.
 * Geocodes the address via Nominatim (OpenStreetMap, plain fetch, no API key)
 * and renders an OSM embed with a custom overlay pin. Falls back to a
 * graceful address card + Google Maps link when geocoding fails.
 */
export const LocationMap: React.FC<LocationMapProps> = ({ address, title }) => {
  const { t, i18n } = useTranslation();
  const [place, setPlace] = useState<GeocodedPlace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GEOCODING_TIMEOUT_MS);

    const query = encodeURIComponent(address);
    const url = `${NOMINATIM_SEARCH_URL}?format=json&limit=1&accept-language=${i18n.language}&q=${query}`;

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Nominatim responded with ${response.status}`);
        return response.json();
      })
      .then((results: unknown[]) => {
        const first = results[0] as NominatimResult | undefined;
        if (!first || typeof first.lat !== 'string' || typeof first.lon !== 'string') {
          throw new Error('No geocoding results');
        }
        const box = first.boundingbox;
        if (!box || box.length < 4) throw new Error('Missing bounding box');
        setPlace({
          lat: parseFloat(first.lat),
          lon: parseFloat(first.lon),
          displayName: first.display_name ?? address,
          boundingbox: [box[0], box[1], box[2], box[3]],
        });
      })
      .catch((error: unknown) => {
        if ((error as Error).name === 'AbortError') {
          console.warn('Geocoding timed out for address:', address);
        } else {
          console.warn('Geocoding failed for address:', address, error);
        }
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
    // El componente se remonta (key) cuando cambia la dirección; el estado
    // inicial (loading) ya cubre el reset, sin setState síncrono en el effect.
  }, [address, i18n.language]);

  const fallbackMapsLink = `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  // Loading skeleton
  if (loading) {
    return (
      <div className="h-96 bg-gray-200 dark:bg-dark-800 rounded-3xl flex items-center justify-center shadow-md border border-gray-100 dark:border-dark-700">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          <p className="text-sm">{t('home.mapLoading', 'Localizando dirección...')}</p>
        </div>
      </div>
    );
  }

  // Graceful fallback: address card + Google Maps link
  if (!place) {
    return (
      <div className="h-96 bg-gray-100 dark:bg-dark-800 rounded-3xl flex flex-col items-center justify-center gap-4 p-8 text-center shadow-md border border-gray-200 dark:border-dark-700">
        <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{address}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('home.mapUnavailable', 'No pudimos generar el mapa para esta dirección.')}</p>
        </div>
        <a
          href={fallbackMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          {t('booking.viewOnMap', 'Ver en Mapa')}
        </a>
      </div>
    );
  }

  // Geocoded: OSM embed with a custom pin overlay
  const [south, north, west, east] = place.boundingbox.map(parseFloat);
  const bbox = `${west},${south},${east},${north}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${place.lat},${place.lon}`;

  return (
    <div className="relative h-96 rounded-3xl overflow-hidden shadow-md border border-gray-100 dark:border-dark-700">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        title={title ?? t('home.mapTitle', 'Mapa de ubicación del negocio')}
      />
      {/* Custom pin overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-3 rounded-full bg-primary-500/20 animate-ping" />
          <div className="relative w-10 h-10 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center ring-4 ring-white dark:ring-dark-800">
            <MapPin className="w-5 h-5" />
          </div>
        </div>
      </div>
      {/* Address chip */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto max-w-xs bg-white/90 dark:bg-dark-900/90 backdrop-blur-md rounded-xl px-4 py-2.5 shadow-md border border-gray-200 dark:border-dark-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{address}</p>
      </div>
    </div>
  );
};