# 🐦 Bird Sender

[![CI Tests](https://github.com/maldos23/bird-sender/actions/workflows/tests.yml/badge.svg)](https://github.com/maldos23/bird-sender/actions/workflows/tests.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?logo=github)](https://maldos23.github.io/bird-sender/)
[![Vercel](https://img.shields.io/badge/Vercel-Demo-black?logo=vercel)](https://https://bird-sender-nemcz9zba-maldos23s-projects.vercel.app)
[![Release](https://img.shields.io/github/v/release/maldos23/bird-sender?include_prereleases&logo=github)](https://github.com/maldos23/bird-sender/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![WebSocket](https://img.shields.io/badge/Protocol-WebSocket-yellow?logo=websocket)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

**通过局域网实时传输文件**

🌐 **[在线演示和文档](https://maldos23.github.io/bird-sender/)** &nbsp;|&nbsp; 🚀 **[查看演示应用](https://https://bird-sender-nemcz9zba-maldos23s-projects.vercel.app)**

📖 阅读其他语言版本：[English](README.md) | [Español](README.es.md)

---

## 📖 简介

Bird Sender 是一款极简的网页应用程序，允许您在连接到同一局域网（WiFi/以太网）的设备之间传输任何类型的文件。无需互联网，无需云服务，简单便捷。

---

## ✨ 特性

- 🚀 **实时传输**
- 🔒 **100% 本地** - 您的文件永远不会离开您的网络
- 🔐 **端到端加密** - 使用 AES-GCM 256 位加密保护密码传输
- 📦 **支持任何类型和大小的文件**
- 🎯 **多文件同时传输**
- ⚡ **优化的二进制协议**
- 🎨 **极简黑白设计**
- 🌐 **无需安装** - 只需打开浏览器

---

## 🛠️ 技术栈

- **后端**: Node.js + Express
- **通信**: WebSocket (ws)
- **前端**: Vanilla JavaScript + Vite
- **协议**: 带服务器中继的二进制 WebSocket
- **样式**: 纯 CSS 响应式设计
- **字体**: Space Grotesk (Google Fonts)

---

## 📦 安装

```bash
# 克隆仓库
git clone https://github.com/maldos23/bird-sender.git

# 进入目录
cd bird-sender

# 安装依赖
npm install
```

---

## 🚀 使用方法

```bash
# 启动服务器
npm run dev
```

服务器将显示两个 URL：

```
  🐦 bird-sender

  Local:   http://localhost:3000
  Network: http://192.168.1.100:3000
```

- **Local**: 在同一台机器上使用
- **Network**: 从网络中的其他设备使用

---

## 📱 如何使用

### 发送文件

1. **在浏览器中打开网络 URL**（例如：`http://192.168.1.100:3000`）

2. **拖放文件**到拖放区域或点击选择文件

3. **从下拉菜单选择目标设备**

4. **点击 "send"** 发送

### 接收文件

1. **在另一台设备上打开相同的 URL**

2. **等待传入传输通知**

3. **点击 "accept"** 接收或 "reject" 拒绝

4. **文件将自动下载**

---

## 🔐 端到端加密

Bird Sender 支持可选的端到端加密，用于敏感文件传输，采用行业标准的 AES-GCM 256 位加密。

### 工作原理

1. **发送方设置密码**（可选）
2. **文件在浏览器中加密**，然后传输，使用：
   - AES-GCM 256 位加密
   - PBKDF2 密钥派生，100,000 次迭代
   - 每个文件使用随机 16 字节盐和 12 字节 IV
3. **加密数据**通过 WebSocket 传输
4. **接收方输入密码**在本地解密文件
5. **文件在浏览器中解密**并下载

### 安全特性

- ✅ **零知识**：服务器永远不会看到密码或未加密的数据
- ✅ **客户端加密**：所有加密操作都在浏览器中进行
- ✅ **强加密**：AES-GCM 提供认证加密
- ✅ **唯一密钥**：每个文件使用唯一的盐/IV 加密
- ✅ **无密钥存储**：密码永远不会被存储或传输

### 示例

```
Alice 发送 "secret.pdf"，密码为 "mypassword123"
  ↓
文件使用 AES-GCM 256 位加密（盐 + IV + 密文）
  ↓
加密数据通过 WebSocket 传输
  ↓
Bob 接收加密文件
  ↓
Bob 输入 "mypassword123"
  ↓
文件在本地解密并下载为 "secret.pdf"
```

**注意**：如果输入错误的密码，解密将失败，文件不会被下载。

---

## 💡 使用场景

### 📸 分享家庭照片
无需 WhatsApp 或电子邮件，将度假照片从手机传输到笔记本电脑。

### 🎮 分享游戏模组
在同一房屋内的游戏 PC 之间发送大型模组文件。

### 📚 分享工作文档
在办公室同事之间传输 PDF、演示文稿或电子表格。

### 🎵 分享音乐和视频
无压缩地发送您的播放列表或家庭视频。

### 💻 分享代码和项目
在开发人员之间传输完整的代码库或代码文件。

### 🎨 分享设计文件
无大小限制地发送 Photoshop、Illustrator 或 Figma 文件。

---

## 🔧 架构

### 传输协议

Bird Sender 使用自定义的二进制 WebSocket 协议：

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

**传输流程：**

1. **Offer** (JSON): 发送方向接收方通知文件信息
2. **Response** (JSON): 接收方接受或拒绝
3. **Chunks** (Binary): 发送方以 64KB 数据包发送数据
4. **Complete** (JSON): 接收方确认接收

---

## 🌍 兼容性

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ 任何支持 WebSocket 的现代浏览器

---

## 🔐 隐私保护

- 🚫 无遥测
- 🚫 无追踪
- 🚫 无外部服务器
- ✅ 一切都在您的本地网络上进行

---

## 🤝 贡献

欢迎贡献。请：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

---

## 📄 许可证

MIT 许可证 - 随意使用

---

## 🐛 已知问题

目前没有。如果您发现 bug，请提交 issue。

---

## 🙏 致谢

- 灵感来自 AirDrop 和 Sharedrop 等工具
- 用 ❤️ 为开源社区构建

---

## 📞 联系方式

如果您有问题或建议，请在 GitHub 上提交 issue。

---

**由开源社区用 🐦 制作**
