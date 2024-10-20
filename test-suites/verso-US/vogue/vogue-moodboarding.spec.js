/// <reference types="Cypress" />

import * as testHelper from "../../../helper/gallery/testHelper"
import * as brandHelper from "../../../helper/bundle/contentDataHelper";
import { brand } from "../../../test-data/brand-auth-data.json"

let workFlowData =
{
    "brand": "Vogue",
    "brandConfigData": {},
}

function testRunner(workFlowData) {
    before(function () {
        cy.clearCookies();
        cy.clearLocalStorage();
        brandHelper.getBrandConfig(workFlowData, 0).then((data) => {
            workFlowData.brandConfigData = data;
        })
    })

    context(`Vogue runway page image bookmarking validation...`, () => {

        it('Validate Image bookmarking', () => {
            testHelper.navigateGalleryPage(workFlowData.brand, 'runwayShow', 0);
            brand.vogue.body.state = "{\"redirectURL\":\"/fashion-shows/fall-2024-menswear/comme-des-garcons-homme-plus/slideshow/collection\"}"
            cy.getBrandsMagicLink(brand.vogue, "activearchive@vogue.com");
            cy.validateImageBookmarking(workFlowData, null, 'accountLink')
        })

        it('Validate Image Unbookmarking', () => {
            cy.validateUnSavingTheImage(workFlowData)
        })

        it('Logout of account', () => {      // Logout is placed here to make sure it happens even though there was unforeseen errors in previous blocks
            cy.accountLogOut();
        })

    })

    context(`Vogue Street Style image bookmarking validation...`, () => {

        it('Validate Sign In popup appears for unregistered users while saving image', () => {
            testHelper.navigateGalleryPage(workFlowData.brand, 'streetStyle', 0);
            cy.validateSigninPopupBeforeBookMarking(workFlowData, 'streetStyle');
        })

        it('Validate Image bookmarking', () => {
            brand.vogue.body.state = "{\"redirectURL\":\"/slideshow/our-best-street-style-from-paris-fall-2024-mens-shows\"}"
            cy.getBrandsMagicLink(brand.vogue, "activearchive@vogue.com");
            cy.validateImageBookmarking(workFlowData, "streetStyle", 'accountLinks')
        })

        it('Validate Image Unbookmarking', () => {
            cy.validateUnSavingTheImage(workFlowData)
        })

        it('Logout of account', () => {      // Logout is placed here to make sure it happens even though there was unforeseen errors in previous blocks
            cy.accountLogOut();
        })

    })
}

testRunner(workFlowData);
