import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Avatar, IconButton, Card, CardContent, Chip, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Person as PersonIcon, Replay as ReplayIcon, Close as CloseIcon, Check as CheckIcon, MilitaryTech as MilitaryTechIcon } from '@mui/icons-material';

const NATO = {
  A: 'Alpha', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo', F: 'Foxtrot', G: 'Golf', H: 'Hotel', I: 'India',
  J: 'Juliett', K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November', O: 'Oscar', P: 'Papa', Q: 'Quebec', R: 'Romeo',
  S: 'Sierra', T: 'Tango', U: 'Uniform', V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee', Z: 'Zulu'
};

function PlayerCard({ dev, teamColor, isTagged, onToggleTag }) {
  return (
    <Paper
      sx={{
        p: 1.5,
        mb: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 2.5,
        bgcolor: isTagged ? 'rgba(20,20,20,0.6)' : 'rgba(255,255,255,0.04)',
        border: `2px solid ${isTagged ? 'rgba(255,75,43,0.5)' : teamColor}60`,
        backdropFilter: 'blur(20px)',
        boxShadow: `0 4px 16px ${isTagged ? 'rgba(255,75,43,0.2)' : teamColor}30`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: isTagged ? '#ff4b2b' : teamColor,
          transform: 'translateY(-3px)',
          boxShadow: `0 8px 28px ${isTagged ? 'rgba(255,75,43,0.4)' : teamColor}50`,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ 
          bgcolor: `${teamColor}25`, 
          width: 40, 
          height: 40, 
          border: `2.5px solid ${teamColor}`,
          opacity: isTagged ? 0.6 : 1,
          transition: 'all 0.3s'
        }}>
          <PersonIcon sx={{ fontSize: 22, color: teamColor }} />
        </Avatar>
        
        <Box>
          <Typography variant="body1" sx={{ 
            fontWeight: 800, 
            color: isTagged ? '#999' : 'white',
            lineHeight: 1.3,
            fontSize: '1rem'
          }}>
            {dev.identifier ? NATO[dev.identifier] : dev.mac.slice(-5)}
          </Typography>
          {dev.identifier && (
            <Typography variant="caption" sx={{ opacity: 0.6, fontFamily: 'monospace', fontSize: '0.7rem', display: 'block' }}>
              [{dev.identifier}] {dev.mac.slice(-8)}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Chip 
          label={isTagged ? "TAGGED OUT" : "ACTIVE"} 
          size="small" 
          sx={{ 
            height: 26,
            fontSize: '0.7rem',
            fontWeight: 900,
            bgcolor: isTagged ? 'rgba(255, 75, 43, 0.25)' : 'rgba(0, 255, 136, 0.25)',
            color: isTagged ? '#ff4b2b' : '#00ff88',
            border: `2px solid ${isTagged ? 'rgba(255, 75, 43, 0.5)' : 'rgba(0, 255, 136, 0.5)'}`,
          }} 
        />
        <IconButton 
          size="small" 
          onClick={() => onToggleTag(dev.mac)}
          sx={{ 
            width: 34,
            height: 34,
            bgcolor: isTagged ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 75, 43, 0.2)',
            border: `2px solid ${isTagged ? 'rgba(0, 255, 136, 0.5)' : 'rgba(255, 75, 43, 0.5)'}`,
            '&:hover': {
              bgcolor: isTagged ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 75, 43, 0.3)',
              transform: 'scale(1.15) rotate(180deg)',
            },
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {isTagged ? <CheckIcon sx={{ fontSize: 18, color: '#00ff88', fontWeight: 900 }} /> : <CloseIcon sx={{ fontSize: 18, color: '#ff4b2b', fontWeight: 900 }} />}
        </IconButton>
      </Box>
    </Paper>
  );
}

export default function LaserTag({ devices, game, toggleTag, resetGame, resetTags, now }) {
  const [confirmReset, setConfirmReset] = useState(false);

  const onlineDevices = devices.filter(d => {
    const diff = Math.max(0, now - d.last_seen);
    return (d.is_online || diff < 15) && (d.team === 'red' || d.team === 'blue');
  });

  const redTeam = onlineDevices.filter(d => d.team === 'red');
  const blueTeam = onlineDevices.filter(d => d.team === 'blue');

  const redAlive = redTeam.filter(d => !game.tagged_out?.[d.mac]).length;
  const blueAlive = blueTeam.filter(d => !game.tagged_out?.[d.mac]).length;

  return (
    <Box>
      {/* Header */}
      <Card sx={{ 
        mb: 4, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, rgba(13,15,20,0.95) 0%, rgba(20,25,35,0.9) 100%)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 0.5 }}>
                LASER TAG ARENA
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>Monitor team status • Toggle tag status • Declare winners</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="warning" 
                startIcon={<ReplayIcon />} 
                onClick={() => setConfirmReset(true)} 
                sx={{ 
                  borderRadius: 2.5, 
                  px: 3, 
                  py: 1.2,
                  fontWeight: 800,
                  boxShadow: '0 4px 20px rgba(255,204,0,0.3)',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 28px rgba(255,204,0,0.4)' },
                  transition: 'all 0.3s'
                }}
              >
                RESET MATCH
              </Button>
              <Button 
                variant="outlined" 
                onClick={resetTags} 
                sx={{ 
                  borderRadius: 2.5, 
                  px: 3, 
                  py: 1.2,
                  fontWeight: 800,
                  borderWidth: 2,
                  borderColor: 'rgba(0,210,255,0.5)',
                  color: '#00d2ff',
                  '&:hover': { 
                    borderWidth: 2,
                    borderColor: '#00d2ff',
                    bgcolor: 'rgba(0,210,255,0.1)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s'
                }}
              >
                RESET TAGS
              </Button>
            </Box>
          </Box>

          {/* Stats */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 3, 
                borderRadius: 2.5, 
                background: 'linear-gradient(135deg, rgba(255, 75, 43, 0.15) 0%, rgba(255, 75, 43, 0.08) 100%)',
                border: '2px solid rgba(255, 75, 43, 0.4)',
                backdropFilter: 'blur(10px)'
              }}>
                <Typography variant="overline" sx={{ color: '#ff4b2b', fontWeight: 900, letterSpacing: 2, fontSize: '0.75rem' }}>TEAM RED</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, mt: 1 }}>
                  Active {redAlive} <Typography component="span" sx={{ opacity: 0.6, fontSize: '0.85em' }}>/ {redTeam.length} Players</Typography>
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 3, 
                borderRadius: 2.5, 
                background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.15) 0%, rgba(0, 210, 255, 0.08) 100%)',
                border: '2px solid rgba(0, 210, 255, 0.4)',
                backdropFilter: 'blur(10px)'
              }}>
                <Typography variant="overline" sx={{ color: '#00d2ff', fontWeight: 900, letterSpacing: 2, fontSize: '0.75rem' }}>TEAM BLUE</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, mt: 1 }}>
                  Active {blueAlive} <Typography component="span" sx={{ opacity: 0.6, fontSize: '0.85em' }}>/ {blueTeam.length} Players</Typography>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Teams */}
      <Grid container spacing={3}>
        {/* Red Team */}
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            p: 3, 
            minHeight: 400, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(255, 75, 43, 0.1) 0%, rgba(255, 75, 43, 0.04) 100%)',
            border: '2px solid rgba(255, 75, 43, 0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(255, 75, 43, 0.2)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#ff4b2b', boxShadow: '0 0 20px rgba(255, 75, 43, 0.8)' }} />
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#ff4b2b', flexGrow: 1 }}>RED TEAM</Typography>
              <Chip 
                label={`${redAlive}/${redTeam.length} ALIVE`} 
                sx={{ 
                  bgcolor: 'rgba(255, 75, 43, 0.25)', 
                  color: '#ff4b2b', 
                  fontWeight: 900,
                  border: '2px solid rgba(255, 75, 43, 0.5)',
                  height: 28
                }} 
              />
            </Box>
            
            {redTeam.length === 0 ? (
              <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                <MilitaryTechIcon sx={{ fontSize: 72, color: '#ff4b2b', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#ff4b2b', fontWeight: 700 }}>No players assigned</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, mt: 1 }}>Assign players in the sidebar</Typography>
              </Box>
            ) : (
              redTeam.map(dev => (
                <PlayerCard 
                  key={dev.mac} 
                  dev={dev} 
                  teamColor="#ff4b2b" 
                  isTagged={game.tagged_out?.[dev.mac]}
                  onToggleTag={toggleTag}
                />
              ))
            )}
          </Box>
        </Grid>

        {/* Blue Team */}
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            p: 3, 
            minHeight: 400, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.1) 0%, rgba(0, 210, 255, 0.04) 100%)',
            border: '2px solid rgba(0, 210, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 210, 255, 0.2)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#00d2ff', boxShadow: '0 0 20px rgba(0, 210, 255, 0.8)' }} />
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#00d2ff', flexGrow: 1 }}>BLUE TEAM</Typography>
              <Chip 
                label={`${blueAlive}/${blueTeam.length} ALIVE`} 
                sx={{ 
                  bgcolor: 'rgba(0, 210, 255, 0.25)', 
                  color: '#00d2ff', 
                  fontWeight: 900,
                  border: '2px solid rgba(0, 210, 255, 0.5)',
                  height: 28
                }} 
              />
            </Box>

            {blueTeam.length === 0 ? (
              <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                <MilitaryTechIcon sx={{ fontSize: 72, color: '#00d2ff', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#00d2ff', fontWeight: 700 }}>No players assigned</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, mt: 1 }}>Assign players in the sidebar</Typography>
              </Box>
            ) : (
              blueTeam.map(dev => (
                <PlayerCard 
                  key={dev.mac} 
                  dev={dev} 
                  teamColor="#00d2ff" 
                  isTagged={game.tagged_out?.[dev.mac]}
                  onToggleTag={toggleTag}
                />
              ))
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Reset Dialog */}
      <Dialog 
        open={confirmReset} 
        onClose={() => setConfirmReset(false)}
        PaperProps={{ 
          sx: { 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, rgba(20,20,30,0.98) 0%, rgba(10,10,20,0.95) 100%)',
            backdropFilter: 'blur(40px)',
            border: '2px solid rgba(255, 75, 43, 0.4)',
            boxShadow: '0 16px 64px rgba(255,75,43,0.4)',
            minWidth: 400
          } 
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: '#ff4b2b', fontSize: '1.5rem', textAlign: 'center', pt: 4 }}>
          ⚠️ Reset Entire Game?
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography sx={{ mb: 2, fontSize: '1.05rem' }}>This will clear ALL tag statuses for both teams.</Typography>
          <Alert severity="warning" sx={{ borderRadius: 2, bgcolor: 'rgba(255,204,0,0.15)', border: '2px solid rgba(255,204,0,0.4)' }}>
            <Typography sx={{ fontWeight: 700 }}>This action cannot be undone!</Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 3, pt: 0, gap: 2 }}>
          <Button 
            onClick={() => setConfirmReset(false)} 
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
            color="error" 
            onClick={() => { resetGame(); setConfirmReset(false); }} 
            sx={{ 
              borderRadius: 2.5, 
              px: 4,
              py: 1.2,
              fontWeight: 800, 
              boxShadow: '0 4px 20px rgba(255,75,43,0.4)' 
            }}
          >
            RESET GAME
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
