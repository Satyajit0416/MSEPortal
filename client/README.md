# Client Setup

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Configuration

The API proxy is configured in `vite.config.js` to forward requests from `/api` to `http://localhost:5000`.

