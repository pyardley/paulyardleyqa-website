/// <reference types="cypress" />

describe("Homepage", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load with correct title", () => {
    cy.title().should("contain", "Paul Yardley");
  });

  it("should display the hero section with name", () => {
    cy.contains("Paul Yardley").should("be.visible");
  });

  it("should have a meta description", () => {
    cy.get('meta[name="description"]')
      .should("have.attr", "content")
      .and("not.be.empty");
  });

  it("should have Open Graph meta tags", () => {
    cy.get('meta[property="og:title"]').should("have.attr", "content");
    cy.get('meta[property="og:description"]').should("have.attr", "content");
    cy.get('meta[property="og:type"]').should(
      "have.attr",
      "content",
      "website",
    );
  });

  it("should have Twitter card meta tags", () => {
    cy.get('meta[name="twitter:card"]').should("have.attr", "content");
    cy.get('meta[name="twitter:title"]').should("have.attr", "content");
  });

  it("should have a canonical URL", () => {
    cy.get('link[rel="canonical"]').should("have.attr", "href");
  });

  it("should display call-to-action buttons", () => {
    cy.get('a[href="/contact"]').should("exist");
    cy.get('a[href="/portfolio"]').should("exist");
  });
});

describe("About Page", () => {
  beforeEach(() => {
    cy.visit("/about");
  });

  it("should load with correct title", () => {
    cy.title().should("contain", "About");
  });

  it("should display the page heading", () => {
    cy.get("h1").should("be.visible").and("contain.text", "About");
  });

  it("should contain professional background information", () => {
    cy.contains("QA").should("exist");
    cy.contains("testing").should("exist");
  });

  it("should have a LinkedIn link", () => {
    cy.get('a[href*="linkedin.com"]')
      .should("have.attr", "target", "_blank")
      .and("have.attr", "rel")
      .and("contain", "noopener");
  });
});

describe("Skills Page", () => {
  beforeEach(() => {
    cy.visit("/skills");
  });

  it("should load with correct title", () => {
    cy.title().should("contain", "Skills");
  });

  it("should display skills heading", () => {
    cy.get("h2").first().should("contain.text", "Skills");
  });

  it("should display skill categories", () => {
    cy.contains("Test Automation").should("be.visible");
    cy.contains("Languages").should("be.visible");
  });

  it("should display individual skills with proficiency levels", () => {
    cy.contains("Playwright").should("be.visible");
    cy.contains("SQL").should("be.visible");
  });

  it("should display proficiency level labels", () => {
    cy.contains("Proficient").should("exist");
  });
});

describe("Portfolio Page", () => {
  beforeEach(() => {
    cy.visit("/portfolio");
  });

  it("should load with correct title", () => {
    cy.title().should("contain", "Portfolio");
  });

  it("should display the page heading", () => {
    cy.get("h1").should("be.visible").and("contain.text", "Portfolio");
  });

  it("should display portfolio description", () => {
    cy.contains("case studies").should("be.visible");
  });
});

describe("Blog Page", () => {
  beforeEach(() => {
    cy.visit("/blog");
  });

  it("should load with correct title", () => {
    cy.title().should("contain", "Blog");
  });

  it("should display the page heading", () => {
    cy.get("h1").should("be.visible").and("contain.text", "Blog");
  });
});

describe("Resume Page", () => {
  beforeEach(() => {
    cy.visit("/resume");
  });

  it("should load with correct title", () => {
    cy.title().should("contain", "Resume");
  });

  it("should display the page heading", () => {
    cy.get("h1").should("be.visible").and("contain.text", "Resume");
  });

  it("should have a downloadable PDF link", () => {
    cy.get("a[download]")
      .should("be.visible")
      .and("have.attr", "href")
      .and("match", /\.pdf$/);
  });

  it("should display Professional Profile section", () => {
    cy.contains("Professional Profile").should("be.visible");
  });

  it("should display Technical Skills section", () => {
    cy.contains("Technical Skills").should("be.visible");
  });

  it("should display skill categories", () => {
    cy.contains("Operating Systems").should("be.visible");
    cy.contains("Databases").should("be.visible");
    cy.contains("Programming & Scripting").should("be.visible");
    cy.contains("Testing Tools").should("be.visible");
  });

  it("should display work experience", () => {
    cy.contains("Senior Test Analyst").should("be.visible");
    cy.contains("Bet365").should("be.visible");
  });

  it("should display education section", () => {
    cy.contains("Education").should("be.visible");
  });
});

describe("Contact Page", () => {
  beforeEach(() => {
    cy.visit("/contact");
  });

  it("should load with correct title", () => {
    cy.title().should("contain", "Contact");
  });

  it("should display the page heading", () => {
    cy.get("h1").should("be.visible").and("contain.text", "Get In Touch");
  });
});
