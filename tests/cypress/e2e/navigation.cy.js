/// <reference types="cypress" />

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
];

describe("Desktop Navigation", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit("/");
  });

  it("should display the site logo linking to home", () => {
    cy.get("nav")
      .find('a[href="/"]')
      .first()
      .should("be.visible")
      .and("contain.text", "Paul Yardley");
  });

  it("should display all navigation links in the desktop nav", () => {
    const desktopNav = cy.get("nav .hidden.md\\:flex");
    navItems.forEach((item) => {
      desktopNav
        .find(`a[href="${item.href}"]`)
        .should("be.visible")
        .and("have.text", item.label);
    });
  });

  it("should navigate to each page when clicking nav links", () => {
    navItems.forEach((item) => {
      cy.visit("/");
      cy.get("nav .hidden.md\\:flex").find(`a[href="${item.href}"]`).click();
      cy.url().should("match", new RegExp(`${item.href}\\/?$`));
    });
  });

  it("should highlight the active page with teal styling", () => {
    cy.visit("/about");
    cy.get("nav .hidden.md\\:flex")
      .find('a[href="/about"]')
      .should("have.class", "text-teal");
  });

  it("should not highlight inactive pages", () => {
    cy.visit("/about");
    cy.get("nav .hidden.md\\:flex")
      .find('a[href="/skills"]')
      .should("not.have.class", "text-teal");
  });

  it("should have a sticky header", () => {
    cy.get("header").should("have.class", "sticky");
  });
});

describe("Mobile Navigation", () => {
  beforeEach(() => {
    cy.viewport(375, 667);
    cy.visit("/");
  });

  it("should show hamburger menu button on mobile", () => {
    cy.get("#mobile-menu-btn").should("be.visible");
  });

  it("should hide desktop navigation on mobile", () => {
    cy.get("nav .hidden.md\\:flex").should("not.be.visible");
  });

  it("should open mobile menu when hamburger is clicked", () => {
    cy.get("#mobile-menu").should("not.be.visible");
    cy.get("#mobile-menu-btn").click();
    cy.get("#mobile-menu").should("be.visible");
    cy.get("#mobile-menu-btn").should("have.attr", "aria-expanded", "true");
  });

  it("should close mobile menu when hamburger is clicked again", () => {
    cy.get("#mobile-menu-btn").click();
    cy.get("#mobile-menu").should("be.visible");
    cy.get("#mobile-menu-btn").click();
    cy.get("#mobile-menu").should("not.be.visible");
    cy.get("#mobile-menu-btn").should("have.attr", "aria-expanded", "false");
  });

  it("should display all navigation links in the mobile menu", () => {
    cy.get("#mobile-menu-btn").click();
    navItems.forEach((item) => {
      cy.get("#mobile-menu")
        .find(`a[href="${item.href}"]`)
        .should("be.visible");
    });
  });

  it("should navigate to a page when a mobile menu link is clicked", () => {
    cy.get("#mobile-menu-btn").click();
    cy.get("#mobile-menu").find('a[href="/about"]').click();
    cy.url().should("match", /\/about\/?$/);
  });

  it("should display dark mode toggle in mobile menu", () => {
    cy.get("#mobile-menu-btn").click();
    cy.get("#theme-toggle-mobile").should("be.visible");
  });
});
