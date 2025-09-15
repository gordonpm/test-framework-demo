const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    setupNodeEvents(on, config) {
      this.screenshotOnRunFailure = true;
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
  env: {
    portalUrl:  "./cypress/mock/login.html",
    apiUrl:     "https://6c967709-9964-4bfb-b888-1a83dcf6bc9d.mock.pstmn.io",
    username:   "tomhardy",
    password:   "tom123",
    email:      "tom@fintechdemo.com"
  }
})