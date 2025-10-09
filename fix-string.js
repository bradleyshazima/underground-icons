import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
// The path to your folder containing the SVG string .js files.
const SVG_STRINGS_DIR = path.join(__dirname, 'src', 'icons', 'svgStrings');

/**
 * A utility script to enforce naming consistency for SVG string files.
 * 1. Renames any file that doesn't end with 'Svg.js'.
 * 2. Updates the `export const` variable inside each file to match its filename.
 */
async function fixSvgStrings() {
  console.log('🚀 Starting SVG Strings consistency check...');
  try {
    await fs.access(SVG_STRINGS_DIR);
  } catch {
    console.error(`❌ Directory not found: ${SVG_STRINGS_DIR}`);
    console.error('Please make sure the path in the script is correct.');
    return;
  }

  const initialFiles = await fs.readdir(SVG_STRINGS_DIR);

  // --- PHASE 1: Rename files that don't end with 'Svg.js' ---
  console.log('\n--- Phase 1: Checking filenames ---');
  let renamedCount = 0;
  for (const filename of initialFiles) {
    if (path.extname(filename) === '.js' && !filename.endsWith('Svg.js')) {
      const oldPath = path.join(SVG_STRINGS_DIR, filename);
      const newFilename = `${path.basename(filename, '.js')}Svg.js`;
      const newPath = path.join(SVG_STRINGS_DIR, newFilename);
      
      console.log(`  🔧 Renaming: ${filename} -> ${newFilename}`);
      await fs.rename(oldPath, newPath);
      renamedCount++;
    }
  }

  if (renamedCount > 0) {
    console.log(`  ✨ Renamed ${renamedCount} file(s).`);
  } else {
    console.log('  ✅ All filenames are consistent.');
  }

  // --- PHASE 2: Fix export statements inside all files ---
  console.log('\n--- Phase 2: Checking file contents ---');
  const updatedFiles = await fs.readdir(SVG_STRINGS_DIR);
  let fixedCount = 0;

  for (const filename of updatedFiles) {
    if (path.extname(filename) !== '.js') continue;

    const expectedExportName = path.basename(filename, '.js');
    const filePath = path.join(SVG_STRINGS_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');

    // Regex to find 'export const SomeName'
    const regex = /export const (\w+)/;
    const match = content.match(regex);

    if (match && match[1] !== expectedExportName) {
      const actualExportName = match[1];
      console.log(`  🔧 Fixing export in ${filename}: '${actualExportName}' -> '${expectedExportName}'`);
      
      const updatedContent = content.replace(actualExportName, expectedExportName);
      await fs.writeFile(filePath, updatedContent, 'utf-8');
      fixedCount++;
    }
  }

  if (fixedCount > 0) {
    console.log(`  ✨ Fixed content in ${fixedCount} file(s).`);
  } else {
    console.log('  ✅ All file contents are consistent.');
  }
  
  console.log('\n✅ SVG Strings consistency check complete!');
}

fixSvgStrings().catch(err => {
  console.error("\nAn error occurred during the fix process:");
  console.error(err);
});
