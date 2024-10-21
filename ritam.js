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
  
  //console.log('Exclusion Patterns:', excludeSpecPattern); // Log exclusion patterns

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

          // Check exclusion against each pattern
          const isExcluded = excludeSpecPattern.some(pattern => {
            const match = fullPath.includes(pattern); // Check against full path
            //console.log(`Checking if ${fullPath} matches pattern ${pattern}: ${match}`);
            return match;
          });

          if (!isExcluded) {
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
    //console.log("Final result array:");
    resultArray.forEach(item => {
      console.log('test-suites/' + item); // Print each item one by one
    });
  }, 1000); // Adjust time as necessary
});
