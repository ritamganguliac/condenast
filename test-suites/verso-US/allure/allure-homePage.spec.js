/// <reference types="Cypress" />

import * as testHelper from "../../../helper/bundle/testHelper"
import * as globalHelper from "../../../helper/global/testHelper"

let workFlowData =
{
    "brand": "Allure",
    "page": "homepage",
    "bundleData": {},
    "brandConfigData": {},
    "currentComponentConfig": {},
    "currentComponentName": undefined,
    "currentComponentData": {},
    "currentComponentIndex": 0,
    "currentItemIndex": 0
}

let maxTesIterationCount = 15;

function testRunner(workFlowData) {
    context(`Fetching the data needed for the test...`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData).then((data) => {
                workFlowData = data;
            })
        })
        /**
        * Commentingt this test case as trending story section is removed in UI
        it('Home Page Trending Stories Validation', () => {
            testHelper.validateTrendingStories(workFlowData);
        })
        */
        beforeEach(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
        })

        it('HomePage Header Validation', () => {
            globalHelper.validateHeader(workFlowData);
        })

        it('HomePage Footer Validation', () => {
            globalHelper.validateFooter(workFlowData);
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Home Page TestRunnner ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}
testRunner(workFlowData);
