import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4);
  data.copy(buf, 8);
  const crcData = buf.subarray(4, 8 + len);
  buf.writeUInt32BE(crc32(crcData), 8 + len);
  return buf;
}

function createPng(width, height, isMaskable = false) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data with filter byte 0 before each row
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  const cx = width / 2;
  const cy = height / 2;
  const scale = isMaskable ? 0.75 : 0.88;
  const cornerR = isMaskable ? 0 : width * 0.22;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pOffset = rowOffset + 1 + x * 4;

      // Base background: Forest Green gradient (#144134 to #1E5C4A)
      let tY = y / height;
      let bgR = Math.round(20 + tY * 10);
      let bgG = Math.round(65 + tY * 27);
      let bgB = Math.round(52 + tY * 22);
      let bgA = 255;

      // Rounded corner clipping if not maskable
      if (!isMaskable) {
        let dx = 0;
        let dy = 0;
        if (x < cornerR) dx = cornerR - x;
        else if (x > width - cornerR) dx = x - (width - cornerR);
        if (y < cornerR) dy = cornerR - y;
        else if (y > height - cornerR) dy = y - (height - cornerR);

        if (dx > 0 && dy > 0) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > cornerR) {
            bgA = 0;
          } else if (dist > cornerR - 1.5) {
            bgA = Math.round(255 * (cornerR - dist) / 1.5);
          }
        }
      }

      if (bgA === 0) {
        rawData[pOffset] = 0;
        rawData[pOffset + 1] = 0;
        rawData[pOffset + 2] = 0;
        rawData[pOffset + 3] = 0;
        continue;
      }

      // Normalized coordinates relative to center (-1 to 1) scaled
      const nx = (x - cx) / (cx * scale);
      const ny = (y - cy) / (cy * scale);

      let r = bgR;
      let g = bgG;
      let b = bgB;
      let a = bgA;

      // Golden Sun: circle centered around ny = 0.05, radius ~0.42
      const sunDist = Math.sqrt(nx * nx + (ny - 0.05) * (ny - 0.05));
      if (sunDist < 0.44) {
        const sunAlpha = sunDist > 0.42 ? (0.44 - sunDist) / 0.02 : 1.0;
        const sr = 245;
        const sg = 158;
        const sb = 11;
        r = Math.round(r * (1 - sunAlpha) + sr * sunAlpha);
        g = Math.round(g * (1 - sunAlpha) + sg * sunAlpha);
        b = Math.round(b * (1 - sunAlpha) + sb * sunAlpha);
      }

      // Soil Furrows (Terracotta / Sand) at bottom (ny: 0.45 to 0.75)
      if (ny > 0.42 && ny < 0.72) {
        const curve = Math.sin(nx * 2.8) * 0.08;
        if (ny > 0.48 + curve && ny < 0.58 + curve) {
          r = 181; g = 85; b = 30; // Terracotta #B5551E
        } else if (ny > 0.60 + curve && ny < 0.68 + curve) {
          r = 140; g = 62; b = 20;
        }
      }

      // Green Sprout leaves & stem
      // Center stem: nx between -0.04 and 0.04, ny between -0.45 and 0.5
      if (Math.abs(nx) < 0.035 && ny > -0.45 && ny < 0.48) {
        r = 255; g = 255; b = 255; // White central spine
      }

      // Left leaf: teardrop curve
      const leftDist = Math.sqrt((nx + 0.22) * (nx + 0.22) + (ny + 0.05) * (ny + 0.05));
      if (leftDist < 0.28 && nx < 0.02 && ny > -0.35 && ny < 0.35) {
        r = 16; g = 185; b = 129; // Emerald green #10B981
      }

      // Right leaf
      const rightDist = Math.sqrt((nx - 0.22) * (nx - 0.22) + (ny + 0.05) * (ny + 0.05));
      if (rightDist < 0.28 && nx > -0.02 && ny > -0.35 && ny < 0.35) {
        r = 52; g = 211; b = 153; // Mint green #34D399
      }

      // Top Golden Seed/Sun tip
      const tipDist = Math.sqrt(nx * nx + (ny + 0.5) * (ny + 0.5));
      if (tipDist < 0.09) {
        r = 253; g = 230; b = 138; // Light Gold #FDE68A
      }

      rawData[pOffset] = r;
      rawData[pOffset + 1] = g;
      rawData[pOffset + 2] = b;
      rawData[pOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(64, 64, false));

console.log('Successfully generated all PWA icons (192, 512, maskable, apple-touch-icon, favicon)!');
