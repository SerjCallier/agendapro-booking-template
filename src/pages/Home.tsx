import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Loader2, CheckCircle2, MapPin, CalendarPlus } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { fetchServices, type ServiceData } from '../services/n8nService';
import { BookingWidget } from '../components/BookingWidget';
import { businessConfig } from '../config/businessConfig';

export const Home: React.FC = () => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Guardamos el turno reservado para generar enlaces
  const [reservationData, setReservationData] = useState<{slot: any, user: any} | null>(null);

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

  if (bookingSuccess && selectedService && reservationData) {
    // ---- Lógica para URLs de Calendario y Mapas ----
    const startDate = new Date(reservationData.slot.datetime);
    const endDate = new Date(startDate.getTime() + selectedService.duracionMinutos * 60000);

    const formatGCalDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const gCalDates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;

    const ubicacionNegocio = businessConfig.contact.address;
    const gCalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(selectedService.nombre + " - " + businessConfig.name)}&dates=${gCalDates}&details=${encodeURIComponent("Turno reservado con éxito en " + businessConfig.name + ".")}&location=${encodeURIComponent(ubicacionNegocio)}`;
    const mapsLink = `https://maps.google.com/?q=${encodeURIComponent(ubicacionNegocio)}`;

    const humanDate = format(startDate, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es });
    const waMessage = `Hola! Soy *${reservationData.user.nombre}*. Acabo de reservar mi turno para *${selectedService.nombre}* el *${humanDate}hs*.\n\nMis datos:\n- Email: ${reservationData.user.email}\n- Tel: ${reservationData.user.telefono}\n\nQuiero confirmar mi seña y recibir el comprobante.\n\n📅 _Evento_: ${gCalLink}\n📍 _Ubicación_: ${mapsLink}`;
    const waUrl = `${businessConfig.contact.whatsapp.includes('?') ? businessConfig.contact.whatsapp + '&' : businessConfig.contact.whatsapp + '?'}text=${encodeURIComponent(waMessage)}`;
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-slide-up px-4 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">¡Turno Reservado con Éxito!</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mb-8">
          Hemos recibido tu seña correctamente. Tu turno ya está agendado en nuestro sistema.
        </p>
        
        {/* Mitigación Costos WhatsApp - Call to action del usuario */}
        <div className="bg-white dark:bg-dark-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-dark-700 w-full max-w-xl mx-auto text-left flex flex-col items-center">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-center">Paso final recomendado:</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">Te enviamos el detalle por correo, pero si quieres recibir tu comprobante rápido e instrucciones, envíanos un WhatsApp automático.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full mb-6">
            <a 
              href={gCalLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center p-3 border border-gray-200 dark:border-dark-600 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <CalendarPlus className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" />
              Guardar en Calendar
            </a>
            <a 
              href={mapsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center p-3 border border-gray-200 dark:border-dark-600 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <MapPin className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" />
              Ver en Mapa
            </a>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Confirmar por WhatsApp
          </a>
        </div>

        <button 
          onClick={() => setBookingSuccess(false)}
          className="mt-8 text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-slide-up">
      {/* Hero Section */}
      <section className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-white dark:from-dark-800 dark:to-dark-900 rounded-3xl shadow-sm border border-primary-100 dark:border-dark-700">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
          {businessConfig.tagline}
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 mb-10">
          Elige el servicio, selecciona el horario que mejor te quede y reserva asegurando tu lugar al instante con una pequeña seña.
        </p>
        <button 
          onClick={() => {
             const target = document.getElementById('catalogo');
             if(target) target.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
          <Calendar className="w-5 h-5 mr-2" />
          Ver Catálogo y Reservar
        </button>
      </section>

      {/* Catálogo Section */}
      <section id="catalogo">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Clock className="w-6 h-6 mr-2 text-primary-500" />
            Nuestros Servicios
          </h2>
        </div>
        
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
                   <img src={service.imagenUrl} alt={service.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {service.nombre}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{service.duracionMinutos} min</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm line-clamp-2">
                    {service.descripcion}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-dark-700">
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    $ {service.precio.toLocaleString()} {service.moneda}
                  </span>
                  <button 
                    onClick={() => handleOpenWidget(service)}
                    className="flex items-center font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-primary-600 dark:hover:bg-primary-500 dark:hover:text-white transition-colors">
                    Reservar
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Visítanos y Relájate</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
              Nos encontramos en el corazón de la ciudad. Reserva tu turno online, acércate y deja que nuestros profesionales se encarguen del resto.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 bg-primary-100 dark:bg-primary-900/30 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ubicación</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">{businessConfig.contact.address.split(',').slice(0, 2).join(',')}<br />{businessConfig.contact.address.split(',').slice(2).join(',')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 bg-primary-100 dark:bg-primary-900/30 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Horarios de Atención</h3>
                  <ul className="text-gray-500 dark:text-gray-400 mt-1 space-y-1">
                    <li><strong className="font-medium text-gray-700 dark:text-gray-300">Lun a Vie:</strong> 09:00 - 20:00</li>
                    <li><strong className="font-medium text-gray-700 dark:text-gray-300">Sábados:</strong> 10:00 - 18:00</li>
                    <li><strong className="font-medium text-gray-700 dark:text-gray-300">Domingos:</strong> Cerrado</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-96 bg-gray-200 dark:bg-dark-800 rounded-3xl overflow-hidden shadow-md border border-gray-100 dark:border-dark-700">
            <iframe 
              src={businessConfig.contact.addressLink} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de ubicación del salón"
            ></iframe>
          </div>
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

