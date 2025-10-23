# Database Setup Guide

## MongoDB Connection Setup

This project uses MongoDB with Mongoose for data management. Follow these steps to set up your database:

### 1. Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/furniture-showcase
MONGODB_DB=furniture-showcase

# For MongoDB Atlas (cloud), use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/furniture-showcase
# MONGODB_DB=furniture-showcase
```

### 2. Database Schemas

The project includes the following database schemas:

- **Product Schema** (`src/lib/models/Product.ts`): Comprehensive product model with categories, pricing, inventory, and specifications
- **Category Schema** (`src/lib/models/Category.ts`): Category management with hierarchical support
- **Furniture Schema** (`src/lib/models/Furniture.ts`): Legacy furniture model (existing)

### 3. Seeding the Database

To populate your database with sample data:

```bash
# Install dependencies (if not already done)
npm install

# Seed the database with 22+ mock furniture products
npm run seed
```

### 4. Testing Database Connection

To test your database connection:

```bash
npm run test-db
```

### 5. Available Scripts

- `npm run seed` - Populate database with sample data
- `npm run test-db` - Test database connection and operations
- `npm run dev` - Start development server

## Database Structure

### Categories

- Sofas
- Chairs
- Tables
- Beds
- Storage

### Products (22+ items)

The seed data includes a variety of furniture products across all categories:

- Modern and classic designs
- Different price ranges
- Various materials and colors
- Featured products and sale items
- Complete specifications and dimensions

## Features

- **Product Management**: Full CRUD operations with rich product data
- **Category Hierarchy**: Support for parent-child category relationships
- **Inventory Tracking**: Stock management and availability
- **Pricing**: Support for original prices, discounts, and sales
- **Search & Filtering**: Text search and category-based filtering
- **Performance**: Optimized with database indexes
- **Validation**: Comprehensive data validation and error handling

## Next Steps

1. Set up your MongoDB instance (local or Atlas)
2. Configure environment variables
3. Run the seeding script
4. Test the connection
5. Start building your furniture showcase application!
