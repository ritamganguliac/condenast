const fs = require('fs');
const path = require('path');

// Define the path to your cypress.config.js file
const configFilePath = path.join(__dirname, 'cypress.config.js');

// Create an array to hold the results
const resultArray = [];

// Read the configuration file
fs.readFile(configFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the config file:', err);
    return;
  }

  // Use eval to parse the module exports (only if you trust the source)
  const config = eval(data);

  // Access the excludeSpecPattern array
  const excludeSpecPattern = config.e2e.excludeSpecPattern.map(item => item.replace('test-suites/**/', ''));

  // Define the base directory to search
  const baseDir = path.join(__dirname, 'test-suites');

  // Function to recursively list files and exclude based on patterns
  const listFiles = (dir) => {
    fs.readdir(dir, { withFileTypes: true }, (err, entries) => {
      if (err) {
        console.error('Error reading directory:', err);
        return;
      }

      entries.forEach(entry => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Recursively list files in subdirectories
          listFiles(fullPath);
        } else {
          // Check if the file should be excluded
          const fileName = fullPath.replace(/^.*[\\/]/, ''); // Get the filename only

          if (!excludeSpecPattern.some(pattern => fileName.includes(pattern))) {
            // Trim the path to include only from 'test-suites/'
            const trimmedPath = fullPath.replace(`${baseDir}/`, ''); // Remove the base directory from the path
            resultArray.push(trimmedPath);
          }
        }
      });
    });
  };

  // Start listing files from the base directory
  listFiles(baseDir);

  // Wait for a moment before logging to ensure all files are processed
  setTimeout(() => {
    resultArray.forEach(item => {
      console.log('test-suites/' + item); // Print each item one by one
    });
  }, 1000); // Adjust time as necessary
});
