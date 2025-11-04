# Docker Preview Environment for Jekyll Site

## Prerequisites
- Docker Desktop installed on macOS
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Build and Start the Container
```bash
cd docker
docker-compose up --build
```

### 2. Access Your Site
Open your browser and visit:
- **Main site**: http://localhost:4000
- **LiveReload**: Automatically enabled (browser will refresh on file changes)

### 3. Stop the Container
Press `Ctrl+C` in the terminal, or run:
```bash
docker-compose down
```

## Useful Commands

### Start (without rebuilding)
```bash
docker-compose up
```

### Run in background (detached mode)
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f
```

### Stop background container
```bash
docker-compose down
```

### Rebuild after Gemfile changes
```bash
docker-compose up --build
```

### Clean everything (including cache)
```bash
docker-compose down -v
```

## How It Works

- The Docker container mounts your project directory
- Jekyll watches for file changes and rebuilds automatically
- LiveReload refreshes your browser automatically
- Changes you make locally are immediately reflected in the container
- Bundle dependencies are cached in a Docker volume for faster rebuilds

## Troubleshooting

### Port already in use
If port 4000 is already in use, edit `docker-compose.yml` and change:
```yaml
ports:
  - "4001:4000"  # Use port 4001 instead
```

### Permission issues
If you encounter permission errors, try:
```bash
docker-compose down -v
docker-compose up --build
```

### Jekyll not rebuilding
Force a rebuild with:
```bash
docker-compose restart
```
