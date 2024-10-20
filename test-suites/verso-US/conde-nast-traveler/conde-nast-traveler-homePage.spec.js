/// <reference types="Cypress" />

import * as testHelper from "../../../helper/bundle/testHelper"
import * as globalHelper from "../../../helper/global/testHelper"

let workFlowData =
{
    "brand": "Conde Nast Traveler",
    "page": "homepage",
    "bundleData": [],
    "brandConfigData": {},
    "currentComponentConfig": {},
    "currentComponentName": undefined,
    "currentComponentData": {},
    "currentComponentIndex": 0,
    "currentItemIndex": 0,
    "sectionData": []
}
let maxTesIterationCount = 9; //This variable will be decided by based on the volume of data in copilot bundle. Reduced from 11 to 9 as part of AUTOMATION-1480

function testRunner(workFlowData) {
    context(`Fetching the data needed for the test...`, () => {
        before(function () {
            testHelper.getTestData(workFlowData).then((data) => {
                workFlowData = data;
            })
        })
        /**
         * Reverting back trending validation test for CNT as the selector .homepage__related-row is now available. Previous ticket AUTOMATION-1191
        */
        it('Home Page Trending Stories Validation', () => {
            testHelper.validateTrendingStories(workFlowData);
        })
    
        it('HomePage Header Validation', () => {
            globalHelper.validateHeader(workFlowData);
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Home Page TestRunnner ' + i,() => {
                /**cy.skipOn('www') or cy.skipOn('stag') - This test can be made to skip in production or stag by specifying either one of this cmd*/
                testHelper.validateBundle(workFlowData);
            })
        }

        it('HomePage Footer Validation', () => {
            globalHelper.validateFooter(workFlowData);
        })

    })
}
testRunner(workFlowData);
