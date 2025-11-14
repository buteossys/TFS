// Re-export from the API service for backward compatibility
export type { Product } from './api';
export { productService, apiService } from './api';

// Firebase has been removed - all data will be handled by the backend API 