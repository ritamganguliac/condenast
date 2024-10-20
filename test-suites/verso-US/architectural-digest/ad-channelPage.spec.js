/// <reference types="Cypress" /> 

import * as testHelper from "../../../helper/bundle/testHelper"

let workFlowData =
{
    "brand": "Architectural Digest",
    "page": "channel",
    "nextPageButtonText": 'Next Page',
    "currentComponentData": {},
}
let urlIndex = {
    "culture-lifestyle": 1
}
let maxTesIterationCount = 8;

function testRunner(workFlowData) {
    context(`Fetching the data needed for the AD-Channel Page`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['culture-lifestyle']).then((data) => {
                workFlowData = data;
            })
        })
        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Channel Page TestRunnner ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
        /* Commenting out the Trending stories as there are data mismatch in backend 
        it('Runway Page "Must Read" content Validation', () => {
            testHelper.validateTrendingStories(workFlowData);
        }) */
        it(`Validate navigation of next page button on Channel`, () => {
            testHelper.validateNextPage(workFlowData);
        })
    })
}


testRunner(workFlowData);
