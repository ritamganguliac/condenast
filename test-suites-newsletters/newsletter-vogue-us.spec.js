import * as newsletterTestHelper from "../helper/newsletter/testHelper"
import * as utils from "../utils/commonUtils";
import * as dataHelper from "../helper/bundle/contentDataHelper";
import { brand } from "../test-data/brand-auth-data.json"

let workFlowData = {
    "brand": "Vogue",
    "page": "newsletters",
}

let urlIndex = {
    "newsletters": 0
}

let redirectUrl = brand.vogue.body.state = "{\"redirectURL\":\"/newsletter\"}"

function testRunner(workFlowData) {
    context(`Validating newsletter Hub and Preview pages for- ${workFlowData.brand}`, () => {
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

        it(`Logout Use Case: Subscribe - select card and verify the email button`, () => {
            workFlowData.actions = { selected: 1, prevSelected: 0 }
            newsletterTestHelper.validateSubscription(workFlowData);
        })

        it(`Logout Use Case: Subscribe - verify incremental count`, () => {
            workFlowData.actions = { selected: 3, prevSelected: 1 }
            newsletterTestHelper.validateSubscription(workFlowData);
        })

        it(`Logout Use Case: Unsubscribe - verify decremental count`, () => {
            workFlowData.actions = { selected: 2, prevSelected: 3 }
            newsletterTestHelper.validateSubscription(workFlowData);
        })

        it(`Logout Use Case: Unsubscribe - deselect all cards and verify email button doesn't exist`, () => {
            workFlowData.actions = { selected: 0, prevSelected: 2 }
            newsletterTestHelper.validateSubscription(workFlowData);
        })

        it(`Validate Signed In user subscribe flow for - ${workFlowData.brand}`, () => {
            cy.getBrandsMagicLink(brand.vogue, brand.email, redirectUrl);
            newsletterTestHelper.validateUserSubscriptions(workFlowData);
        })

    })
}
testRunner(workFlowData);
