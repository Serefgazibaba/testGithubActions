# Docker Troubleshooting - Hands-On Exercises

## Quick Practical Exercises

**Time Required:** 30-45 minutes

---

## Exercise 1: Fix Container That Won't Start

```bash
# This will fail - find and fix the issue
docker run --name broken-nginx nginx:latest /bin/nonexistent

# Your tasks:
# 1. Check why it failed
docker ps -a
docker logs broken-nginx
docker inspect --format='{{.State.ExitCode}}' broken-nginx

# 2. Fix it
docker rm broken-nginx
docker run --name working-nginx -d nginx:latest

# 3. Verify
docker ps
curl http://localhost:80  # Won't work - why?

# 4. Fix the port issue
docker stop working-nginx
docker rm working-nginx
docker run --name working-nginx -d -p 8080:80 nginx:latest
curl http://localhost:8080

# Cleanup
docker stop working-nginx
docker rm working-nginx
```

---

## Exercise 2: Debug Application Errors

```bash
# Create a buggy app
mkdir ~/docker-debug && cd ~/docker-debug

cat > app.py << 'EOF'
from flask import Flask
import os

app = Flask(__name__)

@app.route('/')
def hello():
    # This will crash if DB_NAME is missing
    db = os.environ['DB_NAME']
    return f'Connected to {db}'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF

cat > requirements.txt << 'EOF'
flask==3.0.0
EOF

cat > Dockerfile << 'EOF'
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app.py .
CMD ["python", "app.py"]
EOF

# Build and run (will crash)
docker build -t buggy-app .
docker run --name debug-app -p 5000:5000 buggy-app

# Debug steps:
# 1. Check logs
docker logs debug-app

# 2. Fix with environment variable
docker rm debug-app
docker run --name debug-app -d -p 5000:5000 -e DB_NAME=mydb buggy-app

# 3. Test it
curl http://localhost:5000

# 4. Get inside to explore
docker exec -it debug-app /bin/bash
# Inside: env | grep DB_NAME
# Inside: ps aux
# Inside: exit

# Cleanup
docker stop debug-app
docker rm debug-app
cd ~ && rm -rf ~/docker-debug
```

---

## Exercise 3: Fix Out of Memory Issue

```bash
# Memory hog app
mkdir ~/memory-test && cd ~/memory-test

cat > memory-hog.py << 'EOF'
data = []
while True:
    data.append(' ' * 10 * 1024 * 1024)  # 10MB chunks
    print(f"Allocated {len(data) * 10}MB")
EOF

cat > Dockerfile << 'EOF'
FROM python:3.11-slim
COPY memory-hog.py .
CMD ["python", "memory-hog.py"]
EOF

docker build -t memory-hog .

# Run with low memory (will be killed)
docker run --name oom-test -m 50m memory-hog

# Check if OOM killed
docker inspect --format='{{.State.OOMKilled}}' oom-test
docker inspect --format='{{.State.ExitCode}}' oom-test  # 137

# Fix - increase memory
docker rm oom-test
docker run --name oom-fixed -m 500m -d memory-hog

# Monitor it
docker stats oom-fixed --no-stream

# Cleanup
docker stop oom-fixed
docker rm oom-fixed
cd ~ && rm -rf ~/memory-test
```

---

## Exercise 4: Container Network Debugging

```bash
# Create two containers that need to communicate
docker network create mynetwork

docker run --name web --network mynetwork -d nginx:latest
docker run --name api --network mynetwork -d nginx:latest

# Test DNS resolution
docker exec web ping -c 3 api
docker exec api ping -c 3 web

# Test HTTP communication
docker exec web apt-get update && apt-get install -y curl
docker exec web curl http://api:80

# Get IPs
docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' web
docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' api

# Cleanup
docker stop web api
docker rm web api
docker network rm mynetwork
```

---

## Exercise 5: Volume Data Persistence

```bash
# Run Postgres without volume - data will be lost
docker run --name postgres-no-vol -d \
  -e POSTGRES_PASSWORD=test123 \
  postgres:15

# Create data
docker exec -it postgres-no-vol psql -U postgres -c "CREATE DATABASE myapp;"
docker exec -it postgres-no-vol psql -U postgres -c "\l"

# Stop and remove
docker stop postgres-no-vol
docker rm postgres-no-vol

# Run again - data is gone!
docker run --name postgres-no-vol -d \
  -e POSTGRES_PASSWORD=test123 \
  postgres:15

docker exec -it postgres-no-vol psql -U postgres -c "\l"  # myapp missing

# Fix with volume
docker stop postgres-no-vol
docker rm postgres-no-vol

docker volume create pgdata
docker run --name postgres-vol -d \
  -e POSTGRES_PASSWORD=test123 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:15

# Create data
docker exec -it postgres-vol psql -U postgres -c "CREATE DATABASE myapp;"

# Remove and restart
docker stop postgres-vol
docker rm postgres-vol

docker run --name postgres-vol -d \
  -e POSTGRES_PASSWORD=test123 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:15

# Data persists!
docker exec -it postgres-vol psql -U postgres -c "\l"

# Cleanup
docker stop postgres-vol
docker rm postgres-vol
docker volume rm pgdata
```

