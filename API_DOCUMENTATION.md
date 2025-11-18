# Soar Commerce API Documentation

## Base URL

```
https://api.soar-commerce.com/api/v1
```

For local development:
```
http://localhost:8080/api/v1
```

## Authentication

The API supports multiple authentication methods:

### JWT Token Authentication (Customer Users)
For customer-facing applications, use JWT tokens obtained from the `/auth/token` endpoint.

**Header Format:**
```
Authorization: Bearer <jwt_token>
```

### API Key Authentication (External Applications)
For external applications using API keys created by backend users.

**Header Format (Option 1):**
```
X-API-Key: <api_key>
```

**Header Format (Option 2):**
```
Authorization: Bearer <api_key>
```

API keys start with `sk_live_` (production) or `sk_test_` (sandbox).

---

## Endpoints

### Authentication

#### Register a New User
```http
POST /auth/register
```

Create a new customer user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe",
  "address": {
    "address_line_1": "123 Main St",
    "address_line_2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "US"
  },
  "phone_number": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "customer",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

#### Login (Get JWT Token)
```http
POST /auth/token
Content-Type: application/x-www-form-urlencoded
```

Authenticate and receive a JWT token.

**Request Body (Form Data):**
```
username=user@example.com&password=securepassword123
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": "user_123"
}
```

---

#### Google OAuth Login
```http
POST /auth/google
```

Authenticate using Google OAuth2 ID token.

