'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { productService, Product } from '@/services/db';

const categories = [
  'Food and Beverage',
  'Homegoods',
  'Apparel and Accessories',
  'Rare Books and Antiques',
  'Other'
];

const conditions = ['New','Excellent', 'Good', 'Fair', 'Poor'];

export default function AdminProductsPage() {
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    image: '',
    condition: '',
    size: '',
    brand: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    console.log('Admin products page mounted');
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      console.log('Loading products...');
      const data = await productService.getAllProducts();
      console.log('Loaded products:', data);
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting product data:', formData);
      const productData = {
        title: formData.title,
        price: parseFloat(formData.price),
        image: formData.image,
        condition: formData.condition,
        size: formData.size,
        brand: formData.brand,
        category: formData.category,
        description: formData.description,
      };

      if (editingProduct) {
        console.log('Updating product:', editingProduct.id);
        await productService.updateProduct(editingProduct.id, productData);
      } else {
        console.log('Creating new product');
        await productService.createProduct(productData);
      }

      // Close dialog first
      handleCloseDialog();
      
      // Then reload products
      console.log('Reloading products after save...');
      await loadProducts();
      
      // Clear form data
      setFormData({
        title: '',
        price: '',
        image: '',
        condition: '',
        size: '',
        brand: '',
        category: '',
        description: '',
      });
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || product.name || '',
      price: product.price.toString(),
      image: product.image || (product.images && product.images[0]?.image_url) || '',
      condition: product.condition || '',
      size: product.size || '',
      brand: product.brand || '',
      category: product.category || '',
      description: product.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleOpenDialog = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      price: '',
      image: '',
      condition: '',
      size: '',
      brand: '',
      category: '',
      description: '',
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontFamily: 'var(--font-markazi)',
            mb: 2,
          }}
        >
          Manage Products
        </Typography>

        <Button
          variant="contained"
          onClick={handleOpenDialog}
          sx={{
            mb: 4,
            fontFamily: 'var(--font-markazi)',
          }}
        >
          Add New Product
        </Button>

        {/* Products Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.title}
                      sx={{ width: 50, height: 50, objectFit: 'cover' }}
                    />
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.condition}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(product)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Image URL"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {categories.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                >
                  {conditions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 