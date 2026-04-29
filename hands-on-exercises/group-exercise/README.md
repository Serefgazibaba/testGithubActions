# Group Exercise: E-Commerce Microservices Platform

## 📁 Files in This Folder

- **GROUP-EXERCISE-INSTRUCTIONS.md** - Complete detailed instructions for all 4 groups
- **QUICK-REFERENCE.md** - Quick reference guide for students and instructor
- **docker-compose.yml** - Template for final integration (instructor updates this)

---

## 🎯 Exercise Overview

Students work in **4 groups**, each building a separate microservice. All services are then combined using Docker Compose.

### Services to Build:
1. **Frontend** (Nginx + HTML/JS) - Port 80
2. **Product Catalog** (Node.js API) - Port 3001
3. **Shopping Cart** (Node.js API) - Port 3002
4. **Authentication** (Node.js API) - Port 3003

---

## 🚀 How to Run This Exercise

### For Students:

1. **Read your group's instructions**
   - Open `GROUP-EXERCISE-INSTRUCTIONS.md`
   - Find your group section
   - Follow step-by-step instructions

2. **Build your service**
   - Create Dockerfile
   - Write the code
   - Test locally

3. **Push to Docker Hub**
   - Tag your image
   - Push to your account
   - Verify it's public

4. **Submit to instructor**
   - Docker Hub username
   - Full image name
   - Screenshot of test

### For Instructor:

1. **Before class:**
   - Review `GROUP-EXERCISE-INSTRUCTIONS.md`
   - Decide how to divide students (4 groups)
   - Prepare Docker Hub account examples

2. **During class:**
   - Assign groups
   - Distribute instructions
   - Monitor progress
   - Help with issues

3. **After submissions:**
   - Collect all image names
   - Update `docker-compose.yml` with actual usernames
   - Pull all images
   - Run `docker compose up -d`
   - Demo the complete application

4. **Demo:**
   ```bash
   docker compose up -d
   docker compose ps
   # Open browser: http://localhost
   ```

---

## ⏱️ Time Allocation

| Phase | Time | Activity |
|-------|------|----------|
| **Introduction** | 10 min | Explain project, assign groups |
| **Development** | 60 min | Students build services |
| **Testing & Push** | 15 min | Local testing, push to Docker Hub |
| **Integration** | 10 min | Instructor creates compose file |
| **Demo** | 15 min | Run complete application |
| **Discussion** | 10 min | Q&A, lessons learned |
| **Total** | 2 hours | |

---

## 📋 What Students Will Learn

### Technical Skills:
- ✅ Writing Dockerfiles
- ✅ Building Docker images
- ✅ Testing containers locally
- ✅ Pushing to Docker Hub
- ✅ Pulling from Docker Hub
- ✅ Using Docker Compose
- ✅ Container networking
- ✅ Service communication

### Soft Skills:
- ✅ Team collaboration
- ✅ Following specifications
- ✅ Integration testing
- ✅ Troubleshooting
- ✅ Documentation
- ✅ Time management

### Real-World Concepts:
- ✅ Microservices architecture
- ✅ API design
- ✅ Distributed systems
- ✅ DevOps workflows
- ✅ Container orchestration

---

## 🎓 Prerequisites

Students should know:
- Basic Docker commands (`docker build`, `docker run`)
- How containers work
- Basic programming (Node.js or ability to copy/paste)
- Command line basics
- Text editor usage

Students should have:
- Docker Desktop installed
- Docker Hub account (free)
- Text editor or IDE
- Internet connection
- Terminal access

---

## 📦 Required Tools

- Docker Desktop
- Docker Compose (included with Docker Desktop)
- Text editor (VS Code, Sublime, etc.)
- Web browser
- Terminal/Command Prompt

---

## 🏗️ Architecture Diagram

