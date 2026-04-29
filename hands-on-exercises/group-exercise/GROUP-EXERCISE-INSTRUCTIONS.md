# Group Exercise: Collaborative Microservices Project

## 🎯 Project Overview

**Objective:** Build a complete e-commerce platform where each group creates one microservice, pushes it to Docker Hub, and then combines all services using Docker Compose.

**Teams:** 4 Groups
- **Group 1:** Frontend Service
- **Group 2:** Product Catalog Service
- **Group 3:** Shopping Cart Service
- **Group 4:** User Authentication Service

---

## 📋 Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Nginx)                      │
│              Port 80 - Group 1's Container              │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴───────────┬────────────────┐
        │                      │                │
┌───────▼────────┐   ┌────────▼─────┐   ┌─────▼────────┐
│   Product      │   │  Shopping     │   │     Auth     │
│   Service      │   │   Cart        │   │   Service    │
│  Port 3001     │   │  Port 3002    │   │  Port 3003   │
│  Group 2       │   │  Group 3      │   │  Group 4     │
└────────────────┘   └───────────────┘   └──────────────┘
```

---

## 👥 Group 1: Frontend Service

### Your Mission
Create a simple web interface that connects to all backend services.

### Requirements

1. **Technology:** Nginx with static HTML/JavaScript
2. **Port:** 80
3. **Docker Hub:** `<your-username>/ecommerce-frontend:v1.0`

### Step-by-Step Instructions

1. **Create project directory:**
```bash
mkdir group1-frontend
cd group1-frontend
```

2. **Create index.html:**
```bash
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Commerce Platform</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        h1 { 
            color: #333; 
            margin-bottom: 30px;
            text-align: center;
        }
        .service-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .service-card {
            border: 2px solid #667eea;
            border-radius: 8px;
            padding: 20px;
            background: #f8f9fa;
        }
        .service-card h3 {
            color: #667eea;
            margin-bottom: 15px;
        }
        .btn {
            background: #667eea;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }
        .btn:hover { background: #5568d3; }
        .response {
            margin-top: 15px;
            padding: 10px;
            background: white;
            border-radius: 5px;
            min-height: 50px;
            font-family: monospace;
            font-size: 12px;
        }
        .group-info {
            background: #e7f3ff;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛒 E-Commerce Microservices Platform</h1>
        
        <div class="group-info">
            <strong>👥 Built by 4 Groups | Each service runs in its own container</strong>
        </div>

        <div class="service-grid">
            <!-- Product Service -->
            <div class="service-card">
                <h3>📦 Products (Group 2)</h3>
                <button class="btn" onclick="getProducts()">Get Products</button>
                <button class="btn" onclick="addProduct()">Add Product</button>
                <div id="products-response" class="response"></div>
            </div>

            <!-- Cart Service -->
            <div class="service-card">
                <h3>🛒 Shopping Cart (Group 3)</h3>
                <button class="btn" onclick="getCart()">View Cart</button>
                <button class="btn" onclick="addToCart()">Add to Cart</button>
                <div id="cart-response" class="response"></div>
            </div>

            <!-- Auth Service -->
            <div class="service-card">
                <h3>🔐 Authentication (Group 4)</h3>
                <button class="btn" onclick="login()">Login</button>
                <button class="btn" onclick="getUser()">Get User</button>
                <div id="auth-response" class="response"></div>
            </div>
        </div>
    </div>

    <script>
        const API_BASE = window.location.origin;

        async function getProducts() {
            try {
                const response = await fetch(`${API_BASE}/api/products`);
                const data = await response.json();
                document.getElementById('products-response').innerHTML = 
                    JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('products-response').innerHTML = 
                    'Error: ' + error.message;
            }
        }

        async function addProduct() {
            try {
                const response = await fetch(`${API_BASE}/api/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        name: 'Sample Product', 
                        price: 29.99 
                    })
                });
                const data = await response.json();
                document.getElementById('products-response').innerHTML = 
                    JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('products-response').innerHTML = 
                    'Error: ' + error.message;
            }
        }

        async function getCart() {
            try {
                const response = await fetch(`${API_BASE}/api/cart`);
                const data = await response.json();
                document.getElementById('cart-response').innerHTML = 
                    JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('cart-response').innerHTML = 
                    'Error: ' + error.message;
            }
        }

        async function addToCart() {
            try {
                const response = await fetch(`${API_BASE}/api/cart`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        productId: 1, 
                        quantity: 1 
                    })
                });
                const data = await response.json();
                document.getElementById('cart-response').innerHTML = 
                    JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('cart-response').innerHTML = 
                    'Error: ' + error.message;
            }
        }

        async function login() {
            try {
                const response = await fetch(`${API_BASE}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        username: 'demo', 
                        password: 'password' 
                    })
                });
                const data = await response.json();
                document.getElementById('auth-response').innerHTML = 
                    JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('auth-response').innerHTML = 
                    'Error: ' + error.message;
            }
        }

        async function getUser() {
            try {
                const response = await fetch(`${API_BASE}/api/auth/user`);
                const data = await response.json();
                document.getElementById('auth-response').innerHTML = 
                    JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('auth-response').innerHTML = 
                    'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>
EOF
```

3. **Create Nginx config:**
```bash
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    upstream product_service {
        server product-service:3001;
    }

    upstream cart_service {
        server cart-service:3002;
    }

    upstream auth_service {
        server auth-service:3003;
    }

    server {
        listen 80;

        # Frontend
        location / {
            root /usr/share/nginx/html;
            index index.html;
        }

        # Proxy to Product Service
        location /api/products {
            proxy_pass http://product_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Proxy to Cart Service
        location /api/cart {
            proxy_pass http://cart_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Proxy to Auth Service
        location /api/auth {
            proxy_pass http://auth_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
EOF
```

4. **Create Dockerfile:**
```bash
cat > Dockerfile << 'EOF'
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy frontend files
COPY index.html /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF
```

5. **Build and test locally:**
```bash
docker build -t ecommerce-frontend:v1.0 .
docker run -d -p 8080:80 --name frontend-test ecommerce-frontend:v1.0
curl http://localhost:8080
docker stop frontend-test
docker rm frontend-test
```

6. **Push to Docker Hub:**
```bash
# Login to Docker Hub
docker login

# Tag image
docker tag ecommerce-frontend:v1.0 <your-dockerhub-username>/ecommerce-frontend:v1.0

# Push
docker push <your-dockerhub-username>/ecommerce-frontend:v1.0
```

7. **Share your Docker Hub image name with the instructor!**

---

## 👥 Group 2: Product Service

### Your Mission
Create a REST API for product catalog management.

### Requirements

1. **Technology:** Node.js + Express
2. **Port:** 3001
3. **Docker Hub:** `<your-username>/ecommerce-products:v1.0`
4. **Endpoints:**
   - `GET /api/products` - List all products
   - `POST /api/products` - Add new product
   - `GET /api/products/:id` - Get product by ID

### Step-by-Step Instructions

1. **Create project:**
```bash
mkdir group2-products
cd group2-products
```

2. **Create package.json:**
```bash
cat > package.json << 'EOF'
{
  "name": "product-service",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
EOF
```

3. **Create server.js:**
```bash
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory product database
let products = [
    { id: 1, name: 'Laptop', price: 999.99, stock: 10 },
    { id: 2, name: 'Mouse', price: 29.99, stock: 50 },
    { id: 3, name: 'Keyboard', price: 79.99, stock: 30 },
];

// Get all products
app.get('/api/products', (req, res) => {
    res.json({
        service: 'Product Service (Group 2)',
        products: products
    });
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json({ service: 'Product Service (Group 2)', product });
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Add new product
app.post('/api/products', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock || 0
    };
    products.push(newProduct);
    res.status(201).json({
        service: 'Product Service (Group 2)',
        message: 'Product added',
        product: newProduct
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'Product Service (Group 2)' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏪 Product Service running on port ${PORT}`);
});
EOF
```

4. **Create Dockerfile:**
```bash
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY server.js .

EXPOSE 3001

CMD ["node", "server.js"]
EOF
```

5. **Build, test, and push:**
```bash
# Build
docker build -t ecommerce-products:v1.0 .

# Test locally
docker run -d -p 3001:3001 --name product-test ecommerce-products:v1.0
curl http://localhost:3001/api/products
docker stop product-test && docker rm product-test

# Push to Docker Hub
docker login
docker tag ecommerce-products:v1.0 <your-dockerhub-username>/ecommerce-products:v1.0
docker push <your-dockerhub-username>/ecommerce-products:v1.0
```

6. **Share your Docker Hub image name with the instructor!**

---

## 👥 Group 3: Shopping Cart Service

### Your Mission
Create a REST API for shopping cart management.

### Requirements

1. **Technology:** Node.js + Express
2. **Port:** 3002
3. **Docker Hub:** `<your-username>/ecommerce-cart:v1.0`
4. **Endpoints:**
   - `GET /api/cart` - View cart
   - `POST /api/cart` - Add item to cart
   - `DELETE /api/cart/:id` - Remove item from cart

### Step-by-Step Instructions

1. **Create project:**
```bash
mkdir group3-cart
cd group3-cart
```

2. **Create package.json:**
```bash
cat > package.json << 'EOF'
{
  "name": "cart-service",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
EOF
```

3. **Create server.js:**
```bash
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// In-memory cart
let cart = [];
let nextId = 1;

// Get cart
app.get('/api/cart', (req, res) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.json({
        service: 'Shopping Cart Service (Group 3)',
        items: cart,
        itemCount: cart.length,
        total: total.toFixed(2)
    });
});

// Add to cart
app.post('/api/cart', (req, res) => {
    const cartItem = {
        id: nextId++,
        productId: req.body.productId,
        productName: req.body.productName || `Product ${req.body.productId}`,
        price: req.body.price || 9.99,
        quantity: req.body.quantity || 1,
        addedAt: new Date().toISOString()
    };
    cart.push(cartItem);
    res.status(201).json({
        service: 'Shopping Cart Service (Group 3)',
        message: 'Item added to cart',
        item: cartItem
    });
});

// Remove from cart
app.delete('/api/cart/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = cart.findIndex(item => item.id === id);
    
    if (index !== -1) {
        const removed = cart.splice(index, 1);
        res.json({
            service: 'Shopping Cart Service (Group 3)',
            message: 'Item removed from cart',
            removed: removed[0]
        });
    } else {
        res.status(404).json({ error: 'Item not found in cart' });
    }
});

// Clear cart
app.delete('/api/cart', (req, res) => {
    cart = [];
    res.json({
        service: 'Shopping Cart Service (Group 3)',
        message: 'Cart cleared'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'Shopping Cart Service (Group 3)' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🛒 Shopping Cart Service running on port ${PORT}`);
});
EOF
```

4. **Create Dockerfile:**
```bash
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY server.js .

EXPOSE 3002

CMD ["node", "server.js"]
EOF
```

5. **Build, test, and push:**
```bash
# Build
docker build -t ecommerce-cart:v1.0 .

# Test locally
docker run -d -p 3002:3002 --name cart-test ecommerce-cart:v1.0
curl http://localhost:3002/api/cart
docker stop cart-test && docker rm cart-test

# Push to Docker Hub
docker login
docker tag ecommerce-cart:v1.0 <your-dockerhub-username>/ecommerce-cart:v1.0
docker push <your-dockerhub-username>/ecommerce-cart:v1.0
```

6. **Share your Docker Hub image name with the instructor!**

---

## 👥 Group 4: Authentication Service

### Your Mission
Create a REST API for user authentication.

### Requirements

1. **Technology:** Node.js + Express
2. **Port:** 3003
3. **Docker Hub:** `<your-username>/ecommerce-auth:v1.0`
4. **Endpoints:**
   - `POST /api/auth/login` - User login
   - `POST /api/auth/register` - User registration
   - `GET /api/auth/user` - Get current user

### Step-by-Step Instructions

1. **Create project:**
```bash
mkdir group4-auth
cd group4-auth
```

2. **Create package.json:**
```bash
cat > package.json << 'EOF'
{
  "name": "auth-service",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
EOF
```

3. **Create server.js:**
```bash
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

// In-memory user database
let users = [
    { id: 1, username: 'demo', password: 'password', email: 'demo@example.com' },
    { id: 2, username: 'admin', password: 'admin123', email: 'admin@example.com' },
];

let sessions = {};

// Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        const token = 'token_' + Math.random().toString(36).substr(2, 9);
        sessions[token] = user.id;
        
        res.json({
            service: 'Auth Service (Group 4)',
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } else {
        res.status(401).json({
            service: 'Auth Service (Group 4)',
            error: 'Invalid credentials'
        });
    }
});

// Register
app.post('/api/auth/register', (req, res) => {
    const { username, password, email } = req.body;
    
    // Check if user exists
    if (users.find(u => u.username === username)) {
        return res.status(400).json({
            service: 'Auth Service (Group 4)',
            error: 'Username already exists'
        });
    }
    
    const newUser = {
        id: users.length + 1,
        username,
        password,
        email
    };
    
    users.push(newUser);
    
    res.status(201).json({
        service: 'Auth Service (Group 4)',
        message: 'Registration successful',
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        }
    });
});

// Get current user (demo - just returns demo user)
app.get('/api/auth/user', (req, res) => {
    res.json({
        service: 'Auth Service (Group 4)',
        user: {
            id: 1,
            username: 'demo',
            email: 'demo@example.com',
            role: 'user'
        }
    });
});

// List all users (for demo purposes)
app.get('/api/auth/users', (req, res) => {
    res.json({
        service: 'Auth Service (Group 4)',
        users: users.map(u => ({
            id: u.id,
            username: u.username,
            email: u.email
        }))
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'Auth Service (Group 4)' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔐 Auth Service running on port ${PORT}`);
});
EOF
```

4. **Create Dockerfile:**
```bash
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY server.js .

EXPOSE 3003

CMD ["node", "server.js"]
EOF
```

5. **Build, test, and push:**
```bash
# Build
docker build -t ecommerce-auth:v1.0 .

# Test locally
docker run -d -p 3003:3003 --name auth-test ecommerce-auth:v1.0
curl http://localhost:3003/api/auth/user
docker stop auth-test && docker rm auth-test

# Push to Docker Hub
docker login
docker tag ecommerce-auth:v1.0 <your-dockerhub-username>/ecommerce-auth:v1.0
docker push <your-dockerhub-username>/ecommerce-auth:v1.0
```

6. **Share your Docker Hub image name with the instructor!**

---

## 🎓 Instructor: Final Integration

### After all groups push their images, create the final docker-compose.yml

**Replace `<username>` with actual Docker Hub usernames from each group:**

```yaml
version: '3.8'

services:
  # Group 1: Frontend
  frontend:
    image: <group1-username>/ecommerce-frontend:v1.0
    container_name: ecommerce-frontend
    ports:
      - "80:80"
    depends_on:
      - product-service
      - cart-service
      - auth-service
    networks:
      - ecommerce-net
    restart: unless-stopped

  # Group 2: Product Service
  product-service:
    image: <group2-username>/ecommerce-products:v1.0
    container_name: product-service
    expose:
      - "3001"
    networks:
      - ecommerce-net
    restart: unless-stopped

  # Group 3: Cart Service
  cart-service:
    image: <group3-username>/ecommerce-cart:v1.0
    container_name: cart-service
    expose:
      - "3002"
    networks:
      - ecommerce-net
    restart: unless-stopped

  # Group 4: Auth Service
  auth-service:
    image: <group4-username>/ecommerce-auth:v1.0
    container_name: auth-service
    expose:
      - "3003"
    networks:
      - ecommerce-net
    restart: unless-stopped

networks:
  ecommerce-net:
    driver: bridge
```

### Run the complete application:

```bash
docker compose up -d
docker compose ps
```

### Test the complete application:

```bash
# Visit in browser
http://localhost

# Or use curl
curl http://localhost/api/products
curl http://localhost/api/cart
curl http://localhost/api/auth/user
```

---

## 🎯 Success Criteria

### For Each Group:
- ✅ Container builds successfully
- ✅ Container runs and responds to requests
- ✅ Image pushed to Docker Hub
- ✅ Image is public (pullable by others)
- ✅ Service follows the API contract

### For Final Integration:
- ✅ All 4 containers start successfully
- ✅ Frontend can communicate with all backend services
- ✅ Users can interact with the complete application
- ✅ All services visible in `docker compose ps`
- ✅ Application accessible at http://localhost

---

## 📝 Submission Checklist

Each group must provide:

1. ✅ Docker Hub username
2. ✅ Full image name (username/image:tag)
3. ✅ Confirmation that image is public
4. ✅ Screenshot of successful `docker run` test

**Example submission:**
```
Group: Group 2 (Products)
Username: johndoe
Image: johndoe/ecommerce-products:v1.0
Status: ✅ Public and tested
```

---

## 🏆 Bonus Challenges

### Level 1: Add Health Checks
```yaml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3001/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### Level 2: Add Database
```yaml
postgres:
  image: postgres:15-alpine
  environment:
    POSTGRES_PASSWORD: secret
  volumes:
    - db-data:/var/lib/postgresql/data
```

### Level 3: Add Environment Variables
```yaml
environment:
  NODE_ENV: production
  API_KEY: ${API_KEY}
```

### Level 4: Add Resource Limits
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
```

---

## 🎓 Learning Outcomes

After completing this exercise, students will understand:

- ✅ How to containerize applications
- ✅ How to push images to Docker Hub
- ✅ How to pull and use others' images
- ✅ How Docker Compose orchestrates multiple containers
- ✅ How containers communicate via networks
- ✅ How to build microservices architectures
- ✅ Collaboration in containerized environments
- ✅ Real-world Docker workflows

---

## 🐛 Troubleshooting

### Image not found
```bash
# Make sure image is public on Docker Hub
# Check image name is correct
docker pull <username>/ecommerce-frontend:v1.0
```

### Service can't connect
```bash
# Check all services are on same network
docker network inspect ecommerce-net
```

### Port already in use
```bash
# Stop other services
docker compose down

# Or change port
ports:
  - "8080:80"
```

---

## 🎉 Congratulations!

You've successfully built a distributed microservices application using Docker Compose where each team contributed a service. This mirrors real-world development scenarios!

**Next Steps:**
- Add a database
- Implement actual authentication
- Add monitoring
- Deploy to production
