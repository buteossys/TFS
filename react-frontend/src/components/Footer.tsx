import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import Link from 'next/link';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              The Fair Shoppe
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Unique and rare finds always at fair prices.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              
              <Link href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Typography sx={{ '&:hover': { textDecoration: 'underline' } }}>
                  About Us
                </Typography>
              </Link>
              <Link href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Typography sx={{ '&:hover': { textDecoration: 'underline' } }}>
                  Contact
                </Typography>
              </Link>
            </Box>
          </Grid>
          
        </Grid>
        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} The Fair Shoppe. All rights reserved.
          </Typography>
           <a
                href="https://buteossystems.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
          <Typography variant="body2" color="text.secondary">
              Flight Plan by Buteos Systems
          </Typography>
          </a>
          <a
                href="https://soar-commerce.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
          <Typography variant="body2" color="text.secondary">
              Powered by Soar Commerce
          </Typography>
          </a>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 