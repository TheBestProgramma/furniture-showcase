# 🪑 FurniturePro - Furniture Showcase E-Commerce Platform

A modern, full-featured furniture e-commerce platform built with Next.js 15, featuring a complete admin panel, shopping cart, order management, and WhatsApp integration.

## ✨ Features

### 🛍️ E-Commerce Features

- **Product Catalog**: Browse products with advanced filtering, search, and pagination
- **Shopping Cart**: Add to cart, update quantities, and checkout
- **Order Management**: Complete order flow with customer information and shipping
- **WhatsApp Integration**: Direct checkout via WhatsApp with order summaries and quick order buttons
- **Product Categories**: Organized product browsing by category
- **Product Details**: Detailed product pages with image galleries and specifications
- **Dynamic Footer**: Customizable contact information synced with settings
- **Customer Testimonials**: Display customer reviews and testimonials on homepage

### 👨‍💼 Admin Panel

- **Dashboard**: Overview of products, orders, and categories
- **Product Management**: Full CRUD operations for products with image uploads
- **Category Management**: Create and manage product categories
- **Order Management**: View orders, update status, filter by status, and view order details
- **Customers Management**: View all customers, order history, total spent, and customer statistics
- **Testimonials Management**: Approve, reject, feature, and manage customer testimonials
- **Tips Management**: Create and manage furniture care tips
- **Settings**: Configure business information, contact details, WhatsApp phone, return policy, and footer customization
- **User Management**: Admin user authentication and management

### 🎨 Design & UX

- **Modern Green/White Theme**: Professional color scheme
- **Responsive Design**: Mobile-first approach, works on all devices
- **Image Optimization**: Next.js Image component with lazy loading
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Accessibility**: ARIA labels and semantic HTML

### 🔒 Security

- **Input Validation**: XSS and NoSQL injection prevention
- **Authentication**: NextAuth.js with secure session management
- **Data Sanitization**: All user inputs are sanitized
- **Environment Variables**: Secure configuration management

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **State Management**: Zustand (cart)
- **Image Upload**: Cloudinary
- **Build Tool**: Turbopack
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (local or cloud)
- Cloudinary account (for image uploads)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd furniture-showcase
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB=furniture-showcase

   # Authentication
   NEXTAUTH_SECRET=your_secret_key_here
   NEXTAUTH_URL=http://localhost:3000

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   See [docs/VERCEL_ENV_SETUP.md](docs/VERCEL_ENV_SETUP.md) for detailed setup instructions.

4. **Seed the database** (optional)

   ```bash
   npm run seed        # Seed products and categories
   npm run seed-tips   # Seed furniture care tips
   ```

5. **Create admin user**

   ```bash
   npm run setup-admin
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
furniture-showcase/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel pages
│   │   │   ├── dashboard/     # Admin dashboard
│   │   │   ├── products/      # Product management
│   │   │   ├── categories/    # Category management
│   │   │   ├── orders/        # Order management
│   │   │   ├── customers/     # Customers management
│   │   │   ├── testimonials/  # Testimonials management
│   │   │   ├── tips/          # Tips management
│   │   │   ├── settings/      # Settings management
│   │   │   └── login/         # Admin login
│   │   ├── api/               # API routes
│   │   │   ├── products/      # Product API
│   │   │   ├── categories/    # Category API
│   │   │   ├── orders/        # Order API
│   │   │   ├── testimonials/  # Testimonials API
│   │   │   ├── tips/          # Tips API
│   │   │   ├── settings/      # Settings API
│   │   │   ├── upload/        # Image upload API
│   │   │   └── admin/         # Admin API routes
│   │   │       ├── products/  # Admin product API
│   │   │       ├── orders/    # Admin order API
│   │   │       ├── customers/ # Admin customers API
│   │   │       ├── testimonials/ # Admin testimonials API
│   │   │       └── settings/  # Admin settings API
│   │   ├── products/          # Product pages
│   │   ├── categories/        # Category pages
│   │   ├── tips/              # Tips pages
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout flow
│   │   └── contact/           # Contact page
│   ├── components/            # React components
│   │   ├── admin/             # Admin components
│   │   ├── providers/         # Context providers
│   │   └── ...                # Other components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and helpers
│   │   ├── models/            # MongoDB models
│   │   ├── types/             # TypeScript types
│   │   ├── security.ts        # Security utilities
│   │   ├── whatsapp.ts        # WhatsApp integration
│   │   └── ...                # Other utilities
│   ├── store/                 # State management (Zustand)
│   └── types/                 # Global TypeScript types
├── scripts/                   # Utility scripts
│   ├── check-env.js          # Environment checker
│   ├── setup-admin.js        # Admin setup
│   └── migrate-testimonials.js
├── tests/                     # Test scripts
│   ├── test-api.js           # API tests
│   ├── test-complete-api.js  # Complete API tests
│   └── test-end-to-end.js    # E2E tests
├── docs/                      # Documentation
│   ├── VERCEL_ENV_SETUP.md   # Vercel deployment guide
│   ├── LOCAL_MONGODB_SETUP.md # Local MongoDB setup
│   └── CLOUDINARY_SETUP.md    # Cloudinary setup
└── public/                    # Static assets
```

