# Configuración de Chat API

## Pasos para usar la API de chat:

### 1. **Configurar Variables de Entorno**
Crea un archivo `.env` en la raíz del proyecto:

```bash
# API de Chat
REACT_APP_CHAT_API_URL=http://localhost:3001/api/chat

# API de Revelaciones (si tienes una)
REACT_APP_API_URL=http://localhost:3001/api
```

### 2. **Ejecutar tu API de Chat**
Tu `chatApi.js` necesita estar corriendo. Puedes:

**Opción A: Next.js API Routes**
- Mover `chatApi.js` a `pages/api/chat.js` en un proyecto Next.js
- Ejecutar `npm run dev` en el proyecto Next.js

**Opción B: Servidor Express**
- Convertir tu API a un servidor Express
- Ejecutar en puerto 3001

**Opción C: Vercel/Netlify**
- Deployar tu API en Vercel o Netlify
- Usar la URL del deploy en `REACT_APP_CHAT_API_URL`

### 3. **Configurar CORS**
Tu API debe permitir requests desde tu frontend. En tu `chatApi.js`:

```javascript
// Asegúrate de que tu dominio esté en ALLOWED_ORIGINS
const allowlist = (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
```

### 4. **Variables de Entorno Requeridas**
En tu servidor de chat:

```bash
OPENAI_API_KEY=tu_api_key_de_openai
OPENAI_MODEL=gpt-4o-mini  # o el modelo que prefieras
ALLOWED_ORIGINS=http://localhost:3000,https://tu-dominio.com
```

## Funcionalidades Implementadas:

✅ **Integración con OpenAI** a través de tu API  
✅ **Indicador de "escribiendo..."** mientras procesa  
✅ **Guardado automático** de todos los mensajes  
✅ **Manejo de errores** con mensajes amigables  
✅ **Persistencia** de conversaciones completas  

## Uso:

1. **Crear nueva conversación** → Título "Sin título"
2. **Escribir mensaje** → Se guarda inmediatamente
3. **María Bonobo responde** → Respuesta real de OpenAI
4. **Todo se guarda** → Persistencia completa

## Personalización:

Puedes modificar la personalidad de María Bonobo en tu `chatApi.js`:

```javascript
const systemText = [
  "Eres María Bonobo, una 'virgen bonoba' ficticia, cálida y lúdica.",
  "Responde en español chileno, breve (≤120 palabras), 1 emoji como máximo.",
  "Evita política actual y contenido sexual explícito. Sé amable y creativa."
].join(" ");
```