```
Internet
   ↓
┌──────────────────────────────────────┐
│  Frontend (Nginx)                     │  ← Group 1
│  Port 80                              │
│  Static HTML + JavaScript             │
└────────────┬─────────────────────────┘
             │ (Reverse Proxy)
      ┌──────┴───────┬─────────────┐
      │              │             │
┌─────▼─────┐  ┌────▼────┐  ┌─────▼────┐
│ Products  │  │  Cart   │  │   Auth   │
│ Service   │  │ Service │  │ Service  │
│ Port 3001 │  │Port 3002│  │Port 3003 │
│ Group 2   │  │ Group 3 │  │ Group 4  │
└───────────┘  └─────────┘  └──────────┘
      │              │             │
      └──────┬───────┴─────────────┘
             │
       Docker Network
    (ecommerce-network)
```

---

## 🎯 Success Criteria

### Individual Group Success:
- ✅ Dockerfile builds without errors
- ✅ Container runs successfully
- ✅ Service responds on correct port
- ✅ API returns expected JSON
- ✅ Health check endpoint works
- ✅ Image pushed to Docker Hub
- ✅ Image is publicly accessible

### Complete Project Success:
- ✅ All 4 services running
- ✅ Frontend loads in browser
- ✅ Frontend can call all APIs
- ✅ No network errors
- ✅ All containers in `docker compose ps`
- ✅ Logs show no critical errors

---

## 🐛 Common Issues & Solutions

### "Cannot build image"
- Check Dockerfile syntax
- Ensure all files exist
- Check file paths

### "Container exits immediately"
- Check container logs: `docker logs <container>`
- Verify CMD/ENTRYPOINT
- Check for errors in code

### "Cannot push to Docker Hub"
- Login first: `docker login`
- Check image name format
- Verify Docker Hub account

### "Services can't communicate"
- Ensure same network
- Check container names
- Verify ports

### "Port already in use"
- Stop other containers
- Change port mapping
- Check what's using port

---

## 📊 Assessment Ideas

### Individual (Group) Grade:
- Dockerfile quality (20%)
- Code functionality (30%)
- Docker Hub push (20%)
- Documentation (10%)
- Timely submission (10%)
- Teamwork (10%)

### Bonus Points:
- Added extra features (+5%)
- Excellent error handling (+5%)
- Clean code/comments (+5%)
- Help other groups (+5%)

---

## 🎉 Expected Outcomes

By the end, students will have:

1. **Built** a real containerized microservice
2. **Published** an image to Docker Hub
3. **Integrated** their service with others
4. **Experienced** real-world DevOps workflow
5. **Understood** microservices architecture
6. **Practiced** team collaboration
7. **Debugged** container issues
8. **Completed** a portfolio project

---

## 📚 Next Steps After Exercise

1. **Add Database**
   - Add PostgreSQL to compose file
   - Connect services to database
   - Persist data

2. **Add Monitoring**
   - Add Prometheus
   - Add Grafana dashboards
   - Monitor container metrics

3. **Add CI/CD**
   - GitHub Actions workflow
   - Automated testing
   - Automated deployment

4. **Deploy to Cloud**
   - AWS ECS
   - Google Cloud Run
   - Azure Container Instances

---

## 💡 Tips for Success

### For Students:
- Start early
- Test frequently
- Ask questions
- Help teammates
- Document issues
- Keep it simple
- Follow instructions exactly
- Test before pushing

### For Instructor:
- Circulate and help
- Monitor progress
- Address common issues
- Encourage collaboration
- Celebrate successes
- Be ready to debug
- Have backup images ready
- Take screenshots for demo

---

## 📞 Support

If stuck, check:
1. Exercise instructions
2. Quick reference guide
3. Docker documentation
4. Ask instructor
5. Ask classmates
6. Google error messages

---

## 🏆 Bonus Challenges

For groups that finish early:

1. **Add Environment Variables**
   ```yaml
   environment:
     - NODE_ENV=production
   ```

2. **Add Health Checks**
   ```yaml
   healthcheck:
     test: ["CMD", "curl", "-f", "http://localhost/health"]
   ```

3. **Add Volume Persistence**
   ```yaml
   volumes:
     - data:/app/data
   ```

4. **Add Resource Limits**
   ```yaml
   deploy:
     resources:
       limits:
         memory: 512M
   ```

5. **Add Logging**
   ```yaml
   logging:
     driver: json-file
     options:
       max-size: "10m"
   ```

---

Happy containerizing! 🐳
