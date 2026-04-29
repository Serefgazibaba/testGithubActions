# GitHub Actions Sample Project - Complete Guide

## 📁 Project Structure

```
sample-projects/
└── github-actions-demo/
    ├── .github/
    │   └── workflows/
    │       └── docker-publish.yml    # GitHub Actions CI/CD pipeline
    ├── src/
    │   ├── app.js                     # Express.js application
    │   └── app.test.js                # Simple tests (no external deps)
    ├── Dockerfile                      # Multi-stage production build
    ├── .dockerignore                   # Files to exclude from build
    ├── .gitignore                      # Git ignore patterns
    ├── package.json                    # Node.js dependencies
    ├── README.md                       # Turkish documentation
    └── QUICK-START.md                  # 5-minute quick start guide
```

---

## 🎯 What This Demonstrates

### 1. **Complete CI/CD Pipeline with GitHub Actions**
- Automatic build on every push
- Tests run in containers
- Security scanning with Trivy
- Push to GitHub Container Registry (ghcr.io)
- Automatic version tagging

### 2. **Docker Best Practices**
- Multi-stage builds (smaller images)
- Non-root user for security
- Health checks
- Proper .dockerignore
- Build arguments and environment variables

### 3. **Production-Ready Application**
- Express.js REST API
- Health check endpoint
- Structured JSON responses
- Error handling
- Simple but effective tests

---

## 🚀 Key Features

### GitHub Container Registry (ghcr.io)

**Why ghcr.io instead of Docker Hub?**
- ✅ Free for public repositories
- ✅ Integrated with GitHub (no extra account needed)
- ✅ Uses GITHUB_TOKEN (automatic authentication)
- ✅ Better rate limits
- ✅ Package tied to repository

### Automatic Image Tagging

Every push creates multiple tags:
```
ghcr.io/username/repo:latest          # Always newest
ghcr.io/username/repo:main            # Branch name
ghcr.io/username/repo:sha-abc123      # Commit SHA
ghcr.io/username/repo:v1.0.0          # Version tags
ghcr.io/username/repo:1.0.0           # Semantic versioning
ghcr.io/username/repo:1.0             # Major.Minor
ghcr.io/username/repo:1               # Major only
```

### Three-Stage Pipeline

**Stage 1: Build and Test**
- Builds Docker image
- Runs tests inside container
- Performs health checks
- Shows image size

**Stage 2: Push to Registry** (only on main branch)
- Logs in to ghcr.io
- Tags image with multiple versions
- Pushes to registry
- Creates deployment summary

**Stage 3: Security Scan**
- Scans for vulnerabilities with Trivy
- Checks for critical/high severity issues
- Runs in parallel with push

---

## 📝 GitHub Actions Workflow Breakdown

### Trigger Configuration

```yaml
on:
  push:
    branches: [main, develop]  # Auto-deploy from main
    tags: ['v*']               # Version releases
  pull_request:
    branches: [main]           # Test PRs
```

**What happens:**
- Push to `main` → Build, test, scan, push to ghcr.io
- Push to `develop` → Build and test only
- Create tag `v1.0.0` → Build and push with version tags
- Open PR → Build and test (no push)

### Permissions

```yaml
permissions:
  contents: read    # Read repository
  packages: write   # Push to ghcr.io
```

**Important:** Without `packages: write`, push to ghcr.io will fail!

### Using GITHUB_TOKEN

```yaml
- uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}  # Automatic!
```

**No setup needed:**
- GITHUB_TOKEN is automatically provided
- No need to create secrets
- Works out of the box

---

## 🔧 Application Details

### Endpoints

