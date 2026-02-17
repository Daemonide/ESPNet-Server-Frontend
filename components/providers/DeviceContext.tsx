"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { deviceService, Device, GameState, DashboardData } from '@/lib/api/device-service';

interface DeviceContextType {
  devices: Device[];
  game: GameState;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean; // WebSocket connection status
  refresh: () => Promise<void>;
  assignTeam: (mac: string, team: string) => Promise<boolean>;
  assignIdentifier: (mac: string, identifier: string) => Promise<boolean>;
  clearDevice: (mac: string) => Promise<boolean>;
  deleteDevice: (mac: string) => Promise<boolean>;
  resetGame: () => Promise<boolean>;
  resetPoints: () => Promise<boolean>;
  addPoint: (mac: string) => Promise<boolean>;
  subtractPoint: (mac: string) => Promise<boolean>;
  restartDevice: (mac: string) => Promise<boolean>;
  resetWifi: (mac: string) => Promise<boolean>;
  updateDebounce: (ms: number) => Promise<boolean>;
  updateTimer: (action: string, value: number) => Promise<boolean>;
  updateGameMode: (mode: string) => Promise<boolean>;
  updateName: (mac: string, name: string) => Promise<boolean>;
  updateFriendlyFire: (enabled: boolean) => Promise<boolean>;
  updateShotDelay: (ms: number) => Promise<boolean>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function useDeviceContext() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDeviceContext must be used within a DeviceProvider');
  }
  return context;
}

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DashboardData>({
    devices: [],
    game: { teams: {}, points: {}, debounce_ms: 1000, timer_end: 0, timer_paused: 0, game_mode: 'team' }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      const result = await deviceService.getDevices();
      setData(result);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch initial data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    // Determine WS URL (assume same host as API, but ws://)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NEXT_PUBLIC_SERVER_API_URL
      ? new URL(process.env.NEXT_PUBLIC_SERVER_API_URL).host
      : 'localhost:8080';
    const wsUrl = `${protocol}//${host}/ws`;

    console.log('Connecting to WebSocket:', wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        // Assuming the server sends the full state on update. 
        // If it sends partial updates, we'd need to merge.
        // Based on backend code: broadcastState() sends full state.
        // Calculate time offset (Server - Client)
        // We assume the message receipt time is roughly "now"
        const serverTime = Number(message.server_time);
        const clientTime = Date.now();
        const offsetMs = serverTime ? (serverTime - clientTime) : 0;
        const offsetSec = offsetMs / 1000;

        // Transform devices to match our frontend logic if needed (e.g. ensure defaults)
        const devices: Device[] = Array.isArray(message.devices) ? message.devices.map((device: any) => ({
          mac: String(device.mac || ''),
          ip: String(device.ip || ''),
          last_seen: Number(device.last_seen) || Math.floor(Date.now() / 1000) - 3600, // Default to 1 hour ago if missing
          is_online: Boolean(device.is_online),
          identifier: device.identifier || undefined,
          name: device.name || undefined,
          team: device.team || undefined,
          points: Number(device.points) || 0,
          first_seen: Number(device.first_seen) || Math.floor(Date.now() / 1000),
        })) : [];

        const game: GameState = message.game || {
          teams: {},
          points: {},
          winners: undefined,
          debounce_ms: 1000,
          timer_end: 0,
          timer_paused: 0,
          game_mode: 'team'
        };

        setData({ devices, game });
      } catch (err) {
        console.error('Failed to process WebSocket message:', err);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      wsRef.current = null;

      // Reconnect logic
      if (!reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      ws.close();
    };

    wsRef.current = ws;
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [fetchData, connectWebSocket]);

  // Actions wrappers
  const refresh = async () => {
    setIsLoading(true);
    await fetchData();
  };

  const assignTeam = async (mac: string, team: string) => {
    const success = await deviceService.assignTeam(mac, team);
    if (!success) setError("Failed to assign team");
    // WebSocket should update state, but we can force refresh if needed
    if (!isConnected) fetchData();
    return success;
  };

  const assignIdentifier = async (mac: string, identifier: string) => {
    const success = await deviceService.assignIdentifier(mac, identifier);
    if (!success) setError("Failed to assign identifier");
    if (!isConnected) fetchData();
    return success;
  };

  const clearDevice = async (mac: string) => {
    const success = await deviceService.clearDevice(mac);
    if (!success) setError("Failed to clear device");
    if (!isConnected) fetchData();
    return success;
  };

  const deleteDevice = async (mac: string) => {
    const success = await deviceService.deleteDevice(mac);
    if (!success) setError("Failed to delete device");
    if (!isConnected) fetchData();
    return success;
  };

  const resetGame = async () => {
    const success = await deviceService.resetGame();
    if (!success) setError("Failed to reset game");
    if (!isConnected) fetchData();
    return success;
  };

  const resetPoints = async () => {
    const success = await deviceService.resetPoints();
    if (!success) setError("Failed to reset points");
    if (!isConnected) fetchData();
    return success;
  };

  const addPoint = async (mac: string) => {
    const success = await deviceService.addPoint(mac);
    if (!success) setError("Failed to add point");
    if (!isConnected) fetchData();
    return success;
  };



  const subtractPoint = async (mac: string) => {
    const success = await deviceService.subtractPoint(mac);
    if (!success) setError("Failed to subtract point");
    if (!isConnected) fetchData();
    return success;
  };

  const restartDevice = async (mac: string) => {
    const success = await deviceService.restartDevice(mac);
    if (!isConnected) fetchData();
    return success;
  }

  const resetWifi = async (mac: string) => {
    const success = await deviceService.resetWifi(mac);
    if (!isConnected) fetchData();
    return success;
  }

  const updateDebounce = async (ms: number) => {
    const success = await deviceService.updateDebounce(ms);
    if (!success) setError("Failed to update debounce time");
    if (!isConnected) fetchData();
    return success;
  }

  const updateTimer = async (action: string, value: number) => {
    const success = await deviceService.updateTimer(action, value);
    if (!success) setError("Failed to update timer");
    if (!isConnected) fetchData();
    return success;
  }

  const updateGameMode = async (mode: string) => {
    const success = await deviceService.updateGameMode(mode);
    if (!success) setError("Failed to update game mode");
    if (!isConnected) fetchData();
    return success;
  }

  const updateName = async (mac: string, name: string) => {
    const success = await deviceService.updateName(mac, name);
    if (!success) setError("Failed to update name");
    if (!isConnected) fetchData();
    return success;
  }

  const value = {
    devices: data.devices,
    game: data.game,
    isLoading,
    error,
    isConnected,
    refresh,
    assignTeam,
    assignIdentifier,
    clearDevice,
    deleteDevice,
    resetGame,
    resetPoints,
    addPoint,
    subtractPoint,
    restartDevice,
    resetWifi,
    updateDebounce,
    updateTimer,
    updateGameMode,
    updateName,
    updateFriendlyFire: async (enabled: number | boolean) => {
      // Support both number (legacy/compatibility) and boolean
      const val = typeof enabled === 'boolean' ? enabled : Boolean(enabled);
      const success = await deviceService.updateFriendlyFire(val);
      if (!success) setError("Failed to update friendly fire settings");
      if (!isConnected) fetchData();
      return success;
    },
    updateShotDelay: async (ms: number) => {
      const success = await deviceService.updateShotDelay(ms);
      if (!success) setError("Failed to update shot delay");
      if (!isConnected) fetchData();
      return success;
    }
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
}
