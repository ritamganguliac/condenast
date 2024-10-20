/** Bon-Appetit tag page scenarios are split into two spec files
This is the first spec file **/
import * as tagPageTestHelper from "../../../helper/tag/testHelper"
import * as tagPageConfig from "../../../test-data/verso/tag/bon-appetit-tagpage-config.json"
import * as globalHelper from "../../../helper/global/testHelper";

let tagPageData =
{
    "brand": "bon-appetit",
    "pageUrl": "tagUrl",
    "page": "tag",
    "pageNumber": 1,
    "pageLimit": 24,
    "imagepPixel": 304,
    "labels": tagPageConfig.labels,
    "sortBy": tagPageConfig.sortBy,
    "filter": tagPageConfig.filter,
    "filterErrorText": tagPageConfig.filterErrorText,
    "notValidateAllStackRatedCards": false
}

let baseURL = 'https://www.bonappetit.com';
let tagUrl = ['/simple-cooking/quick', '/ingredient/wine', '/dish/fried-rice', '/cooking-method/braise', '/diet/vegetarian', '/simple-cooking/weeknight-meals', '/ingredient/mustard-greens', '/ingredient/brisket', '/ingredient/buttermilk', '/ingredient/egg'];
let urlIndex = globalHelper.getRunTimeUrlIndex();

function testRunner(tagPageData) {
    context(`Fetching the data needed for the test...`, () => {
        before(function () {
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((data) => {
                tagPageData = data;
                tagPageTestHelper.launchUrl(tagPageData.url);
            })
        })

        beforeEach(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
        })
        // Running only the first case currently until the issue is fixed AUTOMATION-1800.
        it.only(`Tag page bundle Validation for Bon-Appetit on default loaded page - ${baseURL + tagUrl[urlIndex]}`, () => {
            tagPageTestHelper.validateTagPageContent(tagPageData);
        })

        it('Tag page bundle Validation for Bon-Appetit when sortby filter is set to Highest Rating', () => {
            tagPageData.notValidateAllStackRatedCards = true;
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "rating", "Highest Rating", true);
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        it('Fetch Tag page bundle data for Bon-Appetit when sortby filter is set to Most Reviewed', () => {
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "reviewsCount", "Most Reviewed", true);
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        it('Tag page bundle Validation for Bon-Appetit when sortby filter is set to Most Recent', () => {
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "pubDate", "Most Recent", true);
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        it('Tag page bundle Validation for Bon-Appetit when popular filter is applied and sortBy filter is set to Most Recent', () => {
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "pubDate", "Most Recent", false);
            tagPageData.filter = tagPageTestHelper.updateFilterData(tagPageData.filter, true, true, true, 0);
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        it('Tag page bundle Validation for Bon-Appetit when popular filter is applied and sortBy filter is set to Highest Rating', () => {
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "rating", "Highest Rating", true);
            tagPageData.filter = tagPageTestHelper.updateFilterData(tagPageData.filter, false, true, true, 0);
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        it('Tag page bundle Validation for Bon-Appetit when popular filter is applied and sortBy filter is set to Most Reviewed', () => {
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "reviewsCount", "Most Reviewed", true);
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        it('Tag page bundle Validation for Bon-Appetit when already applied popular filter is partially cleared from filter label', () => {
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "reviewsCount", "Most Reviewed", false);
            tagPageData.filter = tagPageTestHelper.removeFilter(tagPageData.filter, "Weeknight Meals", "simple-cooking/weeknight-meals", 0);
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        /** This test case covers
        1. When few filters are selected in the first page and navigated to the second page, then verify that the same selected filters are retained in the next page as well
        2. Verify the bundle data in second page based on already existing filters **/
        it('When popular filter is applied and sortBy filter is set to Most Reviewed then verify that the filters remains the same in second page and verify the tag page bundle', () => {
            tagPageData.pageNumber = 2;
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "reviewsCount", "Most Reviewed", false);
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContentOnNextPage(tagPageData);
            })
        })
    })
}
testRunner(tagPageData);
