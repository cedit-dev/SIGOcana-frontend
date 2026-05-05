// Mock GeoJSON data for testing - To be replaced by backend API calls later.

export const comunasGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Comuna 1 - Centro José Eusebio Caro", poblacion: 30722, area_habitantes: 85, estrato_predominante: 3, densidad: 361.4 }, geometry: { type: "Polygon", coordinates: [[[-73.362, 8.242], [-73.355, 8.242], [-73.355, 8.235], [-73.362, 8.235], [-73.362, 8.242]]] } },
    { type: "Feature", properties: { nombre: "Comuna 2 - Norte", poblacion: 25872, area_habitantes: 120, estrato_predominante: 2, densidad: 215.6 }, geometry: { type: "Polygon", coordinates: [[[-73.355, 8.242], [-73.348, 8.242], [-73.348, 8.235], [-73.355, 8.235], [-73.355, 8.242]]] } },
    { type: "Feature", properties: { nombre: "Comuna 3 - Sur Oriental Olaya Herrera", poblacion: 37393, area_habitantes: 95, estrato_predominante: 2, densidad: 393.6 }, geometry: { type: "Polygon", coordinates: [[[-73.362, 8.235], [-73.355, 8.235], [-73.355, 8.228], [-73.362, 8.228], [-73.362, 8.235]]] } },
    { type: "Feature", properties: { nombre: "Comuna 4 - Sur Occidental Adolfo Milanés", poblacion: 19808, area_habitantes: 150, estrato_predominante: 1, densidad: 132.1 }, geometry: { type: "Polygon", coordinates: [[[-73.355, 8.235], [-73.348, 8.235], [-73.348, 8.228], [-73.355, 8.228], [-73.355, 8.235]]] } },
    { type: "Feature", properties: { nombre: "Comuna 5 - La Costa", poblacion: 22632, area_habitantes: 110, estrato_predominante: 3, densidad: 205.7 }, geometry: { type: "Polygon", coordinates: [[[-73.368, 8.240], [-73.362, 8.240], [-73.362, 8.233], [-73.368, 8.233], [-73.368, 8.240]]] } },
  ]
};

export const barriosGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Centro Histórico", comuna: "Comuna 1", estrato: 3, poblacion: 3200 }, geometry: { type: "Polygon", coordinates: [[[-73.360, 8.240], [-73.357, 8.240], [-73.357, 8.237], [-73.360, 8.237], [-73.360, 8.240]]] } },
    { type: "Feature", properties: { nombre: "La Primavera", comuna: "Comuna 2", estrato: 2, poblacion: 4500 }, geometry: { type: "Polygon", coordinates: [[[-73.353, 8.241], [-73.350, 8.241], [-73.350, 8.238], [-73.353, 8.238], [-73.353, 8.241]]] } },
    { type: "Feature", properties: { nombre: "Los Almendros", comuna: "Comuna 3", estrato: 2, poblacion: 5100 }, geometry: { type: "Polygon", coordinates: [[[-73.360, 8.234], [-73.357, 8.234], [-73.357, 8.231], [-73.360, 8.231], [-73.360, 8.234]]] } },
    { type: "Feature", properties: { nombre: "Villa del Rosario", comuna: "Comuna 4", estrato: 1, poblacion: 2800 }, geometry: { type: "Polygon", coordinates: [[[-73.354, 8.233], [-73.351, 8.233], [-73.351, 8.230], [-73.354, 8.230], [-73.354, 8.233]]] } },
    { type: "Feature", properties: { nombre: "El Contento", comuna: "Comuna 5", estrato: 3, poblacion: 3800 }, geometry: { type: "Polygon", coordinates: [[[-73.367, 8.239], [-73.364, 8.239], [-73.364, 8.236], [-73.367, 8.236], [-73.367, 8.239]]] } },
  ]
};

