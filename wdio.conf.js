exports.config = {
  // Defines that the tests will be executed locally
  runner: "local",
  specs: [
    // Location of test files
    "./test/specs/**/*.js",
  ],
  // Maximum number of instances that can be run in parallel
  maxInstances: 1,
  capabilities: [
    {
      // Maximum number of browser instances
      maxInstances: 1,
      // navegate browser name
      browserName: "chrome",
      // accept insecure certificates
      acceptInsecureCerts: true,
    },
  ],
  logLevel: "info",
  // Number of failures before stopping execution (0 = do not stop)
  bail: 0,
  // Base URL for WebDriverIO requests
  baseUrl: "http://localhost:8080/CheckoutPage",
  // Default timeout for waitFor* commands
  waitforTimeout: 10000,
  // Timeout for WebDriver connection
  connectionRetryTimeout: 120000,
  // Number of connection attempts
  connectionRetryCount: 3,
  // Services used (Chromedriver)
  services: ["chromedriver"],
  // Test framework used
  framework: "mocha",
  // Reports used
  reporters: ["spec"],
  mochaOpts: {
    // User interface for Mocha (bdd = Behavior Driven Development)
    ui: "bdd",
    // Timeout for tests
    timeout: 60000,
  },
};
