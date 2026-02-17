const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || 'http://localhost:8080';

export interface Device {
    mac: string;
    ip: string;
    last_seen: number;  // Unix timestamp in seconds
    is_online: boolean;
    identifier?: string;
    name?: string; // Added name field
    team?: string;
    points: number;
    first_seen: number; // Unix timestamp in seconds
}

export interface GameState {
    teams: Record<string, string[]>;
    points: Record<string, number>;
    winners?: string;
    debounce_ms: number;
    timer_end?: number;
    timer_paused?: number;
    game_mode?: string;
    friendly_fire?: boolean;
    shot_delay_ms?: number;
}

export interface DashboardData {
    devices: Device[];
    game: GameState;
}

// Device API Service with better error handling
export const deviceService = {
    // Get all devices with timeout and retry
    async getDevices(): Promise<DashboardData> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased timeout

            const response = await fetch(`${API_URL}/api/devices`, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'omit',
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Validate and normalize the response
            const devices: Device[] = Array.isArray(data.devices) ? data.devices.map((device: any) => ({
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

            const game: GameState = data.game || {
                teams: {},
                points: {},
                winners: undefined,
                debounce_ms: 1000,
                timer_end: 0,
                timer_paused: 0,
                game_mode: 'team',
                shot_delay_ms: 100
            };

            return { devices, game };
        } catch (error: any) {
            console.error('Failed to fetch devices:', error);
            if (error.name === 'AbortError') {
                throw new Error('Connection timeout - server not responding');
            }
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Cannot connect to server. Make sure it is running.');
            }
            throw new Error(`Network error: ${error.message}`);
        }
    },

    // Assign identifier
    async assignIdentifier(mac: string, identifier: string): Promise<boolean> {
        try {
            const endpoint = `${API_URL}/api/assign/${encodeURIComponent(mac)}/${encodeURIComponent(identifier)}`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                return result.success !== false;
            }
            return false;
        } catch (error) {
            console.error('Failed to assign identifier:', error);
            return false;
        }
    },

    // Assign team
    async assignTeam(mac: string, team: string): Promise<boolean> {
        try {
            const endpoint = `${API_URL}/api/team/${encodeURIComponent(mac)}/${encodeURIComponent(team)}`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                return result.success !== false;
            }
            return false;
        } catch (error) {
            console.error('Failed to assign team:', error);
            return false;
        }
    },

    // Clear device
    async clearDevice(mac: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/api/remove/${encodeURIComponent(mac)}`, {
                method: 'DELETE',
            });
            return response.ok;
        } catch (error) {
            console.error('Failed to clear device:', error);
            return false;
        }
    },

    // Delete device (alias for clear)
    async deleteDevice(mac: string): Promise<boolean> {
        return this.clearDevice(mac);
    },

    // Add point for a device
    async addPoint(mac: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/api/point/${encodeURIComponent(mac)}`, {
                method: 'POST',
            });
            return response.ok;
        } catch (error) {
            console.error('Failed to add point:', error);
            return false;
        }
    },

    // Subtract point for a device
    async subtractPoint(mac: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/api/point/subtract/${encodeURIComponent(mac)}`, {
                method: 'POST',
            });
            return response.ok;
        } catch (error) {
            console.error('Failed to subtract point:', error);
            return false;
        }
    },

    // Restart device
    async restartDevice(mac: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/api/restart/${encodeURIComponent(mac)}`, {
                method: 'POST',
            });
            return response.ok;
        } catch (error) {
            console.error('Failed to restart device:', error);
            return false;
        }
    },

    // Reset WiFi
    async resetWifi(mac: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/api/reset_wifi/${encodeURIComponent(mac)}`, {
                method: 'POST',
            });
            return response.ok;
        } catch (error) {
            console.error('Failed to reset WiFi:', error);
            return false;
        }
    },

    // Reset game (all devices)
    async resetGame(): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/api/reset_game`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                return result.success !== false;
            }
            return false;
        } catch (error) {
            console.error('Failed to reset game:', error);
            return false;
        }
    },

    // Reset points (all devices)
    async resetPoints(): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/api/reset_points`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                return result.success !== false;
            }
            return false;
        } catch (error) {
            console.error('Failed to reset points:', error);
            return false;
        }
    },

    // Update debounce time
    async updateDebounce(ms: number): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/api/config/debounce`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ debounce_ms: ms }),
            });
            return response.ok;
        } catch (error) {
            console.error('Failed to update debounce:', error);
            return false;
        }
    },

    // Update timer
    async updateTimer(action: string, value: number): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/api/game/timer/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action, value }),
            });
            return response.ok;
        } catch (error) {
            console.error('Failed to update timer:', error);
            return false;
        }
    },

    // Update game mode
    async updateGameMode(mode: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/api/game/mode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mode }),
            });
            return response.ok;
        } catch (error) {
            console.error('Failed to update game mode:', error);
            return false;
        }
    },

    // Update name
    async updateName(mac: string, name: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/api/device/name`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mac, name }),
            });
            return response.ok;
        } catch (error) {
            console.error('Failed to update name:', error);
            return false;
        }
    },

    // Update friendly fire
    async updateFriendlyFire(enabled: boolean): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/api/game/friendly_fire`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ enabled }),
            });
            return response.ok;
        } catch (error) {
            console.error('Failed to update friendly fire:', error);
            return false;
        }
    },

    // Update shot delay
    async updateShotDelay(ms: number): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/api/config/shot_delay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value: ms }),
            });
            return response.ok;
        } catch (error) {
            console.error('Failed to update shot delay:', error);
            return false;
        }
    },
};