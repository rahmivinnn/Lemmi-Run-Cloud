# Lemmi Run - Cardano Gaming Platform

## Overview

Lemmi Run is a Unity-style Web3 gaming platform built specifically for the Cardano ecosystem. The application features real Lace wallet integration, Gerbil NFT verification, $Lemmi token tracking, mini-games, referral systems, and skill-based rewards. Built as a full-stack React + Express application, it provides an authentic gaming experience with Unity-like UI panels, HUD elements, and immersive visual design.

The platform serves as a complete gaming interface with features like Lace wallet connectivity, real-time Cardano blockchain data integration, interactive gaming elements, and a comprehensive reward system. It's designed specifically for Gerbil NFT holders and $Lemmi token users on the Cardano blockchain, providing an engaging Unity-game-style experience that bridges traditional gaming with Web3 functionality.

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
- **Lace Wallet API** - Real Cardano wallet integration for authentic blockchain connectivity
- **Cardano Network** - Native support for ADA transactions and Cardano-based assets
- **Gerbil NFT Verification** - Authentic NFT ownership verification on Cardano blockchain
- **$Lemmi Token Integration** - Real token balance tracking and transaction capabilities

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

### Design Philosophy
- **Unity-style Interface** - Game-like panels, HUD elements, and immersive visual design
- **Real Blockchain Integration** - Authentic Lace wallet connectivity, no mock data
- **Gaming-First Approach** - Designed to feel like a Unity game rather than a traditional web app
- **Cardano-Native** - Built specifically for the Cardano ecosystem and community

### Recent Changes (January 2025)
- Complete redesign to Unity-style gaming interface with HUD, navigation panels, and game aesthetics
- Migration from multi-wallet support to Lace-only integration for authentic Cardano experience
- Updated branding from "Neural Interface" to "Lemmi Run - Gerbil Edition"
- Enhanced mobile responsiveness with game-style UI elements
- Real Lace wallet API integration replacing mock wallet connections