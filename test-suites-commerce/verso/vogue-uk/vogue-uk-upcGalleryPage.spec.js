/// <reference types="Cypress" />

import * as testHelper from "../../../helper/article/testHelper";
const { selectors } = require("../../../selectors/verso/selectors");
let vogue_Gallery_Product_Query = require("../../../test-data/verso/galleryProductGraphqlQuery");
let testData = require("../../../test-data/verso/url.json");
let retailerUri = [];
let sellerName = [];
let productId = [];
let productName = [];
let totalProducts = 0;

function testRunner() {
  context(`Fetching the data needed for the test...`, () => {
    before(function () {
      cy.clearCookies();
      cy.clearLocalStorage();

      // Getting retailerUri, sellerName, productId, productName data from the graphql
      const orgId = testData.production["vogue-uk"].orgId;
      const uri_Gallery = testData.production["upc-vogue-uk"].uri_Gallery;
      vogue_Gallery_Product_Query.galleryUpcProductQuery.variables.uri = uri_Gallery;
      vogue_Gallery_Product_Query.galleryUpcProductQuery.variables.organizationId = orgId;
      testHelper
        .getGalleryUpcInfo(vogue_Gallery_Product_Query.galleryUpcProductQuery)
        .then((data) => {
          retailerUri = data[0];
          sellerName = data[1];
          productId = data[2];
          productName = data[3];
          totalProducts = data[4];
        });
    });
    after(function () {
      cy.clearCookies();
      cy.clearLocalStorage();
    });

    describe(
      `UPC Gallery Product page test - Brand: Vogue`,
      {
        retries: {
          runMode: 1,
        },
      },
      () => {
        // To run the below test cases for random five product data from the graphql
        for (let i = 0; i <= 4; i++) {
          // Test case:1(Gallery) , Click on the Price and retailer name button which has cna links and verify it redirects to the correct retailer page or not.
          // Step: 1. Redirects to Staging or production gallery page. eg, slideshow/best-lug-sole-boots
          // Step: 2. Verify the sellername which we got from graphql in the UI page,
          // Step: 3. Verify the  Price and retailer name button which has cna links. When click on the Button, it should redirects to particular
          //          retailer URL. Verify the same.
          it("UPC - Click on the Price and retailer name button and verify it redirects correctly", () => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.visit(testData.production["upc-vogue-uk"].galleryProdUrl).wait(2000);
            cy.scrollTo("bottom");
            cy.scrollTo(0, 10000);
            if (cy.url() == "chrome-error://chromewebdata/") {
              cy.reload(true).wait(2000);
              cy.scrollTo("bottom");
              cy.scrollTo(0, 10000);
            }
            if (retailerUri[i] !== undefined) {
              let randomNumber = testHelper.getRandomNumber(2, 12);
              cy.get('[data-offer-retailer="' + sellerName[randomNumber] + '"]')
                .eq(0)
                .invoke("removeAttr", "target")
                .eq(0)
                .click({ force: true })
                .wait(2000)
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
    describe(`Unified product card changes test - Product image - Brand: Vogue`,
      {
        retries: {
          runMode: 1,
        },
      },
      () => {
        // Test case:2(Gallery) , Click on Product name and it should not redirects.
        // Step: 1. Redirects to Staging or production gallery page. eg, slideshow/best-lug-sole-boots
        // Step: 2. Verify whether Product name should not be clickable.

        it("UPC - Click on Product name and verify it should not redirects - Gallery Page", () => {
          cy.clearCookies();
          cy.clearLocalStorage();
          cy.visit(testData.production["upc-vogue-uk"].galleryProdUrl);
          cy.wait(2000);
          let randomNumber = testHelper.getRandomNumber(1, productId.length - 1);
          cy.get(selectors.upc["article_Product_selections"]+productId[randomNumber]).click({ force: true });
          cy.url().should(
            "contains",
            testData.production["upc-vogue-uk"].galleryProdUrl
          );
        });

        // Test case: 3(Gallery), When click on Product image it should redirects to first retailer url in the list.
        // Step: 1. Redirects to Staging or production article page. eg, article/new-fashion-arrivals
        // Step: 2. Click on Product image which has more than one retailer url.
        // Step: 3. Verify it redirects to the first retailer url.

        it("UPC - Click on the product image and verify it redirects correctly", () => {
          cy.clearCookies();
          cy.clearLocalStorage();
          cy.visit(testData.production["upc-vogue-uk"].galleryProdUrl).wait(1000);
          cy.get(selectors.upc["gallery_UPC_anchor"])
            .first()
            .invoke("removeAttr", "target");
          cy.get(selectors.upc["gallery_UPC_image"])
            .first()
            .click({ force: true });
          cy.wait(3000).then(() => {
            let splitUrl =
              testData.production["upc-vogue-uk"].firstRetailerGallery.split("/");
            cy.url().should("contains", splitUrl[2]);
          });
        });

        // Test case: 4(Gallery), Check the image aspect ratio as 3:4.
        // Step: 1. Redirects to Staging or production article page. eg, article/new-fashion-arrivals
        // Step: 2. Click on Product image.
        // Step: 3. Verify it width and height ratio should be 3:4

        it("UPC - Check image aspect ratio as 3:4", () => {
          cy.clearCookies();
          cy.clearLocalStorage();
          cy.visit(testData.production["upc-vogue-uk"].galleryProdUrl).wait(500);
          testHelper.validateImageAspectRatio(selectors.upc["gallery_UPC_picture"]);
        });
      }
    );
  });
}
testRunner();
