module.exports = (on, config) => {
  const options = {
    printLogsToConsole: 'always'
  };
  require('cypress-terminal-report/src/installLogsPrinter')(on, options);
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'chrome') {
      launchOptions.args.push('--start-fullscreen')
      //launchOptions.args.push('--incognito')
    }
    return launchOptions
  })
}
