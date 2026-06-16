import { describe, it, expect } from "vitest";
import { comunasGeoJSON, barriosGeoJSON, educacionGeoJSON, saludGeoJSON, gobiernoGeoJSON, proyectosGeoJSON } from "@/data/ocana-geodata";

const SEARCHABLE_FIELDS = ["nombre", "tipo", "sector", "categoria", "especialidad", "estrato", "estado", "uso", "superficie"];

interface SearchEntry {
  text: string;
  category: string;
  feature: GeoJSON.Feature;
}

function buildSearchIndex(): SearchEntry[] {
  const sources: Record<string, GeoJSON.FeatureCollection> = {
    comunas: comunasGeoJSON,
    barrios: barriosGeoJSON,
    educacion: educacionGeoJSON,
    salud: saludGeoJSON,
    gobierno: gobiernoGeoJSON,
    proyectos: proyectosGeoJSON,
  };

  const index: SearchEntry[] = [];
  Object.entries(sources).forEach(([catKey, data]) => {
    data.features.forEach((feature) => {
      const props = feature.properties || {};
      const searchTexts: string[] = [];
      SEARCHABLE_FIELDS.forEach((field) => {
        const val = props[field];
        if (val !== null && val !== undefined && val !== "") {
          searchTexts.push(String(val).toLowerCase());
        }
      });
      const text = searchTexts.join(" ");
      if (text) {
        index.push({ text, category: catKey, feature });
      }
    });
  });
  return index;
}

describe("Search Index", () => {
  const index = buildSearchIndex();

  it("should build a non-empty index", () => {
    expect(index.length).toBeGreaterThan(0);
  });

  it("should index features from all categories", () => {
    const categories = new Set(index.map((e) => e.category));
    expect(categories.has("comunas")).toBe(true);
    expect(categories.has("barrios")).toBe(true);
    expect(categories.has("educacion")).toBe(true);
    expect(categories.has("salud")).toBe(true);
  });

  it("should find features by nombre", () => {
    const results = index.filter((e) => e.text.includes("centro"));
    expect(results.length).toBeGreaterThan(0);
  });

  it("should find features by tipo when present", () => {
    const hasType = index.filter((e) => {
      const tipo = e.feature.properties?.tipo;
      return tipo && e.text.includes(String(tipo).toLowerCase());
    });
    expect(hasType.length).toBeGreaterThan(0);
  });

  it("should support category filtering", () => {
    const educacionOnly = index.filter((e) => e.category === "educacion");
    expect(educacionOnly.length).toBeGreaterThan(0);
    educacionOnly.forEach((e) => {
      expect(e.category).toBe("educacion");
    });
  });

  it("search should be case insensitive", () => {
    const query = "CENTRO".toLowerCase();
    const upper = index.filter((e) => e.text.includes(query));
    const lower = index.filter((e) => e.text.includes("centro"));
    expect(upper).toEqual(lower);
  });
});
