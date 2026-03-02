// Sample GeoJSON data for Ocaña, Norte de Santander, Colombia
// Center coordinates: approximately 8.2376° N, 73.3575° W

export const OCANA_CENTER: [number, number] = [8.2376, -73.3575];
export const OCANA_ZOOM = 14;

export interface LayerConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  visible: boolean;
  opacity: number;
  description: string;
}

export const LAYER_CATEGORIES = [
  { id: "admin", name: "División Administrativa", icon: "Layout" },
  { id: "infra", name: "Infraestructura", icon: "HardHat" },
  { id: "equip", name: "Equipamientos", icon: "Building2" },
  { id: "environment", name: "Medio Ambiente", icon: "Leaf" },
  { id: "social", name: "Socioeconómico", icon: "BarChart3" },
];

export const LAYERS_CONFIG: LayerConfig[] = [
  {
    id: "comunas",
    name: "Comunas",
    icon: "Layout",
    color: "#4A90D9",
    category: "admin",
    visible: true,
    opacity: 0.4,
    description: "División por comunas del municipio",
  },
  {
    id: "barrios",
    name: "Barrios",
    icon: "Home",
    color: "#7B68EE",
    category: "admin",
    visible: false,
    opacity: 0.35,
    description: "Límites barriales del área urbana",
  },
  {
    id: "vias",
    name: "Red Vial",
    icon: "Road",
    color: "#E67E22",
    category: "infra",
    visible: false,
    opacity: 0.8,
    description: "Infraestructura vial principal y secundaria",
  },
  {
    id: "educacion",
    name: "Instituciones Educativas",
    icon: "GraduationCap",
    color: "#2ECC71",
    category: "equip",
    visible: true,
    opacity: 1,
    description: "Colegios, universidades e instituciones",
  },
  {
    id: "salud",
    name: "Centros de Salud",
    icon: "Hospital",
    color: "#E74C3C",
    category: "equip",
    visible: true,
    opacity: 1,
    description: "Hospitales, clínicas y puestos de salud",
  },
  {
    id: "gobierno",
    name: "Entidades Públicas",
    icon: "Landmark",
    color: "#F39C12",
    category: "equip",
    visible: false,
    opacity: 1,
    description: "Alcaldía, registraduría, notarías",
  },
  {
    id: "hidrografia",
    name: "Hidrografía",
    icon: "Waves",
    color: "#3498DB",
    category: "environment",
    visible: false,
    opacity: 0.7,
    description: "Ríos, quebradas y cuerpos de agua",
  },
  {
    id: "uso_suelo",
    name: "Uso del Suelo",
    icon: "TreePine",
    color: "#27AE60",
    category: "environment",
    visible: false,
    opacity: 0.3,
    description: "Clasificación del uso del suelo",
  },
  {
    id: "estratificacion",
    name: "Estratificación",
    icon: "Layers",
    color: "#9B59B6",
    category: "social",
    visible: false,
    opacity: 0.4,
    description: "Estratificación socioeconómica",
  },
  {
    id: "proyectos",
    name: "Proyectos Urbanos",
    icon: "Construction",
    color: "#F1C40F",
    category: "social",
    visible: false,
    opacity: 0.5,
    description: "Proyectos de desarrollo urbano vigentes",
  },
];

// Sample comunas polygons for Ocaña
export const comunasGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { nombre: "Comuna 1 - Centro", poblacion: 15200, area_habitantes: 85, estrato_predominante: 3, densidad: 178.8 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.362, 8.242], [-73.355, 8.242], [-73.355, 8.235],
          [-73.362, 8.235], [-73.362, 8.242]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Comuna 2 - La Piñuela", poblacion: 12800, area_habitantes: 120, estrato_predominante: 2, densidad: 106.7 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.355, 8.242], [-73.348, 8.242], [-73.348, 8.235],
          [-73.355, 8.235], [-73.355, 8.242]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Comuna 3 - El Llano", poblacion: 18500, area_habitantes: 95, estrato_predominante: 2, densidad: 194.7 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.362, 8.235], [-73.355, 8.235], [-73.355, 8.228],
          [-73.362, 8.228], [-73.362, 8.235]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Comuna 4 - Cristo Rey", poblacion: 9800, area_habitantes: 150, estrato_predominante: 1, densidad: 65.3 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.355, 8.235], [-73.348, 8.235], [-73.348, 8.228],
          [-73.355, 8.228], [-73.355, 8.235]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Comuna 5 - La Costa", poblacion: 11200, area_habitantes: 110, estrato_predominante: 3, densidad: 101.8 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.368, 8.240], [-73.362, 8.240], [-73.362, 8.233],
          [-73.368, 8.233], [-73.368, 8.240]
        ]]
      }
    },
  ]
};

