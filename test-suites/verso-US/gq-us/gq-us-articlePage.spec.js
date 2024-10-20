/// <reference types="Cypress" />

import * as testHelper from "../../../helper/article/testHelper"
import * as dataHelper from "../../../helper/bundle/contentDataHelper";
import * as globalHelper from "../../../helper/global/testHelper";

let workFlowData =
{
    "brand": "gq-us",
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

        // There is no backend data available for tags currently. Following up with the devs. Skipping Tag validation for now.

        it('Article Page Recirc Content Validation', () => {
            globalHelper.validateContentPageRecircContent(workFlowData)
        })

        it("Article Page CNE video Validation", () => {
            globalHelper.validateCNEVideoInContentPage(workFlowData);
        });

        // There is no backend data available for GQ coupons currently. Following up with the devs. Validation only frontend data meanwhile.
        it("Article Page GQ COUPONS Validation", () => {
            globalHelper.validateGQCouponsInContentPage(workFlowData);
        });

        
    })
}
testRunner(articleData); 
