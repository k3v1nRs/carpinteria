# 🎓 RESUMEN RÁPIDO - Despliegue con Suscripción de Estudiante

## ✅ Configuración 100% GRATIS

### Lo que usaremos:
1. **Base de datos**: Neon.tech (la que ya tienes) - $0
2. **Backend API**: Azure App Service Plan F1 (Gratis) - $0  
3. **Frontend**: Azure Static Web Apps (Gratis) - $0

**Costo total: $0 USD/mes** (conservas tus $100 de créditos) 🎉

---

## 🚀 Pasos Rápidos

### 1. Base de Datos ✅
Ya está lista en Neon.tech. Solo necesitas la cadena de conexión de tu archivo `.env`

### 2. Crear App Service para Backend (5 min)
1. Azure Portal → App Services → Crear
2. Configuración:
   - Grupo: `carpinteria-rg` (nuevo)
   - Nombre: `carpinteria-api`
   - Runtime: Node 18 LTS
   - OS: Windows
   - Región: East US
   - **Plan: F1 (Gratis)** ⭐
3. En "Configuración" → "Variables de entorno":
   - Agregar: `PG_CONNECTION_STRING` = (tu cadena de Neon)
   - Agregar: `NODE_ENV` = `production`
4. En "Centro de implementación":
   - Origen: GitHub
   - Repo: k3v1nRs/carpinteria
   - Rama: main
   - Carpeta: `/api`

### 3. Crear Static Web App para Frontend (5 min)
1. Azure Portal → Static Web Apps → Crear
2. Configuración:
   - Grupo: `carpinteria-rg`
   - Nombre: `carpinteria-frontend`
   - **Plan: Free** ⭐
   - Región: East US 2
   - GitHub: k3v1nRs/carpinteria
   - Rama: main
   - Carpeta app: `/dist`

### 4. Actualizar URL de API
1. Espera a que la API esté desplegada
2. Copia su URL: `https://carpinteria-api.azurewebsites.net`
3. Edita `dist/app.js` línea 18:
   ```javascript
   const apiUrl = 'https://carpinteria-api.azurewebsites.net/api/cotizaciones';
   ```
4. Commit y push:
   ```powershell
   git add .
   git commit -m "Actualizar URL de API"
   git push
   ```

### 5. Configurar CORS
1. En App Service → API → CORS
2. Agregar la URL de tu Static Web App
3. Guardar

---

## ⚠️ Notas Importantes

### Plan F1 (Gratis):
- ✅ Suficiente para tu proyecto
- ⏱️ Se suspende tras 20 min sin uso (tarda ~10 seg en despertar)
- 📊 60 min CPU/día (más que suficiente)

### Primera carga:
- Puede tardar 10-15 segundos si la app estaba dormida
- Las siguientes cargas son instantáneas

---

## 🎯 URLs Finales

- **Tu sitio web**: `https://[nombre].azurestaticapps.net`
- **Tu API**: `https://carpinteria-api.azurewebsites.net`
- **Base de datos**: Neon.tech (tu conexión actual)

---

## 📝 Checklist

- [ ] Crear grupo de recursos `carpinteria-rg`
- [ ] Crear App Service con plan F1
- [ ] Configurar variables de entorno
- [ ] Conectar con GitHub (backend)
- [ ] Crear Static Web App
- [ ] Actualizar URL de API en `app.js`
- [ ] Configurar CORS
- [ ] Probar el sitio

---

**Tiempo total estimado: 15-20 minutos**

Para más detalles, consulta `GUIA-DESPLIEGUE-AZURE.md`
