import { describe, it, expect } from "vitest";
import {
  LAYERS_CONFIG,
  OCANA_CENTER,
  OCANA_ZOOM,
  comunasGeoJSON,
  barriosGeoJSON,
  educacionGeoJSON,
  saludGeoJSON,
} from "@/data/ocana-geodata";

describe("Ocaña Geodata", () => {
  describe("OCANA_CENTER", () => {
    it("should be near Ocaña, Colombia coordinates", () => {
      const [lat, lng] = OCANA_CENTER;
      expect(lat).toBeCloseTo(8.24, 1);
      expect(lng).toBeCloseTo(-73.36, 1);
    });
  });

  describe("OCANA_ZOOM", () => {
    it("should be a reasonable zoom level", () => {
      expect(OCANA_ZOOM).toBeGreaterThanOrEqual(10);
      expect(OCANA_ZOOM).toBeLessThanOrEqual(18);
    });
  });

  describe("LAYERS_CONFIG", () => {
    it("should have at least 10 layers configured", () => {
      expect(LAYERS_CONFIG.length).toBeGreaterThanOrEqual(10);
    });

    it("each layer should have required fields", () => {
      LAYERS_CONFIG.forEach((layer) => {
        expect(layer).toHaveProperty("id");
        expect(layer).toHaveProperty("name");
        expect(layer).toHaveProperty("icon");
        expect(layer).toHaveProperty("color");
        expect(layer).toHaveProperty("category");
        expect(typeof layer.visible).toBe("boolean");
        expect(typeof layer.opacity).toBe("number");
        expect(layer.opacity).toBeGreaterThanOrEqual(0);
        expect(layer.opacity).toBeLessThanOrEqual(1);
      });
    });

    it("layer IDs should be unique", () => {
      const ids = LAYERS_CONFIG.map((l) => l.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("GeoJSON Features", () => {
    it("comunas should have Polygon geometry", () => {
      comunasGeoJSON.features.forEach((f) => {
        expect(["Polygon", "MultiPolygon"]).toContain(f.geometry.type);
      });
    });

    it("barrios should have Polygon geometry", () => {
      barriosGeoJSON.features.forEach((f) => {
        expect(["Polygon", "MultiPolygon"]).toContain(f.geometry.type);
      });
    });

    it("educacion should have Point geometry", () => {
      educacionGeoJSON.features.forEach((f) => {
        expect(f.geometry.type).toBe("Point");
      });
    });

    it("salud should have Point geometry", () => {
      saludGeoJSON.features.forEach((f) => {
        expect(f.geometry.type).toBe("Point");
      });
    });

    it("features should have nombre property", () => {
      [comunasGeoJSON, barriosGeoJSON, educacionGeoJSON, saludGeoJSON].forEach((fc) => {
        fc.features.forEach((f) => {
          expect(f.properties).toHaveProperty("nombre");
          expect(typeof f.properties?.nombre).toBe("string");
        });
      });
    });
  });
});
