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

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export {
  CHUNK_SIZE,
  HEADER_SIZE,
  PKT_CHUNK,
  genTransferId,
  encodeHeader,
  decodeHeader,
  buildPacket,
  formatSize
};

if (typeof window !== 'undefined') {
  window.BirdSenderUtils = {
    CHUNK_SIZE,
    HEADER_SIZE,
    PKT_CHUNK,
    genTransferId,
    encodeHeader,
    decodeHeader,
    buildPacket,
    formatSize
  };
}
