# Invader Comparator Frontend

Frontend application for comparing Space Invader collections between players, built with React, TypeScript, Material-UI, and React Router.

## Tech Stack

- React 19 with TypeScript
- React Router for client-side routing
- Vite for fast development and building
- Material-UI (MUI) for the UI components
- Emotion for styling

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port)

## Configuration

### Adding Your UIDs

To use the Invader Comparator, you'll need to configure your Space Invaders UID and optionally add your friends' UIDs:

1. **Login or continue as guest**: On the home page, you can either log in with Google or continue as a guest
2. **Configure UIDs**: Follow the stepper to add your UID (UUID format: `AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA`)
3. **Add friends' UIDs**: In the second step, you can add multiple UIDs to compare collections
4. **Access settings**: You can modify your UIDs anytime via the settings drawer (click the settings icon in the header)

**Need help finding your UID?** Check out [this tutorial](https://medium.com/@cborel/mapinvaders-4684e840697f) for detailed instructions.

### Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── api/             # API client functions
├── components/      # React components
├── contexts/        # React contexts
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── theme/           # Theme configuration
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── main.tsx         # Application entry point
app/
├── root.tsx         # Root layout component
└── routes.tsx       # Route configuration
```

## Routing

The application uses React Router for navigation:

- `/` - Home page
- `/comparator` - Comparator page

## Key Components

- **Datatable** - Display and manage invader collections
- **FilterPanel** - Filter invaders by various criteria
- **Header** - Application header and navigation
- **SettingsDrawer** - User settings and preferences

## API Integration

The application connects to a backend API to fetch and compare Space Invader data. Make sure the backend service is running and accessible.

## Notes

This project uses CommonJS modules. The build process is handled by Vite, which provides fast hot module replacement during development.
