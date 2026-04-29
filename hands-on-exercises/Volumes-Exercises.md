# Docker Volumes - Hands-On Exercises

## Exercise 1: Create and Manage Volumes

### Objective
Learn the basics of creating, inspecting, and removing Docker volumes.

### Steps

1. **Create a named volume:**
```bash
docker volume create my-data
```

2. **List all volumes:**
```bash
docker volume ls
```

3. **Inspect the volume:**
```bash
docker volume inspect my-data
```

4. **Find where the volume is stored:**
```bash
docker volume inspect my-data --format '{{.Mountpoint}}'
```

5. **Create a container using the volume:**
```bash
docker run -d --name test-app -v my-data:/app/data alpine sleep infinity
```

6. **Write data to the volume:**
```bash
docker exec test-app sh -c "echo 'Hello from volume!' > /app/data/message.txt"
```

7. **Read the data:**
```bash
docker exec test-app cat /app/data/message.txt
```

8. **Remove the container (but keep volume):**
```bash
docker rm -f test-app
```

9. **Verify volume still exists:**
```bash
docker volume ls | grep my-data
```

10. **Create new container with SAME volume:**
```bash
docker run --rm -v my-data:/app/data alpine cat /app/data/message.txt
# Data is still there! ✅
```

11. **Cleanup:**
```bash
docker volume rm my-data
```

### Expected Results
- ✅ Volume persists after container deletion
- ✅ New container can access old data
- ✅ Volume has a known location on host

---

## Exercise 2: Database Persistence with PostgreSQL

### Objective
Ensure database data survives container recreation.

### Steps

1. **Create a volume for PostgreSQL:**
```bash
docker volume create postgres-data
```

2. **Start PostgreSQL with the volume:**
```bash
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=testdb \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:15
```

3. **Wait for database to start:**
```bash
sleep 5
```

4. **Create a table and insert data:**
```bash
docker exec -it postgres psql -U postgres -d testdb -c "
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
  );
"

docker exec -it postgres psql -U postgres -d testdb -c "
  INSERT INTO users (name, email) VALUES 
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com'),
  ('Charlie', 'charlie@example.com');
"
```

5. **Query the data:**
```bash
docker exec -it postgres psql -U postgres -d testdb -c "SELECT * FROM users;"
```

6. **DESTROY the container:**
```bash
docker rm -f postgres
```

7. **Start a NEW PostgreSQL container with the SAME volume:**
```bash
docker run -d \
  --name postgres-new \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=testdb \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:15

sleep 5
```

8. **Verify data is still there:**
```bash
docker exec -it postgres-new psql -U postgres -d testdb -c "SELECT * FROM users;"
# All 3 users still exist! ✅
```

9. **Cleanup:**
```bash
docker rm -f postgres-new
docker volume rm postgres-data
```

### Expected Results
- ✅ Database survives container deletion
- ✅ All tables and data persist
- ✅ New container picks up existing data

---

## Exercise 3: Share Data Between Containers

### Objective
Multiple containers reading and writing to the same volume.

### Steps

1. **Create a shared volume:**
```bash
docker volume create shared-logs
```

2. **Start a writer container (generates logs):**
```bash
docker run -d \
  --name log-writer \
  -v shared-logs:/logs \
  alpine \
  sh -c 'while true; do echo "$(date): Log entry" >> /logs/app.log; sleep 2; done'
```

3. **Start a reader container (monitors logs):**
```bash
docker run -d \
  --name log-reader \
  -v shared-logs:/logs \
  alpine \
  tail -f /logs/app.log
```

4. **Watch the logs:**
```bash
docker logs -f log-reader
# You should see logs being written in real-time!
# Press Ctrl+C to stop
```

5. **Start ANOTHER reader:**
```bash
docker run --rm -it \
  --name log-analyzer \
  -v shared-logs:/logs \
  alpine \
  sh

# Inside container:
cat /logs/app.log
wc -l /logs/app.log
exit
```

6. **Stop the writer:**
```bash
docker stop log-writer
```

7. **Verify logs are still accessible:**
```bash
docker run --rm -v shared-logs:/logs alpine cat /logs/app.log
```

8. **Cleanup:**
```bash
docker rm -f log-writer log-reader
docker volume rm shared-logs
```

