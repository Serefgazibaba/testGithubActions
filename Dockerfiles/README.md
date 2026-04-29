# Dockerfile Examples - Training Materials

This folder contains essential Dockerfile examples demonstrating key concepts for Docker training.

## 📁 Files in This Folder

| File | Purpose | Key Concept |
|------|---------|-------------|
| `Dockerfile.bad-layers` | ❌ Poor layer caching example | Shows what NOT to do |
| `Dockerfile.good-layers` | ✅ Optimized layer caching | Shows best practice for speed |
| `Dockerfile.nodejs-multistage` | Multi-stage build example | Smaller final images |
| `Dockerfile.build-args` | Build arguments & env vars | Configuration flexibility |
| `Dockerfile.cmd` | Using CMD only | Default command (easily overridden) |
| `Dockerfile.entrypoint` | Using ENTRYPOINT only | Fixed executable |
| `Dockerfile.entrypoint-cmd` | ENTRYPOINT + CMD together | Best practice pattern |

---

## 🎯 Key Concepts Demonstrated

### 1. Layer Caching (Bad vs Good)

**Compare:** `Dockerfile.bad-layers` vs `Dockerfile.good-layers`

**Bad approach:**
```dockerfile
COPY . .              # ❌ Everything copied first
RUN npm install       # ❌ Runs every time code changes!
```
**Result:** 2-3 minute rebuilds on every code change 😭

**Good approach:**
```dockerfile
COPY package*.json .  # ✅ Dependencies first
RUN npm install       # ✅ Cached unless package.json changes
COPY . .             # ✅ Code last
```
**Result:** 3-5 second rebuilds! 🚀

**Demonstration in Training:**
1. Show build with bad Dockerfile
2. Change one line of code
3. Rebuild → Takes 2+ minutes
4. Show build with good Dockerfile  
5. Change same line
6. Rebuild → Takes 3 seconds!

---

### 2. Multi-Stage Builds

**File:** `Dockerfile.nodejs-multistage`

**Concept:** Use multiple FROM statements to separate build and runtime

```dockerfile
# Stage 1: Build (includes TypeScript, dev tools)
FROM node:18-alpine AS builder
RUN npm ci              # All dependencies
RUN npm run build       # Build TypeScript

# Stage 2: Production (minimal)
FROM node:18-alpine
RUN npm ci --only=production  # Prod deps only
COPY --from=builder /app/dist ./dist  # Only built files
```

**Benefits:**
- Final image is 3x smaller (no dev dependencies, no source code)
- More secure (no build tools in production)
- Faster deployments

**Demonstration in Training:**
1. Build without multi-stage → Show 500MB image
2. Build with multi-stage → Show 150MB image
3. Inspect both with `docker history` → See the difference

---

### 3. Build Arguments & Environment Variables

**File:** `Dockerfile.build-args`

**ARG vs ENV:**
- `ARG`: Set at **build time** (baked into image)
- `ENV`: Set at **runtime** (can change per container)

**Usage:**
```bash
# Build for different environments
docker build --build-arg NODE_ENV=development -t app:dev .
docker build --build-arg NODE_ENV=production -t app:prod .

# Runtime environment variables
docker run -e API_URL=https://prod-api.com app:prod
```

**Demonstration in Training:**
1. Build with different ARG values
2. Show how ENV can be overridden at runtime
3. Use case: Same Dockerfile for dev/staging/prod

---

### 4. CMD vs ENTRYPOINT

**Files:** `Dockerfile.cmd`, `Dockerfile.entrypoint`, `Dockerfile.entrypoint-cmd`

**Key Differences:**

| Feature | CMD | ENTRYPOINT | ENTRYPOINT + CMD |
|---------|-----|------------|------------------|
| **Purpose** | Default command | Fixed executable | Executable + default args |
| **Override** | ✅ Easy | ⚠️ Needs `--entrypoint` | Args easy, exec fixed |
| **Use case** | Flexible dev | Single-purpose | Production apps |

**CMD alone** (`Dockerfile.cmd`):
- Flexible but can be completely replaced
- `docker run myapp node worker.js` → Runs different command

**ENTRYPOINT alone** (`Dockerfile.entrypoint`):
- Container always runs specific executable
- `docker run myapp worker.js` → Always runs `node worker.js`

**ENTRYPOINT + CMD** (`Dockerfile.entrypoint-cmd`) - **Recommended!**
- Best of both: fixed executable, flexible arguments
- `docker run myapp worker.js` → Runs `node worker.js`
- Can't accidentally run wrong executable

**Demonstration in Training:**
1. Build all 3 Dockerfiles
2. Show CMD being completely overridden
3. Show ENTRYPOINT keeping executable fixed
4. Show ENTRYPOINT + CMD as best practice
5. Discuss shell vs exec form (always use exec!)

