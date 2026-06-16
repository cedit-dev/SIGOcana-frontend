# SigOcaña

SigOcaña es un Sistema de Información Geográfica (SIG) desarrollado para la gestión territorial del municipio de Ocaña, Norte de Santander. La plataforma permite la visualización y el análisis de datos geoespaciales críticos para la toma de decisiones y el conocimiento público del municipio.

---

## Características Principales

- **Cartografía Interactiva**: Navegación por capas de comunas, barrios, infraestructura educativa, salud y equipamientos gubernamentales.
- **Panel de Estadísticas**: Visualización de datos demográficos, extensión territorial y distribución por edades y género mediante gráficos integrados.
- **Herramientas de Búsqueda**: Localización de puntos de interés y delimitaciones territoriales dentro del sistema.
- **Experiencia de Usuario**: Interfaz optimizada con transiciones fluidas y diseño adaptable a diferentes dispositivos.
- **Rendimiento**: Animaciones basadas en CSS y optimización de carga de datos para asegurar una navegación rápida.

---

## Tecnologías

- **Base de desarrollo**: React 18 y Vite.
- **Tipado**: TypeScript.
- **Diseño**: Tailwind CSS.
- **Librería de Componentes**: shadcn/ui.
- **Motor de Mapas**: Leaflet / React-Leaflet.
- **Visualización de Datos**: Recharts.
- **Animaciones**: Framer Motion y GSAP.

---

## Estructura del Directorio

```text
src/
├── components/         # Componentes de interfaz y dashboard
│   ├── gis/            # Lógica y vistas específicas del sistema SIG
│   ├── landing/        # Secciones de la página principal
│   └── ui/             # Componentes base
├── data/               # Fuentes de datos GeoJSON y estadísticas
├── hooks/              # Estado y lógica reutilizable
├── pages/              # Vistas de la aplicación (Inicio, Mapa, Login)
└── App.tsx             # Punto de entrada y ruteo
```

---

## Instalación

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar servidor local**:
   ```bash
   npm run dev
   ```

---

## Mejoras Recientes

Se han implementado optimizaciones en el motor de animaciones para mejorar la respuesta del sistema durante el desplazamiento. Se eliminaron filtros visuales redundantes y se migraron animaciones de JavaScript a CSS para reducir la carga en el hilo principal del navegador.

---

## Hoja de Ruta

- Implementación de guía asistida para nuevos usuarios.
- Ajuste automático de estilos de mapa según el tema visual.
- Generación de reportes técnicos descargables.
- Integración de datos meteorológicos locales.
- Modelado de manzanas en entornos de visualización con profundidad.

---

## Información Institucional

Este sistema forma parte de las herramientas de gestión de la Alcaldía de Ocaña. Los datos están basados en fuentes oficiales de DANE y el Plan de Ordenamiento Territorial (POT).

---
© 2026 SigOcaña · Sistema de Información Geográfica.
