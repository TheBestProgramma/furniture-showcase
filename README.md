# 🪑 FurniturePro - Furniture Showcase

A modern, responsive furniture showcase website built with Next.js 15, featuring a beautiful green and white design theme, interactive carousel, and mobile-first responsive design.

## ✨ Features

### 🎨 Design & UI

- **Modern Green/White Theme**: Clean, professional color scheme with primary green accents
- **Responsive Design**: Mobile-first approach that works perfectly on all devices
- **Interactive Animations**: Smooth hover effects, transitions, and transform animations
- **Professional Typography**: Clean, readable fonts with proper hierarchy

### 🏠 Homepage Sections

- **Hero Section**: Eye-catching welcome section with call-to-action buttons
- **Category Quick Links**: Interactive furniture category navigation with icons
- **Featured Products Carousel**: Auto-rotating product showcase with manual navigation
- **Furniture Care Tips**: Educational content section with helpful tips
- **Call-to-Action Section**: Conversion-focused section to drive engagement

### 🎠 Interactive Carousel

- **Auto-rotation**: Products change automatically every 5 seconds
- **Manual Navigation**: Left/right arrow buttons for user control
- **Visual Indicators**: Dot indicators showing current position
- **Smooth Transitions**: CSS transforms for seamless sliding effects
- **Responsive Layout**: Adapts beautifully to different screen sizes

### 📱 Mobile Experience

- **Hamburger Menu**: Collapsible navigation for mobile devices
- **Touch-Friendly**: Optimized button sizes and spacing for touch interaction
- **Responsive Grid**: Adaptive layouts for mobile, tablet, and desktop
- **Fast Loading**: Optimized performance with Next.js 15 and Turbopack

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Styling**: Tailwind CSS 4 with custom color palette
- **Language**: TypeScript for type safety
- **Fonts**: Geist Sans and Geist Mono from Vercel
- **Build Tool**: Turbopack for fast development
- **Database**: MongoDB with Mongoose (ready for integration)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
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
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
furniture-showcase/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── furniture/
│   │   │       └── route.ts          # API endpoints for furniture data
│   │   ├── globals.css               # Global styles and CSS variables
│   │   ├── layout.tsx                # Root layout component
│   │   └── page.tsx                  # Homepage with all sections
│   ├── components/
│   │   ├── Layout.tsx                # Main layout with header and footer
│   │   └── Footer.tsx                # Footer component
│   ├── lib/
│   │   ├── models/
│   │   │   └── Furniture.ts          # MongoDB furniture model
│   │   └── mongodb.ts                # Database connection
│   └── types/
│       └── global.d.ts               # TypeScript type definitions
├── public/                           # Static assets
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies and scripts
```

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
- **Buttons**: Consistent styling with hover effects

### Components

- **Buttons**: White background with green text and borders
- **Cards**: Rounded corners, subtle shadows, hover animations
- **Navigation**: Clean header with mobile hamburger menu
- **Carousel**: Smooth transitions with visible navigation controls

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## 🌐 API Endpoints

The project includes API routes for furniture management:

- `GET /api/furniture` - Fetch all furniture items
- `POST /api/furniture` - Create new furniture item
- Query parameters: `category`, `featured`, `limit`

## 📱 Responsive Breakpoints

- **Mobile**: `< 640px` - Single column layouts, touch-friendly
- **Tablet**: `640px - 1024px` - 2-3 column grids, medium spacing
- **Desktop**: `> 1024px` - Full layouts, hover effects, large spacing

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with zero configuration

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🔮 Future Enhancements

- [ ] Product detail pages
- [ ] Shopping cart functionality
- [ ] User authentication
- [ ] Admin dashboard
- [ ] Payment integration
- [ ] Search and filtering
- [ ] Product reviews and ratings
- [ ] Email notifications
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Built with ❤️ for showcasing beautiful furniture collections.

---

**Live Demo**: [View the application](http://localhost:3000) (when running locally)

**Tech Stack**: Next.js 15 | TypeScript | Tailwind CSS | MongoDB | Turbopack
