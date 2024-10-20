import * as testHelper from "../../../helper/bundle/testHelper"

let workFlowData =
{
    "brand": "The New Yorker",
    "page": "channel",
    "brandConfigData": {},
    "channelTypeIsNotVersoChannel": true
}

let urlIndex = {
    "humor": 3
}
let maxTestIterationCount = 10;

function testRunner(workFlowData) {
    context(`Fetching the data needed for validating Humors and Cartoons Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['humor']).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i <= maxTestIterationCount; i++) {
            it(`Validate the Channel : Humours and Cartoons` + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}

testRunner(workFlowData);
