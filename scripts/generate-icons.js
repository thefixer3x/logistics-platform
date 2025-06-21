const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let inputSvg = path.join(process.cwd(), 'public', 'icons', 'seftec-shield-logo.svg');
const outputDir = path.join(process.cwd(), 'public', 'icons');
const tempSvg = path.join(outputDir, 'temp.svg');

// Validate paths
if (!fs.existsSync(inputSvg)) {
  console.error(`Input SVG not found at: ${inputSvg}`);
  process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Verify input file exists and convert XML to SVG if needed
try {
  fs.accessSync(inputSvg, fs.constants.R_OK);
  const content = fs.readFileSync(inputSvg, 'utf8');
  
  if (content.includes('<svg')) {
    // Create SVG file in output directory
    const svgFilename = path.basename(inputSvg).replace(/\.[^/.]+$/, '') + '.svg';
    const svgPath = path.join(outputDir, svgFilename);
    fs.writeFileSync(svgPath, content);
    inputSvg = svgPath;
    console.log(`Created SVG file at: ${inputSvg}`);
  } else {
    console.error('Input file does not contain valid SVG content');
    process.exit(1);
  }
} catch (err) {
  console.error(`Cannot access file at ${inputSvg}`);
  process.exit(1);
}

// Icon sizes to generate
const sizes = [
  { name: 'icon-16x16.png', width: 16 },
  { name: 'icon-32x32.png', width: 32 },
  { name: 'icon-192x192.png', width: 192 },
  { name: 'icon-512x512.png', width: 512 },
  { name: 'apple-touch-icon.png', width: 180 }
];

try {
  // Use ImageMagick directly on the input SVG
  sizes.forEach(size => {
    const outputPath = path.join(outputDir, size.name);
    const cmd = `magick "${inputSvg}" -background none -resize ${size.width}x${size.width} "${outputPath}"`;
    console.log('Executing:', cmd);
    execSync(cmd);
    console.log(`Generated ${size.name} at ${outputPath}`);
  });
  console.log('All icons generated successfully');
} catch (err) {
  console.error('Error generating icons:');
  console.error(err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
}
