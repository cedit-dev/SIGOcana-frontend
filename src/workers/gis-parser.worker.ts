import { kml } from "@tmcw/togeojson";
import { DOMParser } from "@xmldom/xmldom";

/**
 * Web Worker for parsing heavy geographic files (KML/GeoJSON)
 * without blocking the main UI thread.
 */
self.onmessage = async (event: MessageEvent) => {
  const { fileContent, fileName, fileType } = event.data;

  try {
    let geojson: any = null;

    if (fileType === "kml" || fileName.endsWith(".kml")) {
      // Parse KML string using xmldom (Worker compatible)
      const parser = new DOMParser();
      const xml = parser.parseFromString(fileContent, "text/xml");
      
      // Convert KML to GeoJSON using togeojson
      geojson = kml(xml);
    } else if (fileType === "json" || fileType === "geojson" || fileName.endsWith(".geojson") || fileName.endsWith(".json")) {
      // It's already GeoJSON, just parse the string
      geojson = JSON.parse(fileContent);
    }

    // Return the clean GeoJSON to the main thread
    self.postMessage({ 
      success: true, 
      geojson,
      fileName 
    });
  } catch (error: any) {
    self.postMessage({ 
      success: false, 
      error: error.message || "Failed to parse file" 
    });
  }
};
