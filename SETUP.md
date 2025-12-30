# InvenTree Inventory Management System - Setup Guide

This repository contains the complete InvenTree inventory management system with Docker setup and Postman API collection.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup Instructions](#detailed-setup-instructions)
- [Accessing InvenTree](#accessing-inventree)
- [API Testing with Postman](#api-testing-with-postman)
- [Updating InvenTree](#updating-inventree)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Docker** (version 20.10 or higher)
  - [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (version 2.0 or higher)
  - [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Git** (for cloning the repository)
  - [Install Git](https://git-scm.com/downloads)

### Verify Installation

```bash
docker --version
docker compose version
git --version
```

---

## Quick Start

Get InvenTree up and running in 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/alokpandey/Inventory-system.git
cd Inventory-system

# 2. Run the following commands in sequence from root of the repository
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml run --rm inventree-dev-server invoke install
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml run --rm inventree-dev-server invoke dev.setup-test --dev
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml up -d

# 6. Access InvenTree at http://localhost:8000
```

That's it! InvenTree should now be running at **http://localhost:8000**

---

## Detailed Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/alokpandey/Inventory-system.git
cd Inventory-system
```

### Step 2: Bring up dev environment using docker compose

```bash
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml run --rm inventree-dev-server invoke install
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml run --rm inventree-dev-server invoke dev.setup-test --dev
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml up -d
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml run --rm inventree-dev-server invoke int.frontend-build
# Have seen the UI doesn't hot reload, so stop and start again
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml down
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml up -d
```

### Step 3: Configure Environment Variables (Optional)

The `docker.dev.env` file is pre-configured with sensible defaults. However, you may want to customize:

```bash
# Edit the .env file
nano docker.dev.env  # or use your preferred editor
```

**Important variables to review:**

| Variable | Default | Description |
|----------|---------|-------------|
| `INVENTREE_SITE_URL` | `http://localhost:8000` | URL where InvenTree will be accessible |
| `INVENTREE_DB_USER` | `pguser` | PostgreSQL database username |
| `INVENTREE_DB_PASSWORD` | `pgpassword` | PostgreSQL database password (change for production!) |

**Security Note:** For production deployments, always change the default database credentials!

### Step 4: Use pre-created admin account

```text
username: admin
password: inventree
```

### Step 5: Verify Installation

Check that all containers are running:

```bash
docker compose --project-directory . -f contrib/container/dev-docker-compose.ymlps
```

All containers should show status as "Up" or "running".

View logs to ensure no errors:

```bash
docker compose --project-directory . -f contrib/container/dev-docker-compose.ymllogs -f
```

Press `Ctrl+C` to stop following logs.

---

## Accessing InvenTree

Once all containers are running:

1. **Open your web browser**
2. **Navigate to:** [http://localhost:8000](http://localhost:8000)
3. **Login** with the admin credentials you created in Step 5

### Default Access Points

- **Web Interface:** http://localhost:8000
- **API Documentation:** http://localhost:8000/api/
- **Admin Panel:** http://localhost:8000/admin/

### External Access

To access InvenTree from other devices on your network:

1. Find your machine's IP address:
   ```bash
   # On Linux/Mac
   ifconfig | grep "inet "
   
   # On Windows
   ipconfig
   ```

2. Update `INVENTREE_SITE_URL` in `.env`:
   ```bash
   INVENTREE_SITE_URL=http://192.168.1.100  # Use your actual IP
   ```

3. Restart containers:
   ```bash
   docker compose down
   docker compose up -d
   ```

---

## API Testing with Postman

This repository includes a complete Postman collection with 100+ API requests.

### Import Postman Collection

1. **Open Postman**
2. **Click "Import"** (top left)
3. **Select file:** `InvenTree_API_Postman_Collection.json` (in repository root)
4. **Click "Import"**

### Configure Postman Environment

1. **Create a new environment** in Postman
2. **Add the following variables:**

| Variable | Value | Description |
|----------|-------|-------------|
| `base_url` | `http://localhost:8000` | Your InvenTree URL |
| `username` | `admin` | Your admin username |
| `password` | `inventree` | Your admin password |
| `auth_token` | (leave empty) | Will be auto-populated |

3. **Save the environment** and select it

### Get Authentication Token

1. Navigate to **"Authentication" → "Get Token"** in the collection
2. Click **"Send"**
3. The `auth_token` variable will be automatically set (If not set, set it manually)
4. You can now use any API endpoint in the collection!

### API Categories Included

The Postman collection includes requests for:
- Authentication & User Management
- Parts & Categories
- Stock Management
- Build Orders
- Purchase Orders
- Sales Orders
- Companies (Suppliers/Manufacturers/Customers)
- Settings & Configuration
- Reports & Labels
- And much more!

---

## Updating InvenTree

To update to the latest version of InvenTree:

### Step 1: Stop Containers

```bash
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml down
```

### Step 2: Pull Latest Images

```bash
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml pull
```

### Step 3: Update Database

```bash
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml run --rm inventree-server invoke update
```

### Step 4: Restart Containers

```bash
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml up -d
```

---

## Troubleshooting

### Containers Won't Start

**Check Docker is running:**
```bash
docker ps
```

**View container logs:**
```bash
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml logs inventree-server
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml logs inventree-db
```

### Cannot Access http://localhost

**Check if containers are running:**
```bash
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml ps
```

**Check port 80 is not in use:**
```bash
# On Linux/Mac
sudo lsof -i :80

# On Windows
netstat -ano | findstr :80
```

**Try accessing via port 8000 directly:**
```bash
http://localhost:8000
```

### Database Connection Errors

**Restart the database container:**
```bash
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml restart inventree-db
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml restart inventree-server
```

### Permission Denied Errors

**Check volume permissions:**
```bash
ls -la contrib/container/inventree-data
```

**Fix permissions (Linux/Mac):**
```bash
sudo chown -R $USER:$USER contrib/container/inventree-data
```

### Reset Everything (Fresh Start)

**Warning:** This will delete all data!

```bash
# Stop and remove containers
docker compose --project-directory . -f contrib/container/dev-docker-compose.yml down -v

# Remove data directory
rm -rf inventree-data

# Start fresh
```

---

## Additional Resources

### Official Documentation

- **InvenTree Documentation:** https://docs.inventree.org/
- **Docker Setup Guide:** `docs/docs/start/docker_install.md` (in this repository)
- **API Documentation:** https://docs.inventree.org/en/latest/api/
- **Plugin Development:** https://docs.inventree.org/en/latest/plugins/

### InvenTree System Architecture

- **Technical Architecture Diagram:** `InvenTree_Technical_Architecture.drawio`
- **Business Architecture:** `InvenTree_Business_Architecture.md`
- **Technical Architecture:** `InvenTree_Technical_Architecture.md`

### Community & Support

- **GitHub Issues:** https://github.com/alokpandey/Inventory-system/issues
- **Documentation:** https://docs.inventree.org/
- **Demo Instance:** https://demo.inventree.org/

---

## Next Steps

After successful installation:

1. **Explore the Web Interface** - Familiarize yourself with the UI
2. **Test the API** - Use the Postman collection to explore API endpoints
3. **Configure Settings** - Customize InvenTree for your needs (Settings → System Settings)
4. **Create Part Categories** - Set up your inventory structure
5. **Add Parts** - Start adding your inventory items
6. **Set up Suppliers** - Add your supplier information
7. **Configure Plugins** - Extend functionality with plugins

---

## License

InvenTree is distributed under the MIT License. See `LICENSE` file for more information.

---

## Acknowledgments

InvenTree is an open-source project maintained by the InvenTree community. This repository contains the complete InvenTree system for easy local deployment.

**Original Project:** https://github.com/alokpandey/Inventory-system

---

**Happy Inventory Management!**

