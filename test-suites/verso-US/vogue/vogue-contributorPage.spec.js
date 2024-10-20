/// <reference types="Cypress" /> 
import * as testHelper from "../../../helper/contributor/testHelper"
import * as dataHelper from "../../../helper/bundle/contentDataHelper";

let workFlowData =
{
    "brand": "Vogue",
    "page": "contributor"
}

let urlIndex = {
    "contributor": 0
}
function testRunner(workFlowData) {
    context(`Fetching the data needed for the test...`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            dataHelper.getBrandConfig(workFlowData, urlIndex['contributor']).then((data) => {
                workFlowData.brandConfigData = data
                testHelper.getcontributorData(workFlowData, urlIndex['contributor']).then((data) => {
                    workFlowData = data;
                })
                testHelper.getcontributorContentData(workFlowData, urlIndex['contributor']).then((data) => {
                    workFlowData.contributorContentData = data;
                })
            })
        })

        it('Validation of Vogue Contributor Page Header', () => {
            testHelper.validateContributorPageHeader(workFlowData)
        })

        it('Validation of Vogue Contributor Page Content', () => {
            testHelper.validateContributorPageContent(workFlowData)
        })
    })
}
testRunner(workFlowData);
