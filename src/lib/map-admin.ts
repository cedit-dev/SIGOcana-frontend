import { LAYERS_CONFIG, LayerConfig } from "@/data/ocana-geodata";

export interface PersistedAdminMapState {
  layers: LayerConfig[];
  dataOverrides: Record<string, GeoJSON.FeatureCollection>;
}

const MAP_ADMIN_STORAGE_KEY = "sigocana.map.admin.state";

const canUseStorage = () => typeof window !== "undefined";

const cloneLayers = (layers: LayerConfig[]) => layers.map((layer) => ({ ...layer }));

export const createEmptyFeatureCollection = (): GeoJSON.FeatureCollection => ({
  type: "FeatureCollection",
  features: [],
});

export function loadAdminMapState(): PersistedAdminMapState {
  if (!canUseStorage()) {
    return {
      layers: cloneLayers(LAYERS_CONFIG),
      dataOverrides: {},
    };
  }

  try {
    const raw = window.localStorage.getItem(MAP_ADMIN_STORAGE_KEY);
    if (!raw) {
      return {
        layers: cloneLayers(LAYERS_CONFIG),
        dataOverrides: {},
      };
    }

    const parsed = JSON.parse(raw) as Partial<PersistedAdminMapState>;
    return {
      layers: Array.isArray(parsed.layers) ? parsed.layers : cloneLayers(LAYERS_CONFIG),
      dataOverrides:
        parsed.dataOverrides && typeof parsed.dataOverrides === "object"
          ? parsed.dataOverrides
          : {},
    };
  } catch {
    return {
      layers: cloneLayers(LAYERS_CONFIG),
      dataOverrides: {},
    };
  }
}

export function saveAdminMapState(state: PersistedAdminMapState) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(MAP_ADMIN_STORAGE_KEY, JSON.stringify(state));
}

export function resetAdminMapState() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(MAP_ADMIN_STORAGE_KEY);
}

export function detectGeometryType(
  collection?: GeoJSON.FeatureCollection,
): GeoJSON.Geometry["type"] | undefined {
  const feature = collection?.features.find((item) => item.geometry?.type);
  return feature?.geometry?.type;
}

export function createPointFeature(input: {
  name: string;
  type?: string;
  description?: string;
  lat: number;
  lng: number;
}): GeoJSON.Feature {
  return {
    type: "Feature",
    properties: {
      nombre: input.name,
      tipo: input.type || "Punto",
      descripcion: input.description || "Creado por super admin",
    },
    geometry: {
      type: "Point",
      coordinates: [input.lng, input.lat],
    },
  };
}
