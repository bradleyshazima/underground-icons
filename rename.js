import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// --- CONFIGURATION ---
// ============================================================
const config = {
  // Add your icon directories here
  directories: [
    'src/icons/iconly/cute/jsx',
    'src/icons/iconly/cute/svg',
    'src/icons/iconsax/outline/jsx',
    'src/icons/iconsax/outline/svg',
    'src/icons/iconamoon/outline/jsx',
    'src/icons/iconamoon/outline/svg',
    'src/icons/iconamoon/fill/jsx',
    'src/icons/iconamoon/fill/svg',
    'src/icons/iconamoon/duotone/jsx',
    'src/icons/iconamoon/duotone/svg',
    'src/icons/iconamoon/cute/jsx',
    'src/icons/iconamoon/cute/svg',
    'src/icons/nova/fill/jsx',
    'src/icons/nova/fill/svg',
    'src/icons/nova/outline/jsx',
    'src/icons/nova/outline/svg',
    'src/icons/pelaicons/outline/jsx',
    'src/icons/pelaicons/outline/svg',
    'src/icons/pelaicons/fill/jsx',
    'src/icons/pelaicons/fill/svg',
    'src/icons/pelaicons/duotone/jsx',
    'src/icons/pelaicons/duotone/svg',
  ],
  
  // Patterns to remove from filenames
  patternsToRemove: [
    /192x192/gi,           // Remove dimensions like 192x192
    /-cute-/gi,            // Remove style indicators like -cute-
    /-outline-/gi,         // Remove -outline-
    /-fill-/gi,            // Remove -fill-
    /-duotone-/gi,         // Remove -duotone-
    /-broken-/gi,          // Remove -broken-
    /-linear-/gi,          // Remove -linear-
  ],
  
  dryRun: false  // Set to true to see what would be renamed without actually renaming
};

// ============================================================
// --- Helper Functions ---
// ============================================================

/**
 * Clean the filename by removing patterns and cleaning up hyphens
 */
function cleanFilename(filename) {
  const ext = path.extname(filename);
  let name = path.basename(filename, ext);
  
  // Remove all specified patterns
  config.patternsToRemove.forEach(pattern => {
    name = name.replace(pattern, '');
  });
  
  // Remove leading hyphens
  name = name.replace(/^-+/, '');
  
  // Remove trailing hyphens
  name = name.replace(/-+$/, '');
  
  // Replace multiple consecutive hyphens with a single hyphen
  name = name.replace(/-+/g, '-');
  
  return name + ext;
}

/**
 * Update the export statement in JSX files to match the new filename
 */
async function updateJsxExport(filePath, oldName, newName) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const oldExportName = path.basename(oldName, '.jsx');
    const newExportName = path.basename(newName, '.jsx');
    
    // Replace the export const name
    const updatedContent = content.replace(
      new RegExp(`export const ${oldExportName}\\b`, 'g'),
      `export const ${newExportName}`
    );
    
    await fs.writeFile(filePath, updatedContent, 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error updating JSX export in ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Rename files in a directory
 */
async function renameFilesInDirectory(directory) {
  try {
    const fullPath = path.join(__dirname, directory);
    
    // Check if directory exists
    try {
      await fs.access(fullPath);
    } catch {
      console.log(`⚠️  Directory not found: ${directory}`);
      return { renamed: 0, skipped: 0, errors: 0 };
    }
    
    const files = await fs.readdir(fullPath);
    let renamed = 0;
    let skipped = 0;
    let errors = 0;
    
    console.log(`\n📁 Processing: ${directory}`);
    console.log(`   Found ${files.length} files`);
    
    for (const file of files) {
      const oldPath = path.join(fullPath, file);
      const newFilename = cleanFilename(file);
      
      // Skip if filename hasn't changed
      if (file === newFilename) {
        skipped++;
        continue;
      }
      
      const newPath = path.join(fullPath, newFilename);
      
      console.log(`   ${file} → ${newFilename}`);
      
      if (!config.dryRun) {
        try {
          // For JSX files, update the export statement first
          if (path.extname(file) === '.jsx') {
            await updateJsxExport(oldPath, file, newFilename);
          }
          
          // Rename the file
          await fs.rename(oldPath, newPath);
          renamed++;
        } catch (error) {
          console.error(`   ❌ Error renaming ${file}:`, error.message);
          errors++;
        }
      } else {
        renamed++; // Count as renamed in dry-run mode
      }
    }
    
    return { renamed, skipped, errors };
  } catch (error) {
    console.error(`❌ Error processing directory ${directory}:`, error.message);
    return { renamed: 0, skipped: 0, errors: 1 };
  }
}

// ============================================================
// --- Main Execution ---
// ============================================================

async function main() {
  console.log('🚀 Icon File Renaming Tool');
  console.log('='.repeat(50));
  
  if (config.dryRun) {
    console.log('⚠️  DRY RUN MODE - No files will be renamed');
  }
  
  console.log('\n📝 Patterns to remove:');
  config.patternsToRemove.forEach((pattern, index) => {
    console.log(`   ${index + 1}. ${pattern}`);
  });
  
  let totalRenamed = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  
  // Process each directory
  for (const directory of config.directories) {
    const stats = await renameFilesInDirectory(directory);
    totalRenamed += stats.renamed;
    totalSkipped += stats.skipped;
    totalErrors += stats.errors;
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   ✅ Renamed: ${totalRenamed} files`);
  console.log(`   ⏭️  Skipped: ${totalSkipped} files (no changes needed)`);
  if (totalErrors > 0) {
    console.log(`   ❌ Errors: ${totalErrors}`);
  }
  
  if (config.dryRun) {
    console.log('\n💡 This was a dry run. Set dryRun to false to actually rename files.');
  } else {
    console.log('\n✨ Done! You can now run generate-icon-system.js');
  }
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});