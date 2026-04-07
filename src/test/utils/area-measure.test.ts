import { describe, it, expect } from "vitest";

// Replicate the area calculation logic from AreaMeasureController
function calculateAreaFromCoords(coords: [number, number][]): number {
  if (coords.length < 3) return 0;

  // Simplified Shoelace formula using approximate meter conversion
  // For small areas near the equator, 1 degree lat ≈ 111320m, 1 degree lng ≈ 111320 * cos(lat)
  const toMeters = (lat: number, lng: number) => {
    const latM = lat * 111320;
    const lngM = lng * 111320 * Math.cos((lat * Math.PI) / 180);
    return { x: lngM, y: latM };
  };

  const points = coords.map(([lat, lng]) => toMeters(lat, lng));

  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area / 2);
}

function formatArea(sqm: number): string {
  if (sqm >= 10000) {
    return `${(sqm / 10000).toFixed(2)} ha`;
  }
  return `${sqm.toFixed(0)} m²`;
}

describe("Area Measurement", () => {
  describe("calculateAreaFromCoords", () => {
    it("should return 0 for less than 3 points", () => {
      expect(calculateAreaFromCoords([])).toBe(0);
      expect(calculateAreaFromCoords([[0, 0]])).toBe(0);
      expect(calculateAreaFromCoords([[0, 0], [1, 1]])).toBe(0);
    });

    it("should calculate area for a triangle", () => {
      const triangle: [number, number][] = [
        [8.24, -73.36],
        [8.25, -73.36],
        [8.24, -73.35],
      ];
      const area = calculateAreaFromCoords(triangle);
      expect(area).toBeGreaterThan(0);
      // Roughly half a km² area for these coords
      expect(area).toBeGreaterThan(10000);
    });

    it("should calculate area for a rectangle", () => {
      const rect: [number, number][] = [
        [8.24, -73.36],
        [8.25, -73.36],
        [8.25, -73.35],
        [8.24, -73.35],
      ];
      const area = calculateAreaFromCoords(rect);
      expect(area).toBeGreaterThan(0);
    });
  });

  describe("formatArea", () => {
    it("should format small areas in m²", () => {
      expect(formatArea(500)).toBe("500 m²");
      expect(formatArea(9999)).toBe("9999 m²");
    });

    it("should format large areas in hectares", () => {
      expect(formatArea(10000)).toBe("1.00 ha");
      expect(formatArea(50000)).toBe("5.00 ha");
      expect(formatArea(123456)).toBe("12.35 ha");
    });
  });
});
