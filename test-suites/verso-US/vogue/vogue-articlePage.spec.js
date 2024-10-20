/// <reference types="Cypress" />

import * as testHelper from "../../../helper/article/testHelper"
import * as dataHelper from "../../../helper/bundle/contentDataHelper";
import { brand } from "../../../test-data/brand-auth-data.json"
import * as bundleTestHelper from "../../../helper/bundle/testHelper"

let workFlowData =
{
    "brand": "Vogue",
    "page": "article",
    "brandConfigData": {}
}
let articleData = {}
let urlIndex = {
    "article": 0
}

function testRunner(articleData) {
    context(`Fetching the data needed for the test...`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            dataHelper.getBrandConfig(workFlowData, urlIndex['article']).then((data) => {
                workFlowData.brandConfigData = data
                testHelper.getArticleInfo(workFlowData, articleData, urlIndex['article']).then((data) => {
                    articleData = data;
                })
            })
        })
        it('Article Page Content Header & Body Validation', () => {
            testHelper.validateArticleContentHeaderAndBody(workFlowData, articleData)
        })

        it('Article Page More Great Fashion Stories List Validation', () => {
            testHelper.validateMoreGreatFashionStoriesList(articleData)
        })

        it.skip('Newsletter Subscribe Form validation in Article Page', () => {
            testHelper.validateNewsletterSubscribeForm(workFlowData)
        })

        it('Save BookMark Icon Validation in article Page', () => {
            cy.getBrandsMagicLink(brand.vogue, brand.email);
            cy.validateSaveBookMarkIcon(workFlowData)
        })
    })
}
testRunner(articleData);
