# 🐛 CHECKLIST DE DEBUG - Google My Business Integration

## ✅ PASO 1: Verificar tu Cuenta de Google My Business

### 1.1 ¿Tienes un Perfil de Negocio en Google?
1. Ve a: https://business.google.com/
2. Inicia sesión con la cuenta que usaste para OAuth
3. **Pregunta crítica**: ¿Ves al menos UN negocio listado?
   - ❌ **Si no ves negocios**: Este es tu problema. Necesitas crear uno.
   - ✅ **Si ves negocios**: Continúa al siguiente paso.

### 1.2 ¿Tu negocio está VERIFICADO?
1. En https://business.google.com/, verifica el estado
2. **Estados posibles**:
   - ✅ **Verificado**: Perfecto, continúa
   - ⚠️ **Pendiente de verificación**: Este puede ser el problema
   - ❌ **No verificado**: Este es definitivamente el problema

**IMPORTANTE**: Algunos endpoints de la API solo funcionan con negocios verificados.

### 1.3 ¿Tu negocio está PUBLICADO?
1. Ve al perfil de tu negocio
2. Verifica que esté marcado como "Publicado"
3. ❌ **Si está en "Borrador"**: La API no lo encontrará

---

## ✅ PASO 2: Probar Manualmente las APIs de Google

### 2.1 Obtener un Access Token válido
Desde tu base de datos Supabase, copia el `access_token` actual de la tabla `google_oauth_tokens`.

```sql
SELECT access_token, token_expiry FROM google_oauth_tokens
WHERE user_id = 'tu-user-id'
ORDER BY updated_at DESC LIMIT 1;
```

**⚠️ IMPORTANTE**: Si `token_expiry` ya pasó, el token está expirado. Debes reconectar la cuenta.

### 2.2 Probar el Endpoint de Accounts
Abre Postman o tu terminal y ejecuta:

```bash
curl -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI" \
  https://mybusinessaccountmanagement.googleapis.com/v1/accounts
```

**Resultado esperado:**
```json
{
  "accounts": [
    {
      "name": "accounts/123456789",
      "accountName": "Mi Negocio",
      "type": "PERSONAL",
      "state": {
        "status": "UNVERIFIED" // o "VERIFIED"
      }
    }
  ]
}
```

**Posibles problemas:**
- ❌ `accounts: []` (vacío) → No tienes negocios o no están accesibles con ese token
- ❌ `401 Unauthorized` → Token expirado o inválido
- ❌ `403 Forbidden` → Falta el scope `business.manage`

### 2.3 Probar el Endpoint de Locations
Si el paso anterior funcionó, copia el `account.name` (ejemplo: `accounts/123456789`) y ejecuta:

```bash
curl -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI" \
  "https://mybusinessbusinessinformation.googleapis.com/v1/accounts/123456789/locations?readMask=name,title,storefrontAddress"
```

**Resultado esperado:**
```json
{
  "locations": [
    {
      "name": "locations/987654321",
      "title": "Mi Tienda Principal",
      "storefrontAddress": {
        "addressLines": ["Calle 123"],
        "locality": "Ciudad"
      }
    }
  ]
}
```

**Posibles problemas:**
- ❌ `locations: []` (vacío) → Tu cuenta no tiene ubicaciones publicadas
- ❌ `404 Not Found` → El account ID es incorrecto

### 2.4 Probar el Endpoint de Reviews
Si tienes ubicaciones, prueba obtener reseñas:

```bash
curl -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI" \
  "https://mybusiness.googleapis.com/v4/accounts/123456789/locations/987654321/reviews"
```

**Resultado esperado:**
```json
{
  "reviews": [
    {
      "reviewId": "abc123",
      "reviewer": {
        "displayName": "Juan Pérez"
      },
      "starRating": "FIVE",
      "comment": "Excelente servicio"
    }
  ]
}
```

**Posibles problemas:**
- ❌ `reviews: []` → No tienes reseñas aún
- ❌ `403 Forbidden` → Faltan permisos

---

## ✅ PASO 3: Verificar la Configuración OAuth

### 3.1 Scopes Autorizados
Los scopes actuales en tu tabla son:
```
https://www.googleapis.com/auth/business.manage
https://www.googleapis.com/auth/userinfo.email
openid
```

✅ **Esto está correcto.**

