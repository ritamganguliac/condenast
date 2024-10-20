import * as testHelper from "../../../helper/bundle/testHelper"

let workFlowData =
{
    "brand": "The New Yorker",
    "page": "channel",
    "brandConfigData": {},
    "channelTypeIsNotVersoChannel": true
}

let urlIndex = {
    "goings-on": 6
}
let maxTestIterationCount = 10;

function testRunner(workFlowData) {
    context(`Fetching the data needed for validating magazine Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['goings-on']).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i <= maxTestIterationCount; i++) {
            it(`Validate the Channel : Goings On` + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}

testRunner(workFlowData);
