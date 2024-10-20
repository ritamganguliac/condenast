import * as testHelper from "../../../helper/bundle/testHelper"
import * as globalHelper from "../../../helper/global/testHelper"

let workFlowData =
{
    "brand": "Architectural Digest",
    "page": "directoryUrl"
}

let maxTesIterationCount = 5

function testRunner(workFlowData) {
    context(`Fetching the data needed for the test...`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, 0).then((data) => {
                workFlowData = data;
            })
        })
        it('HomePage Header Validation', () => {
            globalHelper.validatePromoHeader(workFlowData);
        })
        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Home Page TestRunnner ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}
testRunner(workFlowData);