## 📚 API Endpoints

### Public Endpoints

- `GET /api/products` - Get products (with filtering, search, pagination)
- `GET /api/products/[id]` - Get single product with related products
- `GET /api/categories` - Get categories
- `GET /api/categories/[slug]` - Get category by slug
- `GET /api/tips` - Get tips (with filtering, search, pagination)
- `GET /api/tips/[slug]` - Get tip by slug
- `GET /api/testimonials` - Get approved testimonials
- `POST /api/testimonials` - Submit testimonial (pending approval)
- `GET /api/settings` - Get site settings (public)
- `POST /api/orders` - Create new order
- `POST /api/contact` - Submit contact form
- `POST /api/upload` - Upload images to Cloudinary

### Admin Endpoints (Protected)

- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `GET /api/admin/orders` - Get all orders with filtering and pagination
- `PUT /api/admin/orders/[id]` - Update order status
- `GET /api/admin/customers` - Get all customers with statistics
- `GET /api/admin/testimonials` - Get all testimonials (admin)
- `POST /api/admin/testimonials` - Create testimonial
- `PUT /api/admin/testimonials/[id]` - Update testimonial
- `DELETE /api/admin/testimonials/[id]` - Delete testimonial
- `GET /api/admin/settings` - Get settings (admin)
- `PUT /api/admin/settings` - Update settings
- Similar endpoints for categories and tips

See test files in `tests/` directory for detailed API usage examples.

## 🔧 Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run dev:unsafe` - Start dev server without env check
- `npm run build` - Build for production
- `npm run start` - Start production server

### Database

- `npm run seed` - Seed products and categories
- `npm run seed-tips` - Seed furniture care tips
- `npm run test-db` - Test database connection

### Testing

- `npm run test-api` - Run API tests
- `npm run test-complete` - Run complete API test suite
- `npm run test-e2e` - Run end-to-end tests
- `npm run test-tips` - Test tips API
- `npm run test-all` - Run all tests

### Admin

- `npm run setup-admin` - Create admin user
- `npm run reset-admin` - Reset admin password

### Utilities

- `npm run check-env` - Check environment variables

## 🎨 Design System

### Color Palette

- **Primary Green**: `#16a34a` (primary-600) - Main brand color
- **Light Green**: `#f0fdf4` (primary-50) - Background accents
- **Dark Green**: `#14532d` (primary-900) - Text and borders
- **White**: `#ffffff` - Primary background
- **Gray Scale**: Various shades for text and subtle elements

### Typography

- **Headings**: Bold, large sizes with proper hierarchy
- **Body Text**: Clean, readable fonts with good line spacing
- **Buttons**: Consistent styling with hover effects and centered content

### Customization

- **Dynamic Footer**: Contact information customizable from admin settings
- **Settings Sync**: WhatsApp contact details automatically sync with footer
- **Business Branding**: Customizable business name, description, and contact info

## 🔐 Security Features

- **Input Sanitization**: XSS prevention on all user inputs
- **NoSQL Injection Prevention**: Parameterized queries and validation
- **Data Validation**: Email, phone, and URL validation
- **Password Security**: Secure password hashing with bcrypt
- **Authentication**: Session-based authentication with NextAuth.js
- **Route Protection**: Protected admin routes with role-based access
- **Environment Variables**: Secure configuration management
- **API Security**: Admin endpoints require authentication

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

See [docs/VERCEL_ENV_SETUP.md](docs/VERCEL_ENV_SETUP.md) for detailed instructions.

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📖 Documentation

- [Vercel Environment Setup](docs/VERCEL_ENV_SETUP.md) - How to configure environment variables on Vercel
- [Local MongoDB Setup](docs/LOCAL_MONGODB_SETUP.md) - Setting up MongoDB locally
- [Cloudinary Setup](docs/CLOUDINARY_SETUP.md) - Configuring Cloudinary for image uploads

## 🆕 Recent Updates

### Version 1.1.0

- ✅ Added Customers Management page with order statistics
- ✅ Customizable footer contact details from admin settings
- ✅ WhatsApp contact sync with footer contact information
- ✅ Enhanced settings form with email and address fields
- ✅ Improved UI/UX with centered button content
- ✅ Better error handling and validation

### Key Features

- **Customers Page**: View all customers, their order history, total spent, and statistics
- **Dynamic Footer**: Footer contact details are now managed through admin settings
- **Settings Sync**: WhatsApp phone number automatically syncs with contact phone
- **Enhanced Forms**: Improved form handling for nested address fields

## 🧪 Testing

The project includes comprehensive test scripts:

- **API Tests**: Test all API endpoints
- **E2E Tests**: End-to-end integration tests
- **Database Tests**: Connection and query tests

Run tests with:

```bash
npm run test-all
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for showcasing beautiful furniture collections.

---

**Tech Stack**: Next.js 15 | TypeScript | Tailwind CSS | MongoDB | NextAuth.js | Cloudinary
