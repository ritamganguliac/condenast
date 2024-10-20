import * as testHelper from "../../../helper/article/testHelper"
import * as dataHelper from "../../../helper/bundle/contentDataHelper";
import * as globalHelper from "../../../helper/global/testHelper";

let workFlowData =
{
    "brand": "epicurious",
    "page": "article"
}
let articleData = {}
let urlIndex = globalHelper.getRunTimeUrlIndex(2, 9);

function testRunner(articleData) {
    describe(`Fetching the data needed for the test...`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            workFlowData.urlIndex = urlIndex;
            dataHelper.getBrandConfig(workFlowData, urlIndex).then((data) => {
                workFlowData.brandConfigData = data
                testHelper.getArticleInfo(workFlowData, articleData, urlIndex).then((data) => {
                    workFlowData.articleData = data;
                })
            })
        })

        it('Article Page Content Header & Body Validation', () => {
            testHelper.validateArticleContentHeaderAndBody(workFlowData, workFlowData.articleData);
        })

        it("Article Page CNE video Validation", () => {
            globalHelper.validateCNEVideoInContentPage(workFlowData);
        });

        it("Article Page tag links Validation", () => {
            let tags = workFlowData.articleData.data.getArticle.tags;
            let tagHeader = workFlowData.brandConfigData.configContent.articleData['ComponentConfig.TagCloud.settings.sectionHeader'];
            globalHelper.validateTagLinks(tags, tagHeader);
        });

        it("Article Page recirc unit Validation", () => {
            globalHelper.validateContentPageRecircContent(workFlowData);
        });
    })
}
testRunner(articleData);
