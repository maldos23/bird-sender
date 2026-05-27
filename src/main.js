const CHUNK_SIZE = 64 * 1024;
const HEADER_SIZE = 27;
const PKT_CHUNK = 0x01;

function genTransferId() {
  return Math.random().toString(36).substring(2, 10).padEnd(8, '0');
}

function encodeHeader(type, targetId, transferId, fileIndex, chunkIndex, totalChunks) {
  const header = new ArrayBuffer(HEADER_SIZE);
  const view = new DataView(header);
  const bytes = new Uint8Array(header);

  bytes[0] = type;

  const targetBytes = new TextEncoder().encode(targetId.padEnd(6, ' ').substring(0, 6));
  bytes.set(targetBytes, 1);

  const tidBytes = new TextEncoder().encode(transferId.substring(0, 8).padEnd(8, '0'));
  bytes.set(tidBytes, 7);

  view.setUint32(15, fileIndex, false);
  view.setUint32(19, chunkIndex, false);
  view.setUint32(23, totalChunks, false);

  return bytes;
}

function decodeHeader(buffer) {
  const view = new DataView(buffer instanceof ArrayBuffer ? buffer : buffer.buffer);
  const bytes = new Uint8Array(buffer instanceof ArrayBuffer ? buffer : buffer.buffer);

  const type = bytes[0];
  const targetId = new TextDecoder().decode(bytes.slice(1, 7)).trim();
  const transferId = new TextDecoder().decode(bytes.slice(7, 15)).trim();
  const fileIndex = view.getUint32(15, false);
  const chunkIndex = view.getUint32(19, false);
  const totalChunks = view.getUint32(23, false);

  return { type, targetId, transferId, fileIndex, chunkIndex, totalChunks };
}

function buildPacket(headerBytes, data) {
  const packet = new Uint8Array(HEADER_SIZE + data.byteLength);
  packet.set(headerBytes, 0);
  packet.set(new Uint8Array(data), HEADER_SIZE);
  return packet.buffer;
}

class BirdSender {
  constructor() {
    this.ws = null;
    this.myId = null;
    this.peers = new Map();
    this.pendingFiles = [];
    this.pendingOffer = null;
    this.transfers = new Map();
    this.activeSends = new Map();

    this.dropZone = document.getElementById('dropZone');
    this.fileInput = document.getElementById('fileInput');
    this.peersList = document.getElementById('peersList');
    this.transfersList = document.getElementById('transfersList');
    this.statusEl = document.getElementById('status');
    this.modalOverlay = document.getElementById('modalOverlay');
    this.modalText = document.getElementById('modalText');
    this.modalFiles = document.getElementById('modalFiles');
    this.btnAccept = document.getElementById('btnAccept');
    this.btnReject = document.getElementById('btnReject');

    this.init();
  }

  init() {
    this.connectWS();
    this.bindEvents();
  }

  connectWS() {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.ws = new WebSocket(`${protocol}//${location.host}`);
    this.ws.binaryType = 'arraybuffer';

    this.ws.onopen = () => {
      this.statusEl.textContent = 'online';
      this.statusEl.classList.add('connected');
    };

    this.ws.onclose = () => {
      this.statusEl.textContent = 'offline';
      this.statusEl.classList.remove('connected');
      setTimeout(() => this.connectWS(), 2000);
    };

    this.ws.onmessage = (e) => {
      if (e.data instanceof ArrayBuffer) {
        this.handleBinaryMessage(e.data);
      } else {
        const msg = JSON.parse(e.data);
        this.handleMessage(msg);
      }
    };
  }

  handleMessage(msg) {
    switch (msg.type) {
      case 'init':
        this.myId = msg.id;
        break;
      case 'peers':
        msg.peers.forEach(id => this.addPeer(id));
        this.renderPeers();
        break;
      case 'peer-joined':
        this.addPeer(msg.peerId);
        this.renderPeers();
        break;
      case 'peer-left':
        this.peers.delete(msg.peerId);
        this.renderPeers();
        break;
      case 'transfer-offer':
        this.showTransferModal(msg);
        break;
      case 'transfer-response':
        if (msg.accepted) {
          this.startSending(msg.from, msg.transferId);
        } else {
          const send = this.activeSends.get(msg.transferId);
          if (send) {
            this.updateTransferUI(send.transferEl, 'rejected', 0);
            this.activeSends.delete(msg.transferId);
          }
        }
        break;
      case 'transfer-complete':
        const send = this.activeSends.get(msg.transferId);
        if (send) {
          this.updateTransferUI(send.transferEl, 'complete', 100);
          this.activeSends.delete(msg.transferId);
        }
        break;
    }
  }

