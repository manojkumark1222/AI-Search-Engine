# Frontend Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Configuration

The API base URL is configured in `src/services/api.js`. Default is:
```javascript
baseURL: "http://127.0.0.1:8000"
```

Change this if your backend runs on a different port or host.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features

- **Login/Register** - User authentication
- **Dashboard** - Overview and statistics
- **Connections** - Manage data source connections
- **Query Chat** - Natural language query interface

## Usage

1. Register a new account or login with existing credentials
2. Add data connections in the Connections page
3. Query your data using natural language in the Query page
4. View results and suggested actions

