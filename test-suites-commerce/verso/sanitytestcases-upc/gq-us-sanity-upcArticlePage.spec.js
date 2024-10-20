/// <reference types="Cypress" />

import * as testHelper from "../../../helper/article/testHelper";
const { selectors } = require("../../../selectors/verso/selectors");
let gq_Article_Product_Query = require("../../../test-data/verso/articleProductGraphqlQuery");
let testData = require("../../../test-data/verso/url.json");
let retailerUri = [];
let sellerName = [];
let productId = [];
let productName = [];
let totalProducts = 0;
let retailerUri_withoutUndefined = [];
let sellerName_withoutUndefined = [];

function testRunner() {
  context(`Fetching the data needed for the test...`, () => {
    before(function () {
      cy.clearCookies();
      cy.clearLocalStorage();
      // Getting retailerUri, sellerName, productId, productName data from the graphql
      const orgId = testData.production["gq-us"].orgId;
      const uri_Article = testData.production["upc-gq-us"].uri_Article;
      gq_Article_Product_Query.articleProductQuery.variables.uri = uri_Article;
      gq_Article_Product_Query.articleProductQuery.variables.organizationId = orgId;
      testHelper
        .getArticleUpcInfo(gq_Article_Product_Query.articleProductQuery)
        .then((data) => {
          retailerUri = data[0];
          sellerName = data[1];
          productId = data[2];
          productName = data[3];
          totalProducts = data[4];
        });
      cy.visit(testData.production["upc-gq-us"].articleProdUrl).wait(500);
    });
    after(function () {
      cy.clearCookies();
      cy.clearLocalStorage();
    });

    // To run the below test cases for random five product data from the graphql
    describe(
      `UPC Product page test - Brand: GQ`,
      {
        retries: {
          runMode: 1,
        },
      },
      () => {
        //Checking product page redirection for first 3 products.
        for (let i = 0; i <= 2; i++) {
          // Test case:1(Sanity test case - Article), Check wether all the seller link for the same product is working correctly.
          // Step: 1. Redirects to production article page. eg, article/new-fashion-arrivals
          // Step: 2. Verify the Price and retailer name button which has cna links. When click on the Button, it should redirects to particular
          //          retailer URL. Verify the same for all the sellers for thes same product.

          it("UPC - Click on the Price and retailer name button and verify it redirects correctly", () => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.visit(testData.production["upc-gq-us"].articleProdUrl).wait(500);
            retailerUri.forEach((element) => {
              if (element !== undefined) {
                retailerUri_withoutUndefined.push(element);
              }
            });
            sellerName.forEach((element) => {
              if (element !== undefined) {
                sellerName_withoutUndefined.push(element);
              }
            });
            if (cy.url() !== "chrome-error://chromewebdata/") {
              cy.reload(true);
            }
            cy.get(
              '[data-offer-retailer="' + sellerName_withoutUndefined[i] + '"]'
            ).contains(sellerName_withoutUndefined[i]);
            cy.get(
              '[data-offer-retailer="' + sellerName_withoutUndefined[i] + '"]')
              .invoke("removeAttr", "target")
              .eq(0)
              .click({ force: true })
              .wait(3000)
              .then(() => {
                let splitUrl = retailerUri_withoutUndefined[i].split("/");
                let validateUrl = splitUrl[2].split(".");
                // Rare case, for page redirection chrome displays this chrome-error page. So handling it here.
                if (cy.url() !== "chrome-error://chromewebdata/") {
                  cy.url().should("contains", validateUrl[1]);
                }
              });
          });
        }
      }
    );

    describe(
      `Unified product card changes test - Brand: GQ`,
      {
        retries: {
          runMode: 1,
        },
      },
      () => {
        // Test case:1(Sanity test case - Article) ,Check the reseller links presents for 50 products.
        // Step: 1. Redirects to production article page. eg, article/new-fashion-arrivals
        // Step: 2. Verify the retailer URL is present for 14 products as from the graphql.
        it("UPC - Product image should redirects to first retailer url in the list - Article Page", () => {
          cy.clearCookies();
          cy.clearLocalStorage();
          cy.visit(testData.production["upc-gq-us"].articleProdUrl).wait(1000);
          for (let i = 0; i <= 15; i++) {
            cy.wait(500);
            cy.get(
              '[data-offer-url="' + retailerUri_withoutUndefined[i] + '"]'
            ).should("be.visible");
          }
        });
      }
    );
  });
}
testRunner();