---

## 🚀 How to Use in Training

### Exercise 1: Layer Caching Impact

```bash
# Create a simple Node.js app
mkdir myapp && cd myapp
echo '{"dependencies": {"express": "^4.18.0"}}' > package.json
echo 'console.log("Hello Docker!");' > index.js

# Test BAD Dockerfile
docker build -f Dockerfile.bad-layers -t myapp:bad .
# Change index.js
echo 'console.log("Hello World!");' > index.js
docker build -f Dockerfile.bad-layers -t myapp:bad .
# Note the time!

# Test GOOD Dockerfile
docker build -f Dockerfile.good-layers -t myapp:good .
# Change index.js
echo 'console.log("Hello Docker!");' > index.js  
docker build -f Dockerfile.good-layers -t myapp:good .
# 50x faster!
```

### Exercise 2: Multi-Stage Build

```bash
# Compare image sizes
docker images | grep myapp

# See layer breakdown
docker history myapp:multistage
```

### Exercise 3: Build Arguments

```bash
# Build different versions
docker build -f Dockerfile.build-args \
  --build-arg NODE_ENV=development \
  -t myapp:dev .

docker build -f Dockerfile.build-args \
  --build-arg NODE_ENV=production \
  --build-arg API_URL=https://api.prod.com \
  -t myapp:prod .

# Inspect environment
docker run myapp:dev env
docker run myapp:prod env
```

### Exercise 4: CMD vs ENTRYPOINT

```bash
# Build all 3 versions
docker build -f Dockerfile.cmd -t test:cmd .
docker build -f Dockerfile.entrypoint -t test:entrypoint .
docker build -f Dockerfile.entrypoint-cmd -t test:both .

# Test CMD (easy to override)
docker run test:cmd                     # Runs: node server.js
docker run test:cmd echo "Hello"        # Runs: echo "Hello" (replaced!)

# Test ENTRYPOINT (always runs node)
docker run test:entrypoint server.js    # Runs: node server.js
docker run test:entrypoint --version    # Runs: node --version

# Test ENTRYPOINT + CMD (best practice)
docker run test:both                    # Runs: node server.js
docker run test:both worker.js          # Runs: node worker.js
docker run test:both --version          # Runs: node --version
```

---

## 📊 Expected Training Outcomes

After working with these examples, students will understand:

✅ **Why layer order matters** - 50x faster builds!
✅ **How to optimize Dockerfiles** - Copy dependencies before code
✅ **Multi-stage builds** - Smaller, more secure images
✅ **Build-time vs runtime configuration** - ARG vs ENV
✅ **CMD vs ENTRYPOINT** - When to use each and why combine them
✅ **Real performance impact** - Minutes vs seconds

---

## 💡 Teaching Tips

**When presenting:**
1. **Start with bad example** - Show the pain first
2. **Demonstrate the problem** - Actual slow rebuild
3. **Introduce solution** - Good example with explanation
4. **Show the improvement** - Side-by-side comparison
5. **Let them try** - Hands-on exercise

**Common questions to address:**
- Q: "Why does order matter?"
  - A: Docker caches layers. If a layer changes, all layers after it rebuild.

- Q: "When should I use multi-stage?"
  - A: When you have build tools that aren't needed at runtime (TypeScript, webpack, etc.)

- Q: "ARG vs ENV - which one?"
  - A: ARG for build-time (Node version, build mode), ENV for runtime (API URLs, ports)

- Q: "CMD vs ENTRYPOINT - which one?"
  - A: Use ENTRYPOINT + CMD together. ENTRYPOINT = fixed executable, CMD = default arguments

- Q: "What's wrong with shell form?"
  - A: Adds extra shell process, breaks signals (Ctrl+C), your app isn't PID 1

---

## 🎯 Quick Reference

**For fast builds:**
```dockerfile
COPY package*.json .   # Rarely changes
RUN npm install        # Cached!
COPY . .              # Changes often
```

**For small images:**
```dockerfile
FROM node:18 AS builder
RUN npm run build

FROM node:18-alpine    # Smaller base
COPY --from=builder /app/dist ./dist
```

**For flexibility:**
```dockerfile
ARG BUILD_ENV=production     # Build time
ENV RUNTIME_PORT=3000        # Runtime
```

**For command control:**
```dockerfile
ENTRYPOINT ["node"]          # Fixed executable
CMD ["server.js"]            # Default argument (overridable)
```

---

## 🎯 Summary

**These 7 files teach the most important Dockerfile concepts! 🐳**

- 2 files for layer caching (bad vs good)
- 1 file for multi-stage builds
- 1 file for build arguments
- 3 files for CMD/ENTRYPOINT patterns
