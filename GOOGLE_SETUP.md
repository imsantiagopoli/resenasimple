# Configuración de Google Cloud Platform para Google My Business

Esta guía te ayudará a configurar correctamente tu proyecto de Google Cloud Platform para integrar Google My Business con tu aplicación.

## Paso 1: Crear o Seleccionar un Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Toma nota del ID del proyecto

## Paso 2: Habilitar las APIs Necesarias

Ve a la [Biblioteca de APIs](https://console.cloud.google.com/apis/library) y habilita las siguientes APIs:

### APIs Obligatorias:
- **My Business Business Information API**
- **My Business Account Management API**

### APIs Opcionales (ya habilitadas según tu configuración):
- Business Profile Performance API
- My Business Verifications API
- My Business Q&A API
- My Business Lodging API
- My Business Place Actions API
- My Business Notifications API

## Paso 3: Configurar la Pantalla de Consentimiento OAuth

1. Ve a [Pantalla de consentimiento de OAuth](https://console.cloud.google.com/apis/credentials/consent)
2. Selecciona **Externo** como tipo de usuario
3. Completa la información requerida:
   - **Nombre de la aplicación**: [Nombre de tu aplicación]
   - **Correo de soporte**: [Tu correo electrónico]
   - **Logo de la aplicación**: (Opcional)
   - **Dominios autorizados**: Agrega tu dominio de producción
   - **Correos de contacto del desarrollador**: [Tu correo electrónico]

4. En la sección de **Scopes**, agrega los siguientes permisos:
   - `https://www.googleapis.com/auth/business.manage`
   - `https://www.googleapis.com/auth/userinfo.email`

5. Guarda y continúa

## Paso 4: Crear Credenciales OAuth 2.0

1. Ve a [Credenciales](https://console.cloud.google.com/apis/credentials)
2. Haz clic en **Crear credenciales** → **ID de cliente de OAuth 2.0**
3. Selecciona **Aplicación web** como tipo de aplicación
4. Configura lo siguiente:

### Nombre:
```
Google My Business Integration
```

### Orígenes autorizados de JavaScript:
```
http://localhost:5173
https://tu-dominio.com
```

### URIs de redireccionamiento autorizados:
```
http://localhost:5173/app/mi-negocio
https://tu-dominio.com/app/mi-negocio
```

5. Haz clic en **Crear**
6. **IMPORTANTE**: Guarda el **Client ID** y **Client Secret** que se generan

## Paso 5: Configurar Variables de Entorno en Supabase

Ve a tu proyecto de Supabase y configura las siguientes variables de entorno para tus Edge Functions:

1. Ve a **Settings** → **Edge Functions**
2. Agrega las siguientes variables:

```bash
GOOGLE_CLIENT_ID=tu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret-aqui
GOOGLE_REDIRECT_URI=https://tu-dominio.com/app/mi-negocio
```

Para desarrollo local, también configura:
```bash
GOOGLE_REDIRECT_URI=http://localhost:5173/app/mi-negocio
```

## Paso 6: Límites de Tasa (Rate Limits)

Según tu configuración, tienes los siguientes límites:

- **Solicitudes por minuto**: 300 QPM para cada API
- **Ediciones por minuto por perfil**: 10 ediciones máximo (no se puede aumentar)

Asegúrate de que tu aplicación respete estos límites implementando:
- Rate limiting en tus Edge Functions
- Caché de datos cuando sea posible
- Manejo de errores 429 (Too Many Requests)

## Paso 7: Verificación de la Aplicación (Producción)

Si planeas usar la aplicación en producción con usuarios reales:

1. Ve a [Verificación de OAuth](https://console.cloud.google.com/apis/credentials/consent)
2. Haz clic en **Iniciar verificación**
3. Completa el proceso de verificación de Google
4. Proporciona:
   - Política de privacidad
   - Términos de servicio
   - Video demo de la aplicación
   - Justificación de los scopes solicitados

**Nota**: Mientras esté en modo de prueba, puedes agregar hasta 100 usuarios de prueba sin verificación.

## Paso 8: Agregar Usuarios de Prueba (Modo de Desarrollo)

1. Ve a [Pantalla de consentimiento de OAuth](https://console.cloud.google.com/apis/credentials/consent)
2. En la sección **Usuarios de prueba**, haz clic en **Agregar usuarios**
3. Agrega las direcciones de correo de las cuentas de Google que usarás para probar
4. Solo estos usuarios podrán autorizar la aplicación mientras esté en modo de prueba

## Arquitectura de la Integración

### Flujo de OAuth 2.0:
1. Usuario hace clic en "Conectar Cuenta" en Mi Negocio
2. Edge Function `google-oauth-init` genera URL de autorización
3. Usuario autoriza en Google (ventana popup)
4. Google redirige con código de autorización
5. Edge Function `google-oauth-callback` intercambia código por tokens
6. Tokens se guardan encriptados en Supabase

### Sincronización de Datos:
1. Edge Function `google-locations-sync` obtiene ubicaciones de GMB
2. Ubicaciones se guardan en tabla `google_locations`
3. Edge Function `google-reviews-sync` obtiene reseñas
4. Reseñas se guardan en tabla `google_reviews`

### Respuesta a Reseñas:
1. Usuario escribe respuesta en la interfaz
2. Edge Function `google-review-reply` envía respuesta a Google
3. Respuesta se actualiza en base de datos local

## Estructura de Base de Datos

Las siguientes tablas ya están creadas:

- `google_oauth_tokens`: Almacena tokens de acceso y refresh
- `google_locations`: Ubicaciones de Google My Business
- `google_reviews`: Reseñas sincronizadas de Google
- `google_sync_log`: Registro de sincronizaciones

## Funciones Implementadas

### Edge Functions:
1. `google-oauth-init`: Inicia el flujo OAuth
2. `google-oauth-callback`: Procesa callback de OAuth
3. `google-locations-sync`: Sincroniza ubicaciones
4. `google-reviews-sync`: Sincroniza reseñas
5. `google-review-reply`: Responde a reseñas

### Páginas Frontend:
1. **Mi Negocio** (`/app/mi-negocio`): Conexión y gestión de GMB
2. **Reseñas** (`/app/resenas`): Vista y respuesta de reseñas de Google
3. **Respuestas** (`/app/respuestas`): Respuestas internas del sistema de votación

## Seguridad

- Todos los tokens se almacenan encriptados en Supabase
- Row Level Security (RLS) habilitado en todas las tablas
- Tokens se refrescan automáticamente antes de expirar
- Solo el propietario del negocio puede ver sus tokens y datos

## Pruebas

Para probar la integración:

1. Asegúrate de tener una cuenta de Google My Business con al menos una ubicación
2. Ve a `/app/mi-negocio` en tu aplicación
3. Haz clic en "Conectar Cuenta"
4. Autoriza la aplicación en Google
5. Espera a que se sincronicen las ubicaciones
6. Ve a `/app/resenas` para ver y responder reseñas

## Solución de Problemas

### Error: "Google OAuth is not configured"
- Verifica que las variables de entorno estén configuradas en Supabase
- Asegúrate de que los Edge Functions se hayan desplegado correctamente

### Error: "Failed to fetch Google accounts"
- Verifica que las APIs estén habilitadas en Google Cloud
- Confirma que los tokens no hayan expirado
- Revisa los logs de los Edge Functions

### Error: "redirect_uri_mismatch"
- Asegúrate de que la URI de redirección esté configurada exactamente igual en Google Cloud y en tu variable de entorno
- Verifica que incluyas el protocolo (http/https)

## Recursos Adicionales

- [Documentación de Google My Business API](https://developers.google.com/my-business/content/overview)
- [Guía de OAuth 2.0 de Google](https://developers.google.com/identity/protocols/oauth2)
- [Políticas de uso de Google APIs](https://developers.google.com/terms)
