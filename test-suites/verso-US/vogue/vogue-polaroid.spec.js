/// <reference types="Cypress" />

import * as testHelper from "../../../helper/gallery/testHelper"

// Note: 
// 1. This spec files should be run only on Staging and Never on Prod. It doesn't pick env variable from Cypress.config.js because I have hardcoded it. 
// Prerequisites. 
// 1. Copy the jpg files from confluence page "https://cnissues.atlassian.net/wiki/spaces/QUAL/pages/15879405732/Upload+Images+for+Polaroid+spec+file" and paste it in Fixtures folder
// 2. To run the test case 'Delete Images from Copilot', remove the skip from it block. Read more details on corresponding it block.

let workFlowData =
{
    "brand": "Vogue",
    "page": "polaroid",
    "brandConfigData": {},
}

function testRunner(workFlowData) {
    before(function () {
        cy.clearCookies();
        cy.clearLocalStorage();
    })

    context(`Vogue polaroid validation...`, () => {
        // To perform below block, we need to first acces the copilot link manually in the separate window from cypress
        // and Enter the OKTA creds. When the below block is executed, it will prompt for sigin again. Just click on OKTA and wait
        it.skip('Delete Images from Copilot', () => {
            testHelper.navigatePolaroidPage(workFlowData.brand, 'copilotShow', 0);
            cy.wait(35000)
            cy.removeSlides()
        })

        it('Login to polaroid', () => {
            testHelper.navigatePolaroidPage(workFlowData.brand, 'mainUrl', 0);
            cy.siginPolaroid();
        })

        it('validate error appears unpublished brand and season show', () => {
            testHelper.navigatePolaroidPage(workFlowData.brand, 'unPublishedShow', 0);
            cy.validateUnpublishedShowError();
        })

        it('validate Copilot link is working on published brand and season show', () => {
            testHelper.navigatePolaroidPage(workFlowData.brand, 'publishedShow', 0);
            cy.validateCopilotLinkIsWorking('copilotLink');
        })
        it('validate upload of Invalide file type', () => {
            cy.uploadInvalidFileType();
        })
        it('validate selection of images before uploading', () => {
            cy.validateImageSelectionForUpload();
        })
        it('validate uploading of images on published Fashion show', () => {
            cy.validateImageUploading();
        })

        it('validate reupload of Images published Fashion show', () => {
            cy.validateImageUploading('reupload');
        })

    })
}

testRunner(workFlowData);
