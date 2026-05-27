# 🐦 Bird Sender

**Transferencia de archivos en tiempo real a través de tu red local**

**Real-time file transfer across your local network**

---

## 📖 Descripción | Description

Bird Sender es una aplicación web minimalista que te permite transferir archivos de cualquier tipo entre dispositivos conectados a la misma red local (WiFi/Ethernet). Sin internet, sin nubes, sin complicaciones.

Bird Sender is a minimalist web application that allows you to transfer files of any type between devices connected to the same local network (WiFi/Ethernet). No internet, no clouds, no hassle.

---

## ✨ Características | Features

- 🚀 **Transferencia en tiempo real** | Real-time transfer
- 🔒 **100% local** - Tus archivos nunca salen de tu red | Your files never leave your network
- 📦 **Archivos de cualquier tipo y tamaño** | Files of any type and size
- 🎯 **Múltiples archivos simultáneos** | Multiple simultaneous files
- ⚡ **Protocolo binario optimizado** | Optimized binary protocol
- 🎨 **Diseño minimalista B/N** | Minimalist B&W design
- 🌐 **Sin instalación** - Solo abre el navegador | No installation - just open the browser

---

## 🛠️ Stack Tecnológico | Tech Stack

- **Backend**: Node.js + Express
- **Comunicación**: WebSocket (ws)
- **Frontend**: Vanilla JavaScript + Vite
- **Protocolo**: Binary WebSocket con relay en servidor | Binary WebSocket with server relay
- **Estilos**: CSS puro con diseño responsive | Pure CSS with responsive design
- **Tipografía**: Space Grotesk (Google Fonts)

---

## 📦 Instalación | Installation

```bash
# Clona el repositorio | Clone the repository
git clone git@github.com:maldos23/bird-sender.git

# Entra al directorio | Enter the directory
cd bird-sender

# Instala las dependencias | Install dependencies
npm install
```

---

## 🚀 Uso | Usage

```bash
# Inicia el servidor | Start the server
npm run dev
```

El servidor mostrará dos URLs:

The server will display two URLs:

```
  🐦 bird-sender

  Local:   http://localhost:3000
  Network: http://192.168.1.100:3000
```

- **Local**: Para usar en la misma máquina | To use on the same machine
- **Network**: Para usar desde otros dispositivos en la red | To use from other devices on the network

---

## 📱 Cómo Usar | How to Use

### Enviar Archivos | Send Files

1. **Abre la URL de red** en tu navegador (ej: `http://192.168.1.100:3000`)
   
   **Open the network URL** in your browser (e.g., `http://192.168.1.100:3000`)

2. **Arrastra archivos** a la zona de drop o haz clic para seleccionar
   
   **Drag and drop files** to the drop zone or click to select

3. **Selecciona el dispositivo destino** del menú desplegable
   
   **Select the target device** from the dropdown menu

4. **Haz clic en "send"** para enviar
   
   **Click "send"** to send

### Recibir Archivos | Receive Files

1. **Abre la misma URL** en otro dispositivo
   
   **Open the same URL** on another device

2. **Espera la notificación** de transferencia entrante
   
   **Wait for the notification** of incoming transfer

3. **Haz clic en "accept"** para recibir o "reject" para rechazar
   
   **Click "accept"** to receive or "reject" to decline

4. **Los archivos se descargarán automáticamente**
   
   **Files will download automatically**

---

## 💡 Ejemplos de Uso | Use Cases

### 📸 Compartir Fotos en Familia
Transfiere fotos de las vacaciones del teléfono a la laptop sin usar WhatsApp o correo.

Share vacation photos from phone to laptop without WhatsApp or email.

### 🎮 Compartir Mods de Juegos
Envía archivos de mods grandes entre PCs gamers en la misma casa.

Send large mod files between gaming PCs in the same house.

### 📚 Compartir Documentos de Trabajo
Transfiere PDFs, presentaciones o spreadsheets entre colegas en la oficina.

Transfer PDFs, presentations, or spreadsheets between colleagues at the office.

### 🎵 Compartir Música y Videos
Envía tu playlist o videos caseros sin comprimir.

Send your playlist or home videos without compression.

### 💻 Compartir Código y Proyectos
Transfiere repositorios completos o archivos de código entre desarrolladores.

Transfer complete repositories or code files between developers.

### 🎨 Compartir Archivos de Diseño
Envía archivos de Photoshop, Illustrator o Figma sin límites de tamaño.

Send Photoshop, Illustrator, or Figma files without size limits.

---

## 🔧 Arquitectura | Architecture

### Protocolo de Transferencia | Transfer Protocol

Bird Sender usa un protocolo binario personalizado sobre WebSocket:

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

**Flujo de Transferencia | Transfer Flow:**

1. **Offer** (JSON): El emisor notifica al receptor sobre los archivos
2. **Response** (JSON): El receptor acepta o rechaza
3. **Chunks** (Binary): El emisor envía los datos en paquetes de 64KB
4. **Complete** (JSON): El receptor confirma la recepción

---

## 🌍 Compatibilidad | Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Cualquier navegador moderno con soporte WebSocket | Any modern browser with WebSocket support

---

## 🔐 Privacidad | Privacy

- 🚫 Sin telemetría | No telemetry
- 🚫 Sin tracking | No tracking
- 🚫 Sin servidores externos | No external servers
- ✅ Todo ocurre en tu red local | Everything happens on your local network

---

## 🤝 Contribuir | Contributing

Las contribuciones son bienvenidas. Por favor:

Contributions are welcome. Please:

1. Fork el proyecto | Fork the project
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request | Open a Pull Request

---

## 📄 Licencia | License

MIT License - Siéntete libre de usarlo como quieras | Feel free to use it as you wish

---

## 🐛 Problemas Conocidos | Known Issues

Ninguno por ahora. Si encuentras un bug, por favor abre un issue.

None at the moment. If you find a bug, please open an issue.

---

## 🙏 Agradecimientos | Acknowledgments

- Inspirado por herramientas como AirDrop y Sharedrop
- Inspired by tools like AirDrop and Sharedrop
- Construido con ❤️ para la comunidad de código abierto
- Built with ❤️ for the open source community

---

## 📞 Contacto | Contact

Si tienes preguntas o sugerencias, abre un issue en GitHub.

If you have questions or suggestions, open an issue on GitHub.

---

**Hecho con 🐦 por la comunidad open source**

**Made with 🐦 by the open source community**
