import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Loader2, Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { fetchAvailableSlots, type BookingSlot } from '../services/calendarService';
import { type ServiceData } from '../services/n8nService';
import { defaultTeam } from '../config/businessConfig';

interface BookingWidgetProps {
  service: ServiceData;
  onClose: () => void;
  onReserve: (slot: BookingSlot, personalData: any) => void;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ service, onClose, onReserve }) => {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState(defaultTeam[0]);
  const [step, setStep] = useState<1 | 2>(1); // 1: Profesional, Fecha y Hora, 2: Datos y Seña
  const [userData, setUserData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });

  // Simular Fetch de Slots al cambiar de fecha o profesional
  useEffect(() => {
    setLoadingSlots(true);
    setSelectedSlot(null);
    fetchAvailableSlots(selectedDate, service.id, selectedProfessional.id).then(data => {
      setSlots(data);
      setLoadingSlots(false);
    });
  }, [selectedDate, service.id, selectedProfessional.id]);

  // Generar próximos 7 días para el carrusel superior
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const nextDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleNextStep = () => {
    if (selectedSlot) setStep(2);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700 flex justify-between items-center bg-gray-50 dark:bg-dark-800">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('booking.modalTitle', 'Agendar Turno')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{service.nombre} • {service.duracionMinutos} min</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 ? (
            <div className="space-y-6">
              {/* Professional Selector */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary-500" />
                  {t('booking.selectProfessional', 'Selecciona un profesional')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {defaultTeam.map((pro) => (
                    <button
                      key={pro.id}
                      onClick={() => setSelectedProfessional(pro)}
                      className={`flex items-center p-3 rounded-xl border transition-all ${
                        selectedProfessional.id === pro.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500 shadow-sm'
                          : 'border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-400 hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                    >
                      <img src={pro.imagenUrl} alt={pro.nombre} className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200 dark:border-dark-600" />
                      <div className="text-left">
                        <p className="text-sm font-bold truncate">{pro.nombre}</p>
                        <p className="text-xs opacity-70 truncate">{pro.rol}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selector */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-primary-500" />
                    {t('booking.selectDay', 'Selecciona un día')}
                  </h4>
                </div>
                
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                  {nextDays.map((date, i) => (
                    <button
                      key={i}
                      onClick={() => handleDateSelect(date)}
                      className={`flex flex-col items-center justify-center min-w-[70px] p-3 rounded-xl border transition-all ${
                        isSameDay(date, selectedDate)
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500 shadow-sm'
                          : 'border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-400 hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                    >
                      <span className="text-xs font-medium uppercase mb-1">{format(date, 'EEE', { locale: i18n.language === 'es' ? es : enUS })}</span>
                      <span className="text-xl font-bold">{format(date, 'd')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-500" />
                  {t('booking.availableSlots', 'Horarios Disponibles')}
                </h4>
                
                {loadingSlots ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {slots.filter(s => s.available).length === 0 ? (
                      <div className="col-span-full text-center py-6 text-gray-500 dark:text-gray-400">
                        {t('booking.noSlots', 'No hay horarios disponibles para este día con {{profesional}}.', { profesional: selectedProfessional.nombre })}
                      </div>
                    ) : (
                      slots.map((slot, i) => {
                        const dateObj = new Date(slot.datetime);
                        const isSelected = selectedSlot?.datetime === slot.datetime;
                        if (!slot.available) return null;

                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-3 px-2 rounded-lg text-sm font-medium border text-center transition-all ${
                              isSelected
                                ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                                : 'bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                            }`}
                          >
                            {format(dateObj, 'HH:mm')}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 p-4 rounded-xl flex items-start">
                  <CalendarIcon className="w-5 h-5 mr-3 mt-0.5" />
                  <div>
                    <p className="font-semibold">{t('booking.summaryTitle', 'Resumen de tu turno')}</p>
                    <p className="text-sm mt-1">{service.nombre} {t('booking.withPro', 'con')} {selectedProfessional.nombre}</p>
                    <p className="text-sm mt-0.5">{selectedSlot && format(new Date(selectedSlot.datetime), "EEEE d 'de' MMMM 'a las' HH:mm", { locale: i18n.language === 'es' ? es : enUS })}hs</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
                    <input 
                      type="text" 
                      required 
                      value={userData.nombre}
                      onChange={(e) => setUserData({...userData, nombre: e.target.value})}
                      className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-colors text-gray-900 dark:text-white" 
                      placeholder="Ej. Juan Pérez" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
                    <input 
                      type="email" 
                      required 
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-colors text-gray-900 dark:text-white" 
                      placeholder="juan@ejemplo.com" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono (WhatsApp)</label>
                    <input 
                      type="tel" 
                      required 
                      value={userData.telefono}
                      onChange={(e) => setUserData({...userData, telefono: e.target.value})}
                      className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-colors text-gray-900 dark:text-white" 
                      placeholder="+54 9 11 ..." 
                    />
                  </div>
                </div>

              <div className="bg-gray-50 dark:bg-dark-800 p-4 rounded-xl border border-gray-200 dark:border-dark-700 flex justify-between items-center mt-6">
                 <span className="text-gray-600 dark:text-gray-400">{t('booking.depositLabel', 'Total a pagar ahora (Seña)')}</span>
                 <span className="text-2xl font-bold text-gray-900 dark:text-white">$ {(service.precio * 0.3).toLocaleString()} <span className="text-sm font-normal text-gray-500">{service.moneda}</span></span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800 flex justify-end space-x-3">
          {step === 2 && (
            <button onClick={() => setStep(1)} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-900 border border-gray-300 dark:border-dark-600 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
              {t('common.back', 'Volver')}
            </button>
          )}
          <button
            onClick={step === 1 ? handleNextStep : () => onReserve(selectedSlot!, userData)}
            disabled={step === 1 ? !selectedSlot : (!userData.nombre || !userData.email || !userData.telefono)}
            className={`px-6 py-2.5 text-sm font-medium rounded-xl text-white transition-all shadow-sm ${
              (step === 1 ? !selectedSlot : (!userData.nombre || !userData.email || !userData.telefono))
                ? 'bg-gray-300 dark:bg-dark-700 cursor-not-allowed text-gray-500 dark:text-gray-500'
                : 'bg-primary-600 hover:bg-primary-700 hover:shadow-md'
            }`}
          >
            {step === 1 ? t('common.continue', 'Continuar') : t('booking.payAndConfirm', 'Pagar Seña y Confirmar')}
          </button>
        </div>
      </div>
    </div>
  );
};
