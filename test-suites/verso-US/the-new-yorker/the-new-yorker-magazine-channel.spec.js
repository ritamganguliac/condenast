import * as testHelper from "../../../helper/bundle/testHelper"

let workFlowData =
{
    "brand": "The New Yorker",
    "page": "channel",
    "brandConfigData": {},
    "channelTypeIsNotVersoChannel": true
}

let urlIndex = {
    "magazine": 4
}
let maxTestIterationCount = 13;

function testRunner(workFlowData) {
    context(`Fetching the data needed for validating magazine Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['magazine']).then((data) => {
                workFlowData = data;
            })
        })
        it(`Validate Magazine Bundle Header `, () => {
            testHelper.validateBundleHeader(workFlowData)
        })

        for (var i = 1; i <= maxTestIterationCount; i++) {
            it(`Validate the Channel : magazine` + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}

testRunner(workFlowData);
