# Docker Networks - Hands-On Exercises

## Exercise 1: Basic Network Creation and Container Communication

### Objective
Learn to create networks and enable container-to-container communication.

### Steps

1. **Create a custom bridge network:**
```bash
docker network create my-first-network
```

2. **Verify the network was created:**
```bash
docker network ls
docker network inspect my-first-network
```

3. **Start two Alpine containers on the same network:**
```bash
# Container 1
docker run -dit --name container1 --network my-first-network alpine

# Container 2
docker run -dit --name container2 --network my-first-network alpine
```

4. **Test connectivity from container1 to container2:**
```bash
docker exec -it container1 ping container2
# Press Ctrl+C to stop
```

5. **Test DNS resolution:**
```bash
docker exec -it container1 nslookup container2
```

6. **Cleanup:**
```bash
docker stop container1 container2
docker rm container1 container2
docker network rm my-first-network
```

### Expected Results
- ✅ Containers can ping each other by name
- ✅ DNS resolves container names to IPs
- ✅ Network inspection shows both containers

---

## Exercise 2: Multi-Container Web Application

### Objective
Build a complete web application with frontend, backend, and database using Docker networks.

### Architecture
```
Frontend (Nginx) → Backend (Node.js) → Database (PostgreSQL)
```

### Steps

1. **Create a dedicated network:**
```bash
docker network create webapp-network
```

2. **Start PostgreSQL database:**
```bash
docker run -d \
  --name postgres-db \
  --network webapp-network \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=myapp \
  postgres:15
```

3. **Start a simple Node.js backend (using existing image):**
```bash
docker run -d \
  --name backend \
  --network webapp-network \
  -e DATABASE_URL=postgresql://postgres:mysecretpassword@postgres-db:5432/myapp \
  -p 3000:3000 \
  node:18-alpine \
  sh -c "echo 'Backend running on port 3000'; sleep infinity"
```

4. **Start Nginx frontend:**
```bash
docker run -d \
  --name frontend \
  --network webapp-network \
  -p 8080:80 \
  nginx:alpine
```

5. **Test connectivity from backend to database:**
```bash
# Install postgres client in backend container
docker exec -it backend sh

# Inside container, try to connect to database
apk add postgresql-client
psql postgresql://postgres:mysecretpassword@postgres-db:5432/myapp -c "SELECT version();"
exit
```

6. **View network details:**
```bash
docker network inspect webapp-network
```

7. **Cleanup:**
```bash
docker stop postgres-db backend frontend
docker rm postgres-db backend frontend
docker network rm webapp-network
```

### Expected Results
- ✅ All containers run on the same network
- ✅ Backend can connect to database using hostname "postgres-db"
- ✅ Frontend accessible at http://localhost:8080
- ✅ Backend accessible at http://localhost:3000

---

## Exercise 3: Network Isolation and Security

### Objective
Implement network isolation to restrict access between containers.

### Scenario
Create a secure architecture where:
- Frontend can access Backend
- Backend can access Database
- Frontend CANNOT directly access Database

### Steps

1. **Create two separate networks:**
```bash
docker network create frontend-network
docker network create backend-network
```

2. **Start database (backend network only):**
```bash
docker run -d \
  --name secure-db \
  --network backend-network \
  -e POSTGRES_PASSWORD=secret \
  postgres:15
```

3. **Start backend API (connected to BOTH networks):**
```bash
docker run -d \
  --name api-server \
  --network backend-network \
  alpine \
  sleep infinity

# Connect to frontend network as well
docker network connect frontend-network api-server
```

4. **Start frontend web server (frontend network only):**
```bash
docker run -d \
  --name web-server \
  --network frontend-network \
  -p 8080:80 \
  nginx:alpine
```

5. **Test 1: Frontend CAN reach API:**
```bash
docker exec web-server ping -c 3 api-server
# Should work ✅
```

6. **Test 2: API CAN reach Database:**
```bash
docker exec api-server ping -c 3 secure-db
# Should work ✅
```

7. **Test 3: Frontend CANNOT reach Database:**
```bash
docker exec web-server ping -c 3 secure-db
# Should fail ❌ (bad address)
```

8. **Inspect networks to see the isolation:**
```bash
docker network inspect frontend-network
docker network inspect backend-network
```

9. **Cleanup:**
```bash
docker stop secure-db api-server web-server
docker rm secure-db api-server web-server
docker network rm frontend-network backend-network
```

### Expected Results
- ✅ Frontend → API: Success
- ✅ API → Database: Success
- ❌ Frontend → Database: Blocked (isolation working!)

---

## Exercise 4: Troubleshooting Network Issues

### Objective
Learn to diagnose and fix common Docker networking problems.

### Scenario 1: Container Can't Resolve Names

**Problem Setup:**
```bash
# Create network
docker network create test-net

# Start container on DEFAULT bridge (wrong!)
docker run -dit --name app1 alpine

# Start container on custom network
docker run -dit --name app2 --network test-net alpine
```

**Problem:**
```bash
# This will FAIL
docker exec app1 ping app2
# ping: bad address 'app2'
```

**Diagnosis:**
```bash
# Check which network app1 is on
docker inspect app1 | grep -A 10 Networks

# Check which network app2 is on
docker inspect app2 | grep -A 10 Networks
```

**Solution:**
```bash
# Connect app1 to the custom network
docker network connect test-net app1

# Now it works!
docker exec app1 ping -c 3 app2
```

**Cleanup:**
```bash
docker stop app1 app2
docker rm app1 app2
docker network rm test-net
```

---

