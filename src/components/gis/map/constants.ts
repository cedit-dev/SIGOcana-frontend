import {
  comunasGeoJSON, barriosGeoJSON, educacionGeoJSON,
  saludGeoJSON, gobiernoGeoJSON, hidrografiaGeoJSON,
  usoSueloGeoJSON, estratificacionGeoJSON, proyectosGeoJSON, viasGeoJSON,
} from "@/data/ocana-geodata";

export const GEOJSON_MAP: Record<string, GeoJSON.FeatureCollection> = {
  comunas: comunasGeoJSON,
  barrios: barriosGeoJSON,
  educacion: educacionGeoJSON,
  salud: saludGeoJSON,
  gobierno: gobiernoGeoJSON,
  hidrografia: hidrografiaGeoJSON,
  uso_suelo: usoSueloGeoJSON,
  estratificacion: estratificacionGeoJSON,
  proyectos: proyectosGeoJSON,
  vias: viasGeoJSON,
};

export const POINT_LAYERS = new Set(["educacion", "salud", "gobierno", "proyectos"]);

export const PROP_LABELS: Record<string, string> = {
  tipo: "Tipo", nivel: "Nivel", camas: "Camas disponibles",
  estudiantes: "Estudiantes matriculados", descripcion: "Descripción",
  poblacion: "Población", area_habitantes: "Área (ha)",
  estrato_predominante: "Estrato predominante", densidad: "Densidad (hab/ha)",
  comuna: "Comuna", estrato: "Estrato", longitud_km: "Longitud (km)",
  uso: "Uso del suelo", viviendas: "Viviendas", estado: "Estado",
  presupuesto: "Presupuesto", avance: "Avance (%)", area: "Área",
  direccion: "Dirección",
};

export const ESTRATO_COLORS: Record<number, string> = {
  1: "#fde0c5",
  2: "#f5a96e",
  3: "#d4804a",
  4: "#a05c30",
  5: "#5a8a68",
  6: "#3a6b50",
};

export const USO_COLORS: Record<string, string> = {
  "Urbano": "#c4883a",
  "Agrícola": "#4a7c59",
  "Protección Ambiental": "#2d8a6e",
};
