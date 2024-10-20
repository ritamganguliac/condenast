/// <reference types="Cypress" />

import * as testHelper from "../../../helper/article/testHelper"
import * as dataHelper from "../../../helper/bundle/contentDataHelper";
import * as globalHelper from "../../../helper/global/testHelper";
import * as galleryTestHelper from "../../../helper/gallery/testHelper";

let workFlowData =
{
    "brand": "Glamour",
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

        it("Article Page CNE video Validation", () => {
            globalHelper.validateCNEVideoInContentPage(workFlowData);
        });

        it('Newsletter Subscribe Form validation in Article Page', () => {
            testHelper.validateNewsletterSubscribeForm(workFlowData, articleData)
        })

        it('Article Page Most Popular section Validation', () => {
            galleryTestHelper.validateGalleryMostPopularContent(workFlowData)
        })

        it("Article Page tag links Validation", () => {
            let tags = articleData.data.getArticle.tags;
            let tagHeader = workFlowData.brandConfigData.configContent.articleData['ComponentConfig.TagCloud.settings.sectionHeader'];
            globalHelper.validateTagLinks(tags, tagHeader);
        });

    })
}
testRunner(articleData);
