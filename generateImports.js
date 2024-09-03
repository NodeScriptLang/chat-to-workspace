const fs = require('fs');
const path = require('path');

// Utility function to read and parse each .tsx file
function parseFileExports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const exportRegex = /export \{\s([a-zA-Z,\s]+)/g;
  let match;
  const exports = [];

  while ((match = exportRegex.exec(content)) !== null) {
    console.log(match)
    exports.push(match[1].replace(/type\s/g, '').replace(/\n/g, '').trim()); // Capture the export name
  }

  return exports;
}

// Utility function to generate import statements and aggregate them into an object
function generateImports(directory) {
  // Get all files in the directory
  const files = fs.readdirSync(directory);

  // Initialize arrays to hold the import statements and export object content
  const imports = [];
  const exportAssignments = [];

  // Iterate over each file in the directory
  files.forEach((file) => {
    // Only process .tsx files
    if (path.extname(file) === '.tsx') {
      const componentName = path.basename(file, '.tsx');
      const filePath = path.join(directory, file);

      // Parse the file to find all exports
      const exportedComponents = parseFileExports(filePath);

      exportedComponents.forEach((exportName) => {
        // Generate the import statement
        imports.push(`import { ${exportName} } from './${componentName}';`);

        // Add the export to the export object
        exportAssignments.push(exportName);
      });
    }
  });

  // Generate the export object with all imported components
  const exportObject = `export const components = {\n  ${exportAssignments.join(',\n  ')}\n};`;

  // Combine the import statements with the export object
  const output = `${imports.join('\n')}\n\n${exportObject}\n`;

  // Write the output to a file (optional)
  fs.writeFileSync(path.join(directory, 'index.tsx'), output);

  console.log('Generated imports and combined them into an object:\n');
  console.log(output);
}

// Directory to process
const directoryPath = path.join(__dirname, 'components/ui'); // Adjust path as needed

// Generate imports for the directory
generateImports(directoryPath);
