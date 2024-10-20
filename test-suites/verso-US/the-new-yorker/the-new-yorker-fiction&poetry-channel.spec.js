import * as testHelper from "../../../helper/bundle/testHelper"

let workFlowData =
{
    "brand": "The New Yorker",
    "page": "channel",
    "brandConfigData": {},
    "channelTypeIsNotVersoChannel": true
}

let urlIndex = {
    "fiction-and-poetry": 2
}
let maxTestIterationCount = 13;

function testRunner(workFlowData) {
    context(`Fetching the data needed for validating fiction-and-poetry Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['fiction-and-poetry']).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i <= maxTestIterationCount; i++) {
            it(`Validate the Channel : fiction-and-poetry` + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}

testRunner(workFlowData);
