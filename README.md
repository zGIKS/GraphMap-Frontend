# GraphMap Frontend 🗺️

Frontend moderno en React con Tailwind CSS para visualizar grafos de ciudades con sus conexiones. Implementado con arquitectura DDD (Domain-Driven Design) y patrones de diseño para optimización.

## 🚀 Características

- ✨ **Visualización interactiva** de grafos con Leaflet
- 🎨 **UI moderna** con Tailwind CSS y tema oscuro
- ⚡ **Optimizado para grandes datasets** (1000+ ciudades, 3000+ aristas)
- 🏗️ **Arquitectura DDD** con separación de capas
- 🔄 **Caché inteligente** con patrón Repository
- 📊 **Filtrado dinámico** por distancia y zoom
- 🎯 **Navegación intuitiva** con mouse/trackpad

## 📁 Estructura del Proyecto (DDD)

```
src/
├── domain/                    # Capa de Dominio
│   ├── models/               # Entidades del negocio
│   │   ├── City.js
│   │   └── Edge.js
│   └── repositories/         # Interfaces
│       └── IGraphRepository.js
│
├── application/              # Capa de Aplicación
│   ├── hooks/               # Custom hooks
│   │   └── useGraphData.js
│   └── services/            # Lógica de negocio
│       └── MapService.js
│
├── infrastructure/          # Capa de Infraestructura
│   ├── api/                # Implementaciones de API
│   │   ├── httpClient.js
│   │   └── GraphRepository.js
│   └── config/             # Configuración
│       └── api.config.js
│
└── presentation/           # Capa de Presentación
    ├── components/         # Componentes React
    │   ├── GraphMap.jsx
    │   ├── MapControls.jsx
    │   ├── LoadingScreen.jsx
    │   └── ErrorBoundary.jsx
    └── pages/             # Páginas
        └── MapPage.jsx
```

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Leaflet** - Mapas interactivos
- **Axios** - Cliente HTTP

## 📋 Requisitos

- Node.js >= 18
- Backend corriendo en `http://127.0.0.1:8000`

## 🚀 Instalación y Uso

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir en navegador
# http://localhost:5173
```

## 🔌 Endpoints Consumidos

El frontend consume estos endpoints del backend:

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/cities/` | GET | Lista de todas las ciudades |
| `/graph/edges` | GET | Todas las aristas del grafo |
| `/graph/summary` | GET | Estadísticas del grafo |

### Ejemplo de respuestas:

**GET /cities/**
```json
{
  "cities": [
    {
      "id": 1,
      "city": "Tokyo",
      "lat": 35.6762,
      "lng": 139.6503,
      "country": "Japan",
      "population": 37400068
    }
  ],
  "total": 1000
}
```

**GET /graph/edges**
```json
{
  "edges": [
    {
      "source": 1,
      "target": 2,
      "distance": 3803.5
    }
  ],
  "total_edges": 3000
}
```

## ⚡ Optimizaciones Implementadas

### 1. **Patrón Repository con Caché**
```javascript
// Caché de 5 minutos para reducir llamadas al backend
const cache = {
  cities: null,
  edges: null,
  timestamp: null
};
```

### 2. **Filtrado por Zoom (Strategy Pattern)**
```javascript
// Muestra menos aristas en zoom bajo, más en zoom alto
if (zoomLevel <= 3) maxDistance = 2000;
else if (zoomLevel <= 5) maxDistance = 1500;
else maxDistance = 500;
```

### 3. **Virtualización de Datos**
- Solo renderiza aristas visibles en el viewport
- Lazy loading de edges después de cargar ciudades

### 4. **Singleton Pattern**
```javascript
// Una única instancia del repositorio y httpClient
export const graphRepository = new GraphRepository();
export const httpClient = new HttpClient();
```

## 🎨 Controles de la UI

- **Filtro de distancia**: Slider para ajustar distancia máxima de conexiones
- **Panel de estadísticas**: Muestra número de ciudades y conexiones
- **Botón reload**: Recarga los datos del backend
- **Zoom**: Mouse wheel o gestos del trackpad
- **Pan**: Click y arrastrar para desplazarse

## 🎯 Colores de las Aristas

Las conexiones cambian de color según la distancia:

- 🟢 Verde: < 500km (conexiones locales)
- 🔵 Azul: 500-1000km (regionales)
- 🟡 Ámbar: 1000-2000km (nacionales)
- 🔴 Rojo: > 2000km (continentales)

## 🔧 Configuración

Para cambiar la URL del backend, edita:

```javascript
// src/infrastructure/config/api.config.js
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000',
  // ...
};
```

## 📦 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linter
```

## 🐛 Troubleshooting

### Error de conexión al backend
- Verifica que el backend esté corriendo en `http://127.0.0.1:8000`
- Prueba acceder a `http://127.0.0.1:8000/docs` en tu navegador

### El mapa no carga
- Abre DevTools (F12) y revisa la consola
- Verifica que los datos tengan el formato correcto

### Performance lento
- Reduce el slider de distancia máxima
- Aumenta el nivel de zoom para ver menos datos

## 📝 Próximas Mejoras

- [ ] Endpoint `/edges/viewport` en el backend para filtrado server-side
- [ ] Clustering de ciudades cercanas en zoom bajo
- [ ] Búsqueda de ciudades
- [ ] Cálculo de rutas más cortas
- [ ] Exportar visualización como imagen

## 📄 Licencia

MIT

---

Desarrollado con ❤️ usando React + Tailwind + Leaflet
