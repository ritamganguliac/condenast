/// <reference types="Cypress" />

import * as testHelper from "../../../helper/gallery/testHelper"
import * as tagPageConfig from "../../../test-data/verso/tag/vogue-brand-config.json"
import { brand } from "../../../test-data/brand-auth-data.json"

let workFlowData =
{
    "page": "slideShow",
    "promptResult": "YOUR VOTE IS IN. CHECK BACK FOR RESULTS SOON.",
    "votingPercent": "% VOTED YES",
    "timesToValidate": 6,                     // no.of images with voting buttons to validate
    "favoriteLook": 1
}

function testRunner(workFlowData) {
    beforeEach(function () {
        cy.clearCookies();
        cy.clearLocalStorage();
    })

    context(`Favorite look page validation...`, () => {
        // validate Favorite look voting pages for all Vogue markets
        brand.email = "activearchive@vogue.com"
        for (let i = 0; i < tagPageConfig.favLook.length; i++) {
            it('Validate ' + tagPageConfig.favLook[i].brandname + ' favortie look voting page ', () => {
                testHelper.navigateGalleryPage(tagPageConfig.favLook[i].brandname, workFlowData.page, workFlowData.favoriteLook);
                cy.checkAndCollapsePaywall();
                testHelper.validateVoting(i, workFlowData);
                if (tagPageConfig.favLook[i].behindRegGate === 'yes') {
                    if (tagPageConfig.favLook[i].brandname === "Vogue") {
                        if (Cypress.env('environment') === 'production') {
                            brand.vogue.body.state = "{\"redirectURL\":\"/slideshow/10-best-dressed-stars-jessica-chastain-danai-gurira-alexa-chung\"}"
                            cy.getBrandsMagicLink(brand.vogue, brand.email);
                        }
                        else {
                            brand.vogueStag.body.state = "{\"redirectURL\":\"/slideshow/10-best-dressed-stars-jessica-chastain-danai-gurira-alexa-chung\"}"
                            cy.getBrandsMagicLink(brand.vogueStag, "activearchive@vogue.com");
                        }
                    }
                    if (tagPageConfig.favLook[i].brandname === "vogue-uk") {
                        if (Cypress.env('environment') === 'production') {
                            brand.vogueUK.body.state = "{\"redirectURL\":\"/fashion/gallery/gucci-best-red-carpet-looks\"}"
                            cy.getBrandsMagicLink(brand.vogueUK, brand.email);
                        }
                        else {
                            brand.vogueUKStag.body.state = "{\"redirectURL\":\"/fashion/gallery/met-gala-2022-red-carpet-arrivals-fashion\"}"
                            cy.getBrandsMagicLink(brand.vogueUKStag, "activearchive@vogue.com");
                        }
                    }
                    if (tagPageConfig.favLook[i].brandname === "vogue-germany") {
                        if (Cypress.env('environment') === 'production') {
                            brand.vogueGermany.body.state = "{\"redirectURL\":\"/mode/galerie/blumarine-x-hello-kitty-kollektion-must-haves\"}"
                            cy.getBrandsMagicLink(brand.vogueGermany, brand.email);
                        }
                        else {
                            brand.vogueGermanyStag.body.state = "{\"redirectURL\":\"/kultur/galerie/lv-dream-louis-vuitton-ausstellung-cafe-paris\"}"
                            cy.getBrandsMagicLink(brand.vogueGermanyStag, brand.email);
                        }
                    }
                    cy.voteGallery(workFlowData, i)
                }
                cy.verifyVotingResultsPersist(tagPageConfig.favLook[i].behindRegGate);
                if (tagPageConfig.favLook[i].behindRegGate === 'yes')
                    cy.accountLogOut();
            })
        }
    })
}
testRunner(workFlowData);
