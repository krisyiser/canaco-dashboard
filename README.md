# CANACO Dashboard Empresarial

Dashboard corporativo moderno, modular y escalable para la gestión de socios (CANACO y SIEM) y de finanzas, utilizando Google Sheets como base de datos serverless MVP.

## Stack Tecnológico
- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS v4 + shadcn/ui
- **Tablas**: @tanstack/react-table
- **Formularios**: react-hook-form + zod
- **Gráficos**: Recharts
- **Datos**: Google Sheets API (googleapis, google-auth-library)

## Características del Negocio
1. Padrón CANACO completo, con alta de socios.
2. Padrón SIEM completo, con alta de socios (con formato homologado).
3. Sistema Financiero: ingresos, egresos, gastos.
4. "Conceptos" libres y sin categorías estrictas forzadas por el front.

---

## 🚀 PASO A PASO: Configuración de Google Sheets (Service Account)

Para que el proyecto se pueda comunicar de forma segura con los Google Sheets, debemos usar una Service Account:

### 1) Crear Google Cloud project
1. Ve a la [Consola de Google Cloud](https://console.cloud.google.com/).
2. Crea un nuevo proyecto (ej. "canaco-dashboard").

### 2) Crear service account
1. Ve a "IAM y administración" > "Cuentas de servicio".
2. Haz clic en "Crear cuenta de servicio". Asigna un nombre (ej. `sheets-writer`).
3. (Opcional) Asigna rol "Editor", aunque no es estrictamente necesario para sheets si se le comparte directo.
4. Genera una nueva clave: Clic en la cuenta creada > pestaña "Claves" > "Agregar clave" > "Crear clave nueva" (Formato JSON).
5. Descarga el JSON. Ábrelo y ubica `client_email` y `private_key`.

### 3) Activar Google Sheets API
1. En la consola de Google, ve a "API y servicios" > "Biblioteca".
2. Busca "Google Sheets API".
3. Haz clic en "Habilitar".

### 4) Copiar credenciales a `.env.local`
1. En la raíz del proyecto, copia o renombra el archivo `.env.local.example` a `.env.local` (o crea uno nuevo).
2. Agrega las variables utilizando los valores del JSON descargado:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL="tu-cuenta@tu-proyecto.iam.gserviceaccount.com"
# MUY IMPORTANTE: Pega toda la clave privada, incluyendo el texto de BEGIN y END, y los saltos de línea \n
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIB...resto_de_la_llave...\n-----END PRIVATE KEY-----\n"

# IDs extraídos de las URLs de tus archivos de Google Sheets (ej. https://docs.google.com/spreadsheets/d/AQUI_ESTA_EL_ID/edit)
CANACO_SHEET_ID="ID_DEL_SHEET_CANACO"
SIEM_SHEET_ID="ID_DEL_SHEET_SIEM"
FINANZAS_SHEET_ID="ID_DEL_SHEET_FINANZAS"
```

> **Nota:** Opcionalmente puedes usar la variable `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` con todo el JSON codificado en base64 en lugar de email y private_key (útil para Vercel).

### 5) Compartir spreadsheets con service account
1. Abre cada uno de los 3 archivos de Google Sheets.
2. Haz clic en "Compartir" (Share) arriba a la derecha.
3. Ingresa el `client_email` de tu cuenta de servicio y dale permisos de **Editor**.
4. Haz clic en Enviar. 
*Importante:* Sin esto, la API dará error 403 (Permisos insuficientes).

### 6) Correr el proyecto
Abre una terminal en la raíz del proyecto e instala dependencias, luego inicia en modo dev:

```bash
npm install
npm run dev
```

### 7) Probar lectura y escritura
1. Ve a [http://localhost:3000/configuracion](http://localhost:3000/configuracion).
2. Haz clic en "Test Connection" para verificar que las credenciales están activas.
3. Intenta agregar un registro desde `/socios/canaco/nuevo` y corrobóralo en tu Google Sheet en tiempo real.

---
## Consideraciones Finales

- **Orden de Columnas**: No alteres el orden de columnas en los Sheets a menos que actualices el mapeo en `/src/services/dataService.ts`.
- **Performance**: Todos los componentes pesados (tablas) se manejan en cliente para facilitar exportación y búsqueda asíncrona pero las lecturas principales se hacen desde el servidor en `/app/actions` (Next.js Server Actions) asegurando que no se expongan credenciales en red en el lado cliente.
- **Rutas de APIs**: Se utiliza el enfoque de Data Service Functions expuestos nativamente para Server Components.
- **Calidad de Código**: El proyecto ha sido refactorizado para cumplir estrictamente con los estándares de TypeScript y React. Se implementaron mejoras arquitectónicas para extraer componentes declarados durante el render, garantizar seguridad de tipos (cero castings con `any`) y se resolvió de forma total las advertencias del React Compiler en torno a hooks de terceros (Tanstack Table). El código pasa exitosamente el linteado sin errores.
