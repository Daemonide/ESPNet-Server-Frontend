"use client";

import { useState, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  RefreshCw,
  Users,
  Globe,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Tag,
  Shield,
  Edit2,
  X,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDeviceContext } from "@/components/providers/DeviceContext";
import { PlayerTooltip } from "@/components/ui/player-tooltip";

const NATO: Record<string, string> = {
  A: "Alpha", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot", G: "Golf",
  H: "Hotel", I: "India", J: "Juliett", K: "Kilo", L: "Lima", M: "Mike", N: "November",
  O: "Oscar", P: "Papa", Q: "Quebec", R: "Romeo", S: "Sierra", T: "Tango", U: "Uniform",
  V: "Victor", W: "Whiskey", X: "X-ray", Y: "Yankee", Z: "Zulu"
};

interface EditState {
  identifier: string;
  team: string;
  originalIdentifier?: string;
  originalTeam?: string;
  name: string;
  originalName?: string;
}



// Memoized Row Component
const DeviceRow = memo(({
  device,
  isEditing,
  editState,
  now,
  onStartEdit,
  onCancelEdit,
  onSave,
  onEditChange,
  onConfirmAction
}: {
  device: any,
  isEditing: boolean,
  editState: EditState | undefined,
  now: number,
  onStartEdit: (mac: string, device: any) => void,
  onCancelEdit: (mac: string) => void,
  onSave: (mac: string) => void,
  onEditChange: (mac: string, field: 'identifier' | 'team' | 'name', value: string) => void,
  onConfirmAction: (action: 'clear' | 'delete', mac: string, name: string) => void
}) => {

  const getStatusColor = () => {
    const lastSeen = device.last_seen || 0;
    const diff = Math.max(0, now - lastSeen);

    if (diff >= 30) return "bg-red-100 text-red-800 border-red-200";
    if (diff >= 10) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getStatusText = () => {
    const lastSeen = device.last_seen || 0;
    const diff = Math.max(0, now - lastSeen);

    if (diff >= 30) return "OFFLINE";
    if (diff >= 5) return "LATE";
    return "ONLINE";
  };

  const getLastSeenText = () => {
    const lastSeen = device.last_seen || 0;
    const diff = Math.max(0, now - lastSeen);

    if (lastSeen === 0) return "Never";
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className={
              device.team === "red" ? "bg-red-500/20 text-red-600" :
                device.team === "blue" ? "bg-blue-500/20 text-blue-600" :
                  "bg-muted"
            }>
              {device.identifier ? device.identifier[0] : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm font-mono bg-muted/40 px-2 py-1 rounded border border-border/50 text-foreground">
            {device.mac}
          </div>
        </div>
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            placeholder="Name"
            className="h-8 w-40"
            value={editState?.name || ""}
            onChange={(e) => onEditChange(device.mac, 'name', e.target.value)}
          />
        ) : (
          <div className="font-medium">
            {device.name || <span className="text-muted-foreground italic">No Name</span>}
          </div>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={editState?.identifier || ""}
            onValueChange={(value) => onEditChange(device.mac, 'identifier', value)}
          >
            <SelectTrigger className="w-40 h-8">
              <SelectValue placeholder="Identifier" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {Object.entries(NATO).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {key} - {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="font-medium">
            {device.identifier ? (
              <PlayerTooltip name={device.name}>
                <span className="cursor-help">{NATO[device.identifier] || device.identifier}</span>
              </PlayerTooltip>
            ) : (
              <span className="text-muted-foreground italic">No ID</span>
            )}
          </div>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={editState?.team || "none"}
            onValueChange={(value) => onEditChange(device.mac, 'team', value)}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Team</SelectItem>
              <SelectItem value="red">Red Team</SelectItem>
              <SelectItem value="blue">Blue Team</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div>
            {device.team ? (
              <Badge variant="outline" className={
                device.team === "red"
                  ? "bg-red-100 text-red-800 border-red-200"
                  : "bg-blue-100 text-blue-800 border-blue-200"
              }>
                {device.team.toUpperCase()}
              </Badge>
            ) : (
              <span className="text-muted-foreground italic">Not assigned</span>
            )}
          </div>
        )}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={getStatusColor()}>
          {getStatusText()}
        </Badge>
        <div className="text-xs text-muted-foreground mt-1">
          {getLastSeenText()}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Globe className="h-3 w-3" />
          <span className="font-mono text-sm">{device.ip}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? (
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCancelEdit(device.mac)}
            >
              <X className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              onClick={() => onSave(device.mac)}
            >
              <Save className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStartEdit(device.mac, device)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onConfirmAction('clear', device.mac, device.identifier ? NATO[device.identifier] : device.mac)}
            >
              Clear
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onConfirmAction('delete', device.mac, device.identifier ? NATO[device.identifier] : device.mac)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow >
  );

}, (prev, next) => {
  if (prev.isEditing && next.isEditing) {
    return (
      prev.editState?.identifier === next.editState?.identifier &&
      prev.editState?.team === next.editState?.team &&
      prev.editState?.name === next.editState?.name
    );
  }
  return (
    prev.device === next.device &&
    prev.isEditing === next.isEditing &&
    prev.now === next.now
  );
});

DeviceRow.displayName = "DeviceRow";

export default function RegistryPage() {
  const {
    devices,
    game,
    isLoading,
    error,
    refresh,
    assignIdentifier,
    assignTeam,
    clearDevice: clearDeviceAction,
    deleteDevice: deleteDeviceAction,
    resetGame,
    resetPoints,
    updateDebounce,
    updateGameMode,
    updateName,
    updateFriendlyFire,
    updateShotDelay
  } = useDeviceContext();

  const [debounceValue, setDebounceValue] = useState("1000");
  const [isSavingDebounce, setIsSavingDebounce] = useState(false);

  const [shotDelayValue, setShotDelayValue] = useState("100");
  const [isSavingShotDelay, setIsSavingShotDelay] = useState(false);

  const [editingDevice, setEditingDevice] = useState<string | null>(null);
  const [editStates, setEditStates] = useState<Record<string, EditState>>({});
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: "clear" | "delete";
    mac: string;
    deviceName: string;
  }>({
    open: false,
    title: "",
    message: "",
    action: "clear",
    mac: "",
    deviceName: "",
  });
  const [actionStatus, setActionStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });



  useEffect(() => {
    if (game?.debounce_ms !== undefined) {
      setDebounceValue(game.debounce_ms.toString());
    }
    if (game?.shot_delay_ms !== undefined) {
      setShotDelayValue(game.shot_delay_ms.toString());
    }
  }, [game?.debounce_ms, game?.shot_delay_ms]);

  const saveDebounceSettings = async () => {
    const ms = parseInt(debounceValue);
    if (isNaN(ms) || ms < 0) return;

    setIsSavingDebounce(true);
    try {
      const success = await updateDebounce(ms);
      if (success) {
        setActionStatus({ type: "success", message: "Settings updated successfully" });
        setTimeout(() => setActionStatus({ type: null, message: "" }), 3000);
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (error) {
      setActionStatus({ type: "error", message: "Failed to update settings" });
      setTimeout(() => setActionStatus({ type: null, message: "" }), 3000);
    } finally {
      setIsSavingDebounce(false);
    }
  };

  const saveShotDelaySettings = async () => {
    const ms = parseInt(shotDelayValue);
    if (isNaN(ms) || ms < 0) return;

    setIsSavingShotDelay(true);
    try {
      const success = await updateShotDelay(ms);
      if (success) {
        setActionStatus({ type: "success", message: "Shot delay updated successfully" });
        setTimeout(() => setActionStatus({ type: null, message: "" }), 3000);
      } else {
        throw new Error("Failed to update shot delay");
      }
    } catch (error) {
      setActionStatus({ type: "error", message: "Failed to update shot delay" });
      setTimeout(() => setActionStatus({ type: null, message: "" }), 3000);
    } finally {
      setIsSavingShotDelay(false);
    }
  };

  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startEditing = (mac: string, device: any) => {
    setEditingDevice(mac);
    setEditStates(prev => ({
      ...prev,
      [mac]: {
        identifier: device.identifier || "",
        team: device.team || "none",
        name: device.name ?? "",
        originalIdentifier: device.identifier,
        originalTeam: device.team,
        originalName: device.name,
      },
    }));
  };

  const cancelEditing = (mac: string) => {
    setEditingDevice(null);
    setEditStates(prev => {
      const newStates = { ...prev };
      delete newStates[mac];
      return newStates;
    });
  };

  const updateEditState = (mac: string, field: 'identifier' | 'team' | 'name', value: string) => {
    setEditStates(prev => ({
      ...prev,
      [mac]: {
        ...prev[mac],
        [field]: value
      }
    }));
  };





  const saveChanges = async (mac: string) => {
    const editState = editStates[mac];
    if (!editState) return;

    try {
      let success = true;

      if (editState.identifier !== editState.originalIdentifier) {
        const identifier = editState.identifier.trim().toUpperCase() || "";
        const res = await assignIdentifier(mac, identifier);
        if (!res) success = false;
      }

      if (editState.team !== editState.originalTeam) {
        const team = editState.team === "none" ? "" : editState.team;
        const res = await assignTeam(mac, team);
        if (!res) success = false;
      }

      if (editState.name !== editState.originalName) {
        const name = editState.name.trim();
        const res = await updateName(mac, name);
        if (!res) success = false;
      }

      if (success) {
        setActionStatus({
          type: "success",
          message: "Device updated successfully",
        });
        setTimeout(() => {
          setActionStatus({ type: null, message: "" });
          cancelEditing(mac);
        }, 1000);
      } else {
        throw new Error("Failed to save changes");
      }
    } catch (error) {
      setActionStatus({
        type: "error",
        message: "Failed to save changes",
      });
      setTimeout(() => setActionStatus({ type: null, message: "" }), 3000);
    }
  };

  const handleConfirmAction = (action: 'clear' | 'delete', mac: string, name: string) => {
    setConfirmDialog({
      open: true,
      title: action === 'clear' ? "Clear Device" : "Delete Device",
      message: action === 'clear'
        ? `Clear identifier and team for ${name}?`
        : `Permanently remove ${name}?`,
      action: action,
      mac: mac,
      deviceName: name,
    });
  };

  const executeConfirmAction = async () => {
    try {
      const { action, mac, deviceName } = confirmDialog;
      let success = false;

      if (action === "clear") {
        success = await clearDeviceAction(mac);
      } else {
        success = await deleteDeviceAction(mac);
      }

      if (success) {
        setActionStatus({
          type: "success",
          message: `${deviceName} ${action === 'clear' ? 'cleared' : 'deleted'} successfully`,
        });
      } else {
        throw new Error(`Failed to ${action} device`);
      }
    } catch (error) {
      setActionStatus({
        type: "error",
        message: `Failed to ${confirmDialog.action} device`,
      });
    } finally {
      setTimeout(() => setActionStatus({ type: null, message: "" }), 3000);
      setConfirmDialog(prev => ({ ...prev, open: false }));
    }
  };

  const sortedDevices = [...devices].sort((a, b) => {
    const aId = a.identifier || "";
    const bId = b.identifier || "";
    if (aId && !bId) return -1;
    if (!aId && bId) return 1;
    return aId.localeCompare(bId) || a.mac.localeCompare(b.mac);
  });

  if (isLoading && devices.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Registry</h1>
          <p className="text-muted-foreground">
            Assign identifiers and teams to connected devices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => refresh()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {actionStatus.type && (
        <Alert variant={actionStatus.type === "success" ? "default" : "destructive"}>
          {actionStatus.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <AlertTitle>{actionStatus.type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{actionStatus.message}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" className="ml-4" onClick={() => refresh()}>Retry</Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.length}</div>
            <p className="text-xs text-muted-foreground">Registered devices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned IDs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.filter(d => d.identifier).length}</div>
            <p className="text-xs text-muted-foreground">With identifiers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Red</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{devices.filter(d => d.team === "red").length}</div>
            <p className="text-xs text-muted-foreground">Red team members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Blue</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{devices.filter(d => d.team === "blue").length}</div>
            <p className="text-xs text-muted-foreground">Blue team members</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Game Settings</CardTitle>
          <CardDescription>Configure global game parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="debounce" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Debounce Time (ms)
              </label>
              <Input
                id="debounce"
                type="number"
                value={debounceValue}
                onChange={(e) => setDebounceValue(e.target.value)}
                placeholder="1000"
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Minimum time between points for a single player.
              </p>
            </div>
            <Button
              onClick={saveDebounceSettings}
              disabled={isSavingDebounce || parseInt(debounceValue) < 0}
            >
              {isSavingDebounce ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Update Settings
            </Button>
          </div>

          <div className="flex items-end gap-4 mt-6">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="shotDelay" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Shot Delay (ms)
              </label>
              <Input
                id="shotDelay"
                type="number"
                value={shotDelayValue}
                onChange={(e) => setShotDelayValue(e.target.value)}
                placeholder="100"
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Minimum time between shots (Trigger Debounce).
              </p>
            </div>
            <Button
              onClick={saveShotDelaySettings}
              disabled={isSavingShotDelay || parseInt(shotDelayValue) < 0}
            >
              {isSavingShotDelay ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Update Delay
            </Button>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
            <label className="text-sm font-medium leading-none">
              Game Mode
            </label>
            <Select
              value={game?.game_mode || 'team'}
              onValueChange={(val) => updateGameMode(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Game Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team">Team Battle (Red vs Blue)</SelectItem>
                <SelectItem value="ffa">Solo Operative (Free For All)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[0.8rem] text-muted-foreground">
              Switch between team-based scoring or individual leaderboard.
            </p>
          </div>

          {game.game_mode === 'team' && (
            <div className="flex items-center space-x-2 mt-4">
              <Switch
                id="friendly-fire"
                checked={game.friendly_fire || false}
                onCheckedChange={(checked) => updateFriendlyFire(checked)}
              />
              <Label htmlFor="friendly-fire">Friendly Fire</Label>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device Configuration</CardTitle>
          <CardDescription>
            {devices.length === 0 ? "No devices connected" : "Click Edit to modify device identifier and team assignment"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Devices Found</h3>
              <p className="text-muted-foreground mt-2">Connect ESP32 devices to the network to see them here.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Identifier</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedDevices.map((device) => (
                    <DeviceRow
                      key={device.mac}
                      device={device}
                      isEditing={editingDevice === device.mac}
                      editState={editStates[device.mac]}
                      now={now}
                      onStartEdit={startEditing}
                      onCancelEdit={cancelEditing}
                      onSave={saveChanges}
                      onEditChange={updateEditState}
                      onConfirmAction={handleConfirmAction}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
          <CardDescription>Perform actions on all devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const success = await resetGame();
                  if (success) {
                    setActionStatus({ type: "success", message: "Game reset successfully" });
                    setTimeout(() => setActionStatus({ type: null, message: "" }), 1000);
                  }
                } catch (error) {
                  setActionStatus({ type: "error", message: "Failed to reset game" });
                }
              }}
            >
              Reset All Teams
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const success = await resetPoints();
                  if (success) {
                    setActionStatus({ type: "success", message: "All points reset" });
                    setTimeout(() => setActionStatus({ type: null, message: "" }), 1000);
                  }
                } catch (error) {
                  setActionStatus({ type: "error", message: "Failed to reset points" });
                }
              }}
            >
              Reset All Points
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.message}</DialogDescription>
          </DialogHeader>
          {confirmDialog.action === "delete" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>This will permanently remove the device from the system.</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}>Cancel</Button>
            <Button variant={confirmDialog.action === "delete" ? "destructive" : "default"} onClick={executeConfirmAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="p-4">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-24" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}