import * as testHelper from "../../../helper/bundle/testHelper"
import * as globalHelper from "../../../helper/global/testHelper"

let workFlowData =
{
    "brand": "bon-appetit",
    "page": "homepage",
}

function testRunner(workFlowData) {
    context(`Fetching the data needed for the test...`, () => {
        before(function () {
            testHelper.getTestData(workFlowData).then((data) => {
                workFlowData = data;
                cy.request("https://www.bonappetit.com/editor-picks").then((response) => {
                    workFlowData.editorsPickData = response.body.editorPicks;
                })
            })
        })

        it('HomePage Header Validation', () => {
            cy.clearCookies();
            cy.clearLocalStorage();
            globalHelper.validateHeader(workFlowData);
        })
    })
}
testRunner(workFlowData);
