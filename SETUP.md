# InvenTree Inventory Management System - Setup Guide

This repository contains the complete InvenTree inventory management system with Docker setup and Postman API collection.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup Instructions](#detailed-setup-instructions)
- [Accessing InvenTree](#accessing-inventree)
- [API Testing with Postman](#api-testing-with-postman)
- [Updating InvenTree](#updating-inventree)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

---

## 🔧 Prerequisites

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

## 🚀 Quick Start

Get InvenTree up and running in 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/alokpandey/Inventory-system.git
cd Inventory-system

# 2. Navigate to Docker setup directory
cd contrib/container

# 3. Initialize the database
docker compose run --rm inventree-server invoke update

# 4. Create admin account (follow the prompts)
docker compose run --rm inventree-server invoke superuser

# 5. Start all containers
docker compose up -d

# 6. Access InvenTree at http://localhost
```

That's it! InvenTree should now be running at **http://localhost**

---

## 📖 Detailed Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/alokpandey/Inventory-system.git
cd Inventory-system
```

### Step 2: Navigate to Docker Configuration

```bash
cd contrib/container
```

This directory contains all the necessary Docker configuration files:
- `docker-compose.yml` - Container orchestration
- `.env` - Environment variables
- `Caddyfile` - Reverse proxy configuration

### Step 3: Configure Environment Variables (Optional)

The `.env` file is pre-configured with sensible defaults. However, you may want to customize:

```bash
# Edit the .env file
nano .env  # or use your preferred editor
```

**Important variables to review:**

| Variable | Default | Description |
|----------|---------|-------------|
| `INVENTREE_SITE_URL` | `http://localhost` | URL where InvenTree will be accessible |
| `INVENTREE_DB_USER` | `pguser` | PostgreSQL database username |
| `INVENTREE_DB_PASSWORD` | `pgpassword` | PostgreSQL database password (⚠️ change for production!) |
| `INVENTREE_EXT_VOLUME` | `./inventree-data` | Directory for persistent data storage |
| `INVENTREE_TAG` | `stable` | InvenTree version (stable/latest/specific version) |

⚠️ **Security Note:** For production deployments, always change the default database credentials!

### Step 4: Initialize the Database

Run the database initialization command:

```bash
docker compose run --rm inventree-server invoke update
```

This command will:
- ✅ Install required Python packages
- ✅ Create a new PostgreSQL database
- ✅ Apply database migrations
- ✅ Update translation files
- ✅ Collect static files

**Expected output:** You should see migration messages and "OK" confirmations.

### Step 5: Create Administrator Account

Create your admin user account:

```bash
docker compose run --rm inventree-server invoke superuser
```

You'll be prompted to enter:
- Username
- Email address
- Password (entered twice for confirmation)

**Alternative:** You can also set admin credentials in the `.env` file:

```bash
INVENTREE_ADMIN_USER=admin
INVENTREE_ADMIN_PASSWORD=your_secure_password
INVENTREE_ADMIN_EMAIL=admin@example.com
```

⚠️ **Important:** Remove these credentials from `.env` after first run for security!

### Step 6: Start Docker Containers

Launch all InvenTree services:

```bash
docker compose up -d
```

This starts 5 containers:

| Container | Service | Port |
|-----------|---------|------|
| `inventree-db` | PostgreSQL 17 Database | 5432 (internal) |
| `inventree-cache` | Redis 7 Cache | 6379 (internal) |
| `inventree-server` | Django/Gunicorn Web Server | 8000 (internal) |
| `inventree-worker` | Django-Q Background Worker | - |
| `inventree-proxy` | Caddy Reverse Proxy | 80, 443 |

### Step 7: Verify Installation

Check that all containers are running:

```bash
docker compose ps
```

All containers should show status as "Up" or "running".

View logs to ensure no errors:

```bash
docker compose logs -f
```

Press `Ctrl+C` to stop following logs.

---

## 🌐 Accessing InvenTree

Once all containers are running:

1. **Open your web browser**
2. **Navigate to:** [http://localhost](http://localhost)
3. **Login** with the admin credentials you created in Step 5

### Default Access Points

- **Web Interface:** http://localhost
- **API Documentation:** http://localhost/api/
- **Admin Panel:** http://localhost/admin/

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

## 🔌 API Testing with Postman

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
| `base_url` | `http://localhost` | Your InvenTree URL |
| `username` | `admin` | Your admin username |
| `password` | `your_password` | Your admin password |
| `auth_token` | (leave empty) | Will be auto-populated |

3. **Save the environment** and select it

### Get Authentication Token

1. Navigate to **"Authentication" → "Get Token"** in the collection
2. Click **"Send"**
3. The `auth_token` variable will be automatically set
4. You can now use any API endpoint in the collection!

### API Categories Included

The Postman collection includes requests for:
- 🔐 Authentication & User Management
- 📦 Parts & Categories
- 📊 Stock Management
- 🏭 Build Orders
- 🛒 Purchase Orders
- 💰 Sales Orders
- 🏢 Companies (Suppliers/Manufacturers/Customers)
- 🔧 Settings & Configuration
- 📋 Reports & Labels
- And much more!

---

## 🔄 Updating InvenTree

To update to the latest version of InvenTree:

### Step 1: Stop Containers

```bash
docker compose down
```

### Step 2: Pull Latest Images

```bash
docker compose pull
```

### Step 3: Update Database

```bash
docker compose run --rm inventree-server invoke update
```

### Step 4: Restart Containers

```bash
docker compose up -d
```

---

## 🐛 Troubleshooting

### Containers Won't Start

**Check Docker is running:**
```bash
docker ps
```

**View container logs:**
```bash
docker compose logs inventree-server
docker compose logs inventree-db
```

### Cannot Access http://localhost

**Check if containers are running:**
```bash
docker compose ps
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
docker compose restart inventree-db
docker compose restart inventree-server
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

⚠️ **Warning:** This will delete all data!

```bash
# Stop and remove containers
docker compose down -v

# Remove data directory
rm -rf inventree-data

# Start fresh
docker compose run --rm inventree-server invoke update
docker compose run --rm inventree-server invoke superuser
docker compose up -d
```

---

## 📚 Additional Resources

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

- **GitHub Issues:** https://github.com/inventree/InvenTree/issues
- **Documentation:** https://docs.inventree.org/
- **Demo Instance:** https://demo.inventree.org/

### Useful Commands

```bash
# View all running containers
docker compose ps

# View logs (all containers)
docker compose logs -f

# View logs (specific container)
docker compose logs -f inventree-server

# Stop all containers
docker compose down

# Start all containers
docker compose up -d

# Restart a specific container
docker compose restart inventree-server

# Execute command in running container
docker compose exec inventree-server bash

# Backup database
docker compose run --rm inventree-server invoke export-records -f /home/inventree/data/backup.json

# Load demo data
docker compose run --rm inventree-server invoke dev.setup-test -i
```

---

## 🎯 Next Steps

After successful installation:

1. ✅ **Explore the Web Interface** - Familiarize yourself with the UI
2. ✅ **Test the API** - Use the Postman collection to explore API endpoints
3. ✅ **Configure Settings** - Customize InvenTree for your needs (Settings → System Settings)
4. ✅ **Create Part Categories** - Set up your inventory structure
5. ✅ **Add Parts** - Start adding your inventory items
6. ✅ **Set up Suppliers** - Add your supplier information
7. ✅ **Configure Plugins** - Extend functionality with plugins

---

## 📄 License

InvenTree is distributed under the MIT License. See `LICENSE` file for more information.

---

## 🙏 Acknowledgments

InvenTree is an open-source project maintained by the InvenTree community. This repository contains the complete InvenTree system for easy local deployment.

**Original Project:** https://github.com/inventree/InvenTree

---

**Happy Inventory Management! 🎉**

