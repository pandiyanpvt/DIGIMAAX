import React from 'react';
import { Box, Container, Typography, Grid, Paper, Table, TableBody, TableRow, TableCell, TextField, MenuItem, Button } from '@mui/material';

const ServiceDetailPage = () => {
  return (
    <Box sx={{ background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)', minHeight: '100vh', pt: { xs: 8, md: 10 }, pb: 8 }}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, mb: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 900 }}>Service Name – DIGIMAAX Solutions</Typography>
          <Typography variant="h6" sx={{ color: 'white', mt: 1 }}>Short header tagline about the service.</Typography>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 900, mb: 1 }}>About this service</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Describe what the service is, why customers need it, and key benefits.
              </Typography>

              <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, mt: 3, mb: 1 }}>Packages / Pricing</Typography>
              <Table size="small" sx={{ '& td': { color: 'white' } }}>
                <TableBody>
                  <TableRow>
                    <TableCell>Basic</TableCell>
                    <TableCell>2 Cameras + DVR</TableCell>
                    <TableCell>LKR 25,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Standard</TableCell>
                    <TableCell>4 Cameras + DVR</TableCell>
                    <TableCell>LKR 45,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Premium</TableCell>
                    <TableCell>8 Cameras + DVR</TableCell>
                    <TableCell>LKR 75,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, mt: 3, mb: 1 }}>What’s Included</Typography>
              <ul style={{ marginTop: 0 }}>
                <li style={{ color: 'white' }}>Free site inspection</li>
                <li style={{ color: 'white' }}>Installation</li>
                <li style={{ color: 'white' }}>Warranty</li>
                <li style={{ color: 'white' }}>Support</li>
              </ul>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, mb: 1 }}>Get a Quote</Typography>
              <TextField fullWidth size="small" label="Name" sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { color: 'white' } }} />
              <TextField fullWidth size="small" label="Email" sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { color: 'white' } }} />
              <TextField fullWidth size="small" label="Phone" sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { color: 'white' } }} />
              <TextField fullWidth size="small" label="Address" sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { color: 'white' } }} />
              <TextField fullWidth select size="small" label="Service Type" defaultValue="CCTV Installation" sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { color: 'white' } }}>
                {['CCTV Installation','LED Board Designing','3D Printed Model Creation','POS System Setup','Server Storage Solution','Interior Designing','Product Advertisement','Wall Art & Wall Designs'].map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
              <TextField fullWidth size="small" label="Message / Requirements" minRows={3} multiline sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: 'white' } }} />
              <Button variant="contained" fullWidth sx={{ background: 'linear-gradient(45deg, #2196F3, #FF4081)', textTransform: 'none', fontWeight: 800 }}>Submit Request</Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ServiceDetailPage;


