import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="50%" stop-color="#111827" />
      <stop offset="100%" stop-color="#070a10" />
    </linearGradient>

    <!-- Sneaker Main Gradient -->
    <linearGradient id="sneakerGrad" x1="100" y1="180" x2="420" y2="350" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ff6b00" />
      <stop offset="50%" stop-color="#ea580c" />
      <stop offset="100%" stop-color="#c2410c" />
    </linearGradient>

    <!-- Glow Filter -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="24" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ff5722" stop-opacity="0.35" />
      <stop offset="70%" stop-color="#ff5722" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#ff5722" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="115" fill="url(#bgGrad)" />

  <!-- Subtle Ambient Glow -->
  <circle cx="256" cy="256" r="220" fill="url(#ringGlow)" />

  <!-- Outer Neon Border Ring -->
  <rect x="12" y="12" width="488" height="488" rx="104" stroke="#ff5722" stroke-width="3" stroke-opacity="0.25" fill="none" />

  <!-- Sneaker Group -->
  <g transform="translate(10, 20)">
    <!-- Sneaker Shadow -->
    <ellipse cx="256" cy="370" rx="175" ry="24" fill="#000000" fill-opacity="0.55" filter="blur(14px)" />

    <!-- Outsole (Bottom Rubber) -->
    <path d="M102 344 C130 354 340 355 400 338 C415 334 418 322 410 318 C398 312 370 312 350 312 C300 312 135 314 100 326 C90 330 92 340 102 344 Z" fill="#e2e8f0" />

    <!-- Midsole (White Foam with Air Unit) -->
    <path d="M100 330 C130 336 345 338 398 322 C406 320 408 308 402 304 C390 296 350 296 330 296 C270 296 130 298 98 312 C92 315 92 328 100 330 Z" fill="#ffffff" />

    <!-- Orange Midsole Accent / Air Unit -->
    <rect x="150" y="308" width="60" height="12" rx="6" fill="#ea580c" />
    <rect x="220" y="308" width="35" height="12" rx="6" fill="#ff7828" />

    <!-- Upper Main Body (High Top Silhouette) -->
    <path d="M110 312 
             C106 280 115 220 135 190 
             C142 180 158 178 172 185 
             C188 193 194 212 198 230 
             L250 240 
             L310 252 
             C350 262 385 285 402 304 
             C370 300 130 300 110 312 Z" 
          fill="url(#sneakerGrad)" />

    <!-- High Collar / Ankle Support (Dark Streetwear Panel) -->
    <path d="M135 190 
             C148 165 175 145 205 140 
             C220 138 232 148 230 162 
             C228 175 220 200 205 225 
             C185 210 155 198 135 190 Z" 
          fill="#1e293b" />

    <!-- Collar Padding Orange Rim -->
    <path d="M142 185 C160 155 190 142 220 142 C228 142 228 148 220 152 C195 155 168 170 148 192 Z" fill="#ff7828" />

    <!-- Heel Overlay (Leather Panel) -->
    <path d="M110 312 C108 260 116 220 140 195 C146 225 155 270 170 308 C140 308 120 310 110 312 Z" fill="#0f172a" />

    <!-- Dynamic Speed Swoosh / Lightning Bolt across sneaker -->
    <path d="M135 255 
             C180 248 250 260 355 295 
             C300 282 220 270 160 275 
             C145 276 138 268 135 255 Z" 
          fill="#ffffff" />

    <!-- Second Accent Flame Line -->
    <path d="M175 252 C230 254 300 272 360 292 C310 282 245 270 190 268 Z" fill="#fbbf24" />

    <!-- Laces (Crisp White Cross-Ties) -->
    <line x1="205" y1="228" x2="230" y2="242" stroke="#ffffff" stroke-width="5" stroke-linecap="round" />
    <line x1="222" y1="234" x2="252" y2="248" stroke="#ffffff" stroke-width="5" stroke-linecap="round" />
    <line x1="240" y1="242" x2="274" y2="256" stroke="#ffffff" stroke-width="5" stroke-linecap="round" />
    <line x1="262" y1="250" x2="298" y2="265" stroke="#ffffff" stroke-width="5" stroke-linecap="round" />

    <!-- Toe Box Cap (Front Reinforcement) -->
    <path d="M340 270 C365 276 395 290 402 304 C380 302 355 300 335 298 C325 285 330 275 340 270 Z" fill="#0f172a" />
    <circle cx="365" cy="288" r="2.5" fill="#475569" />
    <circle cx="375" cy="292" r="2.5" fill="#475569" />
    <circle cx="385" cy="296" r="2.5" fill="#475569" />
  </g>

  <!-- Sparkle Star at Top Right -->
  <path d="M390 100 L395 118 L413 123 L395 128 L390 146 L385 128 L367 123 L385 118 Z" fill="#fbbf24" filter="url(#glow)" />
  <circle cx="430" cy="165" r="4" fill="#ffedd5" />
</svg>
`;

async function generate() {
  const baseDir = path.resolve('android/app/src/main/res');

  // Mipmap configurations for Android icons
  const targets = [
    { folder: 'mipmap-mdpi', size: 48 },
    { folder: 'mipmap-hdpi', size: 72 },
    { folder: 'mipmap-xhdpi', size: 96 },
    { folder: 'mipmap-xxhdpi', size: 144 },
    { folder: 'mipmap-xxxhdpi', size: 192 },
  ];

  console.log('Gerando ícones para todas as densidades do Android...');

  const svgBuffer = Buffer.from(svgIcon);

  // Generate 512x512 preview and public favicon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/app-icon.png'));

  for (const t of targets) {
    const dir = path.join(baseDir, t.folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 1. ic_launcher.png
    await sharp(svgBuffer)
      .resize(t.size, t.size)
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'));

    // 2. ic_launcher_round.png (Circular mask)
    const circleMask = Buffer.from(
      `<svg width="${t.size}" height="${t.size}"><circle cx="${t.size / 2}" cy="${t.size / 2}" r="${t.size / 2}" fill="#fff" /></svg>`
    );

    await sharp(svgBuffer)
      .resize(t.size, t.size)
      .composite([{ input: circleMask, blend: 'dest-in' }])
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'));

    // 3. ic_launcher_foreground.png (for adaptive icons)
    await sharp(svgBuffer)
      .resize(t.size, t.size)
      .png()
      .toFile(path.join(dir, 'ic_launcher_foreground.png'));

    console.log(`✓ ${t.folder} (${t.size}x${t.size}) atualizado com sucesso!`);
  }

  console.log('Todos os ícones nativos do Android foram gerados com sucesso!');
}

generate().catch(console.error);
