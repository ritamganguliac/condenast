import * as testHelper from "../../../helper/bundle/testHelper"
import * as globalHelper from "../../../helper/global/testHelper"

let workFlowData =
{
    "brand": "vanity-fair-italy",
    "page": "homepage",
    "bundleData": [],
    "brandConfigData": {},
    "currentComponentConfig": {},
    "currentComponentName": undefined,
    "currentComponentData": {},
    "currentComponentIndex": 0,
    "currentItemIndex": 0,
    "sectionData": [],
    "siteHeaderVariationValue": "CustomeTopRule"
}

let maxTestIterationCount = 15;

function testRunner(workFlowData) {
    context(`Fetching the data needed for the test...`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData).then((data) => {
                workFlowData = data;
            })
        })

        it('HomePage Header Validation', () => {
            globalHelper.validateHeader(workFlowData);
        })

        for (var i = 1; i < maxTestIterationCount; i++) {
            it('Home Page TestRunnner ' + i,() => {
                testHelper.validateBundle(workFlowData);
            })
        }

        it('HomePage Footer Validation', () => {
            globalHelper.validateFooter(workFlowData);
        })
    })
}
testRunner(workFlowData);
