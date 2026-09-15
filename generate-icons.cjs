const sharp = require('sharp');
const fs = require('fs');

async function generate() {
  const input = 'src/assets/images/pwa_icon_1789487137271.jpg';
  
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
  }

  await sharp(input).resize(192, 192).toFile('public/pwa-192x192.png');
  await sharp(input).resize(512, 512).toFile('public/pwa-512x512.png');
  await sharp(input).resize(180, 180).toFile('public/apple-touch-icon.png');
  
  console.log('Icons generated.');
}

generate();
