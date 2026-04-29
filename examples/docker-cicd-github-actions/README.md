# GitHub Actions Docker CI/CD Demo

This project demonstrates automated Docker image build and deployment process using GitHub Actions.

## 🎯 What Does It Do?

1. Automatically builds Docker image on every `git push`
2. Runs tests automatically
3. Pushes image to GitHub Container Registry (ghcr.io)
4. Tags image with versions

## 🚀 Setup

### 1. Clone This Repository

```bash
git clone https://github.com/Emre-Yavas/introduction-to-docker.git
cd introduction-to-docker/examples/docker-cicd-github-actions
```

### 2. Test Locally

```bash
# Build Docker image
docker build -t myapp:local .

# Run it
docker run -p 3000:3000 myapp:local

# Test it
curl http://localhost:3000
```

### 3. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

**Automatically:**
- ✅ Docker image is built
- ✅ Tests run
- ✅ Pushed to ghcr.io

## 📦 Using the Image

### Pull from GitHub Container Registry

```bash
# Latest version
docker pull ghcr.io/emre-yavas/introduction-to-docker:latest

# Specific version
docker pull ghcr.io/emre-yavas/introduction-to-docker:v1.0.0

# Run it
docker run -p 3000:3000 ghcr.io/emre-yavas/introduction-to-docker:latest
```

## 🔧 Project Structure

```
docker-cicd-github-actions/
├── .github/
│   └── workflows/
│       └── docker-publish.yml    # GitHub Actions pipeline
├── src/
│   ├── app.js                     # Main application
│   └── app.test.js                # Tests
├── Dockerfile                      # Docker image definition
├── .dockerignore                   # Files excluded from build
├── package.json                    # Node.js dependencies
└── README.md                       # This file
```

## 🔄 Pipeline Flow

```
Git Push
    ↓
GitHub Actions Triggered
    ↓
Docker Image Built
    ↓
Tests Run (Inside Container!)
    ↓
✅ Success → Image Pushed
    ↓
ghcr.io/username/repo:latest
ghcr.io/username/repo:sha-abc123
ghcr.io/username/repo:v1.0.0
```

## 📊 GitHub Actions Features

### Automatic Triggers

- Push to `main` branch
- Pull request created
- Tag created (`v*`)

### Image Tagging

- `latest`: Latest version
- `sha-xxx`: Specific commit
- `v1.0.0`: Semantic versioning

## 🎯 Hands-On Exercise

### Task 1: Change Code and Push

1. Open `src/app.js`
2. Change the message
3. Commit and push
4. Go to GitHub → Actions tab
5. Watch the pipeline run

### Task 2: Add New Feature

1. Add new endpoint to `src/app.js`
2. Write test (`src/app.test.js`)
3. Push
4. Verify tests pass
5. Pull new image and test

### Task 3: Version Release

1. Create tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
2. Watch tag build in Actions
3. Pull image with version:
   ```bash
   docker pull ghcr.io/emre-yavas/introduction-to-docker:v1.0.0
   ```

## 🔍 Troubleshooting

### Image is Private and Can't Pull?

```bash
# Login with GitHub token
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Or use Personal Access Token
docker login ghcr.io -u USERNAME
# Password: ghp_xxxxxxxxxxxx
```

### Actions Failing?

1. Check logs in Actions tab
2. Find which step failed
3. Run same command locally:
   ```bash
   docker build -t test .
   docker run --rm test npm test
   ```

## 📚 Topics Learned

- ✅ Writing GitHub Actions workflows
- ✅ Automatic Docker image builds
- ✅ Running tests in containers
- ✅ Using GitHub Container Registry
- ✅ Image versioning
- ✅ Creating CI/CD pipelines

## 🔗 Useful Links

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 💡 Tips

**Speed Up Builds:**
- Use layer caching
- Use multi-stage builds
- Add .dockerignore file

**Security:**
- Use secrets (don't hardcode!)
- Scan images (Trivy)
- Use minimal base images

**Best Practices:**
- Write tests for every feature
- Use semantic versioning
- Keep README updated
- Write descriptive commit messages
