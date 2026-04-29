# 🚀 Hızlı Başlangıç Kılavuzu

## 5 Dakikada GitHub Actions + Docker

### Adım 1: Local'de Test Et (2 dakika)

```bash
# Projeyi kopyala
cd github-actions-demo

# Image build et
docker build -t myapp:test .

# Çalıştır
docker run -p 3000:3000 myapp:test

# Test et
curl http://localhost:3000
# {"message":"Merhaba! GitHub Actions ile otomatik deploy edildi! 🚀", ...}

# Testleri çalıştır
docker run --rm myapp:test npm test
# ✅ Tüm testler başarılı!
```

✅ **Checkpoint:** Eğer yukarıdakiler çalıştıysa, devam!

---

### Adım 2: GitHub Repository Oluştur (1 dakika)

1. GitHub'da yeni repository oluştur: `github-actions-demo`
2. **Public** seç (Container Registry için ücretsiz)
3. Initialize edilmemiş bırak (README ekleme)

```bash
# Local'de git init
git init
git add .
git commit -m "Initial commit: GitHub Actions Docker demo"

# GitHub'a push
git remote add origin https://github.com/YOURUSERNAME/github-actions-demo.git
git branch -M main
git push -u origin main
```

---

### Adım 3: Actions'ı İzle (1 dakika)

1. GitHub repository'de → **Actions** sekmesine git
2. "Docker CI/CD Pipeline" workflow'unu göreceksin
3. Tıkla ve izle:

```
✅ Build Docker Image & Run Tests
   ✅ Checkout repository
   ✅ Build Docker image
   ✅ Run tests in container
   ✅ Health check test
   
✅ Push to GitHub Container Registry
   ✅ Login to GitHub Container Registry
   ✅ Build and push Docker image
   
✅ Security Vulnerability Scan
   ✅ Run Trivy scanner
```

---

### Adım 4: Image'ı Pull Et ve Çalıştır (1 dakika)

```bash
# Image'ı pull et (public, login gereksiz)
docker pull ghcr.io/YOURUSERNAME/github-actions-demo:latest

# Çalıştır
docker run -p 3000:3000 ghcr.io/YOURUSERNAME/github-actions-demo:latest

# Test et
curl http://localhost:3000
```

🎉 **Tebrikler!** Otomatik CI/CD pipeline'ın çalışıyor!

---

## 📊 Ne Oldu?

### Pipeline Akışı

```
1. Git Push
      ↓
2. GitHub Actions Tetiklendi
      ↓
3. Docker Image Build Edildi
      ↓
4. Testler Çalıştı (Container içinde!)
      ↓
5. Güvenlik Taraması Yapıldı
      ↓
6. Image ghcr.io'ya Push Edildi
      ↓
7. Otomatik Tag'lendi:
   - ghcr.io/USER/REPO:latest
   - ghcr.io/USER/REPO:main
   - ghcr.io/USER/REPO:sha-abc123
```

---

## 🎯 Şimdi Dene: İlk Değişikliğini Yap

### Challenge 1: Message'ı Değiştir

```bash
# src/app.js dosyasını aç
# Line 7'deki message'ı değiştir:
message: 'İlk değişikliğim! 🎉',

# Commit ve push
git add src/app.js
git commit -m "feat: message updated"
git push origin main
```

**Sonuç:**
- Actions otomatik çalışır
- Yeni image build edilir
- Testler geçerse push edilir
- 2-3 dakika içinde yeni image hazır!

```bash
# Yeni image'ı pull et
docker pull ghcr.io/YOURUSERNAME/github-actions-demo:latest

# Çalıştır ve değişikliği gör
docker run -p 3000:3000 ghcr.io/YOURUSERNAME/github-actions-demo:latest
curl http://localhost:3000
# {"message":"İlk değişikliğim! 🎉", ...}
```

---

### Challenge 2: Yeni Endpoint Ekle

