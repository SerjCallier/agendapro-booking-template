# Estructura de Base de Datos - Google Sheets

Para que el modelo funcione correctamente con n8n, el documento de Google Sheets (que actuará como CMS/Base de datos) debe tener las siguientes pestañas correspondientes a cada funcionalidad.

## 1. Pestaña: `Servicios`
Contiene el catálogo principal de los turnos que se pueden reservar.

| ID | Nombre | Descripcion | Precio | Moneda | DuracionMinutos | ImagenURL | Activo |
|----|--------|-------------|--------|--------|-----------------|-----------|--------|
| S01 | Corte Premium | Corte de pelo con lavado y asesoramiento | 5000 | ARS | 45 | https://drive.google.com/url | TRUE |
| S02 | Color y Peinado | Tintura completa y peinado final | 12000 | ARS | 120 | https://drive.google.com/url | TRUE |

## 2. Pestaña: `Equipo`
Permite cargar dinámicamente a los profesionales o personal del negocio.

| ID | Nombre | Rol | Descripcion | ImagenURL | Activo |
|----|--------|-----|-------------|-----------|--------|
| E01 | Ana García | Estilista Principal | Especialista en colorimetría y diseño de autor. | https://drive.google.com/url | TRUE |
| E02 | Carlos Ruiz | Barbero | Más de 10 años de experiencia en cortes clásicos. | https://drive.google.com/url | TRUE |

## 3. Pestaña: `Blog`
Permite al cliente agregar nuevos artículos que benefician el SEO de la página web.

| ID | Titulo | Categoria | Extracto | Contenido_Markdown | Fecha | Autor | ImagenURL | Publicado |
|----|--------|-----------|----------|--------------------|-------|-------|-----------|-----------|
| B01 | 5 Tips para cuidar tu cabello | Cuidado | Descubre cómo mantener tu color por más tiempo | # 5 Tips... | 2026-02-25 | Flor | https://drive... | TRUE |
| B02 | Nuevas tendencias 2026 | Novedades | Lo que se viene este año en estilismo | # Las nuevas... | 2026-02-20 | Sergio | https://drive... | TRUE |

## 3. Pestaña: `Configuracion` (Opcional)
Variables globales que la app frontend puede consumir.

| Clave | Valor |
|-------|-------|
| BUSINESS_NAME | KlierBook |
| WHATSAPP_NUMBER | +5491123456789 |
| WHATSAPP_MESSAGE | Hola! Quería confirmar mi turno y recibir el comprobante. |

---

### Endpoints (Mocks Frontend)

En el frontend, crearemos un servicio (ej. `GoogleSheetsService.ts`) que apunte (con axios o fetch) a URLs que luego serán reemplazadas por los Webhooks HTTP `GET` de producción en n8n.

- `GET /api/servicios` -> Llama a n8n, n8n lee la pestaña 'Servicios' y retorna un JSON Array.
- `GET /api/equipo` -> Llama a n8n, n8n lee la pestaña 'Equipo' y retorna un JSON Array.
- `GET /api/blog` -> Llama a n8n, n8n lee la pestaña 'Blog' y retorna un JSON Array.
