import {
  HEADER_SIZE,
  PKT_CHUNK,
  genTransferId,
  encodeHeader,
  decodeHeader,
  buildPacket,
  formatSize
} from '../src/utils.js';

describe('Protocol Utils', () => {
  describe('genTransferId', () => {
    test('generates 8-character transfer ID', () => {
      const id = genTransferId();
      expect(id).toHaveLength(8);
    });

    test('generates unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(genTransferId());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('encodeHeader / decodeHeader', () => {
    test('encodes and decodes header correctly', () => {
      const type = PKT_CHUNK;
      const targetId = 'abc123';
      const transferId = 'test0001';
      const fileIndex = 0;
      const chunkIndex = 5;
      const totalChunks = 10;

      const encoded = encodeHeader(type, targetId, transferId, fileIndex, chunkIndex, totalChunks);
      const decoded = decodeHeader(encoded.buffer);

      expect(decoded.type).toBe(type);
      expect(decoded.targetId).toBe(targetId);
      expect(decoded.transferId).toBe(transferId);
      expect(decoded.fileIndex).toBe(fileIndex);
      expect(decoded.chunkIndex).toBe(chunkIndex);
      expect(decoded.totalChunks).toBe(totalChunks);
    });

    test('handles short targetId with padding', () => {
      const encoded = encodeHeader(PKT_CHUNK, 'abc', 'test0001', 0, 0, 1);
      const decoded = decodeHeader(encoded.buffer);
      expect(decoded.targetId).toBe('abc');
    });

    test('truncates long targetId to 6 chars', () => {
      const encoded = encodeHeader(PKT_CHUNK, 'abcdefgh', 'test0001', 0, 0, 1);
      const decoded = decodeHeader(encoded.buffer);
      expect(decoded.targetId).toBe('abcdef');
    });

    test('handles large chunk indices', () => {
      const encoded = encodeHeader(PKT_CHUNK, 'abc123', 'test0001', 999, 99999, 100000);
      const decoded = decodeHeader(encoded.buffer);
      expect(decoded.fileIndex).toBe(999);
      expect(decoded.chunkIndex).toBe(99999);
      expect(decoded.totalChunks).toBe(100000);
    });

    test('header size is exactly 27 bytes', () => {
      const encoded = encodeHeader(PKT_CHUNK, 'abc123', 'test0001', 0, 0, 1);
      expect(encoded.byteLength).toBe(HEADER_SIZE);
    });
  });

  describe('buildPacket', () => {
    test('builds packet with header and data', () => {
      const header = encodeHeader(PKT_CHUNK, 'abc123', 'test0001', 0, 0, 1);
      const data = new TextEncoder().encode('Hello World');
      const packet = buildPacket(header, data);

      expect(packet.byteLength).toBe(HEADER_SIZE + data.byteLength);

      const decodedHeader = decodeHeader(packet);
      expect(decodedHeader.targetId).toBe('abc123');
    });

    test('handles empty data', () => {
      const header = encodeHeader(PKT_CHUNK, 'abc123', 'test0001', 0, 0, 1);
      const data = new Uint8Array(0);
      const packet = buildPacket(header, data);

      expect(packet.byteLength).toBe(HEADER_SIZE);
    });

    test('handles large data chunks', () => {
      const header = encodeHeader(PKT_CHUNK, 'abc123', 'test0001', 0, 0, 1);
      const data = new Uint8Array(64 * 1024);
      const packet = buildPacket(header, data);

      expect(packet.byteLength).toBe(HEADER_SIZE + 64 * 1024);
    });
  });

  describe('formatSize', () => {
    test('formats 0 bytes', () => {
      expect(formatSize(0)).toBe('0 B');
    });

    test('formats bytes', () => {
      expect(formatSize(500)).toBe('500 B');
    });

    test('formats kilobytes', () => {
      expect(formatSize(1024)).toBe('1 KB');
      expect(formatSize(1536)).toBe('1.5 KB');
    });

    test('formats megabytes', () => {
      expect(formatSize(1024 * 1024)).toBe('1 MB');
      expect(formatSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
    });

    test('formats gigabytes', () => {
      expect(formatSize(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });
});
