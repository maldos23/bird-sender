# 🐦 Bird Sender

[![CI Tests](https://github.com/maldos23/bird-sender/actions/workflows/tests.yml/badge.svg)](https://github.com/maldos23/bird-sender/actions/workflows/tests.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?logo=github)](https://maldos23.github.io/bird-sender/)
[![Release](https://img.shields.io/github/v/release/maldos23/bird-sender?include_prereleases&logo=github)](https://github.com/maldos23/bird-sender/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![WebSocket](https://img.shields.io/badge/Protocol-WebSocket-yellow?logo=websocket)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

**Real-time file transfer across your local network**

🌐 **[Live Demo & Documentation](https://maldos23.github.io/bird-sender/)**

📖 Read this in other languages: [Español](README.es.md) | [中文](README.zh.md)

---

## 📖 Description

Bird Sender is a minimalist web application that allows you to transfer files of any type between devices connected to the same local network (WiFi/Ethernet). No internet, no clouds, no hassle.

---

## ✨ Features

- 🚀 **Real-time transfer**
- 🔒 **100% local** - Your files never leave your network
- 📦 **Files of any type and size**
- 🎯 **Multiple simultaneous files**
- ⚡ **Optimized binary protocol**
- 🎨 **Minimalist B&W design**
- 🌐 **No installation** - just open the browser

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Communication**: WebSocket (ws)
- **Frontend**: Vanilla JavaScript + Vite
- **Protocol**: Binary WebSocket with server relay
- **Styles**: Pure CSS with responsive design
- **Typography**: Space Grotesk (Google Fonts)

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/maldos23/bird-sender.git

# Enter the directory
cd bird-sender

# Install dependencies
npm install
```

---

## 🚀 Usage

```bash
# Start the server
npm run dev
```

The server will display two URLs:

```
  🐦 bird-sender

  Local:   http://localhost:3000
  Network: http://192.168.1.100:3000
```

- **Local**: To use on the same machine
- **Network**: To use from other devices on the network

---

## 📱 How to Use

### Send Files

1. **Open the network URL** in your browser (e.g., `http://192.168.1.100:3000`)

2. **Drag and drop files** to the drop zone or click to select

3. **Select the target device** from the dropdown menu

4. **Click "send"** to send

### Receive Files

1. **Open the same URL** on another device

2. **Wait for the notification** of incoming transfer

3. **Click "accept"** to receive or "reject" to decline

4. **Files will download automatically**

---

## 💡 Use Cases

### 📸 Share Family Photos
Transfer vacation photos from phone to laptop without WhatsApp or email.

### 🎮 Share Game Mods
Send large mod files between gaming PCs in the same house.

### 📚 Share Work Documents
Transfer PDFs, presentations, or spreadsheets between colleagues at the office.

### 🎵 Share Music and Videos
Send your playlist or home videos without compression.

### 💻 Share Code and Projects
Transfer complete repositories or code files between developers.

### 🎨 Share Design Files
Send Photoshop, Illustrator, or Figma files without size limits.

---

## 🔧 Architecture

### Transfer Protocol

Bird Sender uses a custom binary protocol over WebSocket:

```
┌─────────────────────────────────────────┐
│           HEADER (27 bytes)             │
├─────────────────────────────────────────┤
│ Type (1B) │ Target (6B) │ TransferID   │
│           │             │ (8B)         │
├─────────────────────────────────────────┤
│ FileIdx (4B) │ ChunkIdx (4B) │ Total   │
│              │               │ (4B)    │
└─────────────────────────────────────────┘
│                                         │
│         CHUNK DATA (64KB max)           │
│                                         │
└─────────────────────────────────────────┘
```

**Transfer Flow:**

1. **Offer** (JSON): Sender notifies receiver about the files
2. **Response** (JSON): Receiver accepts or rejects
3. **Chunks** (Binary): Sender sends data in 64KB packets
4. **Complete** (JSON): Receiver confirms reception

---

## 🧪 Testing

### Unit Tests (Jest)

```bash
npm test
```

### E2E Tests (Cypress)

```bash
npm run test:e2e
```

### Coverage Report

```bash
npm run test:coverage
```

### CI/CD

Tests run automatically on every push and pull request via GitHub Actions:
- ✅ Unit tests with Jest (15 tests)
- ✅ E2E tests with Cypress (12 tests)
- ✅ Coverage reports uploaded as artifacts

---

## 🌍 Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Any modern browser with WebSocket support

---

## 🔐 Privacy

- 🚫 No telemetry
- 🚫 No tracking
- 🚫 No external servers
- ✅ Everything happens on your local network

---

## 🤝 Contributing

Contributions are welcome. Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License - Feel free to use it as you wish

---

## 🐛 Known Issues

None at the moment. If you find a bug, please open an issue.

---

## 🙏 Acknowledgments

- Inspired by tools like AirDrop and Sharedrop
- Built with ❤️ for the open source community

---

## 📞 Contact

If you have questions or suggestions, open an issue on GitHub.

---

**Made with 🐦 by the open source community**
