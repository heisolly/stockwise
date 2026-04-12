# StockWise - Professional Inventory Management for Nigerian SMEs

<div align="center">
<img width="1200" height="475" alt="StockWise Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

**The heartbeat of your Business Inventory**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

## 🌟 Overview

StockWise is a comprehensive inventory management and growth insights platform specifically designed for Small and Medium-sized Enterprises (SMEs) in the Nigerian retail market. It transforms how business owners track their stock, record sales, and make strategic decisions by combining traditional POS functionality with modern AI-powered insights.

## ✨ Key Features

### 🏢 **Smart Dashboard**
- Real-time business metrics and KPIs
- Interactive sales charts and analytics
- Low stock alerts and notifications
- Quick action buttons for common tasks
- Recent activity feed

### 📦 **Inventory Manager**
- Comprehensive product catalog management
- Categories and pricing control
- Stock level tracking with alerts
- Bulk import/export functionality
- Barcode and SKU support

### 💰 **Sales POS**
- Intuitive point-of-sale interface
- Multiple payment methods (Cash, Card, Transfer, POS)
- Customer information tracking
- Quick product search and selection
- Real-time stock updates

### 🤖 **AI Insights**
- Google Gemini-powered business analysis
- Actionable recommendations
- Risk assessment and alerts
- Performance trend analysis
- Growth opportunity identification

### 👥 **Staff Management**
- Role-based access control (Owner vs Employee)
- Staff invitation and management
- Activity tracking and permissions
- Secure user authentication

### 📊 **Reports & Analytics**
- Visual charts using Recharts
- Sales performance tracking
- Expense management
- Profit analysis
- Custom date range filtering

### ⚙️ **Settings & Configuration**
- Business profile management
- Subscription plans (Free to Premium)
- Notification preferences
- Data import/export
- Security settings

## 🛠️ Tech Stack

- **Frontend**: Next.js 14.2.4 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Fonts**: Outfit & Varela Round
- **State Management**: Redux Toolkit with Redux Persist
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/stockwise-full.git
   cd stockwise-full
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run database migrations**
   ```bash
   # Apply the database schema using Supabase dashboard or CLI
   # The schema is in the database migration files
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
stockwise-full/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── providers.tsx      # Redux providers
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── inventory/         # Inventory management
│   │   ├── sales/             # Sales POS
│   │   ├── reports/           # Reports & analytics
│   │   ├── staff/             # Staff management
│   │   ├── settings/          # Settings
│   │   ├── insights/          # AI insights
│   │   └── layout/            # Layout components
│   ├── store/                 # Redux store
│   │   ├── slices/            # Redux slices
│   │   └── index.ts           # Store configuration
│   ├── lib/                   # Utility libraries
│   │   └── supabase.ts        # Supabase client
│   ├── types/                 # TypeScript types
│   │   ├── index.ts           # App types
│   │   └── database.ts        # Database types
│   └── constants/             # App constants
│       └── index.ts
├── public/                    # Static assets
├── docs/                      # Documentation
└── README.md
```

## 🎨 Design System

StockWise uses a custom design system built with Tailwind CSS:

- **Primary Colors**: Emerald palette
- **Secondary Colors**: Blue palette  
- **Accent Colors**: Naira (Gold) palette
- **Typography**: Outfit (headings) & Varela Round (body)
- **Border Radius**: Soft, rounded corners (2xl-4xl)
- **Shadows**: Multi-level shadow system
- **Animations**: Smooth transitions with Framer Motion

## 💾 Database Schema

The application uses a comprehensive PostgreSQL schema via Supabase:

- **business_profiles** - Business information and settings
- **users** - Staff accounts and authentication
- **products** - Product catalog and inventory
- **sales** - Sales transactions and records
- **expenses** - Expense tracking
- **activity_logs** - Audit trail and activity history
- **business_insights** - AI-generated insights

## 🔐 Security Features

- Row Level Security (RLS) on all database tables
- JWT-based authentication
- Role-based access control
- Secure API endpoints
- Input validation and sanitization
- XSS protection

## 📱 Mobile Responsiveness

StockWise is fully responsive and optimized for mobile devices:

- Mobile-first design approach
- Touch-friendly interfaces
- Adaptive layouts
- Progressive Web App (PWA) ready
- Mobile-optimized navigation

## 🌍 Nigerian Market Focus

- Nigerian Naira (₦) currency support
- Local business categories
- Nigerian payment methods
- Local market insights
- Regional date/time formats

## 📈 Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| **Free Starter** | ₦0 | 10 Products, Daily Sales, 1 User |
| **Basic Shop** | ₦2,500/month | Unlimited Products, Monthly Reports |
| **Business Standard** | ₦5,000/month | Staff Management, Weekly Reports |
| **Premium Enterprise** | ₦10,000/month | AI Insights, Unlimited Staff, API Access |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: support@stockwise.ng
- **Phone**: +234-800-000-0000
- **Documentation**: [docs.stockwise.ng](https://docs.stockwise.ng)

## 🙏 Acknowledgments

- Built with ❤️ for Nigerian SMEs
- Powered by [Supabase](https://supabase.com)
- Charts by [Recharts](https://recharts.org)
- Icons by [Lucide](https://lucide.dev)

---

<div align="center">
**Made in Nigeria 🇳🇬 for Nigerian Businesses**

*Transforming inventory management, one business at a time*
</div>
#   s t o c k w i s e  
 