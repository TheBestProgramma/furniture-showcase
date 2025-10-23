# Furniture Showcase API Documentation

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### 1. Get All Products

**GET** `/api/products`

#### Query Parameters

| Parameter   | Type    | Description                          | Example           |
| ----------- | ------- | ------------------------------------ | ----------------- |
| `page`      | number  | Page number (default: 1)             | `?page=2`         |
| `limit`     | number  | Items per page (default: 12)         | `?limit=20`       |
| `category`  | string  | Category slug                        | `?category=sofas` |
| `search`    | string  | Search term                          | `?search=leather` |
| `minPrice`  | number  | Minimum price                        | `?minPrice=100`   |
| `maxPrice`  | number  | Maximum price                        | `?maxPrice=500`   |
| `featured`  | boolean | Featured products only               | `?featured=true`  |
| `onSale`    | boolean | On-sale products only                | `?onSale=true`    |
| `inStock`   | boolean | In-stock products only               | `?inStock=true`   |
| `sortBy`    | string  | Sort field (default: createdAt)      | `?sortBy=price`   |
| `sortOrder` | string  | Sort order: asc/desc (default: desc) | `?sortOrder=asc`  |

#### Example Requests

```bash
# Get all products
curl "http://localhost:3000/api/products"

# Get products with pagination
curl "http://localhost:3000/api/products?page=1&limit=5"

# Search for sofas
curl "http://localhost:3000/api/products?search=sofa"

# Filter by category and price
curl "http://localhost:3000/api/products?category=chairs&minPrice=200&maxPrice=800"

# Get featured products sorted by price
curl "http://localhost:3000/api/products?featured=true&sortBy=price&sortOrder=asc"
```

#### Response Format

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "product_id",
        "name": "Product Name",
        "description": "Product description",
        "price": 299.99,
        "originalPrice": 399.99,
        "category": {
          "_id": "category_id",
          "name": "Category Name",
          "slug": "category-slug"
        },
        "images": ["image1.jpg", "image2.jpg"],
        "dimensions": {
          "width": 100,
          "height": 80,
          "depth": 60
        },
        "material": ["wood", "fabric"],
        "color": "Brown",
        "brand": "Brand Name",
        "sku": "SKU-001",
        "inStock": true,
        "stockQuantity": 10,
        "featured": false,
        "onSale": true,
        "discountPercentage": 25,
        "tags": ["modern", "comfortable"],
        "rating": {
          "average": 4.5,
          "count": 12
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalCount": 22,
      "limit": 12,
      "hasNextPage": true,
      "hasPrevPage": false,
      "nextPage": 2,
      "prevPage": null
    },
    "filters": {
      "category": "sofas",
      "search": "leather",
      "minPrice": 100,
      "maxPrice": 500,
      "featured": true,
      "onSale": null,
      "inStock": null,
      "sortBy": "price",
      "sortOrder": "asc"
    }
  }
}
```

### 2. Get Single Product

**GET** `/api/products/[id]`

#### Path Parameters

| Parameter | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| `id`      | string | Product ID (MongoDB ObjectId) |

#### Example Request

```bash
curl "http://localhost:3000/api/products/507f1f77bcf86cd799439011"
```

#### Response Format

```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Detailed product description",
      "price": 299.99,
      "category": {
        "_id": "category_id",
        "name": "Category Name",
        "slug": "category-slug",
        "description": "Category description",
        "image": "category-image.jpg"
      },
      "images": ["image1.jpg", "image2.jpg"],
      "dimensions": {
        "width": 100,
        "height": 80,
        "depth": 60,
        "weight": 25
      },
      "material": ["wood", "fabric"],
      "color": "Brown",
      "brand": "Brand Name",
      "productModel": "Model-001",
      "sku": "SKU-001",
      "inStock": true,
      "stockQuantity": 10,
      "featured": false,
      "onSale": true,
      "discountPercentage": 25,
      "tags": ["modern", "comfortable"],
      "specifications": {
        "Weight Capacity": "300 lbs",
        "Material": "Solid oak"
      },
      "rating": {
        "average": 4.5,
        "count": 12
      }
    },
    "relatedProducts": [
      {
        "_id": "related_product_id",
        "name": "Related Product",
        "price": 199.99,
        "category": {
          "_id": "category_id",
          "name": "Category Name",
          "slug": "category-slug"
        }
      }
    ]
  }
}
```

### 3. Get Categories

**GET** `/api/categories`

#### Query Parameters

| Parameter             | Type    | Description                        | Example                     |
| --------------------- | ------- | ---------------------------------- | --------------------------- |
| `includeProductCount` | boolean | Include product count per category | `?includeProductCount=true` |

#### Example Request

```bash
curl "http://localhost:3000/api/categories?includeProductCount=true"
```

#### Response Format

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "category_id",
        "name": "Sofas",
        "slug": "sofas",
        "description": "Comfortable seating for your living room",
        "image": "/images/categories/sofas.jpg",
        "isActive": true,
        "sortOrder": 1,
        "productCount": 3
      }
    ],
    "total": 5
  }
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid product ID format"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Product not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Failed to fetch products",
  "message": "Detailed error message"
}
```

## Testing

### Using curl

```bash
# Test basic endpoints
curl "http://localhost:3000/api/products"
curl "http://localhost:3000/api/categories"

# Test with filters
curl "http://localhost:3000/api/products?category=sofas&featured=true"
curl "http://localhost:3000/api/products?search=leather&minPrice=200&maxPrice=800"
```

### Using the test script

```bash
# Start the development server
npm run dev

# In another terminal, run the test script
node test-api.js
```

## Features

### ✅ Implemented Features

- **Pagination**: Page-based pagination with metadata
- **Search**: Full-text search across name, description, and tags
- **Filtering**: Category, price range, featured, on-sale, in-stock
- **Sorting**: Multiple sort options (price, name, date, etc.)
- **Related Products**: Automatic related product suggestions
- **Error Handling**: Comprehensive error responses
- **Type Safety**: Full TypeScript support
- **Performance**: Database indexes for fast queries

### 🔍 Search Capabilities

- Search by product name
- Search by description
- Search by tags
- Case-insensitive search
- Partial matching

### 📊 Filtering Options

- **Category**: Filter by category slug
- **Price Range**: Min/max price filtering
- **Featured**: Show only featured products
- **On Sale**: Show only discounted products
- **In Stock**: Show only available products
- **Combined**: Multiple filters can be used together

### 📄 Pagination

- Configurable page size
- Total count and page information
- Navigation helpers (next/previous page)
- Efficient database queries with skip/limit

### 🎯 Sorting Options

- **Price**: Ascending/descending
- **Name**: Alphabetical sorting
- **Date**: Creation date sorting
- **Rating**: Average rating sorting
- **Custom**: Any field can be used for sorting