export const educacionGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Universidad Francisco de Paula Santander - Ocaña", tipo: "Universidad", nivel: "Superior", estudiantes: 8500, descripcion: "UFPS Sede Ocaña · Primera IES pública del nororiente colombiano" }, geometry: { type: "Point", coordinates: [-73.3625, 8.2285] } },
    { type: "Feature", properties: { nombre: "Universidad Santo Tomás CAU Ocaña", tipo: "Universidad", nivel: "Superior", estudiantes: null, descripcion: "Calle 10 N 10-40, Barrio Amargura · Fundada en 1980" }, geometry: { type: "Point", coordinates: [-73.3560, 8.2340] } },
    { type: "Feature", properties: { nombre: "UNAD CEAD Ocaña", tipo: "Universidad", nivel: "Superior", estudiantes: null, descripcion: "Calle 10 N. 9-47, Centro · Educación a distancia" }, geometry: { type: "Point", coordinates: [-73.3568, 8.2338] } },
    { type: "Feature", properties: { nombre: "Colegio Nacional José Eusebio Caro", tipo: "Colegio", nivel: "Básica y Media", estudiantes: 1200, descripcion: "Calle 11 No. 9-81, Barrio San Francisco" }, geometry: { type: "Point", coordinates: [-73.3568, 8.2291] } },
    { type: "Feature", properties: { nombre: "Instituto Técnico Alfonso López", tipo: "Instituto", nivel: "Básica y Media", estudiantes: 950, descripcion: "Institución técnica pública" }, geometry: { type: "Point", coordinates: [-73.3545, 8.2310] } },
    { type: "Feature", properties: { nombre: "Colegio La Salle", tipo: "Colegio", nivel: "Básica y Media", estudiantes: 800, descripcion: "Institución privada · Comunidad De La Salle" }, geometry: { type: "Point", coordinates: [-73.3575, 8.2320] } },
    { type: "Feature", properties: { nombre: "SENA Regional Ocaña", tipo: "Técnico", nivel: "Técnico y Tecnológico", estudiantes: 3200, descripcion: "Transv. 30 No. 7-10, Barrio La Primavera" }, geometry: { type: "Point", coordinates: [-73.3510, 8.2400] } },
    { type: "Feature", properties: { nombre: "Colegio Agustina Ferro", tipo: "Colegio", nivel: "Básica y Media", estudiantes: 700, descripcion: "Institución educativa oficial" }, geometry: { type: "Point", coordinates: [-73.3590, 8.2255] } },
  ]
};

export const saludGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Hospital Emiro Quintero Cañizares", tipo: "Hospital", nivel: 2, camas: 120, descripcion: "Calle 7 # 9-177 · Hospital público de referencia regional" }, geometry: { type: "Point", coordinates: [-73.3585, 8.2542] } },
    { type: "Feature", properties: { nombre: "Clínica Ocaña", tipo: "Clínica", nivel: 2, camas: 45, descripcion: "Institución prestadora de salud privada · Nivel II" }, geometry: { type: "Point", coordinates: [-73.3540, 8.2355] } },
    { type: "Feature", properties: { nombre: "Centro de Salud La Piñuela", tipo: "Centro de Salud", nivel: 1, camas: 10, descripcion: "Barrio La Piñuela · Atención primaria en salud" }, geometry: { type: "Point", coordinates: [-73.3520, 8.2390] } },
    { type: "Feature", properties: { nombre: "Centro de Atención Neuropsiquiátrico de Ocaña", tipo: "Centro Especializado", nivel: 2, camas: null, descripcion: "Salud mental, neuropsiquiatría y adicciones" }, geometry: { type: "Point", coordinates: [-73.3600, 8.2320] } },
    { type: "Feature", properties: { nombre: "Hospiclinic de Colombia SAS", tipo: "Clínica", nivel: 1, camas: null, descripcion: "Diagnóstico avanzado e imagenología" }, geometry: { type: "Point", coordinates: [-73.3530, 8.2350] } },
  ]
};