**Request Body:**
```json
{
  "token": "google_id_token_here"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### Products

**Important Notes:**
- **Stock Management**: The `stock` field in product responses is a computed value aggregated from all active variants. Stock is not stored directly on products but on product variants.
- **Automatic Primary Variant**: When creating or updating a product, if a `stock` value is provided, the system automatically creates or updates a primary/default variant (with no options) to store that stock quantity. All products have at least one primary variant.
- **Price Field**: The API accepts `price` in requests, which is automatically mapped to `base_price` in the backend. Responses return `base_price` mapped back to `price` for frontend compatibility.
- **Subcategory**: Optional `subcategory` may be set and is always associated with a `category`.

#### List All Products
```http
GET /products?skip=0&limit=100
```

Retrieve a list of products. Public endpoint - no authentication required.

**Query Parameters:**
- `skip` (optional): Number of products to skip (default: 0)
- `limit` (optional): Maximum number of products to return (default: 100, max: 100)
- `id` (optional): Get a single product by ID

**Response:** `200 OK`
```json
[
  {
    "id": "prod_123",
    "name": "Product Name",
    "description": "Product description",
    "base_price": 29.99,
    "price": 29.99,
    "images": [
      {
        "image_url": "https://example.com/image.jpg",
        "image_priority": 0,
        "tag": "thumbnail"
      }
    ],
    "category": "Electronics",
    "subcategory": "Headphones",
    "stock": 100,
    "sku": "SKU-123",
    "item_number": "ITEM-001",
    "is_active": true,
    "available_colors": ["Red", "Blue"],
    "available_sizes": ["S", "M", "L"],
    "search_keywords": ["summer", "beach"],
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

**Note:** The `stock` field is computed from the sum of all active variants' stock quantities.

---

#### Get Product by ID
```http
GET /products/{product_id}
```

Get a single product by its ID. Public endpoint.

**Response:** `200 OK`
```json
{
  "id": "prod_123",
  "name": "Product Name",
  "description": "Product description",
  "base_price": 29.99,
  "price": 29.99,
  "images": [...],
  "category": "Electronics",
  "subcategory": "Headphones",
  "stock": 100,
  "sku": "SKU-123",
  "item_number": "ITEM-001",
  "is_active": true,
  "available_colors": ["Red", "Blue"],
  "available_sizes": ["S", "M", "L"],
  "search_keywords": ["summer", "beach"],
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Note:** The `stock` field is computed from the sum of all active variants' stock quantities.

---

#### Create Product
```http
POST /products
Authorization: Bearer <jwt_token_or_api_key>
```

Create a new product. Requires backend user authentication (admin/super_admin role) or API key.

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description here",
  "price": 49.99,
  "base_price": 49.99,
  "images": [
    {
      "image_url": "https://example.com/image.jpg",
      "image_priority": 0,
      "tag": "thumbnail"
    }
  ],
  "category": "Electronics",
  "subcategory": "Headphones",
  "stock": 50,
  "sku": "SKU-NEW",
  "item_number": "ITEM-001",
  "weight": 1.5,
  "dimensions": {
    "length": 10,
    "width": 5,
    "height": 3
  },
  "package_dimensions": {
    "length": 12,
    "width": 7,
    "height": 5
  },
  "materials": ["Cotton", "Polyester"],
  "manufacturer": "Acme Corp",
  "is_active": true,
  "available_colors": ["Red", "Blue"],
  "available_sizes": ["S", "M", "L"],
  "search_keywords": ["summer", "beach"],
  "upsell_product_ids": ["prod_789"],
  "cross_sell_product_ids": ["prod_101"],
  "related_product_ids": ["prod_202"],
  "is_bundle": false,
  "metadata": {
    "color": "red",
    "size": "large"
  }
}
```

**Important:**
- If `stock` is provided, a primary/default variant is automatically created with that stock quantity.
- If `stock` is not provided or is 0, a primary variant is still created with stock 0.
- The `price` field is accepted but mapped to `base_price` internally. You can use either field.
- The `tenant_id` field is required and must match the authenticated user's project/tenant.

**Response:** `201 Created`
```json
{
  "id": "prod_456",
  "name": "New Product",
  "description": "Product description here",
  "base_price": 49.99,
  "price": 49.99,
  "category": "Electronics",
  "stock": 50,
  "created_at": "2024-01-01T00:00:00Z",
  ...
}
```

**Note:** The returned `stock` value is computed from the created primary variant.

---

#### Update Product
```http
PUT /products/{product_id}
Authorization: Bearer <jwt_token_or_api_key>
```

Update an existing product. Requires backend user authentication (admin/super_admin role) or API key.

**Request Body (all fields optional):**
```json
{
  "name": "Updated Product Name",
  "price": 39.99,
  "base_price": 39.99,
  "stock": 75,
  "description": "Updated description",
  "category": "Updated Category",
  "subcategory": "Updated Subcategory",
  "is_active": true,
  "available_colors": ["Red", "Blue", "Green"],
  "search_keywords": ["winter", "cozy"]
}
```

**Important:**
- If `stock` is provided, the system updates the existing primary variant (variant with no options) or creates one if it doesn't exist.
- If `stock` is not provided but no primary variant exists, one is automatically created with stock 0.
- The `price` field is accepted but mapped to `base_price` internally. You can use either field.

**Response:** `200 OK`
```json
{
  "id": "prod_123",
  "name": "Updated Product Name",
  "base_price": 39.99,
  "price": 39.99,
  "stock": 75,
  ...
}
```

**Note:** The returned `stock` value is computed from all active variants.

**Alternative with query parameter:**
```http
PUT /products?id={product_id}
```

---

#### Delete Product
```http
DELETE /products/{product_id}
Authorization: Bearer <jwt_token_or_api_key>
```

Delete a product. Requires backend user authentication (admin/super_admin role) or API key.

**Response:** `204 No Content`

**Alternative with query parameter:**
```http
DELETE /products?id={product_id}
```

---

#### Get Product Images
```http
GET /products/{product_id}/images
```

Get all images for a specific product. Public endpoint.

**Response:** `200 OK`
```json
[
  {
    "product_item_number": "ITEM-001",
    "image_url": "https://example.com/image.jpg",
    "image_priority": 0,
    "tag": "thumbnail",
    "image_size": [800, 600]
  }
]
```

---

#### Bulk Upload Products
```http
POST /products/bulk-upload
Authorization: Bearer <jwt_token_or_api_key>
Content-Type: multipart/form-data
```

Create multiple products from a CSV or Excel file. Requires backend user authentication (admin/super_admin role) or API key.

**Request:**
- File upload (multipart/form-data)
- Accepted file types: `.csv`, `.xlsx`, `.xls`

**CSV/Excel File Format:**
The file should contain columns that map to product fields. Required columns:
- `name` (string, min 3 characters)
- `description` (string, min 1 character)
- `price` or `base_price` (number, >= 0)
- `category` (string, min 3 characters)

Optional columns:
- `stock` (number, >= 0) - If provided, creates a primary variant with this stock quantity
- `item_number` (string)
- `sku` (string)
- `weight` (number)
- `manufacturer` (string)
- `is_active` (boolean, default: true)
- `available_colors` (comma-separated string, e.g., "Red,Blue,Green")
- `available_sizes` (comma-separated string, e.g., "S,M,L")
- `search_keywords` (comma-separated string, e.g., "summer,beach,vacation")
- `materials` (comma-separated string, e.g., "Cotton,Polyester")

**Example CSV:**
```csv
name,description,price,category,stock,item_number,manufacturer
"T-Shirt","Comfortable cotton t-shirt",29.99,"Clothing",50,"TS-001","Acme Corp"
"Jeans","Classic blue jeans",59.99,"Clothing",30,"JE-002","Fashion Co"
```

**Response:** `200 OK`
```json
{
  "message": "Bulk upload complete. 2 products created, 0 failed.",
  "success_count": 2,
  "failure_count": 0,
  "created_ids": ["prod_123", "prod_456"],
  "failed_rows": []
}
```

**Error Response:** `200 OK` (with failures)
```json
{
  "message": "Bulk upload complete. 1 products created, 1 failed.",
  "success_count": 1,
  "failure_count": 1,
  "created_ids": ["prod_123"],
  "failed_rows": [
    {
      "row_index": 3,
      "data": {
        "name": "Invalid Product",
        "price": -10
      },
      "error": "base_price must be >= 0"
    }
  ]
}
```

**Important Notes:**
- Each product created will automatically have a primary variant created with the stock quantity from the file (or 0 if not provided).
- The `tenant_id` is automatically set from the authenticated user's project.
- Failed rows are reported but don't prevent successful products from being created.
- All products are created in a single transaction for data consistency.

---

### Orders

#### Create Order
```http
POST /orders
Authorization: Bearer <jwt_token_or_api_key>
```

Create a new order. Requires authentication. Customer users can only create orders for themselves.

**Request Body:**
```json
{
  "user_id": "user_123",
  "project_id": "proj_456",
  "items": [
    {
      "product_id": "prod_123",
      "name": "Product Name",
      "price": 29.99,
      "quantity": 2
    }
  ],
  "total_price": 59.98,
  "shipping_address": {
    "address_line_1": "123 Main St",
    "address_line_2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "US"
  },
  "status": "pending"
}
```

**Response:** `201 Created`
```json
{
  "id": "order_789",
  "user_id": "user_123",
  "items": [...],
  "total_price": 59.98,
  "status": "pending",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

#### List Orders
```http
GET /orders
Authorization: Bearer <jwt_token_or_api_key>
```

List orders. Backend users can see all orders, customer users can only see their own.

**Query Parameters:**
- `id` (optional): Get a single order by ID

**Response:** `200 OK`
```json
[
  {
    "id": "order_789",
    "user_id": "user_123",
    "items": [...],
    "total_price": 59.98,
    "status": "pending",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

#### Get Order by ID
```http
GET /orders/{order_id}
Authorization: Bearer <jwt_token_or_api_key>
```

Get a single order by ID. Backend users can see any order, customer users can only see their own.

**Response:** `200 OK`
```json
{
  "id": "order_789",
  "user_id": "user_123",
  "items": [...],
  "total_price": 59.98,
  "status": "pending"
}
```

---

#### List Orders by User
```http
GET /orders/user/{user_id}
Authorization: Bearer <jwt_token_or_api_key>
```

List all orders for a specific user. Backend users can see any user's orders, customer users can only see their own.

**Response:** `200 OK`
```json
[
  {
    "id": "order_789",
    "user_id": "user_123",
    ...
  }
]
```

---

#### Update Order
```http
PUT /orders/{order_id}
Authorization: Bearer <jwt_token>
```

Update an order. Requires backend user authentication (admin/super_admin role).

**Request Body:**
```json
{
  "status": "shipped",
  "updated_at": "2024-01-02T00:00:00Z"
}
```

**Response:** `200 OK`
```json
{
  "id": "order_789",
  "status": "shipped",
  ...
}
```

**Alternative with query parameter:**
```http
PUT /orders?id={order_id}
```

---

#### Delete Order
```http
DELETE /orders/{order_id}
Authorization: Bearer <jwt_token>
```

Delete an order. Requires backend user authentication (admin/super_admin role).

**Response:** `204 No Content`

**Alternative with query parameter:**
```http
DELETE /orders?id={order_id}
```

---

### Users

#### Get User by ID
```http
GET /users/{user_id}
Authorization: Bearer <jwt_token_or_api_key>
```

Get a user profile. Backend users can see any user, customer users can only see their own.

**Response:** `200 OK`
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "address": {...},
  "phone_number": "+1234567890",
  "role": "customer",
  "orders": [],
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

#### List All Users
```http
GET /users
Authorization: Bearer <jwt_token>
```

List all customer users. Requires backend user authentication (admin/super_admin role).

**Query Parameters:**
- `id` (optional): Get a single user by ID

**Response:** `200 OK`
```json
[
  {
    "id": "user_123",
    "email": "user@example.com",
    ...
  }
]
```

---

#### Create User
```http
POST /users
Authorization: Bearer <jwt_token>
```

Create a new customer user. Requires backend user authentication (admin/super_admin role).

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "first_name": "Jane",
  "last_name": "Smith"
}
```

**Response:** `201 Created`
```json
{
  "id": "user_456",
  "email": "newuser@example.com",
  ...
}
```

---

#### Update User
```http
PUT /users/{user_id}
Authorization: Bearer <jwt_token>
```

Update a user. Requires backend user authentication (admin/super_admin role).

**Request Body:**
```json
{
  "first_name": "Updated Name",
  "phone_number": "+1987654321"
}
```

**Response:** `200 OK`
```json
{
  "id": "user_123",
  "first_name": "Updated Name",
  ...
}
```

---

#### Delete User
```http
DELETE /users/{user_id}
Authorization: Bearer <jwt_token>
```

Delete a user. Requires backend user authentication (admin/super_admin role).

**Response:** `204 No Content`

---

### Categories

#### List Categories
```http
GET /categories
```

Get all product categories. Public endpoint.

**Query Parameters:**
- `id` (optional): Get a specific category

**Response:** `200 OK`
```json
[
  {
    "id": "electronics",
    "name": "Electronics",
    "description": "Products in the Electronics category",
    "is_active": true,
    "product_count": 25
  }
]
```

---

#### Get Category by ID
```http
GET /categories/{category_id}
```

Get a single category by ID. Public endpoint.

**Response:** `200 OK`
```json
{
  "id": "electronics",
  "name": "Electronics",
  "is_active": true
}
```

---

#### Create Category
```http
POST /categories
Authorization: Bearer <jwt_token>
```

Create a new category. Requires backend user authentication (admin/super_admin role).

**Request Body:**
```json
{
  "name": "New Category",
  "description": "Category description",
  "is_active": true
}
```

**Response:** `201 Created`
```json
{
  "id": "new-category",
  "name": "New Category",
  ...
}
```

---

#### Update Category
```http
PUT /categories/{category_id}
Authorization: Bearer <jwt_token>
```

Update a category. Requires backend user authentication (admin/super_admin role).

**Request Body:**
```json
{
  "name": "Updated Category Name",
  "is_active": false
}
```

**Response:** `200 OK`

---

#### Delete Category
```http
DELETE /categories/{category_id}
Authorization: Bearer <jwt_token>
```

Delete a category. Requires backend user authentication (admin/super_admin role).

**Response:** `204 No Content`

---

### Cart

#### Get Cart
```http
GET /cart
Authorization: Bearer <jwt_token>
```

Get current user's shopping cart. Requires customer authentication.

**Response:** `200 OK`
```json
{
  "items": [],
  "total": 0,
  "user_id": "user_123"
}
```

---

#### Add to Cart
```http
POST /cart
Authorization: Bearer <jwt_token>
```

Add an item to the cart. Requires customer authentication.

**Request Body:**
```json
{
  "product_id": "prod_123",
  "quantity": 2
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Item added to cart",
  "item": {...},
  "user_id": "user_123"
}
```

---

#### Update Cart
```http
PUT /cart
Authorization: Bearer <jwt_token>
```

Update the cart. Requires customer authentication.

**Request Body:**
```json
{
  "items": [
    {
      "product_id": "prod_123",
      "quantity": 3
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Cart updated",
  "cart": {...}
}
```

---

#### Clear Cart
```http
DELETE /cart
Authorization: Bearer <jwt_token>
```

Clear the cart. Requires customer authentication.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Cart cleared",
  "user_id": "user_123"
}
```

---

### Checkout

#### Create Checkout Session
```http
POST /checkout
Authorization: Bearer <jwt_token>
```

Create a checkout session for payment processing. Requires customer authentication.

**Request Body:**
```json
{
  "order_id": "order_789",
  "line_items": [
    {
      "price": 2999,
      "quantity": 2
    }
  ],
  "success_url": "https://example.com/success",
  "cancel_url": "https://example.com/cancel"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "checkout_url": "https://checkout.stripe.com/session_id",
  "session_id": "cs_test_session_id"
}
```

---

### Shipping

#### Get Shipping Rates
```http
POST /shipping/rates
```

Calculate shipping rates for an address and parcel. Public endpoint.

**Request Body:**
```json
{
  "to_address": {
    "street1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US"
  },
  "parcel": {
    "length": 10,
    "width": 5,
    "height": 3,
    "weight": 1.5
  }
}
```

**Response:** `200 OK`
```json
[
  {
    "id": "rate_123",
    "service": "USPS Ground",
    "rate": "5.99",
    "shipment_id": "shp_456"
  }
]
```

---

#### Purchase Shipping Label
```http
POST /shipping/purchase-label
Authorization: Bearer <jwt_token>
```

Purchase a shipping label. Requires backend user authentication (admin/super_admin role).

**Request Body:**
```json
{
  "shipment_id": "shp_456",
  "rate_id": "rate_123"
}
```

**Response:** `200 OK`
```json
{
  "label_url": "https://example.com/label.pdf",
  "tracking_code": "1234567890"
}
```

---

#### Shipping Webhook
```http
POST /shipping/webhooks/shipping
```

Webhook endpoint for EasyPost shipping events. No authentication required (webhook signature verified).

---

### Payments

#### Create Payment Link
```http
POST /payments/create-payment-link
Authorization: Bearer <jwt_token>
```

Create a Stripe payment link. Requires customer authentication.

**Request Body:**
```json
{
  "order_id": "order_789",
  "project_id": "proj_456",
  "line_items": [
    {
      "price": 2999,
      "quantity": 2
    }
  ],
  "success_url": "https://example.com/success",
  "cancel_url": "https://example.com/cancel"
}
```

**Response:** `200 OK`
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

---

#### Process Payment
```http
POST /payments/pay
Authorization: Bearer <jwt_token>
```

Process a payment using Stripe Payment Intent. Requires customer authentication.

**Request Body:**
```json
{
  "amount_cents": 5998,
  "source_id": "card_123",
  "order_id": "order_789"
}
```

**Response:** `200 OK`
```json
{
  "payment": {
    "id": "pi_123",
    "status": "succeeded"
  }
}
```

---

#### Stripe Webhook
```http
POST /payments/webhook
```

Webhook endpoint for Stripe payment events. No authentication required (webhook signature verified).

---

### Profile

#### Get Profile
```http
GET /profile
Authorization: Bearer <jwt_token>
```

Get current user's profile. Requires customer authentication.

**Response:** `200 OK`
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "address": {...},
  "phone_number": "+1234567890",
  "role": "customer",
  "orders": [],
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

#### Get Profile by ID
```http
GET /profile/{user_id}
Authorization: Bearer <jwt_token>
```

Get user profile by ID. Requires customer authentication and can only view own profile.

**Response:** `200 OK`
```json
{
  "id": "user_123",
  ...
}
```

---

### Upload

#### Upload Image
```http
POST /upload
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

Upload an image file to Firebase Storage. Requires backend user authentication (admin/developer/super_admin role).

**Request Body (Form Data):**
```
image: <file>
```

**Response:** `200 OK`
```json
{
  "url": "https://firebasestorage.googleapis.com/v0/b/.../products/uuid.jpg"
}
```

---

### Email

#### Send Email
```http
POST /email/send
```

Send an email.

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "body": "Email body content",
  "html": "<p>HTML email content</p>"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

---

#### Register Email
```http
POST /email/register
```

Register an email for early access.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Registration successful! Check your email for confirmation.",
  "email": "user@example.com"
}
```

**Alternative GET endpoint:**
```http
GET /email/register?email=user@example.com
```

---

#### Unsubscribe from Email
```http
GET /email/unsubscribe?email=user@example.com&token=optional_token
```

Unsubscribe from marketing emails.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Successfully unsubscribed",
  "email": "user@example.com"
}
```

**Alternative POST endpoint:**
```http
POST /email/unsubscribe
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "token": "optional_token"
}
```

---

#### Check Unsubscribe Status
```http
GET /email/unsubscribe/status?email=user@example.com
```

Check if an email is unsubscribed.

**Response:** `200 OK`
```json
{
  "email": "user@example.com",
  "unsubscribed": false
}
```

---

### Queue

#### Get Queue Status
```http
GET /queue/status
```

Get queue status and statistics.

**Response:** `200 OK`
```json
{
  "status": "operational",
  "redis_connected": true,
  "queued_jobs": 5,
  "redis_info": {
    "connected_clients": "10",
    "used_memory_human": "2.5M"
  }
}
```

---

#### Get Job Status
```http
GET /queue/job/{job_id}
```

Get status of a specific job.

**Response:** `200 OK`
```json
{
  "job_id": "job_123",
  "status": "completed",
  "result": {...},
  "finish_timestamp": "2024-01-01T00:00:00Z"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "detail": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

API rate limits may apply. Check response headers for rate limit information:
- `X-RateLimit-Limit`: Maximum requests per time window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

---

## Pagination

Endpoints that return lists support pagination via query parameters:
- `skip`: Number of items to skip (default: 0)
- `limit`: Maximum items to return (default: 100, max: 100)

---

## Webhooks

The API supports webhooks for:
- **Shipping Events**: `/shipping/webhooks/shipping` (EasyPost)
- **Payment Events**: `/payments/webhook` (Stripe)

Webhook signatures are verified for security. Ensure your webhook endpoints are publicly accessible.

---

## Support

For API support, please contact your platform administrator or refer to the dashboard documentation.

