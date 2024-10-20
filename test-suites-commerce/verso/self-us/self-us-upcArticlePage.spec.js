/// <reference types="Cypress" />

import * as testHelper from "../../../helper/article/testHelper";
const { selectors } = require("../../../selectors/verso/selectors");
let self_Article_Product_Query = require("../../../test-data/verso/articleProductGraphqlQuery");
let testData = require("../../../test-data/verso/url.json");
let retailerUri = [];
let sellerName = [];
let productId = [];
let productName = [];
let totalProducts = 0;
let updatedsellerName = [];
function testRunner() {
  context(`Fetching the data needed for the test...`, () => {
    before(function () {
      cy.clearCookies();
      cy.clearLocalStorage();
      // Getting retailerUri, sellerName, productId, productName data from the graphql
      const orgId = testData.production["Self"].orgId;
      const uri_Article = testData.production["upc-self-us"].uri_Article;
      self_Article_Product_Query.articleProductQuery.variables.uri = uri_Article;
      self_Article_Product_Query.articleProductQuery.variables.organizationId = orgId;
      testHelper
        .getArticleUpcInfo(self_Article_Product_Query.articleProductQuery)
        .then((data) => {
          retailerUri = data[0];
          sellerName = data[1];
          productId = data[2];
          productName = data[3];
          totalProducts = data[4];
        });
      cy.visit(testData.production["upc-self-us"].articleProdUrl).wait(500);
    });
    after(function () {
      cy.clearCookies();
      cy.clearLocalStorage();
    });

    // To run the below test cases for random five product data from the graphql
    describe(
      `UPC Product page test - Brand: Self`,
      {
        retries: {
          runMode: 1,
        },
      },
      () => {
        for (let i = 0; i <= 4; i++) {
          // Test case:1(Article) , Click on the Price and retailer name button which has cna links and verify it redirects to the correct retailer page or not.
          // Step: 1. Redirects to Staging or production article page. eg, article/new-fashion-arrivals
          // Step: 2. Verify the sellername which we got from graphql in the UI page,
          // Step: 3. Verify the Price and retailer name button which has cna links. When click on the Button, it should redirects to particular
          //          retailer URL. Verify the same.

          it("UPC - Click on the Price and retailer name button and verify it redirects correctly", () => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.visit(testData.production["upc-self-us"].articleProdUrl).wait(500);
            if (cy.url() !== "chrome-error://chromewebdata/") {
              cy.reload(true);
            }
            let randomNumber = testHelper.getRandomNumber(1, totalProducts - 1);
            sellerName.forEach((element) => {
              element.replace(/\s+$/,"");
              updatedsellerName.push(element.replace("'", "&#39;"));
            });
            if (retailerUri[randomNumber] !== undefined) {
              cy.get('[data-offer-retailer="' + updatedsellerName[randomNumber] + '"]')
                .invoke("removeAttr", "target")
                .eq(0)
                .click({ force: true })
                .wait(3000)
                .then(() => {
                  let splitUrl = retailerUri[randomNumber].split("/");
                  let validateUrl = splitUrl[2].split(".");
                  if (splitUrl[2] == "click.linksynergy.com") {
                    validateUrl = "www.saksfifthavenue.com";
                  }
                  // Rare case, for page redirection chrome displays this chrome-error page. So handling it here.
                  if (cy.url() !== "chrome-error://chromewebdata/") {
                    cy.url().should("contains", validateUrl[1]);
                  }
                });
            }
          });
        }
      }
    );

    describe(`Unified product card changes test - Brand: Self`,
      {
        retries: {
          runMode: 1,
        },
      },
      () => {
        // Test case:2(Article) , Click on Product name it should not redirects.
        // Step: 1. Redirects to Staging or production article page. eg, article/new-fashion-arrivals
        // Step: 2. Verify whether Product name is not clickable.

        it("UPC - Click on Product name it should not redirects - Article Page", () => {
          cy.clearCookies();
          cy.clearLocalStorage();
          cy.visit(testData.production["upc-self-us"].articleProdUrl);
          cy.wait(2000);
          let randomNumber = testHelper.getRandomNumber(1, productId.length - 1);
          cy.get(selectors.upc["article_Product_selections"]+productId[randomNumber]).click({ force: true });
          cy.url().should("contains",testData.production["upc-self-us"].articleProdUrl);
        });

        // Test case: 3(Article), When click on Product image it should redirects to first retailer url in the list.
        // Step: 1. Redirects to Staging or production article page. eg, article/new-fashion-arrivals
        // Step: 2. Click on Product image which has more than one retailer url.
        // Step: 3. Verify it redirects to the first retailer url.

        it("UPC - Product image should redirects to first retailer url in the list - Article Page", () => {
          cy.clearCookies();
          cy.clearLocalStorage();
          cy.visit(testData.production["upc-self-us"].articleProdUrl).wait(1000);
          cy.get(selectors.upc["gallery_UPC_anchor"])
            .first()
            .invoke("removeAttr", "target");
          cy.get(selectors.upc["gallery_UPC_image"])
            .first()
            .click({ force: true });
          cy.wait(3000).then(() => {
            let splitUrl = testData.production["upc-self-us"].firstRetailerArticle.split("/");
            cy.url().should("contains", splitUrl[2]);
          });
        });
        // Test case: 4(Article), Check the image aspect ratio as 3:4.
        // Step: 1. Redirects to Staging or production article page. eg, article/new-fashion-arrivals
        // Step: 2. Click on Product image.
        // Step: 3. Verify it width and height ratio should be 3:4

        it("UPC - Check image aspect ratio as 3:4", () => {
          cy.clearCookies();
          cy.clearLocalStorage();
          cy.visit(testData.production["upc-self-us"].articleProdUrl).wait(500);
          testHelper.validateImageAspectRatio(selectors.upc["article_UPC_Picture"]);
        });
      }
    );
  });
}
testRunner();
