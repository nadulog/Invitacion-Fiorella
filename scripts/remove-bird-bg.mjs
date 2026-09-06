import sharp from "sharp";

const input = "public/bird-source.png";
const output = "public/bird-fiorella.png";
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const magenta = Math.min(r, b) - g;
  const alpha = magenta >= 55 ? 0 : magenta <= 18 ? 255 : Math.round(255 * (55 - magenta) / 37);
  data[i + 3] = alpha;
  if (alpha < 245) {
    const spill = Math.max(0, Math.max(r, b) - g);
    data[i] = Math.max(0, r - spill * 0.42);
    data[i + 2] = Math.max(0, b - spill * 0.42);
  }
}

await sharp(data, { raw: info }).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(output);
