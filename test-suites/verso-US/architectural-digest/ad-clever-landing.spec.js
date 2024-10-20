import * as testHelper from "../../../helper/bundle/testHelper"
import * as globalHelper from "../../../helper/global/testHelper"

let workFlowData =
{
    "brand": "Architectural Digest",
    "page": "channel",
    "currentComponentIndex": 0,

}

let urlIndex = {
    "channel": 0
}


let maxTesIterationCount = 15

function testRunner(workFlowData) {
    context(`Fetching the data needed for the test...`, () => {
        before(function () {
            testHelper.getTestData(workFlowData, urlIndex.channel).then((data) => {
                workFlowData = data;
            })
        })
        beforeEach(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
        })

        
        //commented out the below test as Trending stories had been removed
        // it('Home Page Trending Stories Validation', () => {
        //     testHelper.validateTrendingStories(workFlowData);
        // })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Home Page TestRunnner ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }

        it('HomePage Header Validation', () => {
            globalHelper.validateHeader(workFlowData);
        })

    })
}
testRunner(workFlowData);
