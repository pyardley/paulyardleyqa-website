/// <reference types="cypress" />

describe("Dark Mode - Desktop Toggle", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit("/");
    cy.setLightMode();
  });

  it("should start in light mode when localStorage is set to light", () => {
    cy.reload();
    cy.get("html").should("not.have.class", "dark");
  });

  it("should start in dark mode when localStorage is set to dark", () => {
    cy.setDarkMode();
    cy.reload();
    cy.get("html").should("have.class", "dark");
  });

  it("should toggle to dark mode when clicking the theme button", () => {
    cy.reload();
    cy.get("html").should("not.have.class", "dark");
    cy.get("#theme-toggle").click();
    cy.get("html").should("have.class", "dark");
  });

  it("should toggle back to light mode on second click", () => {
    cy.reload();
    cy.get("#theme-toggle").click();
    cy.get("html").should("have.class", "dark");
    cy.get("#theme-toggle").click();
    cy.get("html").should("not.have.class", "dark");
  });

  it("should save dark preference to localStorage", () => {
    cy.reload();
    cy.get("#theme-toggle").click();
    cy.window()
      .its("localStorage")
      .invoke("getItem", "theme")
      .should("eq", "dark");
  });

  it("should save light preference to localStorage", () => {
    cy.setDarkMode();
    cy.reload();
    cy.get("#theme-toggle").click();
    cy.window()
      .its("localStorage")
      .invoke("getItem", "theme")
      .should("eq", "light");
  });

  it("should persist dark mode across page navigation", () => {
    cy.reload();
    cy.get("#theme-toggle").click();
    cy.get("html").should("have.class", "dark");
    cy.visit("/about");
    cy.get("html").should("have.class", "dark");
  });

  it("should persist light mode across page navigation", () => {
    cy.reload();
    cy.visit("/about");
    cy.get("html").should("not.have.class", "dark");
  });

  it("should show moon icon in light mode", () => {
    cy.reload();
    cy.get("#theme-toggle svg.block").should("be.visible");
  });

  it("should show sun icon in dark mode", () => {
    cy.setDarkMode();
    cy.reload();
    cy.get("#theme-toggle svg.hidden.dark\\:block").should("be.visible");
  });
});

describe("Dark Mode - Mobile Toggle", () => {
  beforeEach(() => {
    cy.viewport(375, 667);
    cy.visit("/");
    cy.setLightMode();
  });

  it('should display "Switch to Dark Mode" text in light mode', () => {
    cy.reload();
    cy.get("#mobile-menu-btn").click();
    cy.get("#theme-toggle-mobile").should(
      "contain.text",
      "Switch to Dark Mode",
    );
  });

  it('should display "Switch to Light Mode" text in dark mode', () => {
    cy.setDarkMode();
    cy.reload();
    cy.get("#mobile-menu-btn").click();
    cy.get("#theme-toggle-mobile").should(
      "contain.text",
      "Switch to Light Mode",
    );
  });

  it("should toggle dark mode via mobile menu", () => {
    cy.reload();
    cy.get("html").should("not.have.class", "dark");
    cy.get("#mobile-menu-btn").click();
    cy.get("#theme-toggle-mobile").click();
    cy.get("html").should("have.class", "dark");
  });

  it("should close the mobile menu after toggling theme", () => {
    cy.reload();
    cy.get("#mobile-menu-btn").click();
    cy.get("#mobile-menu").should("be.visible");
    cy.get("#theme-toggle-mobile").click();
    cy.get("#mobile-menu").should("not.be.visible");
  });

  it("should update localStorage when toggling via mobile", () => {
    cy.reload();
    cy.get("#mobile-menu-btn").click();
    cy.get("#theme-toggle-mobile").click();
    cy.window()
      .its("localStorage")
      .invoke("getItem", "theme")
      .should("eq", "dark");
  });
});

describe("Dark Mode - Visual Contrast", () => {
  it("should have a light background in light mode", () => {
    cy.visit("/");
    cy.setLightMode();
    cy.reload();
    cy.get("body").should("have.css", "background-color", "rgb(255, 255, 255)");
  });

  it("should have a dark background in dark mode", () => {
    cy.visit("/");
    cy.setDarkMode();
    cy.reload();
    cy.get("body").then(($body) => {
      const bg = $body.css("background-color");
      // Parse RGB values and verify they're low (dark)
      const match = bg.match(/rgb\((\d+), (\d+), (\d+)\)/);
      expect(match).to.not.be.null;
      expect(parseInt(match[1])).to.be.lessThan(50);
      expect(parseInt(match[2])).to.be.lessThan(50);
      expect(parseInt(match[3])).to.be.lessThan(60);
    });
  });

  it("should change header background between modes", () => {
    cy.visit("/");
    cy.setLightMode();
    cy.reload();
    cy.get("header").then(($header) => {
      const lightBg = $header.css("background-color");

      cy.get("#theme-toggle").click();
      cy.get("header").then(($headerDark) => {
        const darkBg = $headerDark.css("background-color");
        expect(lightBg).to.not.equal(darkBg);
      });
    });
  });
});
