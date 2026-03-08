# Especificaciones Técnicas: Flujos n8n para AgendaPro

Este documento detalla la configuración necesaria para cada nodo en n8n para que la integración con Google Sheets y el Frontend funcione correctamente.

## 1. Flujo: Obtener Servicios/Equipo/Blog (GET)
*Repetir esta estructura para cada pestaña.*

1.  **Nodo: Webhook**
    *   **HTTP Method:** GET
    *   **Path:** `services` (o `team`, `blog`)
    *   **Response Mode:** Last Node
2.  **Nodo: Google Sheets**
    *   **Operation:** Get Many
    *   **Document:** [Seleccionar tu archivo]
    *   **Sheet:** `Servicios` (o la que corresponda)
3.  **Nodo: Code (Opcional - Formateo)**
    *   Asegurarse de que los nombres de las columnas coincidan con las interfaces de TypeScript (id, nombre, descripcion, etc.).

## 2. Flujo: Crear Reserva (POST)

1.  **Nodo: Webhook**
    *   **HTTP Method:** POST
    *   **Path:** `booking`
    *   **Response Mode:** When Last Node Finishes
2.  **Nodo: Google Sheets**
    *   **Operation:** Append
    *   **Document:** [Seleccionar tu archivo]
    *   **Sheet:** `Turnos`
    *   **Data to Send:** Usar expresiones para mapear el JSON del Webhook a las columnas de la hoja.
3.  **Nodo: Google Calendar (Opcional)**
    *   **Operation:** Create Event
    *   **Start Time:** `{{ $json.fecha }}T{{ $json.hora }}:00`
    *   **Summary:** `Turno: {{ $json.servicio }} - {{ $json.cliente }}`
4.  **Nodo: Respond to Webhook**
    *   **Response Body:** `{"success": true, "message": "Reserva confirmada"}`

## 3. Formato de Google Sheets (Columnas Sugeridas)

### Pestaña `Turnos`
| Fecha | Hora | Cliente | WhatsApp | Servicio | Profesional | Notas | Estado |
|-------|------|---------|----------|----------|-------------|-------|--------|
| ...   | ...  | ...     | ...      | ...      | ...         | ...   | Programado |

---

> [!TIP]
> Una vez creados los Webhooks en n8n, copia la "Production URL" y pégala en tu archivo `.env` local.
