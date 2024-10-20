/// <reference types="Cypress" /> 

import * as testHelper from "../../../helper/bundle/testHelper"

let workFlowData =
{
    "brand": "ad-india",
    "page": "channel",
    "bundleData": {},
    "brandConfigData": {},
    "currentComponentConfig": {},
    "currentComponentName": undefined,
    "currentComponentData": {},
    "currentComponentIndex": 0,
    "currentItemIndex": 0,
}
let urlIndex = {
    "decorating": 0
}

function testRunner(workFlowData) {
    context(`Fetching the data needed for the Decorating Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex.decorating).then((data) => {
                workFlowData = data;
            })
        })

        it('Validate the Channel : Decorating ', () => {
            testHelper.validateBundle(workFlowData);
        })
    })
}


testRunner(workFlowData);
