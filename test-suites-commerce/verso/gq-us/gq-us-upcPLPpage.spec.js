/// <reference types="Cypress" />

import * as testHelper from "../../../helper/article/testHelper";
const { selectors } = require("../../../selectors/verso/selectors");
let gq_PLP_Product_Query = require("../../../test-data/verso/plpProductGraphqlQuery");
let testData = require("../../../test-data/verso/url.json");
let retailerUri = [];
let sellerName = [];
let productId = [];
let productName = [];
let totalProducts = 0;
function testRunner() {
  context(`Fetching the data needed for the test...`, () => {
    before(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      // Getting retailerUri, sellerName, productId, productName, totalproducts data from the graphql
      const orgId = testData.production["gq-us"].orgId;
      const uri_Plp = testData.production["upc-gq-us"].uri_Plp;
      gq_PLP_Product_Query.plpUpcProductQuery.variables.uri = uri_Plp;
      gq_PLP_Product_Query.plpUpcProductQuery.variables.organizationId = orgId;
      return testHelper
        .getPLPUpcInfo(gq_PLP_Product_Query.plpUpcProductQuery)
        .then((data) => {
          [productName, retailerUri, sellerName, productId, totalProducts] = data;
        });
    });
    after(function () {
      cy.clearCookies();
      cy.clearLocalStorage();
    });
    // To run the below test cases for random five product data from the graphql
    describe(
      `UPC PLP page test - Brand: GQ`,
      {
        retries: {
          runMode: 1,
        },
      },
      () => {
        for (let i = 0; i <= 4; i++) {
          // Test case:1(PLP) , Click on the Shop-at-Retailer-name and verify it redirects correctly to the retailer page or not.
          // Step: 1. Redirects to Staging or production article page. eg, https://www.gq.com/100-under-100-menswear-shop
          // Step: 2. Click on the Shop-at-Retailer-name and verify it redirects correctly to the retailer page or not.

          it("UPC - Click on the Shop-at-Retailer-name and verify it redirects correctly", () => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.visit(testData.production["upc-gq-us"].plpProdUrl).wait(3000);
            let randomNumber = testHelper.getRandomNumber(1,totalProducts - 1);
            if (cy.url() !== "chrome-error://chromewebdata/") {
              cy.reload(true);
            }
            if (productName[i] !== undefined) {
              cy.get(selectors.upc["plp_upc_retailerName"]).invoke(
                "removeAttr",
                "target"
              );
              cy.get(selectors.upc["plp_upc_retailerSpan"])
                .contains(sellerName[randomNumber])
                .click({ force: true })
                .wait(3000);
            }
            let splitUrl = retailerUri[randomNumber].split("/");
            let validateUrl = splitUrl[2].split(".");
            if (cy.url() !== "chrome-error://chromewebdata/") {
              cy.url().should("contains", validateUrl[1]);
            } else {
              cy.reload(true);
              cy.wait(2000);
              cy.url().should("contains", validateUrl[1]);
            }
          });
        }
      }
    );

    describe(
      `Unified product card changes test - Product image - Brand: GQ`,
      {
        retries: {
          runMode: 1,
        },
      },
      () => {
        // Test case: 2(PLP), When click on Product image it should redirects to first retailer url in the list.
        // Step: 1. Redirects to Staging or production article page. eg,  https://www.gq.com/100-under-100-menswear-shop
        // Step: 2. Click on Product image.
        // Step: 3. Verify it redirects to the correct retailer url

        it("UPC - Click on the product image and verify it redirects correctly", () => {
          cy.clearCookies();
          cy.clearLocalStorage();
          let currentURL;
          cy.visit(testData.production["upc-gq-us"].plpProdUrl).wait(2000);
          if (cy.url() !== "chrome-error://chromewebdata/") {
            cy.reload(true);
          }
          cy.get(selectors.upc["plp_upc_anchor"])
            .last()
            .invoke("removeAttr", "target");
          cy.get(selectors.upc["plp_upc_picture"])
            .last()
            .click({ force: true });
          cy.wait(3000).then(() => {
            cy.url().then(url => {
              for(let element of retailerUri){
                let splitUrl = element.split("/");
                if (url.includes(splitUrl[2]))  {
                  cy.url().should("contains", splitUrl[2]);
                  break;
                }
                else {
                  continue;
                }
              }
            });
          });
        });

        // Test case: 3(PLP), Check the image aspect ratio as 3:4.
        // Step: 1. Redirects to Staging or production article page. eg,  https://www.gq.com/100-under-100-menswear-shop
        // Step: 2. Click on Product image.
        // Step: 3. Verify it width and height ratio should be 3:4

        it("UPC - Check image aspect ratio as 3:4", () => {
          cy.clearCookies();
          cy.clearLocalStorage();
          cy.visit(testData.production["upc-gq-us"].plpProdUrl).wait(2000);
          if (cy.url() !== "chrome-error://chromewebdata/") {
            cy.reload(true);
          }
          testHelper.validateImageAspectRatio(selectors.upc["plp_upc_picture"]);
        });
      }
    );
  });
}
testRunner();
