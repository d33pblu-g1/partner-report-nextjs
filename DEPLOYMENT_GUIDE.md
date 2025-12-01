# Deployment Guide - Partner Report Dashboard

This guide covers multiple deployment options for hosting your Partner Report Dashboard online.

---

## 📋 What You're Deploying

1. **Next.js Frontend** - React application (partner-report-nextjs)
2. **PHP Backend API** - REST API (partner-report/api)
3. **MySQL Database** - Data storage

---

## 🚀 Option 1: Vercel + Shared Hosting (Easiest)

**Best for:** Quick deployment, testing, small teams  
**Cost:** $0 - $5/month  
**Time:** 30 minutes

### Step 1: Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to your Next.js project
cd /Users/michalisphytides/Desktop/partner-report-nextjs

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - What's your project's name? partner-report-nextjs
# - In which directory is your code located? ./
# - Want to override settings? No

# Deploy to production
vercel --prod
```

**Result:** You'll get a URL like `https://partner-report-nextjs.vercel.app`

### Step 2: Deploy PHP Backend

#### Option A: Shared Hosting (Recommended)

**Recommended Providers:**
- [Hostinger](https://hostinger.com) - $2/month
- [SiteGround](https://siteground.com) - $3/month
- [Namecheap](https://namecheap.com) - $2/month

**Setup Steps:**
1. Purchase hosting plan with PHP 7.4+ and MySQL
2. Access cPanel
3. Create MySQL database:
   - Go to MySQL Databases
   - Create new database: `partner_report_db`
   - Create user and grant all privileges
   - Note down: database name, username, password, host
4. Upload PHP files:
   - Use File Manager or FTP client (FileZilla)
   - Upload `/partner-report/api` folder to `public_html/api`
5. Import database:
   - Go to phpMyAdmin
   - Select your database
   - Click Import
   - Upload your SQL dump file
   - Click Go
6. Configure database connection:
   - Edit `/api/config.php` or wherever your DB credentials are
   - Update with your hosting database credentials:
   ```php
   $host = 'localhost'; // or provided by hosting
   $dbname = 'partner_report_db';
   $username = 'your_username';
   $password = 'your_password';
   ```

**Your API URL:** `https://yourdomain.com/api/index.php`

### Step 3: Connect Frontend to Backend

1. Update environment variables in Vercel:
   ```bash
   # Using Vercel CLI
   vercel env add NEXT_PUBLIC_API_URL production
   # Enter: https://yourdomain.com/api/index.php
   
   # Or via Vercel Dashboard:
   # - Go to vercel.com
   # - Select your project
   # - Go to Settings > Environment Variables
   # - Add: NEXT_PUBLIC_API_URL = https://yourdomain.com/api/index.php
   ```

2. Redeploy frontend:
   ```bash
   vercel --prod
   ```

3. Test your deployment:
   - Visit `https://partner-report-nextjs.vercel.app`
   - Check if data loads correctly
   - Open browser console for any errors

---

## 🚀 Option 2: DigitalOcean/AWS VPS (Full Control)

**Best for:** Production apps, custom configurations  
**Cost:** $12 - $50/month  
**Time:** 2-3 hours

### Step 1: Create a Droplet/Instance

**DigitalOcean:**
```bash
# Create droplet with:
# - Ubuntu 22.04 LTS
# - Basic plan ($12/month)
# - Choose datacenter region closest to users
```

**AWS EC2:**
```bash
# Create instance with:
# - Ubuntu Server 22.04 LTS
# - t3.small or t3.medium
# - Configure security groups (ports 22, 80, 443)
```

### Step 2: Initial Server Setup

```bash
# SSH into your server
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Create sudo user
adduser deployuser
usermod -aG sudo deployuser
su - deployuser

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PHP 8.1
sudo apt install -y php8.1 php8.1-fpm php8.1-mysql php8.1-curl php8.1-mbstring php8.1-xml

# Install MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Install Nginx
sudo apt install -y nginx

# Install PM2 for process management
sudo npm install -g pm2

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### Step 3: Setup MySQL Database

```bash
# Login to MySQL
sudo mysql -u root -p

# Create database and user
CREATE DATABASE partner_report_db;
CREATE USER 'partner_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON partner_report_db.* TO 'partner_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import your database
mysql -u partner_user -p partner_report_db < /path/to/your/database_dump.sql
```

### Step 4: Deploy PHP Backend

```bash
# Create directory
sudo mkdir -p /var/www/api
sudo chown -R deployuser:deployuser /var/www/api

# Upload your PHP files (from your local machine)
scp -r /Users/michalisphytides/Desktop/partner-report/api/* deployuser@your_server_ip:/var/www/api/

# Update PHP database config
nano /var/www/api/config.php
# Update with your MySQL credentials

# Set permissions
sudo chown -R www-data:www-data /var/www/api
sudo chmod -R 755 /var/www/api
```

### Step 5: Deploy Next.js Frontend

```bash
# Create directory
sudo mkdir -p /var/www/frontend
sudo chown -R deployuser:deployuser /var/www/frontend

# Upload and build (from your local machine)
cd /Users/michalisphytides/Desktop/partner-report-nextjs

# Update .env.local
echo "NEXT_PUBLIC_API_URL=https://yourdomain.com/api/index.php" > .env.local

# Build for production
npm run build

# Upload to server
scp -r .next package.json package-lock.json node_modules deployuser@your_server_ip:/var/www/frontend/

# Or better: build on server
ssh deployuser@your_server_ip
cd /var/www/frontend
# Transfer package.json and source files
npm install
npm run build

# Start with PM2
pm2 start npm --name "partner-report" -- start
pm2 save
pm2 startup
```

### Step 6: Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/partner-report
```

Add this configuration:

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;
    
    root /var/www/api;
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}

# Frontend Next.js
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/partner-report /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Setup SSL (HTTPS)

```bash
# Get SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Step 8: Configure Domain DNS

Point your domain to your server IP:

```
A Record:  @ → your_server_ip
A Record:  www → your_server_ip
A Record:  api → your_server_ip
```

---

## 🚀 Option 3: Docker Container (Modern & Scalable)

**Best for:** Microservices, scalability, DevOps teams  
**Cost:** Varies by hosting  
**Time:** 3-4 hours

### Create Dockerfiles

**Frontend Dockerfile:**
```dockerfile
# /Users/michalisphytides/Desktop/partner-report-nextjs/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

**Backend Dockerfile:**
```dockerfile
# /Users/michalisphytides/Desktop/partner-report/Dockerfile
FROM php:8.1-apache
RUN docker-php-ext-install mysqli pdo pdo_mysql
COPY api/ /var/www/html/api/
RUN chown -R www-data:www-data /var/www/html
EXPOSE 80
```

**Docker Compose:**
```yaml
# docker-compose.yml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: partner_report_db
      MYSQL_USER: partner_user
      MYSQL_PASSWORD: partner_password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database_migrations.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"

  backend:
    build: ./partner-report
    depends_on:
      - mysql
    environment:
      DB_HOST: mysql
      DB_NAME: partner_report_db
      DB_USER: partner_user
      DB_PASSWORD: partner_password
    ports:
      - "8001:80"

  frontend:
    build: ./partner-report-nextjs
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: http://backend:80/api/index.php
    ports:
      - "3000:3000"

volumes:
  mysql_data:
```

Deploy to:
- **Railway.app** (Simple, $5-10/month)
- **Render.com** (Free tier available)
- **AWS ECS** (Scalable, $20-100/month)
- **Google Cloud Run** (Pay per use)

---

## 🚀 Option 4: Serverless (Cost-Effective)

**Frontend:** Vercel (Serverless)  
**Backend:** AWS Lambda + API Gateway  
**Database:** AWS RDS or PlanetScale

This requires converting your PHP API to Node.js/Python for Lambda, which is more complex but highly scalable.

---

## 🔒 Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly in PHP backend
- [ ] Add rate limiting to API
- [ ] Set up database backups
- [ ] Use environment variables (never commit credentials)
- [ ] Enable firewall (UFW on Ubuntu)
- [ ] Keep software updated
- [ ] Add authentication if needed
- [ ] Monitor error logs
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)

---

## 🔧 Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/index.php
```

### Backend (PHP config or .env)
```php
DB_HOST=localhost
DB_NAME=partner_report_db
DB_USER=partner_user
DB_PASSWORD=your_secure_password
DB_CHARSET=utf8mb4
```

---

## 📊 Monitoring & Maintenance

### Set Up Monitoring
- **Uptime:** [UptimeRobot](https://uptimerobot.com) (Free)
- **Errors:** [Sentry](https://sentry.io) (Free tier)
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics) or Google Analytics

### Regular Maintenance
```bash
# Check application logs
pm2 logs partner-report

# Monitor server resources
htop

# Check disk space
df -h

# MySQL performance
mysqladmin -u root -p status

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 💰 Cost Comparison

| Option | Frontend | Backend | Database | Total/Month |
|--------|----------|---------|----------|-------------|
| **Vercel + Shared** | Free | $2-5 | Included | $2-5 |
| **DigitalOcean VPS** | Included | Included | Included | $12-24 |
| **AWS Full Stack** | $0-5 | $10-30 | $15-50 | $25-85 |
| **Docker on Railway** | Included | Included | Included | $10-20 |

---

## 🎯 Recommended Path

**For Beginners:**
1. Start with **Vercel + Shared Hosting** ($2-5/month)
2. Easy to set up, low cost
3. Good for 100-1000 users

**For Production:**
1. Use **DigitalOcean Droplet** ($12/month)
2. Full control, scalable
3. Can handle 10,000+ users

**For Enterprise:**
1. Use **AWS/GCP with Docker**
2. Auto-scaling, high availability
3. Can handle millions of users

---

## 🆘 Troubleshooting

### Frontend Can't Reach Backend
- Check CORS headers in PHP API
- Verify API URL in environment variables
- Check network/firewall rules
- Test API directly: `curl https://api.yourdomain.com/index.php?endpoint=partners`

### Database Connection Errors
- Verify credentials
- Check if MySQL is running: `sudo systemctl status mysql`
- Check user permissions: `SHOW GRANTS FOR 'partner_user'@'localhost';`
- Test connection: `mysql -u partner_user -p`

### Next.js Build Errors
- Clear cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

---

## 📚 Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [Let's Encrypt SSL Setup](https://letsencrypt.org/getting-started/)

---

## ✅ Post-Deployment Checklist

- [ ] Application is accessible at your domain
- [ ] SSL certificate is active (HTTPS)
- [ ] All API endpoints are working
- [ ] Database queries are fast
- [ ] Mobile responsive design works
- [ ] Error tracking is set up
- [ ] Uptime monitoring is configured
- [ ] Database backups are scheduled
- [ ] Documentation is updated
- [ ] Team members have access

---

**Need help?** Open an issue or contact your DevOps team.

**Made with ❤️ - Deploy with confidence!**

