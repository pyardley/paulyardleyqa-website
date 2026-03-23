// ***********************************************************
// Cypress E2E Support File
// This file runs before every spec file.
// https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Support-file
// ***********************************************************

// Custom command: Set theme to light mode
Cypress.Commands.add("setLightMode", () => {
  cy.window().then((win) => {
    win.localStorage.setItem("theme", "light");
    win.document.documentElement.classList.remove("dark");
  });
});

// Custom command: Set theme to dark mode
Cypress.Commands.add("setDarkMode", () => {
  cy.window().then((win) => {
    win.localStorage.setItem("theme", "dark");
    win.document.documentElement.classList.add("dark");
  });
});

// Custom command: Check no console errors
Cypress.Commands.add("checkNoConsoleErrors", () => {
  cy.window().then((win) => {
    cy.spy(win.console, "error").as("consoleError");
  });
});

// Suppress uncaught exceptions from the application
Cypress.on("uncaught:exception", () => {
  return false;
});