// Sample barrios
export const barriosGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { nombre: "Centro Histórico", comuna: "Comuna 1", estrato: 3, poblacion: 3200 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.360, 8.240], [-73.357, 8.240], [-73.357, 8.237],
          [-73.360, 8.237], [-73.360, 8.240]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "La Primavera", comuna: "Comuna 2", estrato: 2, poblacion: 4500 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.353, 8.241], [-73.350, 8.241], [-73.350, 8.238],
          [-73.353, 8.238], [-73.353, 8.241]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Los Almendros", comuna: "Comuna 3", estrato: 2, poblacion: 5100 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.360, 8.234], [-73.357, 8.234], [-73.357, 8.231],
          [-73.360, 8.231], [-73.360, 8.234]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Villa del Rosario", comuna: "Comuna 4", estrato: 1, poblacion: 2800 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.354, 8.233], [-73.351, 8.233], [-73.351, 8.230],
          [-73.354, 8.230], [-73.354, 8.233]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "El Contento", comuna: "Comuna 5", estrato: 3, poblacion: 3800 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.367, 8.239], [-73.364, 8.239], [-73.364, 8.236],
          [-73.367, 8.236], [-73.367, 8.239]
        ]]
      }
    },
  ]
};

// Sample point data - Educational institutions
export const educacionGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Universidad Francisco de Paula Santander - Ocaña", tipo: "Universidad", estudiantes: 8500 }, geometry: { type: "Point", coordinates: [-73.356, 8.238] } },
    { type: "Feature", properties: { nombre: "Colegio Nacional José Eusebio Caro", tipo: "Colegio", estudiantes: 1200 }, geometry: { type: "Point", coordinates: [-73.358, 8.240] } },
    { type: "Feature", properties: { nombre: "Instituto Técnico Alfonso López", tipo: "Instituto", estudiantes: 950 }, geometry: { type: "Point", coordinates: [-73.352, 8.236] } },
    { type: "Feature", properties: { nombre: "Colegio La Salle", tipo: "Colegio", estudiantes: 800 }, geometry: { type: "Point", coordinates: [-73.360, 8.237] } },
    { type: "Feature", properties: { nombre: "SENA Regional Ocaña", tipo: "Técnico", estudiantes: 3200 }, geometry: { type: "Point", coordinates: [-73.354, 8.241] } },
    { type: "Feature", properties: { nombre: "Colegio Agustina Ferro", tipo: "Colegio", estudiantes: 700 }, geometry: { type: "Point", coordinates: [-73.359, 8.233] } },
  ]
};

// Sample point data - Health centers
export const saludGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Hospital Emiro Quintero Cañizares", tipo: "Hospital", nivel: 2, camas: 120 }, geometry: { type: "Point", coordinates: [-73.357, 8.236] } },
    { type: "Feature", properties: { nombre: "Clínica Ocaña", tipo: "Clínica", nivel: 2, camas: 45 }, geometry: { type: "Point", coordinates: [-73.355, 8.239] } },
    { type: "Feature", properties: { nombre: "Centro de Salud La Piñuela", tipo: "Centro de Salud", nivel: 1, camas: 10 }, geometry: { type: "Point", coordinates: [-73.351, 8.240] } },
    { type: "Feature", properties: { nombre: "Puesto de Salud Cristo Rey", tipo: "Puesto de Salud", nivel: 1, camas: 5 }, geometry: { type: "Point", coordinates: [-73.353, 8.231] } },
  ]
};

// Sample point data - Government
export const gobiernoGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Alcaldía Municipal de Ocaña", tipo: "Gobierno Municipal" }, geometry: { type: "Point", coordinates: [-73.358, 8.238] } },
    { type: "Feature", properties: { nombre: "Registraduría Nacional", tipo: "Registraduría" }, geometry: { type: "Point", coordinates: [-73.359, 8.239] } },
    { type: "Feature", properties: { nombre: "Fiscalía General", tipo: "Justicia" }, geometry: { type: "Point", coordinates: [-73.357, 8.240] } },
    { type: "Feature", properties: { nombre: "Defensoría del Pueblo", tipo: "Defensoría" }, geometry: { type: "Point", coordinates: [-73.356, 8.237] } },
  ]
};

// Sample hydrography lines
export const hidrografiaGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { nombre: "Río Algodonal", tipo: "Río", longitud_km: 12.5 },
      geometry: {
        type: "LineString",
        coordinates: [
          [-73.370, 8.245], [-73.365, 8.241], [-73.360, 8.238],
          [-73.355, 8.235], [-73.348, 8.230], [-73.342, 8.226]
        ]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Quebrada La Piñuela", tipo: "Quebrada", longitud_km: 4.2 },
      geometry: {
        type: "LineString",
        coordinates: [
          [-73.358, 8.245], [-73.356, 8.242], [-73.354, 8.238],
          [-73.352, 8.234]
        ]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Quebrada Seca", tipo: "Quebrada", longitud_km: 3.1 },
      geometry: {
        type: "LineString",
        coordinates: [
          [-73.365, 8.236], [-73.362, 8.234], [-73.359, 8.232],
          [-73.356, 8.229]
        ]
      }
    },
  ]
};

