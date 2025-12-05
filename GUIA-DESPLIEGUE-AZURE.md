# 🚀 Guía de Despliegue en Azure - Carpintería El Roble

Esta guía te ayudará a publicar tu sitio web completo en Azure con base de datos PostgreSQL usando tu **suscripción de Azure para estudiantes** ($100 USD en créditos).

## 📋 Requisitos Previos

1. **Cuenta de Azure para Estudiantes** activada (https://azure.microsoft.com/es-es/free/students/)
   - $100 USD en créditos de Azure
   - Sin necesidad de tarjeta de crédito
   - Renovable anualmente mientras seas estudiante
2. **Azure CLI instalado** (https://learn.microsoft.com/es-es/cli/azure/install-azure-cli)
3. **Git instalado** en tu computadora

## 💡 Estrategia de Ahorro con Suscripción Estudiantil

Para maximizar tus créditos de $100 USD, usaremos:
- **Base de datos**: Neon.tech (Gratis, fuera de Azure) o Azure PostgreSQL Free Tier
- **Backend API**: Azure App Service (F1 Gratis)
- **Frontend**: Azure Static Web Apps (Gratis)
- **Costo mensual**: $0 USD 🎉

---

## 🗄️ PASO 1: Configurar Base de Datos PostgreSQL

### ⭐ Opción Recomendada: Usar Neon.tech (100% GRATIS)

**Ya tienes tu base de datos en Neon**, así que solo necesitas:

1. **Verificar tu cadena de conexión actual** en `api/.env`:
   ```
   PG_CONNECTION_STRING=postgresql://...neon.tech/...
   ```

2. **No hacer nada más** - Mantendremos Neon porque:
   - ✅ **Gratis permanentemente** (hasta 0.5 GB)
   - ✅ **Sin consumir tus créditos de Azure**
   - ✅ **Ya está funcionando**
   - ✅ **Serverless y automático**

3. **Guarda esta cadena de conexión** - la necesitarás en el Paso 2.3

### Opción Alternativa: Azure Database for PostgreSQL (Consume créditos)

⚠️ **SOLO si quieres todo en Azure** (consumirá ~$12-15/mes de tus $100 créditos):

1. **Inicia sesión en Azure Portal**: https://portal.azure.com

2. **Crea un servidor PostgreSQL**:
   - Busca "Azure Database for PostgreSQL flexible servers"
   - Click en "Crear"
   - Configuración:
     - **Grupo de recursos**: Crea uno nuevo llamado `carpinteria-rg`
     - **Nombre del servidor**: `carpinteria-db-server` (debe ser único)
     - **Región**: East US (más económico)
     - **Versión de PostgreSQL**: 14 o superior
     - **Carga de trabajo**: Development
     - **Cómputo y almacenamiento**: 
       - Click en "Configurar servidor"
       - Elige **"Burstable, B1ms"** (el más económico)
       - 32 GB de almacenamiento
     - **Usuario administrador**: `adminuser`
     - **Contraseña**: Crea una contraseña segura y **guárdala**

3. **Configurar Red**:
   - En "Redes", selecciona "Acceso público"
   - Marca "Permitir acceso público desde cualquier servicio de Azure"
   - Click en "Agregar dirección IP del cliente actual"

4. **Revisar y Crear** → Espera 5-10 minutos

5. **Obtener cadena de conexión**:
   - Ve al recurso → "Cadenas de conexión"
   - Copia la cadena **Node.js**:
   ```
   postgres://adminuser@carpinteria-db-server:TU_CONTRASEÑA@carpinteria-db-server.postgres.database.azure.com:5432/postgres?ssl=true
   ```

**💰 Mi recomendación**: Usa Neon.tech y ahorra tus créditos para otros proyectos

---

## 🔧 PASO 2: Desplegar el Backend (API) en Azure App Service

### 2.1 Crear App Service para la API

1. **En Azure Portal**, busca "App Services" → Click en "Crear"

2. **Configuración**:
   - **Grupo de recursos**: Crea uno nuevo `carpinteria-rg` (si no lo creaste antes)
   - **Nombre**: `carpinteria-api` (debe ser único globalmente)
   - **Publicar**: Código
   - **Pila del entorno de ejecución**: Node 18 LTS
   - **Sistema operativo**: Windows
   - **Región**: East US (económica y rápida)
   - **Plan de App Service**: 
     - Crea uno nuevo llamado `carpinteria-plan`
     - **🎓 IMPORTANTE PARA ESTUDIANTES**: Selecciona **"F1 (Gratis)"**
     - ⚠️ El plan F1 tiene limitaciones: 60 min/día de CPU, 1 GB RAM, pero es suficiente para tu proyecto

3. **Click en "Revisar y crear"** → Espera el despliegue

> 💡 **Nota**: El plan F1 pone tu app en "suspensión" si no recibe tráfico. La primera carga puede tardar 10-15 segundos.

### 2.2 Configurar Variables de Entorno

1. **Ve a tu App Service** `carpinteria-api`

2. **En el menú izquierdo**: Configuración → **Variables de entorno**

3. **Agrega las siguientes variables** (click en "+ Agregar"):
   - **Nombre**: `PG_CONNECTION_STRING`
   - **Valor**: Tu cadena de conexión de PostgreSQL (la que copiaste en el Paso 1)
   - **Nombre**: `NODE_ENV`
   - **Valor**: `production`

4. **Guardar** los cambios

### 2.3 Desplegar el código desde GitHub

1. **En tu terminal local** (PowerShell), navega a tu proyecto:
   ```powershell
   cd c:\Users\Usuario\Desktop\carpinteria-web
   ```

2. **Asegúrate de que Git esté inicializado**:
   ```powershell
   git status
   ```

3. **Commit de los cambios recientes**:
   ```powershell
   git add .
   git commit -m "Configuración para despliegue en Azure"
   git push origin main
   ```

4. **En Azure Portal**, ve a tu App Service `carpinteria-api`

5. **En el menú izquierdo**: Implementación → **Centro de implementación**

6. **Configurar GitHub**:
   - **Origen**: GitHub
   - Click en "Autorizar" y conecta tu cuenta de GitHub
   - **Organización**: k3v1nRs
   - **Repositorio**: carpinteria
   - **Rama**: main
   - **Carpeta de compilación**: `/api`

7. **Guardar** → Azure configurará automáticamente GitHub Actions

8. **Espera a que se complete el despliegue** (puedes ver el progreso en la pestaña "Actions" de tu repositorio en GitHub)

9. **Prueba tu API**:
   - URL: `https://carpinteria-api.azurewebsites.net/api/cotizaciones`
   - Deberías poder hacer POST a esta URL

---

## 🌐 PASO 3: Desplegar el Frontend en Azure Static Web Apps

### 3.1 Crear Static Web App

1. **En Azure Portal**, busca "Static Web Apps" → Click en "Crear"

2. **Configuración**:
   - **Grupo de recursos**: `carpinteria-rg`
   - **Nombre**: `carpinteria-frontend`
   - **Plan de hospedaje**: **Free** (🎓 Gratis permanentemente)
   - **Región**: East US 2 (disponible para plan gratuito)
   - **Detalles de implementación**:
     - **Origen**: GitHub
     - Autoriza y selecciona:
       - **Organización**: k3v1nRs
       - **Repositorio**: carpinteria
       - **Rama**: main
   - **Detalles de compilación**:
     - **Valores preestablecidos de compilación**: Custom
     - **Ubicación de la aplicación**: `/dist`
     - **Ubicación de la API**: Dejar vacío
     - **Ubicación del artefacto de salida**: Dejar vacío

3. **Revisar y crear** → Espera el despliegue

> 💡 **Ventaja del plan Free**: Incluye SSL gratis, 100 GB de ancho de banda/mes, y dominios personalizados

4. **Azure creará un workflow de GitHub Actions** automáticamente

### 3.2 Actualizar la URL de la API en el Frontend

1. **Espera a que tu API esté desplegada** y obtén su URL: 
   `https://carpinteria-api.azurewebsites.net`

2. **Actualiza el archivo `app.js`**:
   - La URL ya está configurada como: `https://carpinteria-web-final.azurewebsites.net/api/cotizaciones`
   - **Necesitas cambiarla** a tu nueva URL:

3. **Edita `dist/app.js`**:
   ```javascript
   const apiUrl = 'https://carpinteria-api.azurewebsites.net/api/cotizaciones';
   ```

4. **Commit y push**:
   ```powershell
   git add .
   git commit -m "Actualizar URL de API para producción"
   git push origin main
   ```

5. **GitHub Actions redesplegar** automáticamente tu sitio

### 3.3 Obtener la URL de tu sitio

1. **Ve a tu Static Web App** en Azure Portal
2. En la parte superior verás la **URL**: algo como `https://kind-sand-0a1b2c3d4.azurestaticapps.net`
3. **¡Visita esa URL!** Tu sitio ya está en línea 🎉

---

## 🔒 PASO 4: Configurar CORS en la API (Importante)

Para que tu frontend pueda comunicarse con tu backend:

1. **Ve a tu App Service** `carpinteria-api`

2. **En el menú izquierdo**: API → **CORS**

3. **Agrega los orígenes permitidos**:
   - La URL de tu Static Web App (ej: `https://kind-sand-0a1b2c3d4.azurestaticapps.net`)
   - Para desarrollo local: `http://localhost:3000`

4. **Guardar**

---

## 📊 PASO 5: Verificar que todo funciona

### 5.1 Probar la Base de Datos

Conéctate desde tu PC para verificar:

```powershell
# Instala el cliente de PostgreSQL si no lo tienes
# O usa una herramienta como pgAdmin, DBeaver, o Azure Data Studio

# Verifica que la tabla existe
# Desde Azure Portal → Tu servidor PostgreSQL → Query editor
# Ejecuta:
SELECT * FROM cotizaciones;
```

### 5.2 Probar el Backend

```powershell
# Prueba con PowerShell
$body = @{
    nombre = "Prueba Azure"
    email = "test@azure.com"
    telefono = "1234567890"
    descripcion = "Prueba de despliegue"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://carpinteria-api.azurewebsites.net/api/cotizaciones" -Method Post -Body $body -ContentType "application/json"
```

### 5.3 Probar el Frontend

1. Visita tu sitio: `https://TU-STATIC-WEB-APP.azurestaticapps.net`
2. Llena el formulario de cotización
3. Envía la solicitud
4. Verifica en la base de datos que se guardó

---

## 🛠️ Solución de Problemas Comunes

### Error: "Cannot connect to database"
- Verifica que agregaste la variable `PG_CONNECTION_STRING` en App Service
- Confirma que la cadena de conexión tiene el formato correcto
- Revisa que las reglas de firewall de PostgreSQL permitan Azure

### Error: "CORS policy blocked"
- Asegúrate de haber configurado CORS en el App Service
- Agrega la URL exacta de tu Static Web App

### Error: "Application Error" en App Service
- Ve a "Diagnóstico y solución de problemas" en App Service
- Revisa los "Registros de aplicaciones" para ver el error específico
- Verifica que `package.json` tenga el script `start` correcto

### El sitio se despliega pero el formulario no funciona
- Abre las "Herramientas de desarrollador" en el navegador (F12)
- Ve a la consola y busca errores
- Verifica que la URL de la API en `app.js` sea correcta

---

## 💰 Costos con Suscripción de Estudiante

### ✅ Configuración Recomendada (100% GRATIS):
- **Base de datos**: Neon.tech → **$0**
- **Backend API**: Azure App Service (F1 Free) → **$0**
- **Frontend**: Azure Static Web Apps (Free) → **$0**
- **SSL/HTTPS**: Incluido → **$0**

**TOTAL: $0 USD/mes** 🎉

### Opción Alternativa (Si quieres todo en Azure):
- **Azure Database for PostgreSQL (B1ms)**: ~$12-15 USD/mes
- **App Service (F1 Free)**: $0
- **Static Web Apps (Free)**: $0

**Total**: ~$12-15 USD/mes de tus $100 créditos (durarían ~6-8 meses)

### 📊 Límites del Plan F1 (Gratis):
- 1 GB de RAM
- 1 GB de almacenamiento
- 60 minutos de CPU por día
- 165 MB de ancho de banda por día
- La app se suspende tras 20 min sin uso (reinicia en ~10 seg)

**Para este proyecto**: Los límites son más que suficientes ✅

---

## 🎯 URLs Finales

Después del despliegue, tendrás:

- **Frontend**: `https://[tu-app].azurestaticapps.net`
- **Backend API**: `https://carpinteria-api.azurewebsites.net`
- **Base de datos**: Hospedada en Azure o Neon

---

## 📚 Recursos Adicionales

- [Documentación de Azure App Service](https://learn.microsoft.com/es-es/azure/app-service/)
- [Documentación de Static Web Apps](https://learn.microsoft.com/es-es/azure/static-web-apps/)
- [Azure Database for PostgreSQL](https://learn.microsoft.com/es-es/azure/postgresql/)

---

## 🔄 Actualizaciones Futuras

Para actualizar tu sitio después del despliegue inicial:

1. Haz cambios en tu código local
2. Commit y push a GitHub:
   ```powershell
   git add .
   git commit -m "Descripción de cambios"
   git push origin main
   ```
3. GitHub Actions desplegará automáticamente los cambios

---

¡Éxito con tu despliegue! 🎉

Si tienes problemas, revisa la sección de solución de problemas o los logs en Azure Portal.
