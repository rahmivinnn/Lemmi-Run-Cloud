# Neural Interface - Lemmi Protocol

## Overview

Neural Interface is a cyberpunk-themed Web3 gaming platform that combines blockchain functionality with an immersive futuristic user interface. The application features NFT verification, token balance tracking, mini-games, referral systems, and skill-based rewards. Built as a full-stack React + Express application, it offers both free access for Gerbil NFT holders and token-based payment systems using $Lemmi tokens.

The platform serves as a neural network interface simulation with features like wallet connectivity (MetaMask/Phantom), real-time blockchain data integration, interactive gaming elements, and a comprehensive reward system. It's designed to provide an engaging experience that bridges traditional gaming with Web3 functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool for fast development and optimized production builds
- **TailwindCSS** with custom cyberpunk theme for styling
- **Shadcn/ui** component library for consistent UI elements
- **React Query (TanStack Query)** for efficient API state management and caching
- **Wouter** for lightweight client-side routing

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints
- **In-memory storage** using Maps for development (production-ready for database migration)
- RESTful API design with endpoints for wallet verification, token balances, referrals, game scores, and skill rewards
- **Vite middleware integration** for seamless development experience with HMR support

### Component Structure
- **Modular component design** with separation of concerns
- **Custom hooks** for wallet connectivity, audio management, and shared state
- **Glass morphism UI** with neon borders and cyberpunk aesthetics
- **Responsive design** optimized for both desktop and mobile experiences

### Data Storage Design
- **Drizzle ORM** configured for PostgreSQL with migration support
- **Zod schemas** for runtime type validation and data integrity
- **Database tables** for users, wallets, referrals, game scores, and skill rewards
- **In-memory fallback** storage for development and testing

### Game Integration
- **Mini-game engine** with WASD controls and collision detection
- **Real-time score tracking** with persistent high score storage
- **Audio system** using Web Audio API for cyberpunk sound effects
- **Easter egg activation** through sequential user interactions

### Security and Validation
- **Input validation** using Zod schemas across all API endpoints
- **Type-safe API contracts** shared between frontend and backend
- **Error boundary implementation** with graceful fallback UI
- **CORS and security headers** configured for production deployment

## External Dependencies

### Blockchain Integration
- **@neondatabase/serverless** - PostgreSQL database connectivity for production
- **Ethereum/Solana wallet APIs** - MetaMask and Phantom wallet integration for NFT verification
- **Future Web3 providers** - Moralis, Alchemy, or QuickNode for NFT and token balance queries

### UI and Styling
- **@radix-ui/react-*** - Comprehensive set of accessible UI primitives
- **TailwindCSS** with PostCSS - Utility-first CSS framework with custom cyberpunk theme
- **Google Fonts** - Orbitron, Rajdhani, and JetBrains Mono for futuristic typography
- **Lucide React** - Icon library for consistent iconography

### Development Tools
- **Drizzle Kit** - Database migration and schema management
- **@replit/vite-plugin-runtime-error-modal** - Enhanced error reporting in development
- **@replit/vite-plugin-cartographer** - Development tooling for Replit environment

### State Management and Networking
- **@tanstack/react-query** - Server state management with caching and synchronization
- **React Hook Form** with Hookform Resolvers - Form state management and validation
- **Date-fns** - Date manipulation and formatting utilities

### Future Integrations
- **Smart contract interfaces** for $Lemmi token balance queries
- **NFT metadata APIs** for Gerbil NFT verification
- **Real-time WebSocket connections** for live multiplayer features
- **Analytics and monitoring** services for user behavior tracking