### Expected Results
- ✅ Multiple containers access same volume
- ✅ Real-time data sharing works
- ✅ Data persists after all containers stop

---

## Exercise 4: Backup and Restore Volumes

### Objective
Learn to backup volume data and restore it.

### Scenario: Backup Production Database

1. **Create a volume with important data:**
```bash
docker volume create production-db

# Simulate production data
docker run --rm \
  -v production-db:/data \
  alpine \
  sh -c "echo 'Critical production data' > /data/important.txt; \
         echo 'User database' > /data/users.db; \
         echo 'Configuration' > /data/config.json"
```

2. **Backup the volume to a tar file:**
```bash
docker run --rm \
  -v production-db:/data:ro \
  -v $(pwd):/backup \
  alpine \
  tar czf /backup/production-db-backup.tar.gz -C /data .

# Windows PowerShell:
# -v ${PWD}:/backup

# Verify backup file exists
ls -lh production-db-backup.tar.gz
```

3. **Simulate disaster - delete the volume:**
```bash
docker volume rm production-db
```

4. **Create a new volume for restoration:**
```bash
docker volume create production-db-restored
```

5. **Restore data from backup:**
```bash
docker run --rm \
  -v production-db-restored:/data \
  -v $(pwd):/backup \
  alpine \
  tar xzf /backup/production-db-backup.tar.gz -C /data

# Windows PowerShell:
# -v ${PWD}:/backup
```

6. **Verify restored data:**
```bash
docker run --rm -v production-db-restored:/data alpine ls -la /data

docker run --rm -v production-db-restored:/data alpine cat /data/important.txt
docker run --rm -v production-db-restored:/data alpine cat /data/users.db
```

7. **Cleanup:**
```bash
docker volume rm production-db-restored
rm production-db-backup.tar.gz
```

### Expected Results
- ✅ Backup file created successfully
- ✅ Data restored completely
- ✅ All files match original

---

## Exercise 5: Development Workflow with Bind Mounts

### Objective
Use bind mounts for live code reloading during development.

### Steps

1. **Create a simple web application directory:**
```bash
mkdir my-web-app
cd my-web-app
```

2. **Create an HTML file:**
```bash
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <h1>Hello Docker!</h1>
    <p>Version 1.0</p>
</body>
</html>
EOF
```

3. **Create an Nginx config:**
```bash
cat > nginx.conf << 'EOF'
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
EOF
```

4. **Start Nginx with bind mount (live reload):**
```bash
docker run -d \
  --name dev-server \
  -p 8080:80 \
  -v $(pwd)/index.html:/usr/share/nginx/html/index.html:ro \
  -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf:ro \
  nginx:alpine

# Windows PowerShell:
# -v ${PWD}/index.html:/usr/share/nginx/html/index.html:ro
```

5. **Test the application:**
```bash
curl http://localhost:8080
# Or open in browser: http://localhost:8080
```

6. **Edit the HTML file on your host:**
```bash
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
    <style>
        body { background: #f0f0f0; font-family: Arial; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>Hello Docker - Updated!</h1>
    <p>Version 2.0 - With styles!</p>
    <p>Changes appear immediately! 🚀</p>
</body>
</html>
EOF
```

7. **Refresh browser or curl again:**
```bash
curl http://localhost:8080
# Changes are live! No container restart needed! ✅
```

8. **Cleanup:**
```bash
docker stop dev-server
docker rm dev-server
cd ..
rm -rf my-web-app
```

### Expected Results
- ✅ File changes on host appear in container immediately
- ✅ No need to rebuild or restart container
- ✅ Perfect for development workflow

---

## Exercise 6: Volume Inspection and Debugging

### Objective
Learn to troubleshoot volume-related issues.

### Steps

1. **Create multiple volumes and containers:**
```bash
# Create volumes
docker volume create vol1
docker volume create vol2
docker volume create vol3

# Use some volumes
docker run -d --name app1 -v vol1:/data alpine sleep infinity
docker run -d --name app2 -v vol1:/data alpine sleep infinity
docker run -d --name app3 -v vol2:/data alpine sleep infinity
# vol3 is unused
```

2. **Find which containers use a specific volume:**
```bash
# Check vol1 usage
docker ps -a --filter volume=vol1

# Should show app1 and app2
```

3. **Check volume size:**
```bash
docker run --rm -v vol1:/data alpine du -sh /data
```

