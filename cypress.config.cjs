const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "https://paulyardleyqa.co.uk",
    specPattern: "tests/cypress/e2e/**/*.cy.{js,ts}",
    supportFile: "tests/cypress/support/e2e.js",
    fixturesFolder: false,
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
});
