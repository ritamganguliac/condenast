import * as testHelper from "../../../helper/bundle/testHelper"
import * as globalHelper from "../../../helper/global/testHelper"

let workFlowData =
{
    "brand": "ad-germany",
    "page": "homepage",
    "currentComponentIndex": 0
}

let maxTesIterationCount = 15;

function testRunner(workFlowData) {
    context(`Fetching the data needed for the test...`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData).then((data) => {
                workFlowData = data;
            })
        })
        /** 
         * Removing trending stories test for now as there are data mismatch seen on Trending stories. Related to AUTOMATION-1407 

        it('Home Page Trending Stories Validation', () => {
            testHelper.validateTrendingStories(workFlowData);
        })
        */

        it('HomePage Header Validation', () => {
            globalHelper.validateHeader(workFlowData);
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Home Page TestRunnner ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }

        it('HomePage Footer Validation', () => {
            globalHelper.validateFooter(workFlowData);
        })
    })
}
testRunner(workFlowData);
