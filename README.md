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

- `/` - Landing page
- `/home` - Home page
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
