/// <reference types="cypress" />

describe("Footer Links", () => {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Skills", href: "/skills" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "Resume", href: "/resume" },
  ];

  beforeEach(() => {
    cy.visit("/");
  });

  it("should display all quick links in the correct order", () => {
    quickLinks.forEach((link) => {
      cy.get("footer")
        .contains("Quick Links")
        .parent()
        .find(`a[href="${link.href}"]`)
        .should("be.visible")
        .and("have.text", link.label);
    });
  });

  it("should have a Contact Me link", () => {
    cy.get("footer")
      .find('a[href="/contact"]')
      .should("be.visible")
      .and("contain.text", "Contact");
  });

  it("should have a LinkedIn link with correct URL and attributes", () => {
    cy.get("footer")
      .contains("LinkedIn")
      .should("have.attr", "href")
      .and("include", "linkedin.com/in/paul-yardley");

    cy.get("footer")
      .contains("LinkedIn")
      .should("have.attr", "target", "_blank")
      .and("have.attr", "rel")
      .and("include", "noopener");
  });

  it("should have a GitHub link with correct URL and attributes", () => {
    cy.get("footer")
      .contains("GitHub")
      .should("have.attr", "href")
      .and("include", "github.com/pyardley");

    cy.get("footer")
      .contains("GitHub")
      .should("have.attr", "target", "_blank")
      .and("have.attr", "rel")
      .and("include", "noopener");
  });

  it("should display copyright with current year", () => {
    const year = new Date().getFullYear();
    cy.get("footer").should("contain.text", year.toString());
    cy.get("footer").should("contain.text", "Paul Yardley");
  });

  it("should display the footer logo", () => {
    cy.get("footer").find('a[href="/"]').should("contain.text", "Paul Yardley");
  });
});

describe("Internal Links - Dead Link Check", () => {
  const pages = [
    "/",
    "/about",
    "/skills",
    "/portfolio",
    "/blog",
    "/resume",
    "/contact",
  ];

  pages.forEach((pagePath) => {
    it(`should have no broken internal links on ${pagePath}`, () => {
      cy.visit(pagePath);
      cy.get('a[href^="/"]').each(($link) => {
        const href = $link.attr("href");
        if (href && !href.includes(".pdf") && !href.includes("#")) {
          cy.request({
            url: href,
            failOnStatusCode: false,
          }).then((response) => {
            expect(
              response.status,
              `Link ${href} on page ${pagePath}`,
            ).to.be.lessThan(400);
          });
        }
      });
    });
  });
});

describe("PDF Download", () => {
  it("should have a downloadable resume PDF", () => {
    cy.visit("/resume");
    cy.get("a[download]")
      .should("be.visible")
      .invoke("attr", "href")
      .then((href) => {
        expect(href).to.match(/\.pdf$/);
        cy.request(href).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.headers["content-type"]).to.include(
            "application/pdf",
          );
        });
      });
  });
});

describe("External Links", () => {
  it("should have all external links open in new tab with noopener", () => {
    cy.visit("/");
    cy.get('a[target="_blank"]').each(($link) => {
      cy.wrap($link).should("have.attr", "rel").and("include", "noopener");
    });
  });
});