### Scenario 2: Port Already in Use

**Problem Setup:**
```bash
# Start first container on port 8080
docker run -d --name web1 -p 8080:80 nginx

# Try to start second container on SAME port
docker run -d --name web2 -p 8080:80 nginx
# Error: port is already allocated
```

**Diagnosis:**
```bash
# Check what's using port 8080
docker ps --filter publish=8080
```

**Solutions:**

Option 1: Use different host port
```bash
docker run -d --name web2 -p 8081:80 nginx
# Now accessible at http://localhost:8081
```

Option 2: Don't expose to host (use network instead)
```bash
# Create network
docker network create webnet

# Move containers to network (no port exposure needed)
docker stop web1 web2
docker rm web1 web2

docker run -d --name web1 --network webnet nginx
docker run -d --name web2 --network webnet nginx

# Containers can access each other by name
docker run --rm --network webnet alpine wget -O- http://web1
docker run --rm --network webnet alpine wget -O- http://web2
```

**Cleanup:**
```bash
docker stop web1 web2
docker rm web1 web2
docker network rm webnet
```

---

### Scenario 3: Can't Access Container from Host

**Problem Setup:**
```bash
docker run -d --name webapp nginx
curl http://localhost:80
# Connection refused!
```

**Diagnosis:**
```bash
# Check if port is published
docker ps
# PORTS shows: 80/tcp (NOT 0.0.0.0:80->80/tcp)
```

**Solution:**
```bash
docker stop webapp
docker rm webapp

# Publish the port!
docker run -d --name webapp -p 8080:80 nginx

# Now it works
curl http://localhost:8080
```

**Cleanup:**
```bash
docker stop webapp
docker rm webapp
```

---

## Exercise 5: Advanced Network Configuration

### Objective
Create a microservices architecture with multiple networks.

### Architecture
```
┌─────────────────┐
│   Gateway       │  (frontend network)
│   (port 80)     │
└────────┬────────┘
         │
    ┌────┴────┬────────────┐
    │         │            │
┌───▼───┐ ┌──▼────┐  ┌───▼──────┐
│ Auth  │ │ Users │  │ Products │  (services network)
│Service│ │Service│  │ Service  │
└───┬───┘ └──┬────┘  └───┬──────┘
    │        │            │
    └────┬───┴────────┬───┘
         │            │
    ┌────▼────┐  ┌───▼─────┐
    │ AuthDB  │  │ MainDB  │  (database network)
    └─────────┘  └─────────┘
```

### Steps

1. **Create three networks:**
```bash
docker network create frontend-net
docker network create services-net
docker network create database-net
```

2. **Start databases (database network only):**
```bash
docker run -d --name auth-db --network database-net postgres:15 -e POSTGRES_PASSWORD=secret
docker run -d --name main-db --network database-net postgres:15 -e POSTGRES_PASSWORD=secret
```

3. **Start microservices (services network):**
```bash
docker run -d --name auth-service --network services-net alpine sleep infinity
docker run -d --name users-service --network services-net alpine sleep infinity
docker run -d --name products-service --network services-net alpine sleep infinity

# Connect services to database network
docker network connect database-net auth-service
docker network connect database-net users-service
docker network connect database-net products-service
```

4. **Start gateway (frontend network):**
```bash
docker run -d --name gateway --network frontend-net -p 80:80 nginx

# Connect gateway to services network
docker network connect services-net gateway
```

5. **Test connectivity:**
```bash
# Gateway can reach services
docker exec gateway ping -c 2 auth-service
docker exec gateway ping -c 2 users-service

# Services can reach databases
docker exec users-service ping -c 2 main-db

# Gateway CANNOT reach databases (isolated!)
docker exec gateway ping -c 2 main-db
# Should fail!
```

6. **View the complete architecture:**
```bash
echo "=== Frontend Network ==="
docker network inspect frontend-net | grep -A 2 "Containers"

echo "=== Services Network ==="
docker network inspect services-net | grep -A 5 "Containers"

echo "=== Database Network ==="
docker network inspect database-net | grep -A 5 "Containers"
```

7. **Cleanup:**
```bash
docker stop gateway auth-service users-service products-service auth-db main-db
docker rm gateway auth-service users-service products-service auth-db main-db
docker network rm frontend-net services-net database-net
```

### Expected Results
- ✅ Gateway → Services: Connected
- ✅ Services → Databases: Connected
- ❌ Gateway → Databases: Blocked
- ✅ Multi-layer security achieved!

---

## 🎯 Challenge Exercise: Build Your Own

### Task
Create a real-world application with:
- 1 Nginx reverse proxy (exposed to host)
- 2 Node.js backend instances (load balanced)
- 1 Redis cache
- 1 PostgreSQL database
- Proper network isolation

### Requirements
1. Only Nginx should be accessible from host
2. Backends should access cache and database
3. Nginx should NOT directly access database
4. Use meaningful network and container names
5. Document your architecture

**Hint:** You'll need at least 2 networks!

Good luck! 🚀

---

## Summary

You've learned:
- ✅ Create and manage Docker networks
- ✅ Enable container-to-container communication
- ✅ Implement network isolation for security
- ✅ Troubleshoot common network issues
- ✅ Build complex multi-tier architectures
- ✅ Use DNS-based service discovery

**Key Commands:**
```bash
docker network create <name>          # Create network
docker network ls                      # List networks
docker network inspect <name>          # View details
docker network connect <net> <cont>   # Add container
docker network disconnect <net> <cont> # Remove container
docker network rm <name>               # Delete network
docker network prune                   # Clean unused
```
