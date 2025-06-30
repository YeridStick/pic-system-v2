import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ApiIntegrationConfig {
  apiUrl: string;
  arrayPath: string;
  apiFields: string[];
}

interface ApiIntegrationState {
  config: ApiIntegrationConfig;
  setConfig: (config: ApiIntegrationConfig) => void;
  clearConfig: () => void;
}

const defaultConfig: ApiIntegrationConfig = {
  apiUrl: '',
  arrayPath: '',
  apiFields: [],
};

export const useApiIntegrationStore = create<ApiIntegrationState>()(
  persist(
    (set) => ({
      config: defaultConfig,
      setConfig: (config) => set({ config }),
      clearConfig: () => set({ config: defaultConfig }),
    }),
    {
      name: 'pic-api-integration',
    }
  )
); 