# María Bonobo Chat

Una aplicación de chat interactiva que simula conversaciones con "María Bonobo", una personalidad ficticia cálida y lúdica. La aplicación permite a los usuarios crear conversaciones, chatear con la IA, y gestionar sus revelaciones de manera intuitiva.

## 🚀 Características Principales

- **Autenticación de usuarios** con registro e inicio de sesión
- **Chat interactivo** con IA usando OpenAI API
- **Gestión de conversaciones** (crear, editar, eliminar)
- **Interfaz moderna** construida con React y Tailwind CSS
- **Sistema de notificaciones** con toasts
- **Diseño responsivo** para diferentes dispositivos

## 📋 Prerrequisitos

- **Node.js** versión 18.0.0 o superior
- **npm** versión 8.0.0 o superior
- **Cuenta de OpenAI** con API key válida
- **Git** para clonar el repositorio

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd maria-bonobo-chat
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar la aplicación

```bash
# Modo desarrollo
npm start


La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🏗️ Arquitectura de la Aplicación

### Estructura de Directorios

```
src/
├── app/                    # Contextos de React (estado global)
│   ├── AuthContext.jsx    # Manejo de autenticación
│   ├── RevelacionesContext.jsx  # Estado de conversaciones
│   └── ToastContext.jsx   # Sistema de notificaciones
├── components/            # Componentes reutilizables
├── pages/                # Páginas principales de la aplicación
├── services/             # Servicios de API
└── api.js               # Configuración de API
```

### Flujo de la Aplicación

#### 1. **Autenticación**
- Usuario accede a `/login`
- Puede registrarse o iniciar sesión
- Al autenticarse, se redirige a `/revelaciones`

#### 2. **Lista de Conversaciones**
- Página principal (`/revelaciones`)
- Muestra todas las conversaciones del usuario
- Botón para crear nueva conversación
- Acciones: editar título, eliminar, acceder al chat

#### 3. **Chat Individual**
- Ruta: `/revelaciones/:id/chat`
- Interfaz de chat con María Bonobo
- Historial de mensajes persistente
- Edición de título en tiempo real

#### 4. **Gestión de Estado**
- **AuthContext**: Maneja sesiones de usuario y tokens
- **RevelacionesContext**: Gestiona conversaciones y mensajes
- **ToastContext**: Sistema de notificaciones

## 🧩 Componentes Principales

### Contextos (Contexts)

#### `AuthContext`
- **Propósito**: Manejo centralizado de autenticación
- **Funcionalidades**:
  - Login/registro de usuarios
  - Gestión de tokens de sesión
  - Validación de tokens expirados
  - Logout automático

#### `RevelacionesContext`
- **Propósito**: Estado global de conversaciones
- **Funcionalidades**:
  - CRUD de revelaciones
  - Gestión de mensajes
  - Estados de carga y error
  - Sincronización con backend

#### `ToastContext`
- **Propósito**: Sistema de notificaciones
- **Funcionalidades**:
  - Mostrar mensajes de éxito/error
  - Auto-ocultar notificaciones
  - Cola de notificaciones

### Páginas

#### `LoginPage`
- Formulario dual (login/registro)
- Validación en tiempo real
- Manejo de errores de autenticación

#### `RevelacionesList`
- Lista de conversaciones del usuario
- Creación de nuevas conversaciones
- Acciones por conversación

#### `RevelacionChatPage`
- Interfaz principal de chat
- Envío de mensajes a OpenAI
- Persistencia de conversaciones

### Componentes

#### `ProtectedRoute`
- Wrapper para rutas protegidas
- Redirección automática a login si no hay sesión

#### `EditableTitle`
- Título editable en tiempo real
- Guardado automático al backend

#### `RevelacionItemActions`
- Menú de acciones por conversación
- Editar, eliminar, acceder al chat

## 🎨 Decisiones de Diseño

### 1. **Arquitectura de Estado**
- **Context API de React**: Para estado global compartido
- **Separación de responsabilidades**: Cada contexto maneja un dominio específico
- **Optimización de re-renders**: Uso de `useCallback` y `useMemo` donde es necesario

### 2. **Manejo de Autenticación**
- **Tokens de sesión simples**: Para MVP, no JWT complejos
- **Expiración automática**: Tokens expiran en 24 horas
- **Limpieza automática**: Verificación cada 5 minutos

### 3. **Gestión de Datos**
- **Estado local optimista**: UI se actualiza inmediatamente
- **Sincronización con backend**: Operaciones CRUD con manejo de errores
- **Estados de carga**: Indicadores visuales para operaciones asíncronas

### 4. **Interfaz de Usuario**
- **Tailwind CSS**: Sistema de diseño consistente y responsive
- **Componentes reutilizables**: Reducción de duplicación de código
- **Accesibilidad**: Roles ARIA y navegación por teclado

### 5. **Manejo de Errores**
- **Errores granulares**: Diferentes tipos de error por operación
- **Recuperación automática**: Reintentos y limpieza de estado
- **Feedback visual**: Toast notifications para errores y éxitos

### 6. **Performance**
- **Lazy loading**: Carga de datos solo cuando es necesario
- **Memoización**: Evita cálculos innecesarios
- **Optimización de re-renders**: Componentes optimizados

## 🔧 Configuración Avanzada

### Variables de Entorno

```env
# Configuración de OpenAI
REACT_APP_OPENAI_API_KEY=sk-...
REACT_APP_OPENAI_MODEL=gpt-5-mini

# Configuración de la API
REACT_APP_CHAT_API_URL=https://tu-dominio.vercel.app/api/chat

# Configuración de la aplicación
PASSWORD_MIN_LENGTH=4
REACT_APP_MAX_MESSAGE_LENGTH=4000
```

### Personalización de Estilos

La aplicación usa Tailwind CSS. Para personalizar:

1. Editar `tailwind.config.js`
2. Modificar `src/index.css` para estilos globales
3. Usar clases de Tailwind en los componentes

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm test -- --watch

# Tests con coverage
npm test -- --coverage
```

## 📦 Scripts Disponibles

- `npm start`: Ejecuta la aplicación en modo desarrollo
- `npm build`: Construye la aplicación para producción
- `npm test`: Ejecuta los tests
- `npm eject`: Expone la configuración de webpack (irreversible)

## 🚀 Despliegue

### Build de Producción

```bash
npm run build
```

El directorio `build/` contendrá la aplicación optimizada para producción.

### Despliegue en Vercel

1. Conectar tu repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente en cada push

### Despliegue Manual

Subir el contenido del directorio `build/` a tu servidor web.

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:

- Crear un issue en el repositorio
- Revisar la documentación de la API
- Verificar la configuración de variables de entorno

---

**Nota**: Esta aplicación es un MVP (Minimum Viable Product) diseñado para demostrar capacidades de chat con IA. Para uso en producción, se recomienda implementar medidas de seguridad adicionales y optimizaciones de performance.
