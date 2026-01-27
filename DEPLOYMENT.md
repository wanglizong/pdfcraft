# PDFCraft Static Export Deployment Guide

This project is configured for static export, making it deployable to any static hosting provider.

## 📦 Build Output

When you run `npm run build`, Next.js generates a static site in the `out/` directory containing:
- Pre-rendered HTML pages for all routes (including localized routes)
- Static assets (CSS, JS, images, WASM files)
- Client-side JavaScript for interactivity
- PWA assets (service worker, manifest)

## 🔧 Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

## 🏗️ Build the Project

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

The static output will be in the `out/` directory.

## 🚀 Deployment Options

### 1. Vercel (Recommended)

**Automatic Deployment:**
1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Vercel auto-detects Next.js and deploys

**Manual Deployment:**
```bash
npm install -g vercel
vercel --prod
```

Configuration is already set in `vercel.json` with:
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- Cache headers for static assets
- WASM MIME type configuration

---

### 2. Netlify

**Automatic Deployment:**
1. Push your code to GitHub
2. Import project in [Netlify](https://netlify.com)
3. Build settings are auto-detected from `netlify.toml`

**Manual Deployment:**
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=out
```

---

### 3. GitHub Pages

**Automatic Deployment:**
1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to `main` branch - workflow deploys automatically

**Manual Deployment:**
```bash
npm run build
# Push the out/ directory to gh-pages branch
```

The `.github/workflows/deploy.yml` workflow handles automatic deployment.

---

### 4. Cloudflare Pages

**Automatic Deployment:**
1. Connect repository in [Cloudflare Pages](https://pages.cloudflare.com)
2. Build settings:
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node version: 20

**Manual Deployment:**
```bash
npm install -g wrangler
npm run build
wrangler pages deploy out
```

---

### 5. Docker + Nginx (Self-hosted)

The project includes `docker-compose.yml` and `nginx.conf` for containerized deployment.

**Development Mode:**
```bash
docker compose --profile dev up
```
Open http://localhost:3000

**Production Mode (Static Export + Nginx):**
```bash
docker compose --profile prod up --build
```
Open http://localhost:8080

**Stop and remove containers:**
```bash
docker compose down
```

---

### 6. Nginx (Self-hosted without Docker)

```bash
# Build the site
npm run build

# Copy to web root
sudo cp -r out/* /var/www/html/
```

Use the provided `nginx.conf` as a reference, or configure manually:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml application/wasm;

    # MIME types for WASM and ES modules
    types {
        application/wasm wasm;
        application/javascript mjs;
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Static assets - long cache
    location ~* \.(ico|jpg|jpeg|png|gif|svg|webp|avif|woff|woff2|ttf|eot|js|css)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # HTML pages - no cache
    location / {
        try_files $uri $uri.html $uri/ =404;
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    # 404 page
    error_page 404 /404.html;
}
```

---

### 7. Apache (Self-hosted)

```bash
# Build the site
npm run build

# Copy to web root
sudo cp -r out/* /var/www/html/
```

Create `.htaccess` in the web root:

```apache
# Enable rewrite engine
RewriteEngine On

# Serve HTML files without extension
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([^\.]+)$ $1.html [NC,L]

# WASM MIME type
AddType application/wasm .wasm

# Cache static assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|wasm)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# Security headers
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"
Header set Permissions-Policy "camera=(), microphone=(), geolocation=()"
```

---

### 8. AWS S3 + CloudFront

```bash
# Build the site
npm run build

# Upload to S3
aws s3 sync out/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

**S3 Bucket Configuration:**
- Enable static website hosting
- Set index document to `index.html`
- Set error document to `404.html`

---

### 9. Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Build and deploy
npm run build
firebase deploy --only hosting
```

Configure `firebase.json`:
```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "cleanUrls": true,
    "trailingSlash": true,
    "headers": [
      {
        "source": "**/*.@(js|css|woff|woff2|ttf|eot|ico|jpg|jpeg|png|gif|svg|webp|avif|wasm)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "SAMEORIGIN"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          },
          {
            "key": "Permissions-Policy",
            "value": "camera=(), microphone=(), geolocation=()"
          }
        ]
      }
    ]
  }
}
```

---

### 10. Quick Local Preview

After building, you can preview the static site locally:

```bash
# Using Python
cd out
python -m http.server 8080

# Using Node.js serve
npx serve out

# Using PHP
cd out
php -S localhost:8080
```

Then visit http://localhost:8080

---

## 🔧 Environment Variables

The following environment variables can be set before building:

```bash
# No required environment variables for static export
# All processing happens client-side

