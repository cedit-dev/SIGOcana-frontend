import { describe, it, expect } from "vitest";
import { GEOJSON_MAP, POINT_LAYERS, PROP_LABELS, ESTRATO_COLORS, USO_COLORS } from "@/components/gis/map/constants";

describe("Map Constants", () => {
  describe("GEOJSON_MAP", () => {
    it("should contain all expected layer IDs", () => {
      const expectedIds = ["comunas", "barrios", "educacion", "salud", "gobierno", "hidrografia", "uso_suelo", "estratificacion", "proyectos", "vias"];
      expectedIds.forEach((id) => {
        expect(GEOJSON_MAP).toHaveProperty(id);
      });
    });

    it("each entry should be a valid FeatureCollection", () => {
      Object.values(GEOJSON_MAP).forEach((fc) => {
        expect(fc.type).toBe("FeatureCollection");
        expect(Array.isArray(fc.features)).toBe(true);
        expect(fc.features.length).toBeGreaterThan(0);
      });
    });
  });

  describe("POINT_LAYERS", () => {
    it("should contain exactly the point-based layers", () => {
      expect(POINT_LAYERS.has("educacion")).toBe(true);
      expect(POINT_LAYERS.has("salud")).toBe(true);
      expect(POINT_LAYERS.has("gobierno")).toBe(true);
      expect(POINT_LAYERS.has("proyectos")).toBe(true);
      expect(POINT_LAYERS.has("comunas")).toBe(false);
      expect(POINT_LAYERS.has("barrios")).toBe(false);
    });
  });

  describe("PROP_LABELS", () => {
    it("should map common property keys to Spanish labels", () => {
      expect(PROP_LABELS["tipo"]).toBe("Tipo");
      expect(PROP_LABELS["poblacion"]).toBe("Población");
      expect(PROP_LABELS["estrato"]).toBe("Estrato");
      expect(PROP_LABELS["presupuesto"]).toBe("Presupuesto");
    });
  });

  describe("ESTRATO_COLORS", () => {
    it("should define colors for estratos 1-6", () => {
      for (let i = 1; i <= 6; i++) {
        expect(ESTRATO_COLORS[i]).toBeDefined();
        expect(ESTRATO_COLORS[i]).toMatch(/^#[0-9a-f]{6}$/i);
      }
    });
  });

  describe("USO_COLORS", () => {
    it("should define colors for land use categories", () => {
      expect(USO_COLORS["Urbano"]).toBeDefined();
      expect(USO_COLORS["Agrícola"]).toBeDefined();
      expect(USO_COLORS["Protección Ambiental"]).toBeDefined();
    });
  });
});
