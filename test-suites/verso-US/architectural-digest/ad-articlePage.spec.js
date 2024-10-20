/// <reference types="Cypress" />

import * as testHelper from "../../../helper/article/testHelper"
import * as dataHelper from "../../../helper/bundle/contentDataHelper";
import * as globalHelper from "../../../helper/global/testHelper";
import * as galleryTestHelper from "../../../helper/gallery/testHelper";
import { brand } from "../../../test-data/brand-auth-data.json"

let workFlowData =
{
    "brand": "Architectural Digest",
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

        it('Article Page Recirc Content Validation', () => {
            globalHelper.validateContentPageRecircContent(workFlowData)
        })
        it('Article Page More Great Fashion Stories List Validation', () => {
            testHelper.validateMoreGreatFashionStoriesList(articleData)
        })

        it("Article Page CNE video Validation", () => {
            globalHelper.validateCNEVideoInContentPage(workFlowData);
        });

        it('Article Page Most Popular section Validation', () => {
            galleryTestHelper.validateGalleryMostPopularContent(workFlowData)
        })

        it('Save BookMark Icon Validation in article Page', () => {
            cy.getBrandsMagicLink(brand.AD, brand.email);
            cy.validateSaveBookMarkIcon(workFlowData)
        })

    })
}
testRunner(articleData); 
