import * as testHelper from "../../../helper/bundle/testHelper"

let workFlowData =
{
    "brand": "vanity-fair-france",
    "page": "channel",
}

let urlIndex = {
    "culture": 0
}

let maxTesIterationCount = 4;

function testRunner(workFlowData) {

    context(`Fetching the data needed for validating culture Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['culture']).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Validate the Channel : culture - Section ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}
testRunner(workFlowData);