**GET /**
```json
{
  "message": "Merhaba! GitHub Actions ile otomatik deploy edildi! 🚀",
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "2025-12-17T17:55:49.119Z",
  "commit": "abc123"
}
```

**GET /health**
```json
{
  "status": "healthy",
  "uptime": 123.456,
  "timestamp": "2025-12-17T17:55:49.119Z"
}
```

**GET /api/info**
```json
{
  "name": "GitHub Actions Demo API",
  "version": "1.0.0",
  "endpoints": [
    { "path": "/", "method": "GET", "description": "Ana sayfa" },
    { "path": "/health", "method": "GET", "description": "Sağlık kontrolü" },
    { "path": "/api/info", "method": "GET", "description": "API bilgileri" }
  ]
}
```

**GET /anything-else**
```json
{
  "error": "Endpoint bulunamadı",
  "path": "/anything-else",
  "suggestion": "Kullanılabilir endpoint'ler için /api/info adresini ziyaret edin"
}
```

### Tests

Simple, dependency-free tests:
- ✅ Main endpoint returns JSON
- ✅ Health check works
- ✅ API info returns correct data
- ✅ 404 handler works

**No Jest, Mocha, or Chai needed!** Uses Node.js built-in `http` module.

---

## 🎓 Learning Objectives

Students will learn:

1. **GitHub Actions Basics**
   - Workflow syntax
   - Triggers and events
   - Jobs and steps
   - Secrets and environment variables

2. **Docker in CI/CD**
   - Building images in pipelines
   - Running tests in containers
   - Multi-stage builds
   - Image optimization

3. **Container Registry**
   - GitHub Container Registry (ghcr.io)
   - Image tagging strategies
   - Public vs private packages
   - Authentication with GITHUB_TOKEN

4. **DevOps Practices**
   - Automated testing
   - Continuous integration
   - Version management
   - Security scanning

---

## 📋 How to Use in Training

### Step 1: Local Testing (15 minutes)

```bash
cd sample-projects/github-actions-demo

# Build the image
docker build -t demo:local .

# Run tests
docker run --rm demo:local npm test

# Start the app
docker run -d -p 3000:3000 --name demo demo:local

# Test endpoints
curl http://localhost:3000
curl http://localhost:3000/health
curl http://localhost:3000/api/info

# Clean up
docker stop demo && docker rm demo
```

**Teaching points:**
- Multi-stage build = smaller image
- Tests run inside container = consistent environment
- Health checks = Docker can monitor container

---

### Step 2: GitHub Setup (10 minutes)

```bash
# Create new GitHub repo
gh repo create github-actions-demo --public

# Or manually on github.com

# Push code
git init
git add .
git commit -m "feat: initial commit with CI/CD"
git branch -M main
git remote add origin https://github.com/USERNAME/github-actions-demo.git
git push -u origin main
```

**Teaching points:**
- No secrets needed (GITHUB_TOKEN is automatic)
- Public repo = free ghcr.io usage
- Actions runs automatically on push

---

### Step 3: Watch Pipeline (5 minutes)

1. Go to repository on GitHub
2. Click **Actions** tab
3. Click running workflow
4. Watch each step execute

**Teaching points:**
- Real-time logs
- Each step shows duration
- Failures are obvious
- Deployment summary at end

---

### Step 4: Pull and Run (5 minutes)

```bash
# Pull from ghcr.io (no login needed for public)
docker pull ghcr.io/USERNAME/github-actions-demo:latest

# Run it
docker run -p 3000:3000 ghcr.io/USERNAME/github-actions-demo:latest

# Test
curl http://localhost:3000
```

**Teaching points:**
- Same image from CI runs locally
- No "works in CI but not here" issues
- Easy to share and deploy

---

### Step 5: Make Changes (10 minutes)

**Exercise 1: Change the message**
```javascript
// src/app.js
message: 'İlk değişikliğim! 🎉',
```

```bash
git commit -am "feat: update welcome message"
git push
# Watch Actions rebuild automatically
```

**Exercise 2: Add new endpoint**
```javascript
app.get('/api/time', (req, res) => {
  res.json({
    time: new Date().toISOString(),
    timezone: 'UTC'
  });
});
```

**Exercise 3: Create version**
```bash
git tag v1.0.0
git push origin v1.0.0
# Creates v1.0.0, 1.0, 1 tags
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Actions Workflow Not Running

**Symptom:** Push to main but no Actions triggered

**Solutions:**
1. Check `.github/workflows/docker-publish.yml` is committed
2. Actions may be disabled: Settings → Actions → Enable
3. Check branch name matches (main vs master)

---

### Issue 2: Push to ghcr.io Fails

**Error:** `denied: permission_denied`

**Solution:**
```yaml
# Add permissions to workflow
permissions:
  contents: read
  packages: write  # This line is critical!
```

---

### Issue 3: Image is Private

**Symptom:** Can't pull without login

**Solution:**
1. Go to repository on GitHub
2. Click "Packages" (right sidebar)
3. Click package name
4. "Package settings" → "Change visibility" → Public

---

### Issue 4: Build Fails on npm install

**Error:** `npm ci requires package-lock.json`

**Solution:** Already fixed in this project! Uses `npm install --production` instead.

Or create package-lock.json:
```bash
npm install
git add package-lock.json
git commit -m "chore: add package-lock.json"
```

---

## 💡 Advanced Exercises

### 1. Add Environment Variables

```yaml
# In workflow
env:
  NODE_ENV: production
  API_URL: https://api.example.com
```

### 2. Deploy to Server

```yaml
deploy-to-server:
  needs: push-to-registry
  runs-on: ubuntu-latest
  steps:
    - name: Deploy via SSH
      run: |
        ssh user@server "docker pull ghcr.io/USER/REPO:latest && docker-compose up -d"
```

### 3. Notification on Failure

```yaml
- name: Slack Notification
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

### 4. Multi-platform Builds

```yaml
- uses: docker/setup-buildx-action@v5
- uses: docker/build-push-action@v5
  with:
    platforms: linux/amd64,linux/arm64
```

---

## 📊 Metrics to Track

### Build Performance
- Build time (target: < 2 minutes)
- Image size (target: < 50MB)
- Test duration (target: < 30 seconds)

### Pipeline Success
- Success rate (target: > 95%)
- Mean time to recovery
- Deployment frequency

### Code Quality
- Test coverage
- Security vulnerabilities
- Code review time

---

## 🎯 Assessment Ideas

### Quiz Questions

1. What is the difference between `docker build` and `docker run`?
2. Why use GitHub Container Registry instead of Docker Hub?
3. What does `GITHUB_TOKEN` do and where does it come from?
4. What are the benefits of multi-stage builds?
5. How do you tag a Docker image for version 1.2.3?

### Practical Tasks

1. Fork this project and add a new endpoint
2. Add a test for your new endpoint
3. Create a pull request and verify tests run
4. Merge and verify deployment
5. Pull the deployed image and run it locally

---

## 🔗 Related Documentation

**In Training Materials:**
- `03-Docker-In-Development/02-GitHub-Actions-CI-CD-Pipeline.md`
- `03-Docker-In-Development/04-Slide-Points-Development-Workflow.md`
- `Dockerfiles/README.md`

**External Resources:**
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Build Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## ✅ Success Criteria

Students have successfully completed this module when they can:

- ✅ Create a GitHub Actions workflow from scratch
- ✅ Build Docker images in CI/CD pipeline
- ✅ Run tests inside containers
- ✅ Push images to GitHub Container Registry
- ✅ Use proper image tagging strategies
- ✅ Debug pipeline failures using logs
- ✅ Pull and run deployed images locally
- ✅ Understand the flow from code → production

---

## 🎓 Estimated Time

- **Reading documentation:** 20 minutes
- **Local setup and testing:** 15 minutes
- **GitHub setup:** 10 minutes
- **First deployment:** 10 minutes
- **Exercises:** 30 minutes
- **Total:** ~90 minutes

---

## 💬 Discussion Topics

1. **When would you NOT want automated deployment?**
   - Production systems requiring approval
   - Compliance/regulatory requirements
   - High-risk changes

2. **How does this compare to traditional deployment?**
   - Manual builds and deploys
   - Different environments
   - "Works on my machine" problems

3. **What's the value of testing in containers?**
   - Same environment as production
   - No surprises
   - Fast feedback

4. **Why multiple image tags?**
   - `latest` for development
   - Versions for production
   - SHA for debugging

---

**Ready to deploy!** 🚀

This sample project is production-ready and can be used as:
- Training material for workshops
- Template for new projects
- Reference implementation
- Starting point for real applications
