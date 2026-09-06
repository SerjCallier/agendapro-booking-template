import { useEffect } from 'react';
import { type Niche } from '../config/niches';

const PALETTE_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const;

/**
 * Applies the selected niche theme at runtime:
 * - Sets `data-niche` on <html> (CSS scoping hook).
 * - Overrides the `--color-primary-*` CSS variables with the niche palette.
 * - Removes all overrides when no niche is selected, restoring the default
 *   KlierBook palette from index.css.
 *
 * The existing dark/light toggle keeps working: the layout shell already
 * persists the `dark` class, and the niche palette works on both modes.
 */
export const useNicheTheme = (niche: Niche | null): void => {
  useEffect(() => {
    const root = document.documentElement;

    if (!niche) {
      root.removeAttribute('data-niche');
      PALETTE_STEPS.forEach((step) => root.style.removeProperty(`--color-primary-${step}`));
      return;
    }

    root.setAttribute('data-niche', niche.id);
    PALETTE_STEPS.forEach((step) => {
      root.style.setProperty(`--color-primary-${step}`, niche.theme.palette[Number(step)]);
    });
  }, [niche]);
};