import * as testHelper from "../../../helper/bundle/testHelper"

let workFlowData =
{
    "brand": "ad-france",
    "page": "channel",
}

let urlIndex = {
    "adinspiration": 0,
}

let maxTesIterationCount = 4;

function testRunner(workFlowData) {
    context(`Fetching the data needed for validating adinspirations Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['adinspiration']).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Validate the Channel : adinspirations - Section ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}

testRunner(workFlowData);
