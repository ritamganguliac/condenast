import * as tagPageTestHelper from "../../../helper/tag/testHelper";
import * as testHelper from "../../../helper/bundle/testHelper";
import * as brandHelper from "../../../helper/bundle/contentDataHelper";

let workFlowData =
{
    "brand": "Architectural Digest",
    "pageUrl": "tagUrl",
    "page": "tag",
    "uri": "lighting",
    "types": ["ARTICLE",
        "GALLERY",
        "CNEVIDEO",
        "REVIEW",
        "RECIPE"]
}
let urlIndex = 0

function testRunner(tagPageData) {

    context(`Fetching the data needed for validating AD-Topic page`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            tagPageTestHelper.getTopicPageData(tagPageData, urlIndex).then((data) => {
                tagPageData = data;
            })
            brandHelper.getBrandConfig(tagPageData, urlIndex).then((data) => {
                tagPageData.brandConfigData = data;
            })
        })

        it('Validate the Topic page content ', () => {
            tagPageTestHelper.validateTagPageContent(tagPageData);
        })
        it(`Validate more stories button on Topic page`, () => {
            testHelper.validateMoreStoriesPage(tagPageData);
        })

    })
}
testRunner(workFlowData);
