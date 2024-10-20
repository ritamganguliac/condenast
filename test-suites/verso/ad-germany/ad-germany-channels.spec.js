import * as testHelper from "../../../helper/bundle/testHelper"

let workFlowData =
{
    "brand": "ad-germany",
    "page": "channel",
}

let urlIndex = {
    "architektur": 0
}

let maxTesIterationCount = 4;

function testRunner(workFlowData) {
    context(`Fetching the data needed for validating architektur Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['architektur']).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Validate the Channel : architektur - Section ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}

testRunner(workFlowData);
