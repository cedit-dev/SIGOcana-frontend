import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface ParserResult {
  success: boolean;
  geojson?: GeoJSON.FeatureCollection;
  fileName?: string;
  error?: string;
}

/**
 * Hook to interact with the GIS Parser Web Worker.
 * Offloads heavy parsing tasks to a background thread.
 */
export const useGisParser = () => {
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  const parseFile = useCallback((file: File): Promise<ParserResult> => {
    return new Promise((resolve) => {
      setIsParsing(true);

      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        // Initialize the worker
        const worker = new Worker(
          new URL("../workers/gis-parser.worker.ts", import.meta.url),
          { type: "module" }
        );

        // Safety timeout (30 seconds)
        const timeout = setTimeout(() => {
          worker.terminate();
          setIsParsing(false);
          resolve({ success: false, error: "Tiempo de espera agotado (Timeout)" });
        }, 30000);

        worker.onmessage = (event: MessageEvent) => {
          clearTimeout(timeout);
          const result: ParserResult = event.data;
          setIsParsing(false);
          worker.terminate(); 
          resolve(result);
        };

        worker.onerror = (err) => {
          clearTimeout(timeout);
          console.error("Worker error:", err);
          setIsParsing(false);
          worker.terminate();
          resolve({ success: false, error: "Error crítico en el procesador" });
        };

        // Send data to worker
        worker.postMessage({
          fileContent: content,
          fileName: file.name,
          fileType: file.name.split('.').pop()?.toLowerCase()
        });
      };

      reader.onerror = () => {
        setIsParsing(false);
        resolve({ success: false, error: "Failed to read file" });
      };

      reader.readAsText(file);
    });
  }, []);

  return { parseFile, isParsing };
};