export const gobiernoGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Alcaldía Municipal de Ocaña", tipo: "Gobierno Municipal", direccion: "Carrera 12 No. 10-42, Parque Principal" }, geometry: { type: "Point", coordinates: [-73.3540, 8.2354] } },
    { type: "Feature", properties: { nombre: "Registraduría Nacional", tipo: "Registraduría", direccion: "Calle 11 No. 16A-13, Barrio San Agustín" }, geometry: { type: "Point", coordinates: [-73.3490, 8.2360] } },
    { type: "Feature", properties: { nombre: "Fiscalía General de la Nación", tipo: "Justicia", direccion: "Centro de Ocaña" }, geometry: { type: "Point", coordinates: [-73.3548, 8.2358] } },
    { type: "Feature", properties: { nombre: "Defensoría del Pueblo", tipo: "Defensoría", direccion: "Centro de Ocaña" }, geometry: { type: "Point", coordinates: [-73.3545, 8.2350] } },
    { type: "Feature", properties: { nombre: "Catedral de Santa Ana", tipo: "Patrimonio Cultural", direccion: "Parque Principal, frente al Parque" }, geometry: { type: "Point", coordinates: [-73.3539, 8.2347] } },
    { type: "Feature", properties: { nombre: "Terminal de Transporte de Ocaña", tipo: "Transporte", direccion: "Av. Circunvalar Cra. 11 Nº 19-332" }, geometry: { type: "Point", coordinates: [-73.3620, 8.2450] } },
    { type: "Feature", properties: { nombre: "Centro Comercial Plazarella", tipo: "Comercio", direccion: "Carrera 14, 10-83" }, geometry: { type: "Point", coordinates: [-73.3520, 8.2350] } },
  ]
};

export const hidrografiaGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Río Algodonal", tipo: "Río", longitud_km: 12.5 }, geometry: { type: "LineString", coordinates: [[-73.370, 8.245], [-73.365, 8.241], [-73.360, 8.238], [-73.355, 8.235], [-73.348, 8.230], [-73.342, 8.226]] } },
    { type: "Feature", properties: { nombre: "Quebrada La Piñuela", tipo: "Quebrada", longitud_km: 4.2 }, geometry: { type: "LineString", coordinates: [[-73.358, 8.245], [-73.356, 8.242], [-73.354, 8.238], [-73.352, 8.234]] } },
    { type: "Feature", properties: { nombre: "Quebrada Seca", tipo: "Quebrada", longitud_km: 3.1 }, geometry: { type: "LineString", coordinates: [[-73.365, 8.236], [-73.362, 8.234], [-73.359, 8.232], [-73.356, 8.229]] } },
  ]
};

export const usoSueloGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Zona Urbana Central", uso: "Urbano", area_habitantes: 180 }, geometry: { type: "Polygon", coordinates: [[[-73.363, 8.243], [-73.350, 8.243], [-73.350, 8.230], [-73.363, 8.230], [-73.363, 8.243]]] } },
    { type: "Feature", properties: { nombre: "Zona Rural Norte", uso: "Agrícola", area_habitantes: 450 }, geometry: { type: "Polygon", coordinates: [[[-73.370, 8.250], [-73.345, 8.250], [-73.345, 8.243], [-73.370, 8.243], [-73.370, 8.250]]] } },
    { type: "Feature", properties: { nombre: "Zona de Protección", uso: "Protección Ambiental", area_habitantes: 320 }, geometry: { type: "Polygon", coordinates: [[[-73.370, 8.230], [-73.345, 8.230], [-73.345, 8.222], [-73.370, 8.222], [-73.370, 8.230]]] } },
  ]
};

