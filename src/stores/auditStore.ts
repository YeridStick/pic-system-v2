import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuditEvent, AuditConfig } from '../types/storage';

interface AuditState {
  events: AuditEvent[];
  config: AuditConfig;
  addEvent: (event: Omit<AuditEvent, 'id' | 'timestamp'> & { id?: string; timestamp?: string }) => void;
  clearEvents: () => void;
  deleteEvent: (id: string) => void;
  setConfig: (config: Partial<AuditConfig>) => void;
}

const DEFAULT_CONFIG: AuditConfig = {
  enabled: true,
  maxEvents: 30,
  minEvents: 10,
};

export const useAuditStore = create<AuditState>()(
  persist(
    (set, get) => ({
      events: [],
      config: DEFAULT_CONFIG,
      addEvent: (event) => {
        const { enabled, maxEvents } = get().config;
        if (!enabled) return;
        const newEvent: AuditEvent = {
          ...event,
          id: event.id || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: event.timestamp || new Date().toISOString(),
        };
        set((state) => {
          let updated = [newEvent, ...state.events];
          if (updated.length > maxEvents) {
            updated = updated.slice(0, maxEvents);
          }
          return { events: updated };
        });
      },
      clearEvents: () => set({ events: [] }),
      deleteEvent: (id) => set((state) => ({ events: state.events.filter(e => e.id !== id) })),
      setConfig: (config) => set((state) => ({ config: { ...state.config, ...config } })),
    }),
    {
      name: 'pic-audit-store',
    }
  )
); 