// Sample land use
export const usoSueloGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { nombre: "Zona Urbana Central", uso: "Urbano", area_habitantes: 180 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.363, 8.243], [-73.350, 8.243], [-73.350, 8.230],
          [-73.363, 8.230], [-73.363, 8.243]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Zona Rural Norte", uso: "Agrícola", area_habitantes: 450 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.370, 8.250], [-73.345, 8.250], [-73.345, 8.243],
          [-73.370, 8.243], [-73.370, 8.250]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Zona de Protección", uso: "Protección Ambiental", area_habitantes: 320 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.370, 8.230], [-73.345, 8.230], [-73.345, 8.222],
          [-73.370, 8.222], [-73.370, 8.230]
        ]]
      }
    },
  ]
};

// Estratificación
export const estratificacionGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { nombre: "Sector Centro", estrato: 3, viviendas: 2100 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.361, 8.241], [-73.356, 8.241], [-73.356, 8.236],
          [-73.361, 8.236], [-73.361, 8.241]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Sector Norte", estrato: 2, viviendas: 3200 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.356, 8.243], [-73.350, 8.243], [-73.350, 8.238],
          [-73.356, 8.238], [-73.356, 8.243]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Sector Sur", estrato: 1, viviendas: 4100 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.360, 8.234], [-73.350, 8.234], [-73.350, 8.228],
          [-73.360, 8.228], [-73.360, 8.234]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Sector Occidental", estrato: 4, viviendas: 1500 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.368, 8.240], [-73.362, 8.240], [-73.362, 8.234],
          [-73.368, 8.234], [-73.368, 8.240]
        ]]
      }
    },
  ]
};

// Proyectos urbanos
export const proyectosGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Renovación Plaza Principal", estado: "En ejecución", presupuesto: "2.500M COP", avance: 65 }, geometry: { type: "Point", coordinates: [-73.358, 8.238] } },
    { type: "Feature", properties: { nombre: "Nuevo Parque Lineal", estado: "En diseño", presupuesto: "4.200M COP", avance: 20 }, geometry: { type: "Point", coordinates: [-73.354, 8.235] } },
    { type: "Feature", properties: { nombre: "Ampliación Acueducto", estado: "En ejecución", presupuesto: "8.100M COP", avance: 40 }, geometry: { type: "Point", coordinates: [-73.350, 8.240] } },
  ]
};

// Vias
export const viasGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { nombre: "Vía Nacional Ocaña-Cúcuta", tipo: "Nacional", estado: "Bueno" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-73.370, 8.248], [-73.362, 8.243], [-73.355, 8.238],
          [-73.348, 8.233], [-73.340, 8.228]
        ]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Vía Ocaña-Ábrego", tipo: "Departamental", estado: "Regular" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-73.358, 8.238], [-73.363, 8.235], [-73.368, 8.232],
          [-73.373, 8.228]
        ]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Avenida Francisco Fernández de Contreras", tipo: "Urbana Principal", estado: "Bueno" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-73.362, 8.242], [-73.358, 8.238], [-73.354, 8.234]
        ]
      }
    },
  ]
};

// Statistics data for dashboard
export const dashboardStats = {
  poblacionTotal: 67500,
  areaUrbana: 180,
  areaRural: 770,
  areaTotalHa: 950,
  numComunas: 5,
  numBarrios: 42,
  numVeredas: 28,
  equipamientos: {
    educacion: 45,
    salud: 12,
    gobierno: 15,
    deportivo: 8,
    cultural: 6,
  },
  poblacionPorComuna: [
    { comuna: "Comuna 1", poblacion: 15200, area: 85 },
    { comuna: "Comuna 2", poblacion: 12800, area: 120 },
    { comuna: "Comuna 3", poblacion: 18500, area: 95 },
    { comuna: "Comuna 4", poblacion: 9800, area: 150 },
    { comuna: "Comuna 5", poblacion: 11200, area: 110 },
  ],
  estratificacion: [
    { estrato: "Estrato 1", porcentaje: 32, viviendas: 8200 },
    { estrato: "Estrato 2", porcentaje: 35, viviendas: 9100 },
    { estrato: "Estrato 3", porcentaje: 22, viviendas: 5600 },
    { estrato: "Estrato 4", porcentaje: 8, viviendas: 2100 },
    { estrato: "Estrato 5", porcentaje: 2, viviendas: 500 },
    { estrato: "Estrato 6", porcentaje: 1, viviendas: 200 },
  ],
  usoSuelo: [
    { uso: "Urbano", area: 180 },
    { uso: "Agrícola", area: 450 },
    { uso: "Protección", area: 320 },
  ],
};
