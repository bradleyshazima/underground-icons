import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// --- CONFIGURATION ---
// This is the ONLY part you need to edit.
// ============================================================================
const ICON_SETS_CONFIG = [
  {
    name: 'Pela Icons',
    creator: 'Pela',
    socialLink: 'https://twitter.com/pela',
    prefix: 'Pi',
  },
  {
    name: 'Iconsax',
    creator: 'Figma Community',
    socialLink: 'https://twitter.com/underground',
    prefix: 'Is',
  },
];

// --- FILE PATHS (You probably won't need to change these) ---
const JSX_ICONS_DIR = path.join(__dirname, 'src', 'icons', 'jsx');
const SVG_STRINGS_DIR = path.join(__dirname, 'src', 'icons', 'svgStrings');
const OUTPUT_DATA_FILE = path.join(__dirname, 'src', 'data', 'iconData.js');

/**
 * PHASE 1: SANITIZATION
 * Cleans filenames and their internal content.
 * e.g., 'Name-extra(stuff).jsx' -> 'Name.jsx'
 * And updates `export const Name-extra(stuff)` to `export const Name`
 */
async function sanitizeFileNames(directory) {
  console.log(`\nScanning directory: ${path.basename(directory)}...`);
  const files = await fs.readdir(directory);
  let filesCleaned = 0;

  for (const filename of files) {
    // We define a "bad" filename as one containing a hyphen.
    // You can make this regex more complex if needed.
    if (filename.includes('-')) {
      const oldFilenameWithoutExt = path.basename(filename, path.extname(filename));
      const newFilenameWithoutExt = oldFilenameWithoutExt.split('-')[0];
      const newFilename = newFilenameWithoutExt + path.extname(filename);

      if (filename === newFilename) continue;

      const oldPath = path.join(directory, filename);
      const newPath = path.join(directory, newFilename);

      console.log(`  🔧 Cleaning: ${filename} -> ${newFilename}`);
      
      // 1. Rename the file
      await fs.rename(oldPath, newPath);
      filesCleaned++;

      // 2. Read the newly renamed file's content
      const content = await fs.readFile(newPath, 'utf-8');
      
      // 3. Fix the export statement inside the file
      // This regex finds 'export const Old-Name' and replaces it with 'export const NewName'
      const updatedContent = content.replace(
        new RegExp(`export const ${oldFilenameWithoutExt}\\b`),
        `export const ${newFilenameWithoutExt}`
      );

      // 4. Write the fixed content back to the file
      await fs.writeFile(newPath, updatedContent, 'utf-8');
    }
  }

  if (filesCleaned > 0) {
    console.log(`  ✨ Cleaned ${filesCleaned} file(s) in ${path.basename(directory)}.`);
  } else {
    console.log(`  ✅ All files in ${path.basename(directory)} are already clean.`);
  }
}

/**
 * Converts a string from PascalCase to kebab-case.
 */
function pascalToKebab(str) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}


/**
 * PHASE 2: DATA FILE GENERATION
 * Generates the iconData.js file from the cleaned files.
 */
async function generateIconDataFile() {
  try {
    // Ensure directories exist before reading from them
    await fs.access(JSX_ICONS_DIR);
    await fs.access(SVG_STRINGS_DIR);
  } catch (error) {
    console.error(`❌ Error: Make sure the directories '${JSX_ICONS_DIR}' and '${SVG_STRINGS_DIR}' exist.`);
    return;
  }
    
  console.log('\n🚀 Starting icon system build...');

  // ----------------- RUN SANITIZATION FIRST -----------------
  console.log('--- PHASE 1: Sanitizing Filenames & Content ---');
  await sanitizeFileNames(JSX_ICONS_DIR);
  await sanitizeFileNames(SVG_STRINGS_DIR);
  console.log('--- ✅ Sanitization Complete ---');
  // ----------------------------------------------------------

  console.log('\n--- PHASE 2: Generating `iconData.js` ---');
  const allJsxFiles = await fs.readdir(JSX_ICONS_DIR);
  
  const imports = [];
  const iconSetsData = JSON.parse(JSON.stringify(ICON_SETS_CONFIG));
  iconSetsData.forEach(set => set.icons = []);

  for (const file of allJsxFiles) {
    if (path.extname(file) === '.jsx') {
      const componentName = path.basename(file, '.jsx');
      const svgStringComponentName = `${componentName}`;

      const matchedSet = iconSetsData.find(set => componentName.startsWith(set.prefix));
      
      if (matchedSet) {
        imports.push(`import { ${componentName} } from '../icons/jsx/${componentName}';`);
        imports.push(`import { ${svgStringComponentName}Svg } from '../icons/svgStrings/${svgStringComponentName}Svg';`);

        const nameWithStyle = componentName.substring(matchedSet.prefix.length);
        const kebabNameWithStyle = pascalToKebab(nameWithStyle);
        const parts = kebabNameWithStyle.split('-');
        
        const style = parts[0] || 'default';
        const iconName = parts.slice(1).join('-') || kebabNameWithStyle;

        matchedSet.icons.push({
          name: iconName,
          style: style,
          Component: `%%${componentName}%%`,
          svgString: `%%${svgStringComponentName}Svg%%`,
          jsxString: `\`<${componentName} />\``,
        });
      }
    }
  }

  iconSetsData.forEach(set => {
    set.icons.sort((a, b) => a.name.localeCompare(b.name));
  });

  const fileHeader = `// ⚠️ This file is automatically generated by \`generate-icon-system.js\`\n//    Do not edit this file manually. All changes will be lost.\n\n`;
  const importsString = imports.join('\n');
  
  let dataString = JSON.stringify(iconSetsData.filter(set => set.icons.length > 0), null, 2);

  dataString = dataString.replace(/"%%(.*?)%%"/g, '$1');

  const finalContent = `${fileHeader}${importsString}\n\nexport const iconSets = ${dataString};\n`;

  await fs.writeFile(OUTPUT_DATA_FILE, finalContent, 'utf-8');
  console.log(`\n✅ Successfully generated ${OUTPUT_DATA_FILE} with ${imports.length / 2} icons.`);
  console.log('--- ✨ Build Complete ---');
}

// Run the entire process
generateIconDataFile().catch(err => console.error("An error occurred:", err));