---

## Exercise 6: Debug Docker Compose

```bash
mkdir ~/compose-debug && cd ~/compose-debug

# Create app with missing config
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
    depends_on:
      - api
  
  api:
    image: python:3.11-slim
    # Missing command - container will exit
    environment:
      - DB_HOST=database
  
  database:
    image: postgres:15
    # Missing required password
EOF

# Try to run
docker-compose up -d

# Debug
docker-compose ps
docker-compose logs

# Fix the issues
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
    depends_on:
      - api
  
  api:
    image: python:3.11-slim
    command: python3 -m http.server 8000
    environment:
      - DB_HOST=database
    ports:
      - "8000:8000"
  
  database:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=secret123
EOF

# Run fixed version
docker-compose up -d

# Verify all running
docker-compose ps
docker-compose logs api

# Test
curl http://localhost:8080
curl http://localhost:8000

# Cleanup
docker-compose down
cd ~ && rm -rf ~/compose-debug
```

---

## Exercise 7: Resource Monitoring

```bash
# Start multiple containers
docker run --name nginx1 -d nginx:latest
docker run --name redis1 -d redis:latest
docker run --name postgres1 -d -e POSTGRES_PASSWORD=test postgres:15

# Monitor all containers
docker stats --no-stream

# Monitor specific container
docker stats nginx1 --no-stream

# Check disk usage
docker system df
docker system df -v

# Check container sizes
docker ps -s

# Clean up unused resources
docker stop nginx1 redis1 postgres1
docker rm nginx1 redis1 postgres1
docker system prune -a
```

---

## Challenge: Fix Everything

**Scenario:** Multi-container app with multiple issues. Fix them all!

```bash
mkdir ~/final-challenge && cd ~/final-challenge

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  frontend:
    image: nginx:latest
    # Wrong port mapping
    ports:
      - "80:80"
  
  backend:
    build: ./backend
    # Missing environment variable DB_PASSWORD
    environment:
      - DB_HOST=database
      - DB_USER=admin
    # Port not exposed
  
  database:
    image: postgres:15
    # Missing POSTGRES_PASSWORD

volumes:
  dbdata:
EOF

mkdir backend
cat > backend/Dockerfile << 'EOF'
FROM python:3.11-slim
WORKDIR /app
RUN pip install flask psycopg2-binary
COPY app.py .
CMD ["python", "app.py"]
EOF

cat > backend/app.py << 'EOF'
from flask import Flask
import os

app = Flask(__name__)

@app.route('/')
def home():
    db_host = os.environ.get('DB_HOST', 'unknown')
    db_pass = os.environ.get('DB_PASSWORD', 'NOT_SET')
    return f'Backend running! DB: {db_host}, Pass: {db_pass}'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF

# Try to run - multiple issues!
docker-compose up -d

# Your tasks:
# 1. Find all issues using: docker-compose ps, docker-compose logs
# 2. Fix docker-compose.yml
# 3. Ensure all services start successfully
# 4. Test connectivity

# Hints:
# - Change frontend port to 8080
# - Add DB_PASSWORD env var to backend
# - Expose backend port 5000
# - Add POSTGRES_PASSWORD to database
# - Add volume to database for persistence

# After fixing, verify:
# docker-compose ps  # All should be "Up"
# docker-compose logs
# curl http://localhost:8080
# docker-compose exec backend curl localhost:5000

# Solution docker-compose.yml:
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  frontend:
    image: nginx:latest
    ports:
      - "8080:80"
  
  backend:
    build: ./backend
    environment:
      - DB_HOST=database
      - DB_USER=admin
      - DB_PASSWORD=secret123
    ports:
      - "5000:5000"
  
  database:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=secret123
    volumes:
      - dbdata:/var/lib/postgresql/data

volumes:
  dbdata:
EOF

docker-compose up -d --build
docker-compose ps

# Cleanup
docker-compose down -v
cd ~ && rm -rf ~/final-challenge
```

---

## Summary Checklist

After completing these exercises, you can:

✅ Read logs to diagnose startup failures  
✅ Fix missing environment variables  
✅ Resolve port conflicts  
✅ Debug OOM (Out of Memory) issues  
✅ Test container networking and DNS  
✅ Use volumes for data persistence  
✅ Debug Docker Compose services  
✅ Monitor resource usage  
✅ Execute commands inside containers  
✅ Use docker inspect for detailed info  

## Key Commands to Remember

```bash
# The Big 3
docker logs <container>
docker exec -it <container> /bin/bash
docker stats <container>

# Quick checks
docker ps -a
docker inspect <container>
docker port <container>

# Cleanup
docker system prune -a
docker volume prune
```

**Remember:** Most problems are solved by checking logs first!
