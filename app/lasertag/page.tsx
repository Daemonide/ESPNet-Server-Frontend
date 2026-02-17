"use client";

import { useDeviceContext } from "@/components/providers/DeviceContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, Skull, Trophy, RefreshCw, Activity, Plus, Minus, Clock, Play, Square, Pause, RotateCcw } from "lucide-react";
import { PlayerTooltip } from "@/components/ui/player-tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";

const NATO: Record<string, string> = {
  A: "Alpha", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot", G: "Golf",
  H: "Hotel", I: "India", J: "Juliett", K: "Kilo", L: "Lima", M: "Mike", N: "November",
  O: "Oscar", P: "Papa", Q: "Quebec", R: "Romeo", S: "Sierra", T: "Tango", U: "Uniform",
  V: "Victor", W: "Whiskey", X: "X-ray", Y: "Yankee", Z: "Zulu"
};

export default function LaserTag() {
  const { devices, game, isLoading, error, refresh, addPoint, subtractPoint, updateTimer } = useDeviceContext();

  // Filter devices by team and sort by points (desc) then identifier
  const sortDevices = (devices: any[]) => {
    return [...devices].sort((a, b) => {
      // Primary: Points (Desc)
      if (b.points !== a.points) return b.points - a.points;

      // Secondary: Identifier
      const aId = a.identifier || "";
      const bId = b.identifier || "";
      if (aId && !bId) return -1;
      if (!aId && bId) return 1;
      return aId.localeCompare(bId) || a.mac.localeCompare(b.mac);
    });
  };

  const redTeam = sortDevices(devices.filter(d => d.team === 'red'));
  const blueTeam = sortDevices(devices.filter(d => d.team === 'blue'));
  const unassigned = sortDevices(devices.filter(d => !d.team || d.team === 'none'));

  // Calculate stats
  const redScore = redTeam.reduce((acc, d) => acc + (d.points || 0), 0);
  const blueScore = blueTeam.reduce((acc, d) => acc + (d.points || 0), 0);

  if (isLoading && devices.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laser Tag Arena</h1>
          <p className="text-muted-foreground">Live game monitor and control</p>
        </div>
        <Button onClick={() => refresh()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Scoreboard / Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Red Team Stats - Only show in Team Mode */}
        {game.game_mode !== 'ffa' && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Red Team</CardTitle>
              <Shield className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-700">{redScore}</div>
              <p className="text-xs text-red-600/80">Total Points</p>
            </CardContent>
          </Card>
        )}

        {/* Game Status */}
        <Card className="border-zinc-200 bg-zinc-50 dark:bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Match Status</CardTitle>
            <Activity className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {game.winners ? (
                <span className={game.winners === 'red' ? 'text-red-500' : 'text-blue-500'}>
                  {game.winners.toUpperCase()} WINS
                </span>
              ) : (
                "IN PROGRESS"
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {devices.length} Devices Connected
            </p>
          </CardContent>
        </Card>

        {/* Game Status & Timer */}
        <Card className="border-zinc-200 bg-zinc-50 dark:bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Match Status</CardTitle>
            <Activity className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {game.winners ? (
                <span className={game.winners === 'red' ? 'text-red-500' : game.winners === 'blue' ? 'text-blue-500' : 'text-yellow-500'}>
                  {game.winners.toUpperCase()} WINS
                </span>
              ) : (
                <GameTimer game={game} onUpdate={updateTimer} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {devices.length} Devices Connected
            </p>
          </CardContent>
        </Card>

        {/* Blue Team Stats - Only show in Team Mode */}
        {game.game_mode !== 'ffa' && (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Blue Team</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-700">{blueScore}</div>
              <p className="text-xs text-blue-600/80">Total Points</p>
            </CardContent>
          </Card>
        )}
      </div>

      {game.game_mode === 'ffa' ? (
        /* Leaderboard View */
        <Card className="border-t-4 border-t-yellow-500 dark:border-t-yellow-600">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Leaderboard</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400">
                {devices.length} Operatives
              </Badge>
            </CardTitle>
            <CardDescription>Free For All - Top Operatives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(() => {
              const sortedAll = sortDevices(devices);
              if (sortedAll.length === 0) return <p className="text-muted-foreground text-sm">No operatives connected.</p>;
              return sortedAll.map((device, index) => (
                <div key={device.mac} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${index === 0 ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700/50' :
                  index === 1 ? 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700' :
                    index === 2 ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700/50' :
                      'bg-card dark:bg-card'
                  }`}>
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-8 font-bold ${index === 0 ? 'text-yellow-600 dark:text-yellow-400' :
                      index === 1 ? 'text-slate-600 dark:text-slate-400' :
                        index === 2 ? 'text-orange-600 dark:text-orange-400' :
                          'text-muted-foreground'
                      }`}>
                      #{index + 1}
                    </div>
                    <Avatar className={`h-10 w-10 border-2 ${index === 0 ? 'border-yellow-400 dark:border-yellow-600' :
                      index === 1 ? 'border-slate-400 dark:border-slate-600' :
                        index === 2 ? 'border-orange-400 dark:border-orange-600' : 'border-transparent'
                      }`}>
                      <AvatarFallback className="bg-primary/10">
                        {device.identifier?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <PlayerTooltip name={device.name} identifier={device.identifier ? (NATO[device.identifier] || device.identifier) : undefined}>
                          <span className="font-semibold text-lg cursor-help">
                            {device.identifier ? (NATO[device.identifier] || device.identifier) : 'Operative'}
                          </span>
                        </PlayerTooltip>
                        {!device.is_online && (
                          <Badge variant="outline" className="text-xs px-1 py-0 h-5 border-yellow-200 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
                            Offline
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono flex items-center gap-2">
                        {device.mac}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold tabular-nums">
                      {device.points || 0}
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400" onClick={() => subtractPoint(device.mac)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400" onClick={() => addPoint(device.mac)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </CardContent>
        </Card>
      ) : (
        /* Team View */
        <div className="grid gap-6 md:grid-cols-2">
          {/* Red Team Roster */}
          <Card className="border-t-4 border-t-red-500">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Red Team</span>
                <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">
                  {redTeam.length} Players
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {redTeam.length === 0 && <p className="text-muted-foreground text-sm">No operatives assigned.</p>}
              {redTeam.map(device => (
                <PlayerCard
                  key={device.mac}
                  device={device}
                  onAddPoint={() => addPoint(device.mac)}
                  onSubtractPoint={() => subtractPoint(device.mac)}
                  team="red"
                />
              ))}
            </CardContent>
          </Card>

          {/* Blue Team Roster */}
          <Card className="border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Blue Team</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  {blueTeam.length} Players
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {blueTeam.length === 0 && <p className="text-muted-foreground text-sm">No operatives assigned.</p>}
              {blueTeam.map(device => (
                <PlayerCard
                  key={device.mac}
                  device={device}
                  onAddPoint={() => addPoint(device.mac)}
                  onSubtractPoint={() => subtractPoint(device.mac)}
                  team="blue"
                />
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Unassigned / Lobby (Only show if not in FFA, or maybe show at bottom for untracked devices? No, FFA includes everyone usually, or just unassigned. Let's keep Unassigned separate if we want 'teams' logic still to apply for filtering, but for FFA usually everyone plays. 
          Hypothesis: In FFA, everyone is a player. But 'unassigned' logic relies on 'team' field.
          If we want everyone in Leaderboard, we should just show everyone. 
          But the user might want a 'Lobby' vs 'Active' distinction even in FFA. 
          Let's assume for FFA, everyone listed in 'devices' is in the game unless we have a specific 'spectator' mode.
          However, the user said "players can choose to play alone instead of playing in teams".
          Implementation detail: The 'Leaderboard' logic above uses `sortDevices(devices)`, which includes EVERYONE.
          So we probably don't need the 'Unassigned' card in FFA mode.
       */}
      {game.game_mode !== 'ffa' && unassigned.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lobby / Unassigned</CardTitle>
            <CardDescription>Devices waiting for assignment</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {unassigned.map(device => (
              <div key={device.mac} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{device.identifier?.[0] || '?'}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <div className="font-medium truncate">{device.identifier ? NATO[device.identifier] : 'Unassigned'}</div>
                  <div className="text-xs text-muted-foreground truncate">{device.mac}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PlayerCard({ device, onAddPoint, onSubtractPoint, team }: { device: any, onAddPoint: () => void, onSubtractPoint: () => void, team: 'red' | 'blue' }) {
  const isOnline = device.is_online; // Use simple online check for now
  const points = device.points || 0;

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border transition-all bg-card">
      <div className="flex items-center gap-4">
        <Avatar className={`h-10 w-10 border-2 ${team === 'red' ? 'border-red-100' : 'border-blue-100'
          }`}>
          <AvatarFallback className={
            team === 'red' ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50'
          }>
            {device.identifier?.[0] || '?'}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <PlayerTooltip name={device.name} identifier={device.identifier ? (NATO[device.identifier] || device.identifier) : undefined}>
              <span className="font-semibold text-lg cursor-help">
                {device.identifier ? (NATO[device.identifier] || device.identifier) : 'Operative'}
              </span>
            </PlayerTooltip>
            {!isOnline && (
              <Badge variant="outline" className="text-xs px-1 py-0 h-5 border-yellow-200 text-yellow-700 bg-yellow-50">
                Offline
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
              {points} pts
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground font-mono flex items-center gap-2">
            {device.mac}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="icon"
          variant="outline"
          className="h-9 w-9 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 hover:text-red-700"
          onClick={onSubtractPoint}
          title="Subtract Point"
        >
          <Minus className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="h-9 w-9 bg-green-600 text-white hover:bg-green-700 shadow-sm"
          onClick={onAddPoint}
          title="Add Point"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

function GameTimer({ game, onUpdate }: { game: any, onUpdate: (action: string, value: number) => Promise<boolean> }) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [customTime, setCustomTime] = useState("15");
  // Track previous running state to detect completion
  const wasRunningRef = useRef(false);

  useEffect(() => {
    const isRunningNow = (game.timer_end && (game.timer_end * 1000) > Date.now());

    if (wasRunningRef.current && !isRunningNow && !game.timer_paused) {
      // Timer just finished (was running, now not running and not paused)
      if (game.timer_end) { // Ensure it didn't just get cleared/stopped manually to 0
        // Only play if it naturally expired (expiry time is in past/now)
        const now = Date.now();
        const endMs = (game.timer_end || 0) * 1000;
        if (Math.abs(now - endMs) < 2000) { // Within 2 seconds of zero
          const utterance = new SpeechSynthesisUtterance("Game Over. Time is up.");
          window.speechSynthesis.speak(utterance);
        }
      }
    }
    wasRunningRef.current = Boolean(isRunningNow);
  }, [game.timer_end, game.timer_paused]);

  useEffect(() => {
    setIsClient(true);

    const updateTime = () => {
      const now = Date.now();
      // Backend sends seconds, convert to ms for comparison
      const endMs = (game.timer_end || 0) * 1000;
      const pausedMs = (game.timer_paused || 0) * 1000;

      if (game.timer_end && endMs > now) {
        setTimeLeft(endMs - now);
      } else if (game.timer_paused && pausedMs > 0) {
        setTimeLeft(pausedMs);
      } else {
        setTimeLeft(0);
      }
    };

    updateTime(); // Update immediately
    const interval = setInterval(updateTime, 50); // Update every 50ms for smooth ms display
    return () => clearInterval(interval);
  }, [game.timer_end, game.timer_paused]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const dec = Math.floor((ms % 1000) / 100); // Show 1 decimal place (tenths of second)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${dec}`;
  };

  const isRunning = Boolean(game.timer_end && (game.timer_end * 1000) > Date.now());
  const isPaused = Boolean(game.timer_paused && game.timer_paused > 0);
  const hasTime = timeLeft > 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono text-3xl font-bold tracking-widest tabular-nums">
        {isClient ? formatTime(Math.max(0, timeLeft)) : "--:--.-"}
      </div>

      <div className="flex flex-wrap gap-1">
        {!isRunning && !isPaused && (
          <Button size="sm" variant="default" className="h-7 px-2 text-xs" onClick={() => onUpdate('start', 900)}>
            <Play className="h-3 w-3 mr-1" /> Start 15m
          </Button>
        )}

        {(isRunning || isPaused) && (
          <>
            {isRunning ? (
              <Button size="sm" variant="secondary" className="h-7 px-2 text-xs" onClick={() => onUpdate('pause', 0)}>
                <Pause className="h-3 w-3" />
              </Button>
            ) : (
              <Button size="sm" variant="default" className="h-7 px-2 text-xs" onClick={() => onUpdate('resume', 0)}>
                <Play className="h-3 w-3" />
              </Button>
            )}
            <Button size="sm" variant="destructive" className="h-7 px-2 text-xs" onClick={() => onUpdate('stop', 0)}>
              <Square className="h-3 w-3" />
            </Button>
          </>
        )}

        {hasTime && (
          <>
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => onUpdate('add', 60)}>
              +1m
            </Button>
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => onUpdate('add', 30)}>
              +30s
            </Button>
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => onUpdate('add', -60)}>
              -1m
            </Button>
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => onUpdate('add', -30)}>
              -30s
            </Button>
          </>
        )}

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Game Timer</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-2 py-4">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button onClick={() => {
                onUpdate('start', parseInt(customTime) * 60);
                setEditOpen(false);
              }}>Set Timer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  )
}
