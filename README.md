# Lemmi Run - 3D Running Game

A retro-futuristic 3D running game built with React, Three.js, and Express.js.

## Features

- 3D character running game with multiple characters
- Coin collection and obstacle avoidance
- Real-time score tracking
- Responsive design with cyberpunk aesthetics
- Multiple character selection (King Lemmi, Cowboy Gerbil, Grim Reaper, Snow Gerbil)

## Tech Stack

- **Frontend**: React, TypeScript, Three.js, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **Database**: Drizzle ORM with Neon PostgreSQL
- **Deployment**: Vercel

## Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/rahmivinnn/Lemmi-Run-Cloud.git
cd Lemmi-Run-Cloud
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment to Vercel

1. Push your code to GitHub (already done)
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

## Environment Variables

See `.env.example` for required environment variables.

## Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities
├── server/          # Express backend
│   ├── index.ts     # Main server file
│   ├── routes.ts    # API routes
│   └── db.ts        # Database configuration
├── shared/          # Shared types and schemas
├── public/          # Static assets and 3D models
└── vercel.json      # Vercel deployment configuration
```

## Game Controls

- **A/D or Arrow Keys**: Move left/right
- **W/S or Arrow Keys**: Move forward/backward
- **Mouse**: Look around
- **Spacebar**: Jump (if implemented)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.