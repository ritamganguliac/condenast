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
    "onTheme": 0,
}

function testRunner(workFlowData) {
    beforeEach(function () {
        cy.clearCookies();
        cy.clearLocalStorage();
    })

    context(`On Theme page validation...`, () => {
        // validate On Theme voting pages for all Vogue markets
        brand.email = "activearchive@vogue.com"
        for (let i = 0; i < tagPageConfig.onTheme.length; i++) {
            it('Validate ' + tagPageConfig.onTheme[i].brandname + ' on theme voting page ', () => {
                testHelper.navigateGalleryPage(tagPageConfig.onTheme[i].brandname, workFlowData.page, workFlowData.onTheme);
                cy.checkAndCollapsePaywall();
                testHelper.validateVoting(i, workFlowData, "onTheme");
                if (tagPageConfig.favLook[i].behindRegGate === 'yes') {
                    if (tagPageConfig.favLook[i].brandname === "Vogue") {
                        if (Cypress.env('environment') === 'production') {
                            brand.vogue.body.state = "{\"redirectURL\":\"/slideshow/met-gala-2022-red-carpet-live-celebrity-fashion\"}"
                            cy.getBrandsMagicLink(brand.vogue, "activearchive@vogue.com");
                        }
                        else {
                            brand.vogueStag.body.state = "{\"redirectURL\":\"/slideshow/met-gala-2022-red-carpet-live-celebrity-fashion\"}"
                            cy.getBrandsMagicLink(brand.vogueStag, "activearchive@vogue.com");
                        }
                    }
                    if (tagPageConfig.favLook[i].brandname === "vogue-uk") {
                        if (Cypress.env('environment') === 'production') {
                            brand.vogueUK.body.state = "{\"redirectURL\":\"/fashion/gallery/inside-fashion-awards-2021\"}"
                            cy.getBrandsMagicLink(brand.vogueUK, "activearchive@vogue.com");
                        }
                        else {
                            brand.vogueUKStag.body.state = "{\"redirectURL\":\"/fashion/gallery/celebrity-apres-ski-style\"}"
                            cy.getBrandsMagicLink(brand.vogueUKStag, "activearchive@vogue.com");
                        }
                    }
                    if (tagPageConfig.favLook[i].brandname === "vogue-germany") {
                        if (Cypress.env('environment') === 'production') {
                            brand.vogueGermany.body.state = "{\"redirectURL\":\"/mode/galerie/lady-gaga-outfits-house-of-gucci-set-ikonische-fashion-momente\"}"
                            cy.getBrandsMagicLink(brand.vogueGermany, brand.email);
                        }
                        else {
                            brand.vogueGermanyStag.body.state = "{\"redirectURL\":\"/mode/galerie/herzogin-kate-outfit-farbe-blau\"}"
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
