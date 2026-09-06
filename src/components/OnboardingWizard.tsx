import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Scissors, Sparkles, HeartPulse, Paintbrush, Utensils, Trophy, Store, Phone, MapPin, Mail, X, Check } from 'lucide-react';
import { NICHES, type Niche, type NicheId } from '../config/niches';
import { saveBusinessState } from '../services/businessState';

interface OnboardingWizardProps {
  open: boolean;
  onClose: () => void;
}

const NICHE_ICONS: Record<NicheId, React.ComponentType<{ className?: string }>> = {
  barber: Scissors,
  estetica: Sparkles,
  clinica: HeartPulse,
  nails: Paintbrush,
  gastronomia: Utensils,
  sports: Trophy,
};

const DIGITS_ONLY = /[^\d+]/g;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  nicheId: NicheId;
  name: string;
  phone: string;
  address: string;
  email: string;
}

type FormErrors = Partial<Record<'nicheId' | 'name' | 'phone' | 'address' | 'email', string>>;

/**
 * 4-field onboarding wizard ("only what the owner knows by memory").
 * The owner NEVER enters prices, services or professionals: each niche
 * preloads its market defaults. Saving persists to localStorage and the
 * personalized demo renders immediately.
 */
export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>({
    nicheId: 'barber',
    name: '',
    phone: '',
    address: '',
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const selectedNiche: Niche | undefined = useMemo(
    () => NICHES.find((niche) => niche.id === form.nicheId),
    [form.nicheId]
  );

  if (!open) return null;

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = t('onboarding.errorName', 'Ingresa el nombre de tu negocio.');
    const digits = form.phone.replace(DIGITS_ONLY, '').length;
    if (digits < 8) next.phone = t('onboarding.errorPhone', 'Ingresa un teléfono válido (mínimo 8 dígitos).');
    if (!form.address.trim()) next.address = t('onboarding.errorAddress', 'Ingresa la dirección de tu negocio.');
    if (form.email.trim() && !EMAIL_PATTERN.test(form.email.trim())) {
      next.email = t('onboarding.errorEmail', 'Ingresa un correo electrónico válido.');
    }
    return next;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    saveBusinessState({
      nicheId: form.nicheId,
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      email: form.email.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 overflow-y-auto bg-gray-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl w-full max-w-2xl my-4 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-dark-700 flex justify-between items-center bg-gray-50 dark:bg-dark-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('onboarding.title', 'Personaliza tu demo')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('onboarding.subtitle', 'Completa los datos de tu negocio y genera tu demo personalizada al instante.')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Niche selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {`${t('onboarding.nicheLabel', 'Rubro del negocio')} *`}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {NICHES.map((niche) => {
                const Icon = NICHE_ICONS[niche.id];
                const selected = form.nicheId === niche.id;
                return (
                  <button
                    key={niche.id}
                    type="button"
                    onClick={() => setField('nicheId', niche.id)}
                    aria-pressed={selected}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                      selected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500'
                        : 'border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-400 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-medium text-center leading-tight">{t(niche.labelKey, niche.label)}</span>
                    {selected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              {t('onboarding.nicheHint', 'Los servicios y precios de tu rubro se precargan automáticamente.')}
            </p>
            {selectedNiche && (
              <div className="mt-3 rounded-xl border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800 p-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  {t('onboarding.nicheServices', 'Servicios precargados para este rubro:')}
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-0.5">
                  {selectedNiche.defaultServices.map((service) => (
                    <li key={service.id} className="flex justify-between gap-3">
                      <span>{service.nombre}</span>
                      <span className="font-medium text-primary-600 dark:text-primary-400">
                        ${service.precio.toLocaleString('es-AR')} {service.moneda}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {errors.nicheId && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.nicheId}</p>}
          </div>

          {/* Business name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {`${t('onboarding.nameLabel', 'Nombre del negocio')} *`}
            </label>
            <div className="relative">
              <Store className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-colors text-gray-900 dark:text-white"
                placeholder={t('onboarding.namePlaceholder', 'Ej. Barbería Don José')}
              />
            </div>
            {errors.name && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Phone / WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {`${t('onboarding.phoneLabel', 'Teléfono / WhatsApp')} *`}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-colors text-gray-900 dark:text-white"
                placeholder={t('onboarding.phonePlaceholder', 'Ej. 11 2345 6789')}
              />
            </div>
            {errors.phone && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {`${t('onboarding.addressLabel', 'Dirección')} *`}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setField('address', e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-colors text-gray-900 dark:text-white"
                placeholder={t('onboarding.addressPlaceholder', 'Ej. Av. Corrientes 1234, CABA')}
              />
            </div>
            {errors.address && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.address}</p>}
          </div>

          {/* Email (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('onboarding.emailLabel', 'Correo electrónico (opcional)')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-colors text-gray-900 dark:text-white"
                placeholder={t('onboarding.emailPlaceholder', 'Ej. hola@tunegocio.com')}
              />
            </div>
            {errors.email && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>}
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t('onboarding.brandNote', 'Solo pedimos los datos que conoces de memoria. No necesitas cargar servicios ni precios.')}
          </p>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-dark-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-900 border border-gray-300 dark:border-dark-600 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
            >
              {t('onboarding.dismiss', 'Ahora no')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-all"
            >
              {t('onboarding.submit', 'Generar mi demo')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};