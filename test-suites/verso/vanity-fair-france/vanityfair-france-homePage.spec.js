import * as testHelper from "../../../helper/bundle/testHelper"
import * as globalHelper from "../../../helper/global/testHelper"

let workFlowData =
{
    "brand": "vanity-fair-france",
    "page": "homepage"
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

        it('HomePage Header Validation', () => {
            globalHelper.validateHeader(workFlowData);
        })

        it('HomePage Footer Validation', () => {
            globalHelper.validateFooter(workFlowData);
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Home Page TestRunnner ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}
testRunner(workFlowData);
