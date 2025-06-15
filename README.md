# SefTech Logistics Platform

A comprehensive truck management and logistics platform built with Next.js, Supabase, and TypeScript.

## Features

### Multi-Role Dashboard System
- **Driver Portal**: Trip management, payment tracking, benefits requests
- **Supervisor Portal**: Fleet oversight, maintenance approvals, SLA monitoring
- **Contractor Portal**: Contract management, financial analytics, performance reports

### Core Capabilities
- 🚛 **Fleet Management**: Real-time truck tracking and status monitoring
- 📊 **SLA Compliance**: Automated progress tracking and reporting
- 💰 **Payment Integration**: Multiple payment gateways (Paystack, Flutterwave, Stripe)
- 🛂 **KYC Verification**: Identity verification with Prembly
- 🔧 **Maintenance Management**: Request workflows and cost tracking
- 📱 **Mobile Responsive**: Optimized for mobile and tablet use
- 🔔 **Real-time Notifications**: Push notifications and in-app alerts
- 📈 **Analytics & Reporting**: Comprehensive performance dashboards
- 🛡️ **Error Handling**: Robust error boundaries and recovery mechanisms

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Payments**: Paystack, Flutterwave, Stripe
- **Identity Verification**: Prembly
- **Maps**: Mapbox GL
- **Monitoring**: Sentry
- **State Management**: React Query, Context API
- **Deployment**: Netlify

## Quick Start

```bash
# Clone the repository
git clone https://github.com/seftech/logistics_project.git
cd logistics_project

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys and configurations

# Run development server
npm run dev
```

## Deployment

### Netlify Deployment

1. Fork this repository to your GitHub account
2. Log in to Netlify and click "New site from Git"
3. Connect your GitHub account and select the repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variables in Netlify's settings:
   - All variables from `.env.example`
6. Deploy the site

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Error Handling Strategy

The platform implements a comprehensive error handling strategy:

1. **Component-Level Error Boundaries**: Isolate failures to specific UI components
2. **Global Error Handler**: Capture unhandled exceptions across the application
3. **API Error Handling**: Standardized error responses with detailed messages
4. **Connection Status Monitoring**: Detect and recover from network failures
5. **Retry Mechanisms**: User-friendly retry options for failed operations

## Documentation

The project includes comprehensive documentation:

- **[User Onboarding Guide](docs/user-onboarding.md)**: Step-by-step guide for new users
- **[Third-Party Integrations](docs/third-party-integrations.md)**: How to use Paystack, Flutterwave, and Prembly
- **[API Documentation](https://documenter.getpostman.com/view/123456/logistics-api)**: Postman collection for API endpoints
- **[Database Schema](database/schema.sql)**: SQL schema for the Supabase database

### Prerequisites
- Node.js 18+ 
- Supabase account
- Stripe account (for payments)
- Mapbox account (for mapping)

### Installation

1. **Clone and install dependencies**
   ```bash
   cd logistics-platform
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   
   SENTRY_DSN=your_sentry_dsn
   ```

3. **Database Setup**
   - Go to your Supabase project
   - Run the SQL schema from `database/schema.sql` in the SQL editor
   - Enable Row Level Security policies

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Architecture Overview

```
logistics-platform/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Role-based dashboards
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components  
│   ├── dashboard/        # Dashboard-specific components
│   └── layout/           # Layout components
├── contexts/             # React contexts for state
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configs
└── database/             # Database schema and migrations
```

## User Roles & Permissions

### Driver
- View assigned trips and truck information
- Track payment status and request benefits
- Submit maintenance requests
- Update trip status and locations

### Supervisor  
- Monitor fleet operations and driver performance
- Approve/reject maintenance requests
- Generate SLA compliance reports
- Manage driver assignments

### Contractor
- Full access to contract management
- Financial dashboard and payment processing
- Fleet analytics and performance metrics
- Driver and truck management

### Admin
- System-wide access and configuration
- User management and role assignments
- Platform analytics and monitoring

## Database Schema

Key tables:
- `profiles` - User information and roles
- `trucks` - Fleet vehicle management
- `trips` - Trip tracking and logistics
- `contracts` - Contract management
- `payments` - Financial transactions
- `notifications` - Real-time messaging

See `database/schema.sql` for complete schema.

## API Integration

### Stripe Payments
```typescript
// Payment processing
const payment = await stripe.paymentIntents.create({
  amount: calculateAmount(tripData),
  currency: 'ngn',
  metadata: { trip_id: tripId }
})
```

### Real-time Updates
```typescript
// Supabase real-time subscriptions
const channel = supabase
  .channel('truck-locations')
  .on('postgres_changes', {
    event: '*',
    schema: 'public', 
    table: 'truck_locations'
  }, handleLocationUpdate)
  .subscribe()
```

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Environment Variables
Set all required environment variables in your deployment platform:
- Supabase credentials
- Stripe keys  
- Mapbox token
- Sentry DSN

## Contract Management

The platform implements the MOU structure for truck management:

### Key Features
- **Weekly Targets**: Configurable trip targets per truck/week
- **Early Completion Incentives**: Automatic bonus calculations
- **Maintenance Protocols**: Cost tracking and approval workflows  
- **Payment Terms**: Automated weekly upfront payment processing
- **Driver Management**: Daily reporting and key management system

### SLA Monitoring
- Real-time progress tracking
- Automated rollover for incomplete targets
- Performance analytics and reporting
- Penalty calculations for non-compliance

## Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm test             # Run tests
```

### Code Structure
- Use TypeScript for all new code
- Follow the established component patterns
- Implement proper error handling
- Write tests for business logic
- Use proper ESLint configuration

## Monitoring & Analytics

### Sentry Integration
- Error tracking and performance monitoring
- User session recording
- Release tracking and alerts

### Performance Optimization
- Image optimization with Next.js
- Code splitting and lazy loading
- Database query optimization
- Caching strategies

## Support & Maintenance

### Regular Tasks
- Database backups and monitoring
- Security updates and patches  
- Performance optimization
- User feedback integration

### Troubleshooting
Common issues and solutions documented in `/docs/troubleshooting.md`

## License

Proprietary - SefTech Hub Limited

## Contact

For technical support: tech@seftech.com
For business inquiries: business@seftech.com