4. **List files in a volume:**
```bash
docker run --rm -v vol1:/data alpine ls -la /data
```

5. **Find unused volumes:**
```bash
docker volume ls -f dangling=true
# Should show vol3
```

6. **Inspect volume details:**
```bash
docker volume inspect vol1 --format '{{json .}}' | jq
# Or without jq:
docker volume inspect vol1
```

7. **Check which networks and volumes a container uses:**
```bash
docker inspect app1 --format '{{.Mounts}}'
```

8. **Cleanup unused volumes:**
```bash
# First, remove containers
docker rm -f app1 app2 app3

# Then prune unused volumes
docker volume prune -f

# Verify
docker volume ls
```

### Expected Results
- ✅ Can identify which containers use a volume
- ✅ Can check volume size and contents
- ✅ Can find and clean up unused volumes

---

## Exercise 7: Read-Only Volumes

### Objective
Protect data from accidental modification.

### Steps

1. **Create a volume with configuration:**
```bash
docker volume create app-config

# Add config files
docker run --rm -v app-config:/config alpine sh -c "
  echo 'DATABASE_URL=postgres://db:5432' > /config/db.conf;
  echo 'API_KEY=secret123' > /config/api.conf;
  echo 'DEBUG=false' > /config/app.conf;
"
```

2. **Start container with READ-ONLY mount:**
```bash
docker run -dit --name app -v app-config:/config:ro alpine
```

3. **Try to modify config (should fail):**
```bash
docker exec app sh -c "echo 'HACKED=true' >> /config/app.conf"
# Error: Read-only file system ✅
```

4. **Verify can still read:**
```bash
docker exec app cat /config/app.conf
# Works! ✅
```

5. **Start another container with WRITE access:**
```bash
docker run --rm -v app-config:/config alpine sh -c "
  echo 'NEW_SETTING=value' >> /config/app.conf
"
```

6. **Verify the change:**
```bash
docker exec app cat /config/app.conf
# Shows NEW_SETTING ✅
```

7. **Cleanup:**
```bash
docker rm -f app
docker volume rm app-config
```

### Expected Results
- ✅ Read-only mount prevents writes
- ✅ Can still read data
- ✅ Other containers can write if needed

---

## 🎯 Challenge Exercise: Complete Backup Strategy

### Task
Implement a complete backup and restore strategy for a WordPress site with database.

### Requirements
1. WordPress container with volume for uploads
2. MySQL container with volume for database
3. Create full backup of both volumes
4. Simulate disaster (delete everything)
5. Restore completely from backup
6. Verify site works

### Hints
```bash
# Create volumes
docker volume create wp-content
docker volume create wp-database

# Run MySQL
docker run -d --name mysql \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=wordpress \
  -e MYSQL_USER=wpuser \
  -e MYSQL_PASSWORD=wppass \
  -v wp-database:/var/lib/mysql \
  mysql:8

# Run WordPress
docker run -d --name wordpress \
  -e WORDPRESS_DB_HOST=mysql \
  -e WORDPRESS_DB_USER=wpuser \
  -e WORDPRESS_DB_PASSWORD=wppass \
  -e WORDPRESS_DB_NAME=wordpress \
  -p 8080:80 \
  -v wp-content:/var/www/html/wp-content \
  --link mysql:mysql \
  wordpress:latest

# Now implement backup/restore!
```

Good luck! 🚀

---

## Summary

You've learned:
- ✅ Create and manage Docker volumes
- ✅ Persist database data
- ✅ Share data between containers
- ✅ Backup and restore volumes
- ✅ Use bind mounts for development
- ✅ Inspect and troubleshoot volumes
- ✅ Implement read-only mounts
- ✅ Build production-ready data strategies

**Key Commands:**
```bash
docker volume create <name>           # Create volume
docker volume ls                       # List volumes
docker volume inspect <name>           # View details
docker volume rm <name>                # Delete volume
docker volume prune                    # Remove unused

# Using volumes
-v <volume>:<path>                    # Named volume
-v <volume>:<path>:ro                 # Read-only
-v $(pwd):<path>                      # Bind mount

# Backup
docker run --rm -v <vol>:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz -C /data .

# Restore
docker run --rm -v <vol>:/data -v $(pwd):/backup alpine tar xzf /backup/backup.tar.gz -C /data
```
