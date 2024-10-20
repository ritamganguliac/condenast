/// <reference types="Cypress" />

import * as testHelper from "../../../helper/bundle/testHelper"
import * as globalHelper from "../../../helper/global/testHelper"
import * as dataHelper from "../../../helper/bundle/contentDataHelper"

let workFlowData =
{
    "brand": "The New Yorker",
    "page": "homepage",
    "bundleData": {},
    "brandConfigData": {},
    "currentComponentConfig": {},
    "currentComponentName": undefined,
    "currentComponentData": {},
    "currentComponentIndex": 0,
    "currentItemIndex": 0,
    "layoutConfig": {}
}
let maxTesIterationCount = 26;

function testRunner(workFlowData) {
    context(`Fetching the data needed for the test...`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData).then((data) => {
                workFlowData = data;
                dataHelper.getLayoutConfigData(workFlowData).then((data) => {
                    workFlowData.layoutConfig = data
                })
            })
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
