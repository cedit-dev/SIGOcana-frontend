import { LayerConfig, LAYER_CATEGORIES, LAYERS_CONFIG } from "@/data/ocana-geodata";

export interface CategoryConfig {
  id: string;
  name: string;
  icon: string;
}

export interface AppManifest {
  categories: CategoryConfig[];
  layers: LayerConfig[];
}

/**
 * Service to fetch the application configuration (Manifest).
 * This acts as the bridge between static mock data and the future Backend API.
 */
export const manifestService = {
  /**
   * Simulates fetching the manifest from an API.
   * In the future, this will be a fetch('https://api.sigocana.gov.co/manifest')
   */
  async getManifest(): Promise<AppManifest> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      categories: LAYER_CATEGORIES,
      layers: LAYERS_CONFIG,
    };
  }
};
