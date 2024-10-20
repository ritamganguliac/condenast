import * as testHelper from "../../../helper/bundle/testHelper"

let workFlowData =
{
    "brand": "The New Yorker",
    "page": "channel",
    "brandConfigData": {},
    "channelTypeIsNotVersoChannel": true
}

let urlIndex = {
    "news": 0,
    "culture": 1
}
let maxTestIterationCount = 13;

function testRunner(workFlowData) {

    context(`Fetching the data needed for validating news Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['news']).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i <= maxTestIterationCount; i++) {
            it(`Validate the Channel : news` + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })

    context(`Fetching the data needed for validating culture Channel`, () => {
        before(function () {
            testHelper.getTestData(workFlowData, urlIndex['culture']).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i <= maxTestIterationCount; i++) {
            it(`Validate the Channel : culture` + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}

testRunner(workFlowData);
