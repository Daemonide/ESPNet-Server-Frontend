import React, { useEffect, useState, useRef } from 'react';
import {
  Box, CssBaseline, AppBar, Toolbar, Typography, Drawer, List,
  ThemeProvider, createTheme,
  Button, FormControl, InputLabel, Select, MenuItem,
  Dialog, DialogContent, DialogActions, Alert, Snackbar,
  Chip, Avatar, ListItemButton, ListItemIcon, ListItemText, SvgIcon
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CelebrationIcon from '@mui/icons-material/Celebration';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import PeopleIcon from '@mui/icons-material/People';
import Dashboard from './Dashboard';
import LaserTag from './LaserTag';

const ESPNetLogo = (props) => (
  <SvgIcon {...props} viewBox="0 0 1960.69 1960.69">
    <g id="Layer_1" data-name="Layer 1">
      <g>
        <path class="cls-1" d="M191.77,1198.93l-79.32.09c-7.78,0-13.53-6.53-13.52-14.44.2-78.52.35-299.65.4-381.16,0-7.78,8.33-12.23,14.94-12.22l76.05.12c9.43.01,13.87,8.52,13.87,17.2v374.52c0,7.26-4.32,15.89-12.42,15.89Z" />
        <g>
          <path class="cls-1" d="M787.06,898.12l-42.72-.15c-7.35-.03-13.53-5.16-14.07-12.63l-.07-77.98c0-9.16,5.48-16.08,15.37-16.06,213.64.41,494.07,1.23,708.06,1.2l9.46,9.78c-121.12-.01-396.03-.15-514.41-.5l.03,81.67c-.13,8.12-4.63,13.14-12.68,14.58l-43.65.3-.06,284.86c0,8.35-5.13,15.75-14.11,15.76l-75.9.07c-8.41,0-15.5-5.81-15.48-14.91" />
          <polygon class="cls-1" points="1122.72 1036.28 1122.68 1068.04 1029.45 1068.07 1029.34 1157.86 977.28 1157.63 977.28 927.04 1029.3 926.86 1029.35 1016.59 1054.88 1016.67 1054.87 1036.29 1122.72 1036.28" />
          <path class="cls-1" d="M1777.41,871.87l-8.04.08-21.97-.54,45.02-45.35c-10.12-1.16-18.9-.43-28.25-.44l-42.41-.03-108.75-.28-28.07-29.35,200.93.09,130.55.49-51.68,54.07-20.71,21.28-45.29-.36-21.31.34Z" />
          <polygon class="cls-1" points="1136.92 1022.21 1070.05 1021.91 1069.9 1002.31 1136.9 1002.18 1136.99 917.31 1188.99 917.35 1188.99 1157.21 1136.96 1134.68 1136.92 1022.21" />
          <path class="cls-1" d="M996.84,1236.01l197.89-1.75-20.37-20.12c-2.25-2.06-9.17-6.85-9.17-6.85l-274.88.22s-.87-7.13.13-10.18c93.15-2.14,315.82-.58,315.82-.58,0,0,6.24,1.53,8.04,3.52,4.48,4.92,8.58,9.28,13.26,13.89l35.27,34.69c10.95,10.76,21.97,20.29,32.13,31.89,2.23,2.55,5.43,5.29,8.34,7.11l82.47-1.67,45.39-.91,78.58-2.1,51.74-.43c3.78-2.8,6.86-6.75,10.1-10.2l35.89-38.05,18.57-19.44h14.57s-1.96,1.82-1.96,1.82c0,0-51.76,53.29-70.78,74-80.62,2.26-264.51,6.04-264.51,6.04l-5.41-.08-3.18-2.91-31.27-31.88c-1.76-1.79-5.54-2.88-8.08-2.82l-34.42.75-22.71-22.25-201.01.67" />
          <g>
            <polyline class="cls-1" points="1493.59 1042.13 1493.86 940.11 1545.06 917.37 1545.1 1156.6 1469.94 1091.12 1469.56 1068.38 1403.02 1010.69 1349.8 963.9 1349.27 916.84" />
            <path class="cls-1" d="M1455.48,1104.78l-68.15-58.43-.18,110.97-51.48-.29-.24-178.73,36.28,30.82,83.81,73.1c.45,7.44.5,14.55-.04,22.57Z" />
          </g>
          <g>
            <path class="cls-1" d="M1649.65,1066.35l-21.03,17.26c-2.01,1.65-3.77,3.12-6.01,4.57-14.73-17.3-18.21-39.63-19.3-62.02l-14.68-1.04c3.81-49.24,33.57-88.89,82.1-103.18,42.77-12.59,88.89.7,118.68,34.32l-37.61,33.52-16.33-11.88c-12.99-6.88-26.98-10.98-41.72-8.38-29.28,5.17-51.56,29.03-53.81,58.73-1.03,13.6,2.52,25.33,9.71,38.1Z" />
            <path class="cls-1" d="M1751.7,1092.47l31.41,38.38c-38.91,32.93-98.52,35.77-142.29,11.72-23.71-13.03-42.08-33.51-53.39-57.86-6.94-14.95-9.24-29.87-10.78-46.68l13.06-.12c1.86,26.59,12.49,50.44,29.49,70.5l30.96-24.19c24.86,26.01,69.11,29.41,96.58,7.12,1.13-.91,4.1.09,4.96,1.13Z" />
          </g>
          <polyline class="cls-1" points="1283.61 1156.95 1231.36 1133.9 1231.32 972.87 1269.19 972.88 1269.4 1038.42 1283.61 1038.71" />
          <path class="cls-1" d="M1691.5,853.91h-167.26s-33.26-34.09-33.26-34.09c-7.99-8.19-15.46-15.36-23.95-25.14l103.23-.51,43.26,44.2,62.47-.19c5.21,4.92,10.39,9.69,15.49,15.74Z" />
          <path class="cls-1" d="M1696.36,861.63c-5.65,12.04-10.84,10.16-26.53,10.16l-162.53.02-206.76.21c-8.28,0-10.38-4.63-16.26-10.96l49.3-.23,349.54.09c4.9,0,8.53.42,13.25.71Z" />
          <path class="cls-1" d="M1283.13,1024.71l-.27-65.21-36.62-.3-.3-42.27,51.74-.07-.15,107.42c-4.85.52-8.96.55-14.4.43Z" />
          <path class="cls-1" d="M1248.18,864.54l-12.1-13.85-25.54-25.79-88.93.08-15.84-18.09,113.13-.11c5.95,4.69,10.75,9.75,15.8,15.29l40.2,42.2-26.72.27Z" />
          <path class="cls-1" d="M1104.88,816.75l-140.43-.41c-3.39-2.47-5.94-5.39-7.94-9.11l138.79-.09c3.84,2.63,6.99,5.66,9.58,9.6Z" />
          <path class="cls-1" d="M1293.87,878.02l-41.29-.14-6.49-7.82c13.18-.41,24.47-.58,37.2-.06,4.12.17,8.13,5.2,10.58,8.02Z" />
        </g>
        <g>
          <path class="cls-1" d="M732.49,1252.9c-2.1,5.62-8.04,10.18-12.35,14.17-29.63,27.43-62.75,49.31-99.1,66.61-13.11,6.24-26.02,10.7-39.8,15.35-20.99,7.09-41.95,11.1-64,14.1-81.23,11.03-166.81-4.4-237.51-46.17-28.2-16.66-53.67-36.07-76.73-59.03-5.56-5.54-5.17-14.44-.18-19.32,5.63-5.51,13.53-5.82,19.71-.31,10.34,9.22,20.25,17.97,31.36,26.67,28.34,22.19,59.36,39.98,93.3,52.37,51.05,18.65,108.14,25.85,162.03,18.65,33.91-4.53,66.09-13.73,97.32-27.2,20.81-8.98,39.63-20.13,58.1-33.06,16.54-11.58,31-24.65,45.99-37.86,4.88-4.3,11.24-4.81,16.41-1.61,4.76,2.94,8.12,9.45,5.44,16.64Z" />
          <path class="cls-1" d="M705.17,749.27c-53.71-49.72-115.84-81.14-189.12-91.53-66.08-9.37-133.69.14-194.26,28.15-21.03,9.72-40.08,21.9-58.74,35.17-13.82,9.83-25.93,20.44-38.24,31.72-6.09,5.58-14.02,6.49-20.08.69-5.24-5.03-5.53-13.78.1-19.68,13.24-13.87,27.69-25.3,43.42-36.76,34.6-25.21,72.89-44.62,114.34-56.34,75.54-21.36,142.31-19.66,217.07,2.37,35.47,10.45,75.01,31.5,104.95,53.12,16.3,11.77,31.63,23.8,45.3,38.46,4.12,4.41,4.38,11.47,1.5,16.31-2.73,4.57-8.91,7.89-14.82,5.78-4.13-1.47-7.98-4.26-11.42-7.45Z" />
          <path class="cls-1" d="M674.06,1203.94c-31.77,32.22-69.99,56.64-112.88,70.88-65.65,21.8-131.26,21.22-196.19-2.16-25.74-9.27-49.13-21.96-71.39-37.62-12.44-8.75-23.1-18.55-34.11-28.78-5.54-5.15-7.86-13.95-3.09-20.11s15.2-6.71,21.47-.99c25.71,23.46,54.12,43.77,86.77,56.77,33.59,13.38,68.35,21,104.71,20.34s68.61-7.88,100.49-21.19c31.2-13.02,58.09-31.58,82.42-54.56,6.26-5.91,16.11-7.7,22.57-1.41,4.3,4.19,4.41,13.58-.77,18.83Z" />
          <path class="cls-1" d="M625.08,782.43c-39.5-29.48-86.27-47.42-135.71-51.32-80-6.3-154.33,19.73-210.96,76.09-3.41,3.39-8.83,5.28-12.93,4.61-4.39-.71-9.37-3.83-10.96-8.44-2.02-5.88,0-12.34,4.31-16.48,45.17-43.41,95.97-70.54,158.06-81,44.19-7.44,88.4-5.27,131.34,7.32,37.78,11.08,71.07,28.05,101.4,52.83,8.81,7.2,17.24,13.69,24.73,22.23,4.76,5.42,5.07,14.81-.56,19.34-7.48,6.02-16.47,2.73-22.64-3.02-8.52-7.93-16.66-15.12-26.09-22.16Z" />
          <g>
            <path class="cls-1" d="M671.18,996.15c0,113.11-91.69,204.8-204.8,204.8s-204.8-91.69-204.8-204.8,91.69-204.8,204.8-204.8,204.8,91.69,204.8,204.8ZM564.63,996.33c0-54.24-43.97-98.22-98.22-98.22s-98.22,43.97-98.22,98.22,43.97,98.22,98.22,98.22,98.22-43.97,98.22-98.22Z" />
            <circle class="cls-1" cx="465.79" cy="995.91" r="13.84" />
          </g>
        </g>
      </g>
    </g>
    <g id="Layer_4" data-name="Layer 4">
      <g>
        <polygon class="cls-1" points="1490.62 851.97 1479.61 851.97 1438.61 809.22 1449.62 809.22 1490.62 851.97" />
        <polygon class="cls-1" points="1473.37 851.97 1462.36 851.97 1421.36 809.22 1432.37 809.22 1473.37 851.97" />
        <polygon class="cls-1" points="1456.12 851.97 1445.11 851.97 1404.11 809.22 1415.12 809.22 1456.12 851.97" />
        <polygon class="cls-1" points="1438.87 851.97 1427.86 851.97 1386.86 809.22 1397.87 809.22 1438.87 851.97" />
        <polygon class="cls-1" points="1421.62 851.97 1410.61 851.97 1369.61 809.22 1380.62 809.22 1421.62 851.97" />
        <polygon class="cls-1" points="1404.37 851.97 1393.36 851.97 1352.36 809.22 1363.37 809.22 1404.37 851.97" />
        <polygon class="cls-1" points="1387.12 851.97 1376.11 851.97 1335.11 809.22 1346.12 809.22 1387.12 851.97" />
        <polygon class="cls-1" points="1369.87 851.97 1358.86 851.97 1317.86 809.22 1328.87 809.22 1369.87 851.97" />
        <polygon class="cls-1" points="1352.62 851.97 1341.61 851.97 1300.61 809.22 1311.62 809.22 1352.62 851.97" />
        <polygon class="cls-1" points="1335.37 851.97 1324.36 851.97 1283.36 809.22 1294.37 809.22 1335.37 851.97" />
        <polygon class="cls-1" points="1318.12 851.97 1307.11 851.97 1266.11 809.22 1277.12 809.22 1318.12 851.97" />
        <polygon class="cls-1" points="1300.87 851.97 1289.86 851.97 1248.86 809.22 1259.87 809.22 1300.87 851.97" />
      </g>
      <g>
        <polygon class="cls-1" points="1739.41 872.32 1730.41 872.32 1759.87 841.09 1768.87 841.09 1739.41 872.32" />
        <polygon class="cls-1" points="1727.41 872.32 1718.41 872.32 1747.87 841.09 1756.87 841.09 1727.41 872.32" />
        <polygon class="cls-1" points="1715.41 872.32 1706.41 872.32 1735.87 841.09 1744.87 841.09 1715.41 872.32" />
        <polygon class="cls-1" points="1703.41 872.32 1694.41 872.32 1723.87 841.09 1732.87 841.09 1703.41 872.32" />
      </g>
      <g>
        <polygon class="cls-1" points="1553.7 1277.96 1509.69 1277.96 1565.15 1215.73 1609.15 1215.73 1553.7 1277.96" />
        <polygon class="cls-1" points="1496.7 1277.96 1452.69 1277.96 1508.15 1215.73 1552.15 1215.73 1496.7 1277.96" />
        <polygon class="cls-1" points="1439.7 1277.96 1395.69 1277.96 1451.15 1215.73 1495.15 1215.73 1439.7 1277.96" />
      </g>
    </g>
  </SvgIcon>
);

const NATO = {
  A: "Alpha", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo",
  F: "Foxtrot", G: "Golf", H: "Hotel", I: "India", J: "Juliett",
  K: "Kilo", L: "Lima", M: "Mike", N: "November", O: "Oscar",
  P: "Papa", Q: "Quebec", R: "Romeo", S: "Sierra", T: "Tango",
  U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray", Y: "Yankee", Z: "Zulu"
};

const leftDrawerWidth = 220;
const rightDrawerWidth = 360;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00d2ff' },
    secondary: { main: '#ff4b2b' },
    success: { main: '#00ff88' },
    warning: { main: '#ffcc00' },
    error: { main: '#ff4b2b' },
    background: { default: '#0a0c12', paper: '#0d0f14' },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    h6: { fontWeight: 800 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 700, borderRadius: 8 },
      },
    },
  },
});

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [victoryDialog, setVictoryDialog] = useState(false);
  const [victoryMessage, setVictoryMessage] = useState('');
  const [victoryTeam, setVictoryTeam] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [data, setData] = useState({
    devices: [],
    game: { teams: {}, tagged_out: {}, winners: null }
  });
  const ws = useRef(null);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const connect = () => {
      const wsUrl = `ws://localhost:8080/ws`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setConnectionStatus('connected');
        showSnackbar('Connected to server', 'success');
      };

      ws.current.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed.type === 'victory') {
            setVictoryTeam(parsed.winner);
            setVictoryMessage(parsed.message);
            setVictoryDialog(true);
            showSnackbar(`${parsed.winner.toUpperCase()} WINS!`, 'success');
          } else {
            const formattedData = {
              devices: Array.isArray(parsed.devices) ? parsed.devices : [],
              game: parsed.game || { teams: {}, tagged_out: {}, winners: null }
            };
            setData(formattedData);
          }
        } catch (err) {
          console.error("Failed to parse WebSocket data:", err);
        }
      };

      ws.current.onclose = () => {
        setConnectionStatus('disconnected');
        showSnackbar('Disconnected. Reconnecting...', 'warning');
        setTimeout(connect, 2000);
      };

      ws.current.onerror = () => {
        setConnectionStatus('error');
      };
    };

    connect();
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);

    return () => {
      clearInterval(interval);
      if (ws.current) ws.current.close();
    };
  }, []);

  const callApi = async (endpoint, method = 'GET', body = null) => {
    try {
      const options = {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
      };
      if (body) options.body = JSON.stringify(body);

      const response = await fetch(`http://localhost:8080${endpoint}`, options);
      
      if (!response.ok) {
        const text = await response.text();
        console.error(`API Error ${response.status}:`, text);
        showSnackbar(`Error: ${response.statusText}`, 'error');
        return null;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return { success: true };
    } catch (err) {
      console.error(`API Error for ${endpoint}:`, err);
      showSnackbar(`Failed to ${method} ${endpoint}`, 'error');
      return null;
    }
  };

  const deleteDevice = async (mac) => {
    await callApi(`/api/device/${mac}`, 'DELETE');
  };

  const assignCallsign = async (mac, callsign) => {
    await callApi(`/api/assign/${mac}/${callsign}`, 'POST');
  };

  const setTeam = async (mac, team) => {
    await callApi(`/api/team/${mac}/${team}`, 'PUT');
  };

  const toggleTag = async (mac) => {
    await callApi(`/api/toggle_tag/${mac}`, 'POST');
  };

  const resetGame = async () => {
    await callApi('/api/reset_game', 'POST');
  };

  const resetTags = async () => {
    await callApi('/api/reset_tags', 'POST');
  };

  const allDevices = data.devices;
  const onlineCount = data.devices.filter(d => {
    const diff = Math.max(0, now - d.last_seen);
    return d.is_online || diff < 15;
  }).length;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        
        {/* Full-Width Top Bar */}
        <AppBar 
          position="fixed" 
          elevation={0} 
          sx={{ 
            zIndex: 1301, 
            background: 'linear-gradient(135deg, rgba(13,15,20,0.95) 0%, rgba(20,25,35,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Toolbar>
            <ESPNetLogo sx={{ mr: 2, color: 'primary.main', fontSize: 70 }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 900, letterSpacing: 0.5 }}>
              ESPNet Control Panel
            </Typography>
            
            {/* Registry Button with Icon and Text */}
            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={() => setRightDrawerOpen(!rightDrawerOpen)}
              sx={{
                mr: 2,
                px: 2.5,
                py: 1,
                borderWidth: 2,
                borderColor: rightDrawerOpen ? '#00d2ff' : 'rgba(255,255,255,0.2)',
                color: rightDrawerOpen ? '#00d2ff' : 'rgba(255,255,255,0.7)',
                fontWeight: 800,
                fontSize: '0.85rem',
                bgcolor: rightDrawerOpen ? 'rgba(0,210,255,0.1)' : 'transparent',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: '#00d2ff',
                  bgcolor: 'rgba(0,210,255,0.15)',
                  color: '#00d2ff'
                }
              }}
            >
              Registry
            </Button>

            {/* Connection Status */}
            <Chip 
              icon={connectionStatus === 'connected' ? <WifiIcon /> : <WifiOffIcon />}
              label={connectionStatus === 'connected' ? 'Connected' : 'Offline'}
              size="small"
              sx={{ 
                height: 34,
                px: 1,
                bgcolor: connectionStatus === 'connected' ? 'rgba(0,255,136,0.15)' : 'rgba(255,75,43,0.15)',
                color: connectionStatus === 'connected' ? '#00ff88' : '#ff4b2b',
                border: `2px solid ${connectionStatus === 'connected' ? 'rgba(0,255,136,0.4)' : 'rgba(255,75,43,0.4)'}`,
                fontWeight: 800,
                fontSize: '0.75rem'
              }}
            />
          </Toolbar>
        </AppBar>

        {/* Left Sidebar - Navigation */}
        <Drawer
          variant="permanent"
          sx={{
            width: leftDrawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: leftDrawerWidth,
              boxSizing: 'border-box',
              background: 'linear-gradient(180deg, rgba(13,15,20,0.98) 0%, rgba(10,12,18,0.95) 100%)',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)'
            },
          }}
        >
          <Toolbar />
          
          <Box sx={{ p: 2, pt: 3 }}>
            <List sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
              <ListItemButton
                selected={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
                sx={{
                  borderRadius: 2.5,
                  py: 1.5,
                  px: 2,
                  mb: 1,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #00d2ff 0%, #0099cc 100%)',
                    color: '#000',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #00d2ff 0%, #0099cc 100%)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#000'
                    }
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.05)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <DashboardIcon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Dashboard" 
                  primaryTypographyProps={{ fontWeight: 800, fontSize: '0.9rem' }}
                />
              </ListItemButton>

              <ListItemButton
                selected={activeTab === 'lasertag'}
                onClick={() => setActiveTab('lasertag')}
                sx={{
                  borderRadius: 2.5,
                  py: 1.5,
                  px: 2,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #00d2ff 0%, #0099cc 100%)',
                    color: '#000',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #00d2ff 0%, #0099cc 100%)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#000'
                    }
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.05)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <SportsEsportsIcon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Laser Tag" 
                  primaryTypographyProps={{ fontWeight: 800, fontSize: '0.9rem' }}
                />
              </ListItemButton>
            </List>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 'auto', p: 2.5, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="caption" sx={{ opacity: 0.4, display: 'block', textAlign: 'center', fontSize: '0.7rem' }}>
              ESPNet Control Panel
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.3, display: 'block', textAlign: 'center', fontSize: '0.65rem', mt: 0.5 }}>
              v3.0.0
            </Typography>
          </Box>
        </Drawer>

        {/* Main Content - FIXED WIDTH CALCULATION */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            pt: 10, 
            pb: 3,
            px: 4,
            overflowY: 'auto',
            background: 'linear-gradient(180deg, #050608 0%, #0a0e15 100%)',
            transition: 'all 0.3s ease-in-out'
          }}
        >
          {activeTab === 'dashboard' && (
            <Dashboard 
              devices={data.devices} 
              now={now} 
              deleteDevice={deleteDevice} 
              callApi={callApi}
            />
          )}
          {activeTab === 'lasertag' && (
            <LaserTag 
              devices={data.devices} 
              game={data.game}
              toggleTag={toggleTag}
              resetGame={resetGame}
              resetTags={resetTags}
              now={now}
            />
          )}
        </Box>

                {/* Right Sidebar - Device Registry (OVERLAY) */}
        <Drawer
          variant="temporary"
          anchor="right"
          open={rightDrawerOpen}
          onClose={() => setRightDrawerOpen(false)}
          sx={{
            width: rightDrawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: rightDrawerWidth,
              boxSizing: 'border-box',
              background: 'linear-gradient(180deg, rgba(10,12,18,0.98) 0%, rgba(13,15,20,0.95) 100%)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(30px)',
            },
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >

          <Toolbar />
          
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>Device Registry</Typography>
              <Chip 
                label={`${onlineCount}/${allDevices.length}`} 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(0,255,136,0.2)', 
                  color: '#00ff88', 
                  fontWeight: 900,
                  border: '2px solid rgba(0,255,136,0.4)'
                }} 
              />
            </Box>
            <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mb: 3 }}>
              All registered devices
            </Typography>

            <List sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', px: 0 }}>
              {allDevices.map(dev => {
                const diff = Math.max(0, now - dev.last_seen);
                const isOnline = dev.is_online && diff < 15;
                
                return (
                  <Box key={dev.mac} sx={{ mb: 2.5 }}>
                    <Box sx={{ 
                      p: 2.5, 
                      borderRadius: 3, 
                      bgcolor: isOnline ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                      border: dev.team === 'red' ? '2px solid rgba(255,75,43,0.5)' : dev.team === 'blue' ? '2px solid rgba(0,210,255,0.5)' : '1px solid rgba(255,255,255,0.1)',
                      opacity: isOnline ? 1 : 0.6,
                      transition: 'all 0.3s',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.05)',
                        opacity: 1,
                        transform: 'translateY(-2px)',
                        boxShadow: dev.team === 'red' ? '0 4px 20px rgba(255,75,43,0.3)' : dev.team === 'blue' ? '0 4px 20px rgba(0,210,255,0.3)' : '0 4px 20px rgba(0,0,0,0.2)'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ 
                          width: 40, 
                          height: 40,
                          bgcolor: dev.team === 'red' ? 'rgba(255,75,43,0.25)' : dev.team === 'blue' ? 'rgba(0,210,255,0.25)' : 'rgba(255,255,255,0.1)',
                          border: `2.5px solid ${dev.team === 'red' ? '#ff4b2b' : dev.team === 'blue' ? '#00d2ff' : 'rgba(255,255,255,0.2)'}`
                        }}>
                          <MilitaryTechIcon sx={{ fontSize: 22, color: dev.team === 'red' ? '#ff4b2b' : dev.team === 'blue' ? '#00d2ff' : '#fff' }} />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 900, fontSize: '0.95rem', mb: 0.3 }}>
                            {dev.identifier ? NATO[dev.identifier] : 'UNASSIGNED'}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.7rem', fontFamily: 'monospace', display: 'block' }}>
                            {dev.mac}
                          </Typography>
                        </Box>
                        {!isOnline && (
                          <Chip 
                            label="OFFLINE" 
                            size="small" 
                            sx={{ 
                              height: 22,
                              fontSize: '0.65rem',
                              fontWeight: 900,
                              bgcolor: 'rgba(255,75,43,0.2)', 
                              color: '#ff4b2b',
                              border: '1px solid rgba(255,75,43,0.4)'
                            }} 
                          />
                        )}
                      </Box>

                      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel sx={{ fontSize: '0.8rem', fontWeight: 700 }}>Callsign</InputLabel>
                        <Select
                          value={dev.identifier || ''}
                          label="Callsign"
                          onChange={(e) => assignCallsign(dev.mac, e.target.value)}
                          sx={{ 
                            fontSize: '0.85rem', 
                            bgcolor: 'rgba(255,255,255,0.03)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(255,255,255,0.1)'
                            }
                          }}
                        >
                          <MenuItem value=""><em>None</em></MenuItem>
                          {Object.keys(NATO).map(letter => (
                            <MenuItem key={letter} value={letter}>{letter} - {NATO[letter]}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel sx={{ fontSize: '0.8rem', fontWeight: 700 }}>Team</InputLabel>
                        <Select
                          value={dev.team || 'none'}
                          label="Team"
                          onChange={(e) => setTeam(dev.mac, e.target.value)}
                          sx={{ 
                            fontSize: '0.85rem', 
                            bgcolor: 'rgba(255,255,255,0.03)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(255,255,255,0.1)'
                            }
                          }}
                        >
                          <MenuItem value="none">No Team</MenuItem>
                          <MenuItem value="red">🔴 Red Team</MenuItem>
                          <MenuItem value="blue">🔵 Blue Team</MenuItem>
                        </Select>
                      </FormControl>

                      <Button 
                        fullWidth
                        size="small" 
                        startIcon={<DeleteOutlineIcon />}
                        onClick={() => deleteDevice(dev.mac)}
                        sx={{ 
                          color: '#ff4b2b',
                          borderWidth: 2,
                          borderColor: 'rgba(255,75,43,0.4)',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          py: 1,
                          '&:hover': { 
                            bgcolor: 'rgba(255,75,43,0.15)', 
                            borderWidth: 2,
                            borderColor: '#ff4b2b' 
                          }
                        }}
                        variant="outlined"
                      >
                        Remove Device
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </List>
          </Box>
        </Drawer>

        {/* Victory Dialog - Fixed HTML Structure */}
        <Dialog 
          open={victoryDialog} 
          onClose={() => setVictoryDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(20,20,30,0.98) 0%, rgba(10,10,20,0.95) 100%)',
              backdropFilter: 'blur(40px)',
              border: `3px solid ${victoryTeam === 'red' ? '#ff4b2b' : '#00d2ff'}`,
              boxShadow: `0 20px 80px ${victoryTeam === 'red' ? 'rgba(255,75,43,0.6)' : 'rgba(0,210,255,0.6)'}`,
              minWidth: 480
            }
          }}
        >
          <Box sx={{ textAlign: 'center', pt: 5, pb: 2 }}>
            <CelebrationIcon sx={{ fontSize: 80, color: victoryTeam === 'red' ? '#ff4b2b' : '#00d2ff', mb: 2 }} />
            <Typography variant="h3" sx={{ 
              fontWeight: 900, 
              background: victoryTeam === 'red' 
                ? 'linear-gradient(135deg, #ff4b2b 0%, #ff8c00 100%)'
                : 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {victoryTeam.toUpperCase()} WINS!
            </Typography>
          </Box>
          <DialogContent sx={{ textAlign: 'center', pb: 4, px: 5 }}>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 600 }}>{victoryMessage}</Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
            <Button 
              variant="contained" 
              onClick={() => setVictoryDialog(false)}
              sx={{ 
                borderRadius: 3, 
                px: 5, 
                py: 1.5,
                background: victoryTeam === 'red'
                  ? 'linear-gradient(135deg, #ff4b2b 0%, #ff8c00 100%)'
                  : 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
                fontWeight: 900,
                fontSize: '1.1rem',
                boxShadow: `0 8px 32px ${victoryTeam === 'red' ? 'rgba(255,75,43,0.5)' : 'rgba(0,210,255,0.5)'}`
              }}
            >
              CLOSE
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ 
              borderRadius: 2,
              backdropFilter: 'blur(20px)',
              fontWeight: 700
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