# Optional: For analytics or custom features
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 📝 Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records

### GitHub Pages
1. Add `CNAME` file to `public/` directory with your domain
2. Update DNS:
   ```
   Type: CNAME
   Name: www (or @)
   Value: your-username.github.io
   ```

### Cloudflare Pages
1. Go to Custom Domains
2. Add your domain
3. DNS is automatically configured if using Cloudflare DNS

---

## 🌐 Multi-language Routes

PDFCraft supports multiple languages. The static export generates pages for all locales:

| Locale | URL Pattern | Example |
|--------|-------------|---------|
| English | `/en/...` | `/en/tools/merge-pdf/` |
| Spanish | `/es/...` | `/es/tools/merge-pdf/` |
| French | `/fr/...` | `/fr/tools/merge-pdf/` |
| German | `/de/...` | `/de/tools/merge-pdf/` |
| Portuguese | `/pt/...` | `/pt/tools/merge-pdf/` |
| Japanese | `/ja/...` | `/ja/tools/merge-pdf/` |
| Korean | `/ko/...` | `/ko/tools/merge-pdf/` |
| Chinese | `/zh/...` | `/zh/tools/merge-pdf/` |

Ensure your hosting provider correctly serves the trailing slash routes (configured via `trailingSlash: true` in `next.config.js`).

---

## 🔍 SEO Considerations

The static export includes:
- ✅ Pre-rendered HTML for all pages
- ✅ Meta tags and Open Graph data
- ✅ Localized meta descriptions
- ✅ Robots.txt
- ✅ Sitemap generation
- ✅ PWA manifest

---

## 🎯 Performance Optimization

The build includes:
- Code splitting and lazy loading
- Optimized bundle sizes
- WebAssembly modules for PDF processing
- Static asset caching headers
- Minified HTML, CSS, and JS
- Gzip/Brotli compression support

---

## 🐛 Troubleshooting

### Issue: 404 errors on page refresh
**Solution:** Ensure your hosting provider is configured to:
1. Serve `index.html` for directory requests
2. Try `.html` extension for extensionless URLs
3. Support trailing slashes (configured in `next.config.js`)

### Issue: Images not loading
**Solution:** Check that `images.unoptimized = true` is set in `next.config.js` (already configured).

### Issue: WASM files not loading
**Solution:** Ensure your server sends the correct MIME type for `.wasm` files:
```
Content-Type: application/wasm
```

### Issue: WebAssembly streaming compilation error
**Solution:** The server must serve WASM files with `application/wasm` MIME type, not `application/octet-stream`.

### Issue: ES modules (.mjs) not loading
**Solution:** Configure your server to serve `.mjs` files with `application/javascript` MIME type.

### Issue: Service Worker not registering (PWA)
**Solution:** 
1. Ensure HTTPS is enabled (required for service workers)
2. Check that `/sw.js` is accessible
3. Verify manifest.json is properly served

---

## 📊 Build Statistics

Check build output:
```bash
npm run build

# The build will display:
# - Route (Static) for all generated pages
# - First Load JS size
# - Bundle analysis
```

---

## 🔄 Continuous Deployment

The project includes:
- **GitHub Actions workflow** (`.github/workflows/release.yml`) - Creates releases on push to main
- **GitHub Actions workflow** (`.github/workflows/deploy.yml`) - Deploys to GitHub Pages
- **Netlify configuration** (`netlify.toml`)
- **Vercel configuration** (`vercel.json`)
- **Docker Compose** (`docker-compose.yml`) + Nginx (`nginx.conf`)

Push to `main` branch to trigger automatic deployment.

---

## 📚 Additional Resources

- [Next.js Static Export Docs](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Vercel Deployment](https://vercel.com/docs)
- [Netlify Deployment](https://docs.netlify.com)
- [GitHub Pages](https://docs.github.com/en/pages)
- [Cloudflare Pages](https://developers.cloudflare.com/pages)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

## ✅ Deployment Checklist

Before deploying, verify:

- [ ] `npm run build` completes without errors
- [ ] All pages render correctly at `/en`, `/zh`, etc.
- [ ] PDF tools work (WebAssembly loads correctly)
- [ ] PWA install prompt appears on mobile
- [ ] Service worker registers (check DevTools → Application)
- [ ] Static assets load with proper caching headers
- [ ] Security headers are applied

After deploying, test:

- [ ] Multi-language routing works
- [ ] PDF processing tools function correctly
- [ ] Page refresh doesn't cause 404 errors
- [ ] PWA can be installed
- [ ] Performance is acceptable (< 3s first load)