```javascript
// src/app.js içine ekle (line 30'dan sonra)
app.get('/api/hello/:name', (req, res) => {
  res.json({
    greeting: `Merhaba ${req.params.name}! 👋`,
    timestamp: new Date().toISOString()
  });
});
```

```bash
git add src/app.js
git commit -m "feat: add personalized greeting endpoint"
git push origin main

# Actions'ı izle, sonra test et:
docker pull ghcr.io/YOURUSERNAME/github-actions-demo:latest
docker run -p 3000:3000 ghcr.io/YOURUSERNAME/github-actions-demo:latest

curl http://localhost:3000/api/hello/Ahmet
# {"greeting":"Merhaba Ahmet! 👋", ...}
```

---

### Challenge 3: Version Release

```bash
# Version tag oluştur
git tag v1.0.0
git push origin v1.0.0

# Actions'da özel bir build başlar
# Sonra pull et:
docker pull ghcr.io/YOURUSERNAME/github-actions-demo:v1.0.0
docker pull ghcr.io/YOURUSERNAME/github-actions-demo:1.0.0
docker pull ghcr.io/YOURUSERNAME/github-actions-demo:1.0
docker pull ghcr.io/YOURUSERNAME/github-actions-demo:1

# Hepsi aynı image! (semantic versioning)
```

---

## 🔍 Debugging

### Actions Fail Ederse

1. **Actions sekmesinde fail olan step'e tıkla**
2. **Log'ları oku** (genellikle çok açıklayıcı)
3. **Local'de aynı komutu çalıştır:**

```bash
# Build fail ediyorsa:
docker build -t test .

# Test fail ediyorsa:
docker run --rm test npm test

# Health check fail ediyorsa:
docker run -d -p 3000:3000 test
curl http://localhost:3000/health
```

---

### Image Private Görünüyorsa

Repository → **Settings** → **Packages** → `github-actions-demo` → **Package Settings**

- **Change visibility** → Public

Artık login olmadan pull edilebilir:
```bash
docker pull ghcr.io/YOURUSERNAME/github-actions-demo:latest
```

---

## 📚 Sonraki Adımlar

### Öğrendikleriniz

- ✅ GitHub Actions workflow yazdınız
- ✅ Docker image otomatik build ettiniz
- ✅ Container içinde test çalıştırdınız
- ✅ GitHub Container Registry kullandınız
- ✅ Otomatik versioning yaptınız
- ✅ CI/CD pipeline oluşturdunuz

### Daha İleri Git

1. **Environment Ekle:**
   - Staging environment
   - Production environment
   - Manual approval gates

2. **Advanced Features:**
   - Multi-platform builds (ARM64 + AMD64)
   - Build caching (daha hızlı builds)
   - Slack/Discord notifications
   - Automatic deployment to cloud

3. **Real Project:**
   - Kendi projenize uygulayın
   - Database ekleyin
   - Docker Compose kullanın
   - Production'a deploy edin

---

## 💡 Pro Tips

**Hızlı Build:**
```yaml
# Build cache ekle
cache-from: type=registry,ref=ghcr.io/USER/REPO:buildcache
cache-to: type=registry,ref=ghcr.io/USER/REPO:buildcache
```

**Security:**
```bash
# Trivy'yi fail etmek için
exit-code: '1'
```

**Auto-merge Dependabot:**
```yaml
# Dependabot PR'larını otomatik merge et
# .github/workflows/dependabot-auto-merge.yml
```

---

## 🎓 Özet

**Artık yapabiliyorsunuz:**

1. ✅ Kod yaz → Git push → Otomatik deploy
2. ✅ Testler otomatik çalışır
3. ✅ Güvenlik otomatik kontrol edilir
4. ✅ Image otomatik tag'lenir ve push edilir
5. ✅ Production-ready workflow

**Yaklaşık süre:** Push'tan deployed image'a → **2-3 dakika**

**Manuel iş:** Sıfır! ✨

---

**Sorular?** README.md dosyasına bakın veya Actions log'larını inceleyin!

Happy Coding! 🚀
