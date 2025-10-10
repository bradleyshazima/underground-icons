import fs from 'fs/promises';
import path from 'path';

const config = {
  iconSetName: 'Il',
  iconStyle: 'cute',
  sourceDir: 'src/assets/svg/iconly/cute',
  outputDirJsx: 'src/icons/iconly/cute/jsx',
  outputDirSvg: 'src/icons/iconly/cute/svg'
};

function toPascalCase(str) {
  if (!str) return '';
  const cleaned = String(str)
    .trim()
    .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .replace(/(^|-)(outline|fill|duotone|bulk|broken|linear| 192x192)(-|$)/g, '');
  const parts = cleaned.split(' ').filter(Boolean);
  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
}

function createJsxComponent(componentName, svgContent) {
  const sanitizedSvg = svgContent
    .replace(/class="/g, 'className="')
    .replace(/class='/g, "className='")
    .replace(/stroke-width="/g, 'strokeWidth="')
    .replace(/stroke-width='/g, "strokeWidth='")
    .replace(/stroke-linecap="/g, 'strokeLinecap="')
    .replace(/stroke-linecap='/g, "strokeLinecap='")
    .replace(/stroke-linejoin="/g, 'strokeLinejoin="')
    .replace(/stroke-linejoin='/g, "strokeLinejoin='")
    .replace(/<svg([^>]*)>/, `<svg {...props}$1>`);
  return `export const ${componentName} = (props) => (\n  ${sanitizedSvg}\n);\n`;
}

async function processIcons() {
  try {
    await fs.mkdir(config.outputDirJsx, { recursive: true });
    await fs.mkdir(config.outputDirSvg, { recursive: true }); // <--- changed

    const files = await fs.readdir(config.sourceDir);
    const svgFiles = files.filter(file => path.extname(file).toLowerCase() === '.svg');

    if (svgFiles.length === 0) {
      console.log(`No SVG files found in ${config.sourceDir}.`);
      return;
    }

    for (const file of svgFiles) {
      const base = path.basename(file, '.svg');
      const stylePascal = toPascalCase(config.iconStyle);
      const iconPascal = toPascalCase(base);
      const finalName = `${config.iconSetName}${stylePascal}${iconPascal}`;

      const srcPath = path.join(config.sourceDir, file);
      const svgContent = await fs.readFile(srcPath, 'utf-8');

      // 1️⃣ Write JSX component
      const jsxContent = createJsxComponent(finalName, svgContent);
      await fs.writeFile(path.join(config.outputDirJsx, `${finalName}.jsx`), jsxContent, 'utf-8');

      // 2️⃣ Write raw SVG file (no wrapping in JS)
      await fs.writeFile(path.join(config.outputDirSvg, `${finalName}.svg`), svgContent, 'utf-8');

      console.log(`✅ Created ${finalName}.jsx + ${finalName}.svg`);
    }

    console.log('\n✨ Conversion complete!');
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

processIcons();
