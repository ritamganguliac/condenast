//Ad - Admin - Google sign test cases
describe("Ad-Admin ", () => {
  before(() => {
    cy.exec("npm install --save-dev gmail-tester", {
      failOnNonZeroExit: false,
    });
  });
  let loginURL;
  it("SignIn via gmail", () => {
    cy.visit("https://id.condenast.com/");
    cy.wait(3000);
    cy.clearCookies();
    cy.get(
      '[src="/static/architectural-digest/assets/logo-landing.svg"]'
    ).click();
    cy.wait(3000);
    cy.get("#TextField-id-email").type("condenastautotest1@gmail.com");
    cy.wait(5000);
    cy.get('[type="submit"]').click();
    cy.wait(2000);
    cy.get('[type="submit"]').click();
    cy.wait(5000);
  });

  it("Using gmail_tester.get_messages(), look for an email with specific subject and link in email body", function () {
    cy.task("gmail:get-messages", {
      options: {
        from: "help@condenast.com",
        subject: "Finish signing in",
        include_body: true,
      },
    }).then((emails) => {
      assert.isAtLeast(
        emails.length,
        1,
        "Expected to find at least one email, but none were found!"
      );
      const body = emails[0].body.html;
      assert.isTrue(
        body.indexOf("https://link.condenast.com/click") >= 0,
        "Found reset link!"
      );
      const links = body.split('a href="');
      const adlink = links[2].split('" target=');
      cy.visit(adlink[0]);
      cy.wait(10000);
      loginURL = adlink[0];
    });
  });

  it("MyAccount", () => {
    cy.wait(3000);
    cy.contains("My Account").click({ force: true })
    cy.wait(500);
    cy.contains("Sign Out");
  });
});
