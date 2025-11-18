"use client";

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Box,
  useTheme,
  useMediaQuery,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  Store as StoreIcon,
  Brush as BrushIcon,
  Home as HomeIcon,
  ContactSupport as ContactIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CartDrawer from './CartDrawer';
import { useCart } from '@/contexts/CartContext';
import { productService } from '@/services/db';

interface CategoryData {
  name: string;
  subcategories: string[];
}

let cachedCategories: CategoryData[] | null = null;

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const { state } = useCart();
  const cartItemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const isHomePage = pathname === '/';

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    if (cachedCategories) {
      setCategories(cachedCategories);
      return;
    }

    try {
      const products = await productService.getAllProducts();
      const categoryMap = new Map<string, Set<string>>();

      products.forEach(product => {
        if (product.category && product.is_active !== false) {
          if (!categoryMap.has(product.category)) {
            categoryMap.set(product.category, new Set());
          }
          if (product.subcategory) {
            categoryMap.get(product.category)!.add(product.subcategory);
          }
        }
      });

      const categoryData: CategoryData[] = Array.from(categoryMap.entries()).map(([name, subcategories]) => ({
        name,
        subcategories: Array.from(subcategories).sort()
      })).sort((a, b) => a.name.localeCompare(b.name));

      cachedCategories = categoryData;
      setCategories(categoryData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const getCategorySlug = (categoryName: string) => {
    return categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, '');
  };

  const getSubcategoryHash = (subcategoryName: string) => {
    return subcategoryName.toLowerCase().replace(/\s+/g, '-');
  };

  const staticMenuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'All Products', icon: <StoreIcon />, path: '/catalog' },
  ];

  const bottomMenuItems = [
    { 
      text: 'Custom Shoppe', 
      icon: <BrushIcon />, 
      path: 'https://the-fair-shoppe.printify.me',
      external: true 
    },
    { text: 'Contact Us', icon: <ContactIcon />, path: '/contact' },
  ];

  return (
    <>
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMenuOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontFamily: 'var(--font-markazi)',
            }}
          >
            The Fair Shoppe
          </Typography>

          {!isHomePage && (
            <IconButton
              color="inherit"
              onClick={() => setCartOpen(true)}
              sx={{ ml: 2 }}
            >
              <Badge badgeContent={cartItemCount} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'var(--font-markazi)',
              mb: 2,
            }}
          >
            Menu
          </Typography>
          <List>
            {/* Static menu items */}
            {staticMenuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                href={item.path}
                onClick={() => setMenuOpen(false)}
                selected={pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontFamily: 'var(--font-markazi)',
                  }}
                />
              </ListItem>
            ))}

            {/* Dynamic categories */}
            {categories.map((category) => {
              const categorySlug = getCategorySlug(category.name);
              const isExpanded = expandedCategories.has(category.name);
              const categoryPath = `/category/${categorySlug}`;
              
              return (
                <React.Fragment key={category.name}>
                  <ListItem
                    button
                    onClick={() => {
                      if (category.subcategories.length > 0) {
                        toggleCategory(category.name);
                      } else {
                        setMenuOpen(false);
                      }
                    }}
                    component={category.subcategories.length === 0 ? Link : 'div'}
                    href={category.subcategories.length === 0 ? categoryPath : undefined}
                    selected={pathname === categoryPath}
                  >
                    <ListItemIcon><StoreIcon /></ListItemIcon>
                    <ListItemText
                      primary={category.name}
                      primaryTypographyProps={{
                        fontFamily: 'var(--font-markazi)',
                      }}
                    />
                    {category.subcategories.length > 0 && (
                      isExpanded ? <ExpandLess /> : <ExpandMore />
                    )}
                  </ListItem>
                  
                  {category.subcategories.length > 0 && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem
                          button
                          component={Link}
                          href={categoryPath}
                          onClick={() => setMenuOpen(false)}
                          sx={{ pl: 4 }}
                          selected={pathname === categoryPath}
                        >
                          <ListItemText
                            primary={`All ${category.name}`}
                            primaryTypographyProps={{
                              fontFamily: 'var(--font-markazi)',
                              fontSize: '0.9rem'
                            }}
                          />
                        </ListItem>
                        {category.subcategories.map((subcategory) => {
                          const subcategoryHash = getSubcategoryHash(subcategory);
                          const subcategoryPath = `${categoryPath}#${subcategoryHash}`;
                          
                          return (
                            <ListItem
                              button
                              key={subcategory}
                              component={Link}
                              href={subcategoryPath}
                              onClick={() => setMenuOpen(false)}
                              sx={{ pl: 4 }}
                            >
                              <ListItemText
                                primary={subcategory}
                                primaryTypographyProps={{
                                  fontFamily: 'var(--font-markazi)',
                                  fontSize: '0.9rem'
                                }}
                              />
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              );
            })}

            {/* Bottom static menu items */}
            {bottomMenuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={item.external ? 'a' : Link}
                href={item.path}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={() => setMenuOpen(false)}
                selected={!item.external && pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontFamily: 'var(--font-markazi)',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
} 