  handleBinaryMessage(buffer) {
    if (buffer.byteLength < HEADER_SIZE) return;

    const header = decodeHeader(buffer);
    const transferId = header.transferId;

    let transfer = this.transfers.get(transferId);
    if (!transfer) return;

    if (header.fileIndex !== transfer.currentFileIndex) {
      if (transfer.currentFile && transfer.chunks.length > 0) {
        const blob = new Blob(transfer.chunks, { type: transfer.currentFile.type || 'application/octet-stream' });
        this.downloadFile(blob, transfer.currentFile.name);
      }
      transfer.currentFileIndex = header.fileIndex;
      transfer.currentFile = transfer.files[header.fileIndex];
      transfer.chunks = [];
      transfer.receivedSize = 0;
    }

    const chunkData = buffer.slice(HEADER_SIZE);
    transfer.chunks.push(chunkData);
    transfer.receivedSize += chunkData.byteLength;

    const totalSize = transfer.files.reduce((acc, f) => acc + f.size, 0);
    const progress = (transfer.receivedSize / totalSize) * 100;
    this.updateTransferUI(transfer.transferEl, `${Math.round(progress)}%`, progress);

    if (header.chunkIndex === header.totalChunks - 1 && header.fileIndex === transfer.files.length - 1) {
      const blob = new Blob(transfer.chunks, { type: transfer.currentFile.type || 'application/octet-stream' });
      this.downloadFile(blob, transfer.currentFile.name);
      transfer.chunks = [];

      this.updateTransferUI(transfer.transferEl, 'complete', 100);

      this.ws.send(JSON.stringify({
        type: 'transfer-complete',
        to: transfer.peerId,
        transferId: transferId
      }));

      this.transfers.delete(transferId);
    }
  }

  addPeer(id) {
    this.peers.set(id, { id });
  }

  renderPeers() {
    if (this.peers.size === 0) {
      this.peersList.innerHTML = '<div class="empty-state">no devices found</div>';
      return;
    }

    this.peersList.innerHTML = '';
    this.peers.forEach((peer) => {
      const el = document.createElement('div');
      el.className = 'peer-item';
      el.innerHTML = `
        <div class="peer-info">
          <div class="peer-dot"></div>
          <span class="peer-id">${peer.id}</span>
        </div>
        <span class="peer-badge">ready</span>
      `;
      this.peersList.appendChild(el);
    });
  }

  bindEvents() {
    this.dropZone.addEventListener('click', () => this.fileInput.click());

    this.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dropZone.classList.add('dragover');
    });

    this.dropZone.addEventListener('dragleave', () => {
      this.dropZone.classList.remove('dragover');
    });

    this.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropZone.classList.remove('dragover');
      const files = Array.from(e.dataTransfer.files);
      this.handleFiles(files);
    });

    this.fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      this.handleFiles(files);
      this.fileInput.value = '';
    });

    this.btnAccept.addEventListener('click', () => this.acceptTransfer());
    this.btnReject.addEventListener('click', () => this.rejectTransfer());
  }

  handleFiles(files) {
    if (files.length === 0) return;
    this.pendingFiles = files;
    this.showSendBar();
  }

  showSendBar() {
    let sendBar = document.querySelector('.send-bar');
    if (!sendBar) {
      sendBar = document.createElement('div');
      sendBar.className = 'send-bar';
      sendBar.innerHTML = `
        <select id="peerSelect">
          <option value="">select device</option>
        </select>
        <button class="send-btn" id="sendBtn">send</button>
      `;
      this.dropZone.after(sendBar);

      document.getElementById('sendBtn').addEventListener('click', () => this.sendFiles());
    }

    const select = document.getElementById('peerSelect');
    select.innerHTML = '<option value="">select device</option>';
    this.peers.forEach((peer) => {
      const opt = document.createElement('option');
      opt.value = peer.id;
      opt.textContent = peer.id;
      select.appendChild(opt);
    });

    this.showFilePreview();
  }

  showFilePreview() {
    let preview = document.querySelector('.file-preview');
    if (preview) preview.remove();

    preview = document.createElement('div');
    preview.className = 'file-preview';

    this.pendingFiles.forEach((file, i) => {
      const chip = document.createElement('div');
      chip.className = 'file-chip';
      chip.innerHTML = `
        <span>${file.name}</span>
        <span class="file-chip-remove" data-index="${i}">✕</span>
      `;
      preview.appendChild(chip);
    });

    preview.querySelectorAll('.file-chip-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.index);
        this.pendingFiles.splice(idx, 1);
        if (this.pendingFiles.length === 0) {
          preview.remove();
          const sendBar = document.querySelector('.send-bar');
          if (sendBar) sendBar.remove();
        } else {
          this.showFilePreview();
        }
      });
    });

    const sendBar = document.querySelector('.send-bar');
    if (sendBar) sendBar.after(preview);
  }

  sendFiles() {
    const select = document.getElementById('peerSelect');
    const targetId = select.value;
    if (!targetId || this.pendingFiles.length === 0) return;

    const transferId = genTransferId();
    const fileInfo = this.pendingFiles.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type
    }));

    this.ws.send(JSON.stringify({
      type: 'transfer-offer',
      to: targetId,
      transferId: transferId,
      files: fileInfo
    }));

    const transferEl = this.addTransferItem('waiting...', this.pendingFiles, true);

    this.activeSends.set(transferId, {
      transferId,
      targetId,
      files: this.pendingFiles,
      transferEl
    });
  }

  showTransferModal(msg) {
    this.pendingOffer = msg;
    const totalSize = msg.files.reduce((acc, f) => acc + f.size, 0);
    this.modalText.textContent = `${msg.from} wants to send ${msg.files.length} file(s) — ${this.formatSize(totalSize)}`;
    this.modalFiles.innerHTML = msg.files.map(f =>
      `<div class="modal-file">${f.name} (${this.formatSize(f.size)})</div>`
    ).join('');
    this.modalOverlay.classList.add('active');
  }

  acceptTransfer() {
    this.modalOverlay.classList.remove('active');
    const from = this.pendingOffer.from;
    const files = this.pendingOffer.files;
    const transferId = this.pendingOffer.transferId;

    const transferEl = this.addTransferItem('receiving...', files, false);

    this.transfers.set(transferId, {
      transferId,
      peerId: from,
      files,
      currentFileIndex: -1,
      currentFile: null,
      chunks: [],
      receivedSize: 0,
      transferEl
    });

    this.ws.send(JSON.stringify({
      type: 'transfer-response',
      to: from,
      transferId: transferId,
      accepted: true
    }));
  }

  rejectTransfer() {
    this.modalOverlay.classList.remove('active');
    this.ws.send(JSON.stringify({
      type: 'transfer-response',
      to: this.pendingOffer.from,
      transferId: this.pendingOffer.transferId,
      accepted: false
    }));
    this.pendingOffer = null;
  }

  async startSending(peerId, transferId) {
    const send = this.activeSends.get(transferId);
    if (!send) return;

    const files = send.files;
    const transferEl = send.transferEl;

    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const file = files[fileIndex];
      const arrayBuffer = await file.arrayBuffer();
      const totalChunks = Math.ceil(arrayBuffer.byteLength / CHUNK_SIZE);

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, arrayBuffer.byteLength);
        const chunkData = arrayBuffer.slice(start, end);

        const header = encodeHeader(PKT_CHUNK, peerId, transferId, fileIndex, chunkIndex, totalChunks);
        const packet = buildPacket(header, chunkData);

        while (this.ws.bufferedAmount > 1024 * 1024) {
          await new Promise(r => setTimeout(r, 10));
        }

        this.ws.send(packet);

        const fileProgress = (chunkIndex + 1) / totalChunks;
        const overallProgress = ((fileIndex + fileProgress) / files.length) * 100;
        this.updateTransferUI(transferEl, `${Math.round(overallProgress)}%`, overallProgress);
      }
    }

    this.updateTransferUI(transferEl, 'sending...', 99);

    const preview = document.querySelector('.file-preview');
    if (preview) preview.remove();
    const sendBar = document.querySelector('.send-bar');
    if (sendBar) sendBar.remove();
  }

  updateTransferUI(transferEl, statusText, progress) {
    if (!transferEl) return;
    const fill = transferEl.querySelector('.progress-fill');
    const status = transferEl.querySelector('.transfer-status');
    if (fill) fill.style.width = `${progress}%`;
    if (status) status.textContent = statusText;
  }

  downloadFile(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  addTransferItem(status, files, isSender) {
    const el = document.createElement('div');
    el.className = 'transfer-item';
    const names = files.map(f => f.name).join(', ');
    el.innerHTML = `
      <div class="transfer-header">
        <span class="transfer-name">${isSender ? '→ ' : '← '}${names}</span>
        <span class="transfer-status ${status === 'complete' ? 'complete' : 'sending'}">${status}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
    `;
    this.transfersList.prepend(el);
    return el;
  }

  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

window.birdSender = new BirdSender();