### 3.2 Verificar que el Usuario dio Permisos
Cuando hiciste OAuth, ¿Google te mostró una pantalla pidiendo:
- ✅ **"Administrar perfiles de negocio"**?
- ✅ **"Ver tus perfiles de negocio"**?

Si no viste estas pantallas, puede que el scope no se haya autorizado correctamente.

**Solución**: Reconecta la cuenta y presta atención a los permisos que solicita.

---

## ✅ PASO 4: Revisar Logs de Edge Functions

### 4.1 Ver logs de google-reviews-fetch
1. Ve a Supabase Dashboard → Edge Functions → google-reviews-fetch
2. Click en "Logs"
3. Busca el último request y revisa:
   - ¿Dice "No OAuth token found"?
   - ¿Dice "Accounts API error"?
   - ¿Qué respuesta devuelve el endpoint de Google?

### 4.2 Ver logs de google-locations-sync
Similar al anterior, revisa qué está devolviendo.

---

## ✅ PASO 5: Casos Comunes

### Caso 1: "accounts: []" (Sin cuentas)
**Causa**: La cuenta de Google usada no tiene ningún negocio en Google My Business.

**Solución**:
1. Ve a https://business.google.com/create
2. Crea un perfil de negocio
3. Completa la información básica
4. Reconecta tu cuenta OAuth

### Caso 2: "locations: []" (Sin ubicaciones)
**Causa**: Tienes una cuenta de GMB pero no has agregado ubicaciones.

**Solución**:
1. En https://business.google.com/, agrega una ubicación
2. Publica la ubicación
3. Vuelve a sincronizar en tu app

### Caso 3: Token expirado
**Causa**: El `access_token` ya expiró y el refresh falló.

**Solución**:
1. Revisa que `refresh_token` NO sea NULL en tu base de datos
2. Si es NULL, reconecta la cuenta (Google debe dar refresh_token en primer OAuth)
3. Asegúrate que las variables de entorno GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET sean correctas

### Caso 4: "User is not verified"
**Causa**: Tu perfil de negocio necesita verificación.

**Solución**:
1. Google debe enviarte un código por correo/teléfono/postal
2. Completa el proceso de verificación
3. Una vez verificado, vuelve a intentar

---

## 🎯 ACCIÓN INMEDIATA RECOMENDADA

Ejecuta estos comandos en orden y reporta los resultados:

### 1. Verificar que tienes token válido
```sql
SELECT
  access_token,
  refresh_token,
  token_expiry,
  scope,
  (token_expiry > NOW()) as is_valid
FROM google_oauth_tokens
WHERE user_id = 'tu-user-id';
```

### 2. Si el token es válido, probar accounts endpoint manualmente
```bash
curl -H "Authorization: Bearer TU_TOKEN" \
  https://mybusinessaccountmanagement.googleapis.com/v1/accounts
```

### 3. Revisar logs de Supabase Edge Functions
Ve a Dashboard → Edge Functions → google-reviews-fetch → Logs

---

## 🔧 NECESITAS CAMBIAR ALGO EN TU CUENTA DE GOOGLE?

**SÍ, si alguno de estos es verdad:**
- ❌ No tienes un perfil de Google My Business creado
- ❌ Tu perfil está sin verificar y las APIs requieren verificación
- ❌ No tienes ubicaciones publicadas en tu perfil
- ❌ El usuario de prueba no está agregado en Google Cloud Console (modo desarrollo)

**NO, si:**
- ✅ Ya tienes perfil de GMB verificado y publicado
- ✅ Ya tienes al menos una ubicación
- ✅ El problema es solo en el código (que ya lo identifiqué)

---

## 📊 RESULTADO ESPERADO

Después de seguir estos pasos, deberías saber **exactamente** en qué paso se rompe:

1. ✅ OAuth → ✅ Token guardado → ❌ **Aquí falla**: Sin accounts
2. ✅ OAuth → ✅ Token guardado → ✅ Accounts encontrados → ❌ **Aquí falla**: Sin locations
3. ✅ OAuth → ✅ Token guardado → ✅ Accounts → ✅ Locations → ❌ **Aquí falla**: Sin reviews

Una vez identifiques el paso exacto, sabrás si es problema de:
- **Tu cuenta de Google** (falta crear/verificar negocio)
- **El código** (ya lo identifiqué y puedo arreglarlo)
- **La configuración OAuth** (scopes o permisos)
