import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Loader2, CheckCircle2, MapPin, CalendarPlus, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { fetchServices, type ServiceData } from '../services/n8nService';
import { BookingWidget } from '../components/BookingWidget';
import { LocationMap } from '../components/LocationMap';
import { businessConfig } from '../config/businessConfig';
import { getNicheById } from '../config/niches';
import { useBusinessState, offerWhatsAppUrl } from '../services/businessState';

export const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [reservationCopied, setReservationCopied] = useState(false);
  
  // Guardamos el turno reservado para generar enlaces
  const [reservationData, setReservationData] = useState<{slot: any, user: any} | null>(null);

  // Personalized demo state (re-renders when localStorage business state changes)
  const business = useBusinessState();
  const niche = business ? getNicheById(business.nicheId) ?? null : null;
  const businessDisplayName = business?.name ?? businessConfig.name;
  const businessAddress = business?.address ?? businessConfig.contact.address;

  useEffect(() => {
    fetchServices().then(data => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  const handleOpenWidget = (service: ServiceData) => {
    setSelectedService(service);
    setIsWidgetOpen(true);
  };

  const handleSimulatePaymentAndReserve = (slot: any, userData: any) => {
    setReservationData({ slot, user: userData });
    // Simular que el usuario fue a MercadoPago y volvió
    setIsWidgetOpen(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setBookingSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const handleCopyReservation = async () => {
    if (!selectedService || !reservationData) return;
    const startDate = new Date(reservationData.slot.datetime);
    const dateLocale = i18n.language === 'es' ? es : enUS;
    const humanDate = format(startDate, `EEEE d '${t('booking.onDay', 'de')}' MMMM '${t('booking.atTime', 'a las')}' HH:mm`, { locale: dateLocale });
    const summary = [
      t('booking.copyReservationBody', 'Resumen de mi reserva:'),
      `- ${t('booking.copyService', 'Servicio')}: ${selectedService.nombre}`,
      `- ${t('booking.copyDate', 'Fecha')}: ${humanDate}hs`,
      `- ${t('booking.copyName', 'Nombre')}: ${reservationData.user.nombre}`,
      `- ${t('booking.copyEmail', 'Email')}: ${reservationData.user.email}`,
      `- ${t('booking.copyPhone', 'Teléfono')}: ${reservationData.user.telefono}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(summary);
      setReservationCopied(true);
      setTimeout(() => setReservationCopied(false), 2500);
    } catch (error) {
      console.error('Error copying reservation summary:', error);
    }
  };

  if (bookingSuccess && selectedService && reservationData) {
    // ---- Lógica para URLs de Calendario y Mapas (sin WhatsApp del bot real) ----
    const startDate = new Date(reservationData.slot.datetime);
    const endDate = new Date(startDate.getTime() + selectedService.duracionMinutos * 60000);

    const formatGCalDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const gCalDates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;

    const gCalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(selectedService.nombre + " - " + businessDisplayName)}&dates=${gCalDates}&details=${encodeURIComponent("Turno reservado con éxito en " + businessDisplayName + ".")}&location=${encodeURIComponent(businessAddress)}`;
    const mapsLink = `https://maps.google.com/?q=${encodeURIComponent(businessAddress)}`;

    return (
      <div className="flex flex-col items-center justify-center py-20 animate-slide-up px-4 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">{t('booking.successTitle', '¡Turno Reservado con Éxito!')}</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mb-8">
          {t('booking.successMessage', 'Hemos recibido tu seña correctamente. Tu turno ya está agendado en nuestro sistema.')}
        </p>
        
        {/* Reserva en modo demo: sin WhatsApp del bot real (cero riesgo legal) */}
        <div className="bg-white dark:bg-dark-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-dark-700 w-full max-w-xl mx-auto text-left flex flex-col items-center">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-center">{t('booking.finalStepTitle', 'Paso final recomendado:')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">{t('booking.whatsappPrompt', 'Te enviamos el detalle por correo, pero si quieres recibir tu comprobante rápido e instrucciones, envíanos un WhatsApp automático.')}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full mb-6">
            <a 
              href={gCalLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center p-3 border border-gray-200 dark:border-dark-600 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <CalendarPlus className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" />
              {t('booking.saveToCalendar', 'Guardar en Calendar')}
            </a>
            <a 
              href={mapsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center p-3 border border-gray-200 dark:border-dark-600 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <MapPin className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" />
              {t('booking.viewOnMap', 'Ver en Mapa')}
            </a>
          </div>

          {/* Avíso demo: la confirmación NO se envía por WhatsApp en la demo */}
          <div className="w-full rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 p-4 text-left">
            <p className="text-sm font-semibold text-primary-800 dark:text-primary-300 mb-1">
              {t('booking.demoReservationTitle', 'Reserva registrada en modo demo')}
            </p>
            <p className="text-xs text-primary-700 dark:text-primary-300/80 mb-3 leading-relaxed">
              {t('booking.demoReservationMessage', 'En esta demo la confirmación se registra en el sistema y no se envía por WhatsApp. En la versión final, el cliente recibe el comprobante automáticamente.')}
            </p>
            <button
              onClick={handleCopyReservation}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              {reservationCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {reservationCopied ? t('booking.copied', 'Resumen copiado') : t('booking.copyReservation', 'Copiar resumen de la reserva')}
            </button>
          </div>
        </div>

        <button 
          onClick={() => setBookingSuccess(false)}
          className="mt-8 text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          {t('booking.backToCatalog', 'Volver al catálogo')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-slide-up">
       {/* Hero Section */}
       <section className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-white dark:from-dark-800 dark:to-dark-900 rounded-3xl shadow-sm border border-primary-100 dark:border-dark-700">
         <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
           {business
             ? t('home.demoTitle', '{{negocio}}: turnos online para {{rubro}}', { negocio: business.name, rubro: niche ? t(niche.labelKey, niche.label) : '' })
             : t('home.title', 'KlierBook: Agenda profesional sin suscripciones, con recordatorios de WhatsApp')}
         </h1>
         <p className="max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 mb-10">
           {niche
             ? t(niche.taglineKey, niche.tagline)
             : t('home.tagline', 'Recordatorios por WhatsApp que reducen olvidos. Seña que asegura tu ingreso. Sin suscripciones.')}
         </p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
           <button 
             onClick={() => {
                const target = document.getElementById('catalogo');
                if(target) target.scrollIntoView({ behavior: 'smooth' });
             }}
             className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
             <Calendar className="w-5 h-5 mr-2" />
             {t('home.cta', 'Ver demostración')}
           </button>
           {/* Oferta KlierBook: número REAL del bot, SOLO aquí (meeting 1-1) */}
           <a
             href={offerWhatsAppUrl(t('home.offerWhatsAppMessage', 'Hola KlierBook! Quiero una demo personalizada para mi negocio.'))}
             target="_blank"
             rel="noopener noreferrer"
             className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012-2v8a2 2 0 01-2 2h-5l-5 5v-3z"/></svg>
             {t('home.offerWhatsAppCta', 'Contacto por WhatsApp')}
           </a>
         </div>
       </section>

      {/* Catálogo Section */}
      <section id="catalogo">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Clock className="w-6 h-6 mr-2 text-primary-500" />
            {t('home.ourServices', 'Nuestros Servicios')}
          </h2>
        </div>
        {niche && (
          <p className="text-sm text-gray-500 dark:text-gray-400 -mt-5 mb-6">
            {t('home.ourServicesNiche', 'Servicios y precios por defecto para {{rubro}}. En tu versión final podrás editarlos.', { rubro: t(niche.labelKey, niche.label) })}
          </p>
        )}
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700 hover:shadow-md transition-shadow group flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Calendar className="w-16 h-16 text-primary-500" />
                </div>
                
                {/* Imagen del servicio (si proviene de Google Sheets/Drive) */}
                <div className="w-full h-40 mb-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-700">
                   <img src={service.imagenUrl} alt={service.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                     onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t(`home.service.${service.id}.name`, service.nombre)}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{service.duracionMinutos} min</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm line-clamp-2">
                    {t(`home.service.${service.id}.desc`, service.descripcion)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-dark-700">
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    $ {service.precio.toLocaleString('es-AR')} {service.moneda}
                  </span>
                  <button 
                    onClick={() => handleOpenWidget(service)}
                    className="flex items-center font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-primary-600 dark:hover:bg-primary-500 dark:hover:text-white transition-colors">
                    {t('booking.reserve', 'Reservar')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Ubicación y Horarios Section */}
      <section className="py-16 border-t border-gray-100 dark:border-dark-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('home.locationTitle', 'Visítanos y Relájate')}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
              {t('home.locationSubtitle', 'Nos encontramos en el corazón de la ciudad. Reserva tu turno online, acércate y deja que nuestros profesionales se encarguen del resto.')}
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 bg-primary-100 dark:bg-primary-900/30 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('home.locationLabel', 'Ubicación')}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {businessAddress.split(',').map((part) => part.trim()).filter(Boolean).join(', ')}
                  </p>
                  {business?.phone && (
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{business.phone}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 bg-primary-100 dark:bg-primary-900/30 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('home.hoursTitle', 'Horarios de Atención')}</h3>
                  <ul className="text-gray-500 dark:text-gray-400 mt-1 space-y-1">
                    <li><strong className="font-medium text-gray-700 dark:text-gray-300">{t('home.weekdays', 'Lun a Vie:')}</strong> 09:00 - 20:00</li>
                    <li><strong className="font-medium text-gray-700 dark:text-gray-300">{t('home.saturdays', 'Sábados:')}</strong> 10:00 - 18:00</li>
                    <li><strong className="font-medium text-gray-700 dark:text-gray-300">{t('home.sundays', 'Domingos:')}</strong> {t('home.closed', 'Cerrado')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mapa con pin custom (geocoding Nominatim + OSM embed, fallback Google Maps) */}
          <LocationMap key={businessAddress} address={businessAddress} />
        </div>
      </section>

      {/* Inject Booking Widget Modal if open */}
      {isWidgetOpen && selectedService && (
        <BookingWidget 
          service={selectedService} 
          onClose={() => setIsWidgetOpen(false)} 
          onReserve={handleSimulatePaymentAndReserve}
        />
      )}
    </div>
  );
};