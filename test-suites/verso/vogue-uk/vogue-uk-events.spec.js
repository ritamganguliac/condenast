/// <reference types="Cypress" /> 
import * as testHelper from "../../../helper/bundle/testHelper"

let workFlowData =
{
    "brand": "vogue-uk",
    "page": "events",
    "shouldValidateChannelHedAndDek": true
}

let maxTesIterationCount = 10;

function testRunner(workFlowData) {
    context(`Fetching the data needed for Vogue Events Page`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, 0).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Validdate event list ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}
testRunner(workFlowData);
