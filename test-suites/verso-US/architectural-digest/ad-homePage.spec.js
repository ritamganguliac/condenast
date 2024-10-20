import * as testHelper from "../../../helper/bundle/testHelper"
import * as globalHelper from "../../../helper/global/testHelper"

let workFlowData =
{
    "brand": "Architectural Digest",
    "page": "homepage",
    "bundleData": [],
    "brandConfigData": {},
    "currentComponentConfig": {},
    "currentComponentName": undefined,
    "currentComponentData": {},
    "currentComponentIndex": 0,
    "currentItemIndex": 0,
    "sectionData": []
}
let maxTesIterationCount = 11; //This variable will be decided by based on the volume of data in copilot bundle

function testRunner(workFlowData) {
    context(`Fetching the data needed for the test...`, () => {
        before(function () {
            testHelper.getTestData(workFlowData).then((data) => {
                workFlowData = data;
            })
        })
        beforeEach(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
        })

        it('Home Page Trending Stories Validation', () => {
            testHelper.validateTrendingStories(workFlowData);
        })

        it('HomePage Header Validation', () => {
            globalHelper.validateHeader(workFlowData);
        })

        it('HomePage Footer Validation', () => {
            globalHelper.validateFooter(workFlowData);
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Home Page TestRunnner ' + i, () => {
                /**cy.skipOn('www') or cy.skipOn('stag') - This test can be made to skip in production or stag by specifying either one of this cmd*/
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}
testRunner(workFlowData);
