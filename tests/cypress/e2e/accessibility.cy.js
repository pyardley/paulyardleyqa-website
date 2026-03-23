/// <reference types="cypress" />

const pages = [
  { name: "Homepage", path: "/" },
  { name: "About", path: "/about" },
  { name: "Skills", path: "/skills" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Blog", path: "/blog" },
  { name: "Resume", path: "/resume" },
  { name: "Contact", path: "/contact" },
];

describe("Accessibility - All Pages", () => {
  pages.forEach((page) => {
    describe(`${page.name} (${page.path})`, () => {
      beforeEach(() => {
        cy.visit(page.path);
      });

      it('should have lang="en" on the html element', () => {
        cy.get("html").should("have.attr", "lang", "en");
      });

      it("should have at most one h1 element", () => {
        cy.get("h1").should("have.length.at.most", 1);
      });

      it("should have a non-empty page title", () => {
        cy.title().should("not.be.empty");
      });

      it("should have a meta description", () => {
        cy.get('meta[name="description"]')
          .should("have.attr", "content")
          .and("have.length.greaterThan", 10);
      });
    });
  });
});

describe("Accessibility - Global Elements", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should have a skip-to-content link", () => {
    cy.get("a.skip-link")
      .should("exist")
      .and("have.attr", "href", "#main-content");
  });

  it("should have a main content landmark with correct id", () => {
    cy.get("main#main-content").should("exist");
  });

  it("should have an accessible navigation landmark", () => {
    cy.get('nav[aria-label="Main navigation"]').should("exist");
  });

  it("should have aria-label on the dark mode toggle", () => {
    cy.get("#theme-toggle")
      .should("have.attr", "aria-label")
      .and("match", /dark mode/i);
  });

  it("should have aria-expanded on the mobile menu button", () => {
    cy.get("#mobile-menu-btn")
      .should("have.attr", "aria-expanded")
      .and("match", /true|false/);
  });

  it("should have aria-label on the mobile menu button", () => {
    cy.get("#mobile-menu-btn")
      .should("have.attr", "aria-label")
      .and("match", /menu/i);
  });

  it("should have alt text on all images if any exist", () => {
    cy.get("body").then(($body) => {
      if ($body.find("img").length > 0) {
        cy.get("img").each(($img) => {
          cy.wrap($img).should("have.attr", "alt");
        });
      }
    });
  });

  it("should have noopener on all external links", () => {
    cy.get('a[target="_blank"]').each(($link) => {
      cy.wrap($link).should("have.attr", "rel").and("include", "noopener");
    });
  });
});

describe("Accessibility - Heading Hierarchy", () => {
  it("should have proper heading hierarchy on the resume page", () => {
    cy.visit("/resume");
    cy.get("h1, h2, h3, h4, h5, h6").then(($headings) => {
      const levels = [];
      $headings.each((_, el) => {
        levels.push(parseInt(el.tagName.replace("H", "")));
      });

      // First heading should be h1
      expect(levels[0]).to.equal(1);

      // No heading should skip more than 1 level
      for (let i = 1; i < levels.length; i++) {
        const jump = levels[i] - levels[i - 1];
        expect(
          jump,
          `Heading jump from h${levels[i - 1]} to h${levels[i]}`,
        ).to.be.at.most(1);
      }
    });
  });
});

describe("Responsive Design", () => {
  const viewports = [
    { name: "Mobile", width: 375, height: 667 },
    { name: "Tablet", width: 768, height: 1024 },
    { name: "Desktop", width: 1280, height: 720 },
  ];

  viewports.forEach((vp) => {
    describe(`${vp.name} (${vp.width}x${vp.height})`, () => {
      beforeEach(() => {
        cy.viewport(vp.width, vp.height);
        cy.visit("/");
      });

      it("should not have horizontal scrollbar", () => {
        cy.document().then((doc) => {
          expect(doc.body.scrollWidth).to.be.at.most(vp.width + 1);
        });
      });

      it("should display the header", () => {
        cy.get("header").should("be.visible");
      });

      it("should display the footer", () => {
        cy.get("footer").should("exist");
      });
    });
  });

  it("should show mobile menu button on mobile only", () => {
    cy.viewport(375, 667);
    cy.visit("/");
    cy.get("#mobile-menu-btn").should("be.visible");

    cy.viewport(1280, 720);
    cy.get("#mobile-menu-btn").should("not.be.visible");
  });

  it("should show desktop nav on desktop only", () => {
    cy.viewport(1280, 720);
    cy.visit("/");
    cy.get("nav .hidden.md\\:flex").should("be.visible");

    cy.viewport(375, 667);
    cy.get("nav .hidden.md\\:flex").should("not.be.visible");
  });
});
