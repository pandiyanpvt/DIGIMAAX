import React from 'react';
import { Box, Container, Typography, Grid, Paper, Table, TableBody, TableRow, TableCell, TextField, MenuItem, Button } from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';

const ServiceDetailPage = () => {
  const { t } = useTranslation();
  
  const serviceOptions = [
    t('services.cctvInstallation'),
    t('services.ledBoardDesigning'),
    t('services.printedModelCreation'),
    t('services.posSystemSetup'),
    t('services.serverStorageSolution'),
    t('services.interiorDesigning'),
    t('services.productAdvertisement'),
    t('services.wallArtDesigns'),
  ];
  return (
    <Box sx={{ background: 'linear-gradient(180deg, #29085D 0%, #1a0540 100%)', minHeight: '100vh', pt: { xs: 8, md: 10 }, pb: 8 }}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, mb: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 900 }}>{t('serviceDetail.serviceNameHeader')}</Typography>
          <Typography variant="h6" sx={{ color: 'white', mt: 1 }}>{t('serviceDetail.serviceTagline')}</Typography>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 900, mb: 1 }}>{t('serviceDetail.aboutService')}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
                {t('serviceDetail.serviceDescription')}
              </Typography>

              <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, mt: 3, mb: 1 }}>{t('serviceDetail.packagesPricing')}</Typography>
              <Table size="small" sx={{ '& td': { color: 'white' } }}>
                <TableBody>
                  <TableRow>
                    <TableCell>{t('serviceDetail.basic')}</TableCell>
                    <TableCell>2 Cameras + DVR</TableCell>
                    <TableCell>LKR 25,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t('serviceDetail.standard')}</TableCell>
                    <TableCell>4 Cameras + DVR</TableCell>
                    <TableCell>LKR 45,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t('serviceDetail.premium')}</TableCell>
                    <TableCell>8 Cameras + DVR</TableCell>
                    <TableCell>LKR 75,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, mt: 3, mb: 1 }}>{t('serviceDetail.whatsIncluded')}</Typography>
              <ul style={{ marginTop: 0 }}>
                <li style={{ color: 'white' }}>{t('serviceDetail.freeSiteInspection')}</li>
                <li style={{ color: 'white' }}>{t('serviceDetail.installation')}</li>
                <li style={{ color: 'white' }}>{t('serviceDetail.warranty')}</li>
                <li style={{ color: 'white' }}>{t('serviceDetail.support')}</li>
              </ul>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, mb: 1 }}>{t('serviceDetail.getQuote')}</Typography>
              <TextField fullWidth size="small" label={t('serviceDetail.name')} sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { color: 'white' } }} />
              <TextField fullWidth size="small" label={t('serviceDetail.email')} sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { color: 'white' } }} />
              <TextField fullWidth size="small" label={t('serviceDetail.phone')} sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { color: 'white' } }} />
              <TextField fullWidth size="small" label={t('serviceDetail.address')} sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { color: 'white' } }} />
              <TextField fullWidth select size="small" label={t('serviceDetail.serviceType')} defaultValue={serviceOptions[0]} sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { color: 'white' } }}>
                {serviceOptions.map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
              <TextField fullWidth size="small" label={t('serviceDetail.messageRequirements')} minRows={3} multiline sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: 'white' } }} />
              <Button variant="contained" fullWidth sx={{ background: 'linear-gradient(45deg, #2196F3, #FF4081)', textTransform: 'none', fontWeight: 800 }}>{t('serviceDetail.submitRequest')}</Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ServiceDetailPage;


