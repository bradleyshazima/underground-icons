import fs from 'fs/promises';
import path from 'path';

// --- CONFIGURATION ---
const config = {
  iconSetName: 'Is',      // e.g., 'pela', 'feather'
  iconStyle: 'outline',        // e.g., 'fill', 'outline', 'duotone'
  sourceDir: 'src/assets/svg/iconsax/outline',
  outputDirJsx: 'src/icons/jsx',
  outputDirSvgString: 'src/icons/svgStrings'
};
// -------------------

function toPascalCase(str) {
  return str.replace(/(^\w|-\w)/g, (c) => c.replace('-', '').toUpperCase());
}

function createJsxComponent(componentName, svgContent) {
  const sanitizedSvg = svgContent
    .replace(/class="/g, 'className="')
    .replace(/stroke-width="/g, 'strokeWidth="')
    .replace(/stroke-linecap="/g, 'strokeLinecap="')
    .replace(/stroke-linejoin="/g, 'strokeLinejoin="')
    .replace(/<svg(.*?)>/, `<svg {...props} $1>`);

  return `
export const ${componentName} = (props) => (
  ${sanitizedSvg}
);
`;
}

async function processIcons() {
  try {
    await fs.mkdir(config.outputDirJsx, { recursive: true });
    await fs.mkdir(config.outputDirSvgString, { recursive: true });

    const files = await fs.readdir(config.sourceDir);
    const svgFiles = files.filter(file => path.extname(file) === '.svg');

    if (svgFiles.length === 0) {
      console.log(`No SVG files found in ${config.sourceDir}.`);
      return;
    }

    for (const file of svgFiles) {
      const iconName = path.basename(file, '.svg');
      const finalName = `${config.iconSetName}${toPascalCase(config.iconStyle)}${toPascalCase(iconName)}`;

      const filePath = path.join(config.sourceDir, file);
      const rawSvgContent = await fs.readFile(filePath, 'utf-8');

      // 1. Create JSX Component
      const jsxContent = createJsxComponent(finalName, rawSvgContent);
      const jsxOutputPath = path.join(config.outputDirJsx, `${finalName}.jsx`);
      await fs.writeFile(jsxOutputPath, jsxContent);

      // 2. Create SVG String Module
      const svgStringContent = `export const ${finalName}Svg = \`${rawSvgContent}\`;`;
      const svgStringOutputPath = path.join(config.outputDirSvgString, `${finalName}.js`);
      await fs.writeFile(svgStringOutputPath, svgStringContent);

      console.log(`✅ Converted ${file} -> ${finalName}.jsx & ${finalName}.js`);
    }
    console.log('\nConversion complete! ✨');

  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

processIcons();