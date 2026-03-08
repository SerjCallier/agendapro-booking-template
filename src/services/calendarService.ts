
export interface BookingSlot {

  datetime: string; // ISO String (ej. 2026-02-26T10:00:00.000Z)
  available: boolean;
}

export const fetchAvailableSlots = async (date: Date, _serviceId: string, _professionalId?: string): Promise<BookingSlot[]> => {
  // Simulando retardo de n8n verificando Google Calendar
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generar algunos slots falsos para el día seleccionado, digamos entre 9 am y 18 pm.
      const slots: BookingSlot[] = [];
      const baseDate = new Date(date);
      baseDate.setHours(9, 0, 0, 0); // Empieza a las 9 AM

      for (let i = 0; i < 9; i++) { // 9 horas
        slots.push({
          datetime: new Date(baseDate.getTime() + i * 60 * 60 * 1000).toISOString(),
          available: Math.random() > 0.3 // 70% chance de estar disponible
        });
      }
      resolve(slots);
    }, 1000);
  });
};
