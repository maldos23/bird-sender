# 🐦 Bird Sender

[![CI Tests](https://github.com/maldos23/bird-sender/actions/workflows/tests.yml/badge.svg)](https://github.com/maldos23/bird-sender/actions/workflows/tests.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?logo=github)](https://maldos23.github.io/bird-sender/)
[![Vercel](https://img.shields.io/badge/Vercel-Demo-black?logo=vercel)](https://bird-sender.vercel.app)
[![Release](https://img.shields.io/github/v/release/maldos23/bird-sender?include_prereleases&logo=github)](https://github.com/maldos23/bird-sender/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![WebSocket](https://img.shields.io/badge/Protocol-WebSocket-yellow?logo=websocket)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

**Transferencia de archivos en tiempo real a través de tu red local**

🌐 **[Demo en Vivo y Documentación](https://maldos23.github.io/bird-sender/)** &nbsp;|&nbsp; 🚀 **[Ver App Demo](https://bird-sender.vercel.app)**

📖 Leer en otros idiomas: [English](README.md) | [中文](README.zh.md)

---

## 📖 Descripción

Bird Sender es una aplicación web minimalista que te permite transferir archivos de cualquier tipo entre dispositivos conectados a la misma red local (WiFi/Ethernet). Sin internet, sin nubes, sin complicaciones.

---

## ✨ Características

- 🚀 **Transferencia en tiempo real**
- 🔒 **100% local** - Tus archivos nunca salen de tu red
- 🔐 **Cifrado de extremo a extremo** - Cifrado AES-GCM de 256 bits para transferencias protegidas con contraseña
- 📦 **Archivos de cualquier tipo y tamaño**
- 🎯 **Múltiples archivos simultáneos**
- ⚡ **Protocolo binario optimizado**
- 🎨 **Diseño minimalista B/N**
- 🌐 **Sin instalación** - Solo abre el navegador

---

## 🛠️ Stack Tecnológico

- **Backend**: Node.js + Express
- **Comunicación**: WebSocket (ws)
- **Frontend**: Vanilla JavaScript + Vite
- **Protocolo**: Binary WebSocket con relay en servidor
- **Estilos**: CSS puro con diseño responsive
- **Tipografía**: Space Grotesk (Google Fonts)

---

## 📦 Instalación

```bash
# Clona el repositorio
git clone https://github.com/maldos23/bird-sender.git

# Entra al directorio
cd bird-sender

# Instala las dependencias
npm install
```

---

## 🚀 Uso

```bash
# Inicia el servidor
npm run dev
```

El servidor mostrará dos URLs:

```
  🐦 bird-sender

  Local:   http://localhost:3000
  Network: http://192.168.1.100:3000
```

- **Local**: Para usar en la misma máquina
- **Network**: Para usar desde otros dispositivos en la red

---

## 📱 Cómo Usar

### Enviar Archivos

1. **Abre la URL de red** en tu navegador (ej: `http://192.168.1.100:3000`)

2. **Arrastra archivos** a la zona de drop o haz clic para seleccionar

3. **Selecciona el dispositivo destino** del menú desplegable

4. **Haz clic en "send"** para enviar

### Recibir Archivos

1. **Abre la misma URL** en otro dispositivo

2. **Espera la notificación** de transferencia entrante

3. **Haz clic en "accept"** para recibir o "reject" para rechazar

4. **Los archivos se descargarán automáticamente**

---

## 🔐 Cifrado de Extremo a Extremo

Bird Sender soporta cifrado de extremo a extremo opcional para transferencias de archivos sensibles usando cifrado AES-GCM de 256 bits estándar de la industria.

### Cómo Funciona

1. **El emisor establece una contraseña** al enviar archivos (opcional)
2. **Los archivos se cifran** en el navegador antes de la transmisión usando:
   - Cifrado AES-GCM de 256 bits
   - Derivación de clave PBKDF2 con 100,000 iteraciones
   - Salt aleatorio de 16 bytes e IV de 12 bytes por archivo
3. **Los datos cifrados** se transmiten sobre WebSocket
4. **El receptor ingresa la contraseña** para descifrar los archivos localmente
5. **Los archivos se descifran** en el navegador y se descargan

### Características de Seguridad

- ✅ **Conocimiento cero**: El servidor nunca ve contraseñas ni datos sin cifrar
- ✅ **Cifrado del lado del cliente**: Todas las operaciones criptográficas ocurren en el navegador
- ✅ **Criptografía fuerte**: AES-GCM proporciona cifrado autenticado
- ✅ **Claves únicas**: Cada archivo cifrado con salt/IV únicos
- ✅ **Sin almacenamiento de claves**: Las contraseñas nunca se almacenan ni transmiten

### Ejemplo

```
Alice envía "secreto.pdf" con contraseña "micontraseña123"
  ↓
Archivo cifrado con AES-GCM de 256 bits (salt + IV + ciphertext)
  ↓
Datos cifrados transmitidos sobre WebSocket
  ↓
Bob recibe archivo cifrado
  ↓
Bob ingresa "micontraseña123"
  ↓
Archivo descifrado localmente y descargado como "secreto.pdf"
```

**Nota**: Si se ingresa una contraseña incorrecta, el descifrado fallará y el archivo no se descargará.

---

## 💡 Ejemplos de Uso

### 📸 Compartir Fotos en Familia
Transfiere fotos de las vacaciones del teléfono a la laptop sin usar WhatsApp o correo.

### 🎮 Compartir Mods de Juegos
Envía archivos de mods grandes entre PCs gamers en la misma casa.

### 📚 Compartir Documentos de Trabajo
Transfiere PDFs, presentaciones o spreadsheets entre colegas en la oficina.

### 🎵 Compartir Música y Videos
Envía tu playlist o videos caseros sin comprimir.

### 💻 Compartir Código y Proyectos
Transfiere repositorios completos o archivos de código entre desarrolladores.

### 🎨 Compartir Archivos de Diseño
Envía archivos de Photoshop, Illustrator o Figma sin límites de tamaño.

---

## 🔧 Arquitectura

### Protocolo de Transferencia

Bird Sender usa un protocolo binario personalizado sobre WebSocket:

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

**Flujo de Transferencia:**

1. **Offer** (JSON): El emisor notifica al receptor sobre los archivos
2. **Response** (JSON): El receptor acepta o rechaza
3. **Chunks** (Binary): El emisor envía los datos en paquetes de 64KB
4. **Complete** (JSON): El receptor confirma la recepción

---

## 🌍 Compatibilidad

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Cualquier navegador moderno con soporte WebSocket

---

## 🔐 Privacidad

- 🚫 Sin telemetría
- 🚫 Sin tracking
- 🚫 Sin servidores externos
- ✅ Todo ocurre en tu red local

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - Siéntete libre de usarlo como quieras

---

## 🐛 Problemas Conocidos

Ninguno por ahora. Si encuentras un bug, por favor abre un issue.

---

## 🙏 Agradecimientos

- Inspirado por herramientas como AirDrop y Sharedrop
- Construido con ❤️ para la comunidad de código abierto

---

## 📞 Contacto

Si tienes preguntas o sugerencias, abre un issue en GitHub.

---

**Hecho con 🐦 por la comunidad open source**
