"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff,
  RefreshCw,
  Trash2,
  Users,
  Activity,
  Clock,
  AlertTriangle,
  Cpu,
  Globe,
  Power,
  AlertCircle,
  Shield,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeviceContext } from "@/components/providers/DeviceContext";
import { PlayerTooltip } from "@/components/ui/player-tooltip";

const NATO: Record<string, string> = {
  A: "Alpha", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot", G: "Golf",
  H: "Hotel", I: "India", J: "Juliett", K: "Kilo", L: "Lima", M: "Mike", N: "November",
  O: "Oscar", P: "Papa", Q: "Quebec", R: "Romeo", S: "Sierra", T: "Tango", U: "Uniform",
  V: "Victor", W: "Whiskey", X: "X-ray", Y: "Yankee", Z: "Zulu"
};

export default function Home() {
  const {
    devices,
    game,
    isLoading,
    error,
    refresh,
    restartDevice,
    resetWifi,
    deleteDevice
  } = useDeviceContext();

  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [showOffline, setShowOffline] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    online: true,
    late: true,
    offline: true,
  });
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: "restart" | "reset_wifi" | "delete";
    mac: string;
    deviceName: string;
  }>({
    open: false,
    title: "",
    message: "",
    action: "restart",
    mac: "",
    deviceName: "",
  });

  // Update 'now' every second for UI timers
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getDevicesByStatus = () => {
    const online: any[] = [];
    const late: any[] = [];
    const offline: any[] = [];

    // Sort devices first
    const sortedDevices = [...devices].sort((a, b) => {
      const aId = a.identifier || "";
      const bId = b.identifier || "";
      if (aId && !bId) return -1;
      if (!aId && bId) return 1;
      return aId.localeCompare(bId) || a.mac.localeCompare(b.mac);
    });

    sortedDevices.forEach(device => {
      const lastSeen = device.last_seen || 0;
      const diff = Math.max(0, now - lastSeen);

      if (diff >= 20) { // Offline if > 20s
        offline.push(device);
      } else if (diff >= 10) {
        late.push(device);
      } else {
        online.push(device);
      }
    });

    return { online, late, offline };
  };

  const formatTimeDiff = (lastSeen: number) => {
    const diff = Math.max(0, now - lastSeen);
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAction = async (mac: string, action: "restart" | "reset_wifi" | "delete") => {
    let success = false;

    switch (action) {
      case "restart":
        success = await restartDevice(mac);
        break;
      case "reset_wifi":
        success = await resetWifi(mac);
        break;
      case "delete":
        success = await deleteDevice(mac);
        break;
    }

    return success;
  };

  if (isLoading && devices.length === 0) {
    return <LoadingSkeleton />;
  }

  // Error state handled by context, but we can show banner if no data
  if (error && devices.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="mx-auto w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Connection Error</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {error}
        </p>
        <Button onClick={() => refresh()} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry Connection
        </Button>
      </div>
    );
  }

  const { online, late, offline } = getDevicesByStatus();

  if (devices.length === 0 && !error) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <Activity className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Awaiting Connection</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          No devices discovered. Ensure ESP32 units are powered on and connected to the network.
        </p>
        <Button onClick={() => refresh()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Check Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Banner */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Issue</AlertTitle>
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" className="ml-4" onClick={() => refresh()}>
              <RefreshCw className="mr-2 h-3 w-3" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Network Statistics
          </CardTitle>
          <CardDescription>Real-time device status overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Devices"
              value={devices.length.toString()}
              icon={<Cpu className="h-4 w-4" />}
              description="All registered devices"
            />
            <StatCard
              title="Online"
              value={online.length.toString()}
              icon={<Wifi className="h-4 w-4" />}
              description="Active connections"
              variant="success"
            />
            <StatCard
              title="Late"
              value={late.length.toString()}
              icon={<Clock className="h-4 w-4" />}
              description="No heartbeat for 10s"
              variant="warning"
            />
            <StatCard
              title="Offline"
              value={offline.length.toString()}
              icon={<WifiOff className="h-4 w-4" />}
              description="No heartbeat for 20s+"
              variant="destructive"
            />
          </div>
        </CardContent>
      </Card>

      {/* Game State Alert */}
      {game?.winners && (
        <Alert className="border-green-500/20 bg-green-500/5">
          <Shield className="h-4 w-4" />
          <AlertTitle className="text-green-600">Victory!</AlertTitle>
          <AlertDescription>
            Team {game.winners.toUpperCase()} wins! All opposing players eliminated.
          </AlertDescription>
        </Alert>
      )}

      {/* Online Devices */}
      {online.length > 0 && (
        <DeviceSection
          title="Active Devices"
          devices={online}
          now={now}
          variant="online"
          expanded={expandedSections.online}
          onToggle={() => toggleSection("online")}
          onAction={(device, action) => {
            setConfirmDialog({
              open: true,
              title: action === "restart" ? "Restart Device" :
                action === "reset_wifi" ? "Reset WiFi" : "Delete Device",
              message: action === "restart" ?
                `Restart ${device.identifier ? NATO[device.identifier] : device.mac}?` :
                action === "reset_wifi" ?
                  `Reset WiFi for ${device.identifier ? NATO[device.identifier] : device.mac}?` :
                  `Permanently remove ${device.identifier ? NATO[device.identifier] : device.mac}?`,
              action,
              mac: device.mac,
              deviceName: device.identifier ? NATO[device.identifier] : device.mac,
            });
          }}
          formatTimeDiff={formatTimeDiff}
        />
      )}

      {/* Late Devices */}
      {late.length > 0 && (
        <DeviceSection
          title="Late Responses"
          devices={late}
          now={now}
          variant="late"
          expanded={expandedSections.late}
          onToggle={() => toggleSection("late")}
          onAction={(device, action) => {
            setConfirmDialog({
              open: true,
              title: "Device Unavailable",
              message: "Device is currently not responding. Some actions may not work.",
              action,
              mac: device.mac,
              deviceName: device.identifier ? NATO[device.identifier] : device.mac,
            });
          }}
          formatTimeDiff={formatTimeDiff}
        />
      )}

      {/* Offline Devices */}
      {offline.length > 0 && (
        <Card className="border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <CardTitle className="text-red-700 dark:text-red-400">Offline Devices</CardTitle>
                <Badge variant="outline" className="ml-2 bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
                  {offline.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 mr-4">
                  <Switch
                    checked={showOffline}
                    onCheckedChange={setShowOffline}
                    id="show-offline"
                  />
                  <Label htmlFor="show-offline" className="text-sm text-muted-foreground">
                    Show
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("offline")}
                  className="h-8 w-8 p-0"
                >
                  {expandedSections.offline ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <CardDescription className="text-red-600 dark:text-red-300">
              No heartbeat received for 20+ seconds
            </CardDescription>
          </CardHeader>
          {showOffline && expandedSections.offline && (
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {offline.map((device) => (
                  <DeviceCard
                    key={device.mac}
                    device={device}
                    now={now}
                    variant="offline"
                    onAction={(action) => {
                      setConfirmDialog({
                        open: true,
                        title: action === "delete" ? "Delete Device" : "Device Offline",
                        message: action === "delete" ?
                          `Permanently remove ${device.identifier ? NATO[device.identifier] : device.mac}?` :
                          "Device is offline. Some actions may not work.",
                        action,
                        mac: device.mac,
                        deviceName: device.identifier ? NATO[device.identifier] : device.mac,
                      });
                    }}
                    formatTimeDiff={formatTimeDiff}
                  />
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Team Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Status
          </CardTitle>
          <CardDescription>Current game team assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(game?.teams || {}).map(([team, members]) => (
              <TeamCard
                key={team}
                team={team}
                members={members as string[]}
                devices={devices}
                now={now}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmDialog.action === "restart" && <RefreshCw className="h-5 w-5" />}
              {confirmDialog.action === "reset_wifi" && <Power className="h-5 w-5" />}
              {confirmDialog.action === "delete" && <Trash2 className="h-5 w-5" />}
              {confirmDialog.title}
            </DialogTitle>
            <DialogDescription>{confirmDialog.message}</DialogDescription>
          </DialogHeader>
          {confirmDialog.action === "delete" && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This will permanently remove the device from the system.
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.action === "delete" ? "destructive" : "default"}
              onClick={async () => {
                const success = await handleAction(confirmDialog.mac, confirmDialog.action);
                if (success) {
                  setConfirmDialog(prev => ({ ...prev, open: false }));
                }
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Components
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="border shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {[...Array(3)].map((_, i) => (
        <Card key={i} className="border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-8 rounded-full" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, j) => (
                <Card key={j} className="overflow-hidden">
                  <Skeleton className="h-1 w-full" />
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <div className="space-y-2 mb-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-20 rounded-md" />
                      <Skeleton className="h-9 w-20 rounded-md" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
  variant = "default",
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  variant?: "default" | "success" | "warning" | "destructive";
}) {
  const variantClasses = {
    default: "text-foreground",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    destructive: "text-red-600 dark:text-red-400",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={variantClasses[variant]}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function DeviceSection({
  title,
  devices,
  now,
  variant,
  expanded,
  onToggle,
  onAction,
  formatTimeDiff,
}: {
  title: string;
  devices: any[];
  now: number;
  variant: "online" | "late";
  expanded: boolean;
  onToggle: () => void;
  onAction: (device: any, action: "restart" | "reset_wifi" | "delete") => void;
  formatTimeDiff: (lastSeen: number) => string;
}) {
  const colors = {
    online: {
      bg: "border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-950/10",
      text: "text-green-700 dark:text-green-400",
      badge: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
      dot: "bg-green-500",
      desc: "text-green-600 dark:text-green-300",
    },
    late: {
      bg: "border-yellow-200 dark:border-yellow-900/30 bg-yellow-50/50 dark:bg-yellow-950/10",
      text: "text-yellow-700 dark:text-yellow-400",
      badge: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
      dot: "bg-yellow-500",
      desc: "text-yellow-600 dark:text-yellow-300",
    },
  };

  const color = colors[variant];

  return (
    <Card className={color.bg}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${color.dot} ${variant === "online" ? "animate-pulse" : ""}`} />
            <CardTitle className={color.text}>{title}</CardTitle>
            <Badge variant="outline" className={`ml-2 ${color.badge}`}>
              {devices.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription className={color.desc}>
          {variant === "online"
            ? "Connected and responding normally"
            : "No heartbeat received for 10-20 seconds"}
        </CardDescription>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <DeviceCard
                key={device.mac}
                device={device}
                now={now}
                variant={variant}
                onAction={(action) => onAction(device, action)}
                formatTimeDiff={formatTimeDiff}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function DeviceCard({
  device,
  now,
  variant,
  onAction,
  formatTimeDiff,
}: {
  device: any;
  now: number;
  variant: "online" | "late" | "offline";
  onAction: (action: "restart" | "reset_wifi" | "delete") => void;
  formatTimeDiff: (lastSeen: number) => string;
}) {
  const lastSeen = device.last_seen || 0;
  const diff = Math.max(0, now - lastSeen);

  const statusColors = {
    online: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    late: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
    offline: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  };

  const teamColors = {
    red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  };

  return (
    <Card className="overflow-hidden border hover:shadow-md transition-shadow">
      <div className={`h-1 ${variant === "online" ? "bg-green-500" : variant === "late" ? "bg-yellow-500" : "bg-red-500"}`} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={
                device.team === "red" ? "bg-red-500/20 text-red-600" :
                  device.team === "blue" ? "bg-blue-500/20 text-blue-600" :
                    "bg-muted"
              }>
                {device.identifier ? device.identifier[0] : "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <PlayerTooltip name={device.name} identifier={device.identifier ? (NATO[device.identifier] || device.identifier) : undefined}>
                  <h3 className="font-semibold cursor-help">
                    {device.identifier ? `${device.identifier} - ${NATO[device.identifier] || device.identifier}` : "Unassigned"}
                  </h3>
                </PlayerTooltip>
                {device.team && (
                  <Badge variant="outline" className={`${teamColors[device.team as keyof typeof teamColors]} text-xs`}>
                    {device.team.toUpperCase()}
                  </Badge>
                )}
              </div>
              <p className="text-xs font-mono text-muted-foreground">{device.mac}</p>
            </div>
          </div>
          <Badge className={`${statusColors[variant]} text-xs`}>
            {variant.toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">IP:</span>
            </div>
            <span className="font-mono">{device.ip}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Last Seen:</span>
            </div>
            <span className="font-medium">
              {formatTimeDiff(lastSeen)}
            </span>
          </div>
          {variant === "late" && (
            <div className="mt-2">
              <Progress value={(diff - 10) * 10} className="h-1" />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.max(0, Math.floor(20 - diff))}s until offline
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {variant === "online" && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onAction("restart")}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Restart
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onAction("reset_wifi")}
              >
                <Power className="h-3 w-3 mr-1" />
                WiFi
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction("delete")}
            className={variant === "online" ? "w-auto px-3" : "flex-1"}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamCard({ team, members, devices, now }: {
  team: string;
  members: string[];
  devices: any[];
  now: number;
}) {
  const teamDevices = devices.filter(d => members.includes(d.mac));
  const onlineCount = teamDevices.filter(d => {
    const lastSeen = d.last_seen || 0;
    const diff = now - lastSeen;
    return diff < 10;
  }).length;

  const teamConfig = {
    red: {
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
    },
    blue: {
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
    },
  }[team] || {
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-100 dark:bg-gray-900/20",
    border: "border-gray-200 dark:border-gray-800",
  };

  return (
    <Card className={`${teamConfig.bg} ${teamConfig.border} border`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg ${teamConfig.color}`}>
          Team {team.toUpperCase()}
        </CardTitle>
        <CardDescription>{members.length} players</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Online</span>
            <span className="font-medium">{onlineCount}/{members.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}