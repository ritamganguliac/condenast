import * as newsletterTestHelper from "../helper/newsletter/testHelper";
import * as utils from "../utils/commonUtils";
import * as dataHelper from "../helper/bundle/contentDataHelper";

let workFlowData = {
    "brand": "bon-appetit",
    "page": "newsletters",
}

let urlIndex = {
    "newsletters": 0
}

function testRunner(workFlowData) {
    context(`Validating newsletter Hub and Preview pages for - ${workFlowData.brand}`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            workFlowData.url = utils.getPageUrl(workFlowData.brand, workFlowData.page, urlIndex['newsletters']);
            cy.visit(workFlowData.url)
            dataHelper.getBrandConfig(workFlowData, urlIndex['newsletters']).then((data) => {
                workFlowData.brandConfigData = data
            })
        })

        it(`Hub page Validation for- ${workFlowData.brand}`, () => {
            newsletterTestHelper.validateHubPage(workFlowData);
        })

        it(`Hub Page-SignUp link Validation for- ${workFlowData.brand}`, () => {
            newsletterTestHelper.validateSignUpLinkHubPage(workFlowData);
        })

        it(`Preview page Validation for- ${workFlowData.brand}`, () => {
            newsletterTestHelper.validatePreviewLinks(workFlowData);
        })

    })
}
testRunner(workFlowData);