export const estratificacionGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Sector Centro", estrato: 3, viviendas: 2100 }, geometry: { type: "Polygon", coordinates: [[[-73.361, 8.241], [-73.356, 8.241], [-73.356, 8.236], [-73.361, 8.236], [-73.361, 8.241]]] } },
    { type: "Feature", properties: { nombre: "Sector Norte", estrato: 2, viviendas: 3200 }, geometry: { type: "Polygon", coordinates: [[[-73.356, 8.243], [-73.350, 8.243], [-73.350, 8.238], [-73.356, 8.238], [-73.356, 8.243]]] } },
    { type: "Feature", properties: { nombre: "Sector Sur", estrato: 1, viviendas: 4100 }, geometry: { type: "Polygon", coordinates: [[[-73.360, 8.234], [-73.350, 8.234], [-73.350, 8.228], [-73.360, 8.228], [-73.360, 8.234]]] } },
    { type: "Feature", properties: { nombre: "Sector Occidental", estrato: 4, viviendas: 1500 }, geometry: { type: "Polygon", coordinates: [[[-73.368, 8.240], [-73.362, 8.240], [-73.362, 8.234], [-73.368, 8.234], [-73.368, 8.240]]] } },
  ]
};

export const proyectosGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Renovación Plaza Principal", estado: "En ejecución", presupuesto: "2.500M COP", avance: 65 }, geometry: { type: "Point", coordinates: [-73.358, 8.238] } },
    { type: "Feature", properties: { nombre: "Nuevo Parque Lineal", estado: "En diseño", presupuesto: "4.200M COP", avance: 20 }, geometry: { type: "Point", coordinates: [-73.354, 8.235] } },
    { type: "Feature", properties: { nombre: "Ampliación Acueducto", estado: "En ejecución", presupuesto: "8.100M COP", avance: 40 }, geometry: { type: "Point", coordinates: [-73.350, 8.240] } },
  ]
};

export const viasGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Vía Nacional Ocaña-Cúcuta", tipo: "Nacional", estado: "Bueno" }, geometry: { type: "LineString", coordinates: [[-73.370, 8.248], [-73.362, 8.243], [-73.355, 8.238], [-73.348, 8.233], [-73.340, 8.228]] } },
    { type: "Feature", properties: { nombre: "Vía Ocaña-Ábrego", tipo: "Departamental", estado: "Regular" }, geometry: { type: "LineString", coordinates: [[-73.358, 8.238], [-73.363, 8.235], [-73.368, 8.232], [-73.373, 8.228]] } },
    { type: "Feature", properties: { nombre: "Avenida Francisco Fernández de Contreras", tipo: "Urbana Principal", estado: "Bueno" }, geometry: { type: "LineString", coordinates: [[-73.362, 8.242], [-73.358, 8.238], [-73.354, 8.234]] } },
  ]
};

export const dashboardStats = {
  poblacionTotal: 136427,
  areaUrbana: 696,
  areaRural: 62076,
  areaTotalHa: 67227,
  numComunas: 5,
  numBarrios: 42,
  numVeredas: 90,
  numCorregimientos: 17,
  equipamientos: { educacion: 8, salud: 5, gobierno: 4, deportivo: 8, cultural: 6 },
  poblacionPorComuna: [
    { comuna: "1 · Centro JE Caro", poblacion: 30722, area: 85 },
    { comuna: "2 · Norte", poblacion: 25872, area: 120 },
    { comuna: "3 · Sur Oriental O.H.", poblacion: 37393, area: 95 },
    { comuna: "4 · Sur Occ. A.Milanés", poblacion: 19808, area: 150 },
    { comuna: "5 · La Costa", poblacion: 22632, area: 110 },
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
    { uso: "Urbano", area: 696 },
    { uso: "Agrícola", area: 42000 },
    { uso: "Protección", area: 24531 },
  ],
  poblacionPorEdad: [
    { grupo: "Niños (<12)", cantidad: 24226, porcentaje: 17.8 },
    { grupo: "Adolescentes (12-17)", cantidad: 13488, porcentaje: 9.9 },
    { grupo: "Adultos (18-59)", cantidad: 79921, porcentaje: 58.6 },
    { grupo: "Adultos ≥60", cantidad: 18792, porcentaje: 13.8 },
  ],
  distribucionGenero: [
    { genero: "Mujeres", cantidad: 70999, porcentaje: 52 },
    { genero: "Hombres", cantidad: 65428, porcentaje: 48 },
  ],
};
