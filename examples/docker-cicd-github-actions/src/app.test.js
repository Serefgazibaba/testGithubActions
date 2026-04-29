const app = require('./app');
const http = require('http');

// Simple test framework (without external dependencies)
async function runTests() {
  console.log('🧪 Running tests...\n');
  
  const server = app.listen(3001);
  let failedTests = 0;
  
  try {
    // Test 1: Root endpoint
    await test('Root endpoint returns JSON', async () => {
      const response = await makeRequest('http://localhost:3001/');
      if (!response.message) {
        throw new Error('Response missing message field');
      }
      if (!response.version) {
        throw new Error('Response missing version field');
      }
    });
    
    // Test 2: Health check
    await test('Health check endpoint works', async () => {
      const response = await makeRequest('http://localhost:3001/health');
      if (response.status !== 'healthy') {
        throw new Error(`Expected: healthy, Got: ${response.status}`);
      }
      if (typeof response.uptime !== 'number') {
        throw new Error('Uptime is not a number');
      }
    });
    
    // Test 3: API info
    await test('API info endpoint returns correct data', async () => {
      const response = await makeRequest('http://localhost:3001/api/info');
      if (!response.name) {
        throw new Error('API name missing');
      }
      if (!Array.isArray(response.endpoints)) {
        throw new Error('Endpoints is not an array');
      }
      if (response.endpoints.length !== 3) {
        throw new Error(`Expected 3 endpoints, found ${response.endpoints.length}`);
      }
    });
    
    // Test 4: 404 handler
    await test('Unknown endpoint returns 404', async () => {
      const response = await makeRequest('http://localhost:3001/nonexistent', true);
      if (!response.error) {
        throw new Error('404 response missing error field');
      }
    });
    
    console.log('\n✅ All tests passed!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Tests failed!');
    console.error(error.message);
    process.exit(1);
  } finally {
    server.close();
  }
  
  // Test helper function
  async function test(description, testFn) {
    try {
      await testFn();
      console.log(`✅ ${description}`);
    } catch (error) {
      console.error(`❌ ${description}`);
      throw error;
    }
  }
}

// HTTP request helper
function makeRequest(url, allowErrors = false) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', chunk => data += chunk);
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(new Error(`JSON parse hatası: ${e.message}`));
        }
      });
      
      res.on('error', reject);
    }).on('error', (err) => {
      if (!allowErrors) {
        reject(err);
      }
    });
  });
}

// Testleri çalıştır
runTests();
