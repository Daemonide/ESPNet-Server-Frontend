import React, { useState } from 'react';
import { Grid, Card, Box, Chip, Typography, Fade, Divider, Button, Switch, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Alert, Paper } from '@mui/material';
import { MilitaryTech as MilitaryTechIcon, Wifi as WifiIcon, Timer as TimerIcon, RestartAlt as RestartIcon, WifiOff as WifiOffIcon, TrendingUp as TrendingUpIcon, Speed as SpeedIcon } from '@mui/icons-material';

const NATO = {
  A: "Alpha", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot", G: "Golf", H: "Hotel", I: "India", J: "Juliett",
  K: "Kilo", L: "Lima", M: "Mike", N: "November", O: "Oscar", P: "Papa", Q: "Quebec", R: "Romeo", S: "Sierra", T: "Tango",
  U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray", Y: "Yankee", Z: "Zulu"
};

export default function Dashboard({ devices, now, deleteDevice, callApi }) {
  const [showOffline, setShowOffline] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, mac: '', action: '', title: '', message: '', deviceName: '' });

  if (!devices || devices.length === 0) {
    return (
      <Fade in={true}>
        <Box sx={{ textAlign: 'center', mt: 10 }}>
          <MilitaryTechIcon sx={{ fontSize: 100, mb: 3, opacity: 0.3 }} />
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>Awaiting Connection</Typography>
          <Typography variant="body1" sx={{ opacity: 0.6 }}>No devices discovered. Ensure ESP32 units are powered on.</Typography>
        </Box>
      </Fade>
    );
  }

  const handleRestartDevice = async (mac) => {
    const result = await callApi(`/api/restart/${mac}`, 'POST');
    if (result) console.log(`✓ Restarted ${mac}`);
  };

  const handleResetWifi = async (mac) => {
    const result = await callApi(`/api/reset_wifi/${mac}`, 'POST');
    if (result) console.log(`✓ Reset WiFi for ${mac}`);
  };

  const showConfirmDialog = (mac, action, title, message, deviceName) => {
    setConfirmDialog({ open: true, mac, action, title, message, deviceName });
  };

  const handleConfirmAction = () => {
    const { mac, action } = confirmDialog;
    if (action === 'restart') handleRestartDevice(mac);
    else if (action === 'reset_wifi') handleResetWifi(mac);
    else if (action === 'delete') deleteDevice(mac);
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  const onlineDevices = devices.filter(d => {
    const diff = Math.max(0, now - d.last_seen);
    return d.is_online && diff < 6;
  });

  const lateDevices = devices.filter(d => {
    const diff = Math.max(0, now - d.last_seen);
    return d.is_online && diff >= 6 && diff < 15;
  });

  const offlineDevices = devices.filter(d => {
    const diff = Math.max(0, now - d.last_seen);
    return !d.is_online || diff >= 15;
  });

  const StatusBadge = ({ device, now }) => {
    const diff = Math.max(0, now - device.last_seen);
    if (!device.is_online || diff >= 15) {
      return <Chip label="OFFLINE" size="small" sx={{ height: 26, fontSize: '0.7rem', fontWeight: 900, bgcolor: 'rgba(255, 75, 43, 0.2)', color: '#ff4b2b', border: '2px solid rgba(255, 75, 43, 0.5)' }} />;
    }
    if (diff >= 6) {
      return <Chip label="LATE" size="small" sx={{ height: 26, fontSize: '0.7rem', fontWeight: 900, bgcolor: 'rgba(255, 204, 0, 0.2)', color: '#ffcc00', border: '2px solid rgba(255, 204, 0, 0.5)' }} />;
    }
    return <Chip label="ONLINE" size="small" sx={{ height: 26, fontSize: '0.7rem', fontWeight: 900, bgcolor: 'rgba(0, 255, 136, 0.2)', color: '#00ff88', border: '2px solid rgba(0, 255, 136, 0.5)' }} />;
  };

  return (
    <Box>
      {/* Stats Overview */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'rgba(13,15,20,0.6)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
        <Typography variant="overline" sx={{ opacity: 0.5, fontWeight: 800, fontSize: '0.7rem', letterSpacing: 2 }}>NETWORK STATISTICS</Typography>
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid item xs={6} md={3}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700, fontSize: '0.7rem' }}>TOTAL DEVICES</Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, mt: 0.5 }}>{devices.length}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box>
              <Typography variant="caption" sx={{ color: '#00ff88', opacity: 0.9, fontWeight: 700, fontSize: '0.7rem' }}>ONLINE</Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#00ff88', mt: 0.5 }}>{onlineDevices.length}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box>
              <Typography variant="caption" sx={{ color: '#ffcc00', opacity: 0.9, fontWeight: 700, fontSize: '0.7rem' }}>LATE</Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#ffcc00', mt: 0.5 }}>{lateDevices.length}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box>
              <Typography variant="caption" sx={{ color: '#ff4b2b', opacity: 0.9, fontWeight: 700, fontSize: '0.7rem' }}>OFFLINE</Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#ff4b2b', mt: 0.5 }}>{offlineDevices.length}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Active Devices Section */}
      {onlineDevices.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'rgba(13,15,20,0.4)', borderRadius: 3, border: '1px solid rgba(0,255,136,0.15)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SpeedIcon sx={{ mr: 1.5, color: '#00ff88' }} />
            <Typography variant="h6" sx={{ fontWeight: 900 }}>Active Devices</Typography>
            <Chip label={onlineDevices.length} size="small" sx={{ ml: 2, bgcolor: 'rgba(0,255,136,0.2)', color: '#00ff88', fontWeight: 800 }} />
          </Box>
          <Grid container spacing={2.5}>
            {onlineDevices.map((dev) => {
              const diff = Math.max(0, now - dev.last_seen);
              return (
                <Grid item xs={12} md={6} lg={4} key={dev.mac}>
                  <Card sx={{ 
                    borderRadius: 2.5, 
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(20px)',
                    border: dev.team ? `2.5px solid ${dev.team === 'red' ? 'rgba(255,75,43,0.5)' : 'rgba(0,210,255,0.5)'}` : '2px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.3s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(0,210,255,0.2)' }
                  }}>
                    <Box sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: dev.team === 'red' ? 'rgba(255,75,43,0.25)' : dev.team === 'blue' ? 'rgba(0,210,255,0.25)' : 'rgba(255,255,255,0.1)', 
                          width: 48, 
                          height: 48,
                          border: `3px solid ${dev.team === 'red' ? '#ff4b2b' : dev.team === 'blue' ? '#00d2ff' : 'rgba(255,255,255,0.2)'}`
                        }}>
                          <MilitaryTechIcon sx={{ fontSize: 26, color: dev.team === 'red' ? '#ff4b2b' : dev.team === 'blue' ? '#00d2ff' : '#fff' }} />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1.1rem', mb: 0.3 }}>
                            {dev.identifier ? NATO[dev.identifier] : 'UNASSIGNED'}
                          </Typography>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.6, fontSize: '0.75rem' }}>
                            {dev.identifier && `[${dev.identifier}] • `}{dev.mac}
                          </Typography>
                        </Box>
                        <StatusBadge device={dev} now={now} />
                      </Box>
                      
                      <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
                      
                      <Box sx={{ display: 'flex', gap: 3, mb: 2.5 }}>
                        <Box>
                          <Typography variant="caption" sx={{ display: 'block', opacity: 0.5, fontSize: '0.7rem', fontWeight: 700 }}>LAST SEEN</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <TimerIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>{diff}s</Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ display: 'block', opacity: 0.5, fontSize: '0.7rem', fontWeight: 700 }}>IP ADDRESS</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <WifiIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{dev.ip}</Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          fullWidth
                          startIcon={<RestartIcon />}
                          onClick={() => showConfirmDialog(dev.mac, 'restart', 'Restart Device', `Restart ${dev.identifier ? NATO[dev.identifier] : dev.mac}?`, dev.identifier ? NATO[dev.identifier] : dev.mac)}
                          sx={{ 
                            borderWidth: 2,
                            borderColor: 'rgba(0, 210, 255, 0.4)',
                            color: '#00d2ff',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            '&:hover': { 
                              borderWidth: 2,
                              borderColor: '#00d2ff',
                              bgcolor: 'rgba(0, 210, 255, 0.15)'
                            }
                          }}
                        >
                          Restart
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined"
                          fullWidth
                          startIcon={<WifiOffIcon />}
                          onClick={() => showConfirmDialog(dev.mac, 'reset_wifi', 'Reset WiFi', `Reset WiFi for ${dev.identifier ? NATO[dev.identifier] : dev.mac}?`, dev.identifier ? NATO[dev.identifier] : dev.mac)}
                          sx={{ 
                            borderWidth: 2,
                            borderColor: 'rgba(255, 75, 43, 0.4)',
                            color: '#ff4b2b',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            '&:hover': { 
                              borderWidth: 2,
                              borderColor: '#ff4b2b',
                              bgcolor: 'rgba(255, 75, 43, 0.15)'
                            }
                          }}
                        >
                          WiFi
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      )}

      {/* Late/Offline Sections */}
      {lateDevices.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'rgba(13,15,20,0.4)', borderRadius: 3, border: '1px solid rgba(255,204,0,0.15)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TrendingUpIcon sx={{ mr: 1.5, color: '#ffcc00' }} />
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffcc00' }}>Late Responses</Typography>
            <Chip label={lateDevices.length} size="small" sx={{ ml: 2, bgcolor: 'rgba(255,204,0,0.2)', color: '#ffcc00', fontWeight: 800 }} />
          </Box>
          <Grid container spacing={2}>
            {lateDevices.map(dev => (
              <Grid item xs={12} md={4} key={dev.mac}>
                <Card sx={{ p: 2, bgcolor: 'rgba(255,204,0,0.05)', border: '2px solid rgba(255,204,0,0.2)', borderRadius: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>{dev.identifier ? NATO[dev.identifier] : dev.mac.slice(-5)}</Typography>
                  <Typography variant="caption" sx={{ color: '#ffcc00', fontWeight: 700 }}>Last seen {Math.max(0, now - dev.last_seen)}s ago</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {showOffline && offlineDevices.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(13,15,20,0.3)', borderRadius: 3, border: '1px solid rgba(255,75,43,0.15)', opacity: 0.7 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WifiOffIcon sx={{ mr: 1.5, color: '#ff4b2b' }} />
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#ff4b2b' }}>Offline Devices</Typography>
            <Chip label={offlineDevices.length} size="small" sx={{ ml: 2, bgcolor: 'rgba(255,75,43,0.2)', color: '#ff4b2b', fontWeight: 800 }} />
            <Box sx={{ flexGrow: 1 }} />
            <FormControlLabel control={<Switch checked={showOffline} onChange={(e) => setShowOffline(e.target.checked)} size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 700 }}>Show</Typography>} />
          </Box>
          <Grid container spacing={2}>
            {offlineDevices.map(dev => (
              <Grid item xs={12} md={4} key={dev.mac}>
                <Card sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Typography variant="body1" sx={{ opacity: 0.7, fontWeight: 700 }}>{dev.identifier ? NATO[dev.identifier] : 'Unknown'}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.5, fontWeight: 600 }}>{dev.ip} • Offline {Math.floor(Math.max(0, now - dev.last_seen) / 60)}m</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Confirm Dialog */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false})} 
        PaperProps={{ 
          sx: { 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, rgba(20,20,30,0.98) 0%, rgba(10,10,20,0.95) 100%)',
            backdropFilter: 'blur(40px)', 
            border: '2px solid rgba(255,75,43,0.4)',
            minWidth: 420,
            boxShadow: '0 16px 64px rgba(0,0,0,0.6)'
          } 
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.4rem', textAlign: 'center', pt: 4 }}>
          {confirmDialog.action === 'delete' ? '🗑️' : confirmDialog.action === 'restart' ? '🔄' : '📡'} {confirmDialog.title}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography sx={{ fontSize: '1.05rem', mb: 2 }}>{confirmDialog.message}</Typography>
          {confirmDialog.action === 'delete' && (
            <Alert severity="error" sx={{ borderRadius: 2, bgcolor: 'rgba(255,75,43,0.15)', border: '2px solid rgba(255,75,43,0.4)' }}>
              <Typography sx={{ fontWeight: 700 }}>This will permanently remove the device!</Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 3, pt: 0, gap: 2 }}>
          <Button 
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            variant="outlined"
            sx={{ 
              borderRadius: 2.5, 
              px: 4,
              py: 1.2,
              fontWeight: 800,
              borderWidth: 2,
              '&:hover': { borderWidth: 2 }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color={confirmDialog.action === 'restart' ? 'primary' : 'error'}
            onClick={handleConfirmAction}
            sx={{ 
              borderRadius: 2.5, 
              px: 4,
              py: 1.2,
              fontWeight: 800,
              boxShadow: confirmDialog.action === 'restart' ? '0 4px 20px rgba(0,210,255,0.4)' : '0 4px 20px rgba(255,75,43,0.4)'
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
