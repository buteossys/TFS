/**
 * API Service Layer for Headless Backend
 * Handles HTTP requests through Next.js API routes (which proxy to the headless backend)
 * This keeps the API key server-side only for security
 */

// Use relative URLs to call Next.js API routes, which will proxy to the headless backend
const API_BASE_URL = '';

export interface Product {
  id: string;
  title?: string;
  name?: string; // API uses 'name', frontend uses 'title'
  price: number;
  image?: string;
  images?: Array<{
    image_url: string;
    image_priority?: number;
    alt_text?: string;
  }>;
  condition?: string;
  size?: string;
  brand?: string;
  category: string;
  description?: string;
  stock?: number;
  sku?: string;
  item_number?: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Product API methods - call Next.js API routes
  async getAllProducts(): Promise<Product[]> {
    return this.request<Product[]>('/api/products');
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`);
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return this.request<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.request(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Auth API methods - call Next.js API routes
  async register(userData: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }): Promise<User> {
    return this.request<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email: string, password: string): Promise<{ access_token: string; token_type: string }> {
    // Login is handled by NextAuth, but this method is kept for backward compatibility
    // In practice, use NextAuth's signIn function instead
    throw new Error('Use NextAuth signIn instead of direct login');
  }

  // Email API methods - call Next.js API routes
  async sendEmail(emailData: {
    to: string[];
    subject: string;
    body: string;
    html_body?: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(emailData),
    });
  }

  // Payment API methods - call Next.js API routes
  // Note: The checkout route expects { items, userId } format
  async createPaymentLink(paymentData: {
    items: Array<{ title?: string; name?: string; price: number; quantity: number }>;
    userId?: string;
  }): Promise<{ url: string }> {
    return this.request<{ url: string }>('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }
}

export const apiService = new ApiService();
export const productService = {
  getAllProducts: () => apiService.getAllProducts(),
  createProduct: (product: Omit<Product, 'id'>) => apiService.createProduct(product),
  updateProduct: (id: string, product: Partial<Product>) => apiService.updateProduct(id, product),
  deleteProduct: (id: string) => apiService.deleteProduct(id),
};

export const emailService = {
  sendEmail: (emailData: { to: string[]; subject: string; body: string; html_body?: string }) => 
    apiService.sendEmail(emailData),
};

export const paymentService = {
  createPaymentLink: (paymentData: { items: Array<{ title?: string; name?: string; price: number; quantity: number }>; userId?: string }) => 
    apiService.createPaymentLink(paymentData),
};