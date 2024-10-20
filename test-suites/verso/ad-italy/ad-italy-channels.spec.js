import * as testHelper from "../../../helper/bundle/testHelper"

let workFlowData =
{
    "brand": "ad-italy",
    "page": "channel",
}

let urlIndex = {
    "news": 0
}

let maxTesIterationCount = 4;

function testRunner(workFlowData) {
    context(`Fetching the data needed for validating news Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['news']).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Validate the Channel : news - Section ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}

testRunner(workFlowData);
