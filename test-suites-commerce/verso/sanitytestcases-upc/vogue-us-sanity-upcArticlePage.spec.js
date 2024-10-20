/// <reference types="Cypress" />

import * as testHelper from "../../../helper/article/testHelper";
const { selectors } = require("../../../selectors/verso/selectors");
let vogue_Article_Product_Query = require("../../../test-data/verso/articleProductGraphqlQuery");
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
      const orgId = testData.production["Vogue"].orgId;
      const uri_Article = testData.production["upc-vogue-us"].uri_Article;
      vogue_Article_Product_Query.articleProductQuery.variables.uri = uri_Article;
      vogue_Article_Product_Query.articleProductQuery.variables.organizationId = orgId;
      testHelper
        .getArticleUpcInfo(vogue_Article_Product_Query.articleProductQuery)
        .then((data) => {
          retailerUri = data[0];
          sellerName = data[1];
          productId = data[2];
          productName = data[3];
          totalProducts = data[4];
        });
      cy.visit(testData.production["upc-vogue-us"].articleProdUrl).wait(500);
    });
    after(function () {
      cy.clearCookies();
      cy.clearLocalStorage();
    });

    // To run the below test cases for product data from the graphql
    describe(
      `UPC Product page test - Brand: Vogue`,
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
            cy.visit(testData.production["upc-vogue-us"].articleProdUrl).wait(500);
            if (cy.url() == "chrome-error://chromewebdata/") {
              cy.reload(true);
            }
            sellerName.forEach((element) => {
              updatedsellerName.push(element.replace("&", "&amp;"));
            });
            cy.get('[data-offer-retailer="' + updatedsellerName[i] + '"]')
              .invoke("removeAttr", "target")
              .eq(0)
              .dblclick({ force: true })
              .wait(3000)
              .then(() => {
                let splitUrl = retailerUri[i].split("/");
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
      `Unified product card changes test - Brand: Vogue`,
      {
        retries: {
          runMode: 1,
        },
      },
      () => {
        // Test case:1(Sanity test case - Article) ,Check the reseller links presents for 50 products.
        // Step: 1. Redirects to production article page. eg, article/new-fashion-arrivals
        // Step: 2. Verify the retailer URL is present for 50 products as from the graphql.
        it("UPC - Product image should redirects to first retailer url in the list - Article Page", () => {
          cy.clearCookies();
          cy.clearLocalStorage();
          cy.visit(testData.production["upc-vogue-us"].articleProdUrl).wait(1000);
          for (let i = 0; i <= 49; i++) {
            cy.wait(500);
            cy.get('[data-offer-url="' + retailerUri[i] + '"]').should(
              "be.visible"
            );
          }
        });
      }
    );
  });
}
testRunner();
