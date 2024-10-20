/** Bon-Appetit tag page scenarios are split into two spec files
This is the second spec file **/
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
    "notValidateAllStackRatedCards": true
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
        it.only(`Tag page bundle Validation for Bon-Appetit when diets filter is applied and sortBy filter is set to Most Recent - ${baseURL + tagUrl[urlIndex]}`, () => {
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "pubDate", "Most Recent", false);
            tagPageData.filter = tagPageTestHelper.updateFilterData(tagPageData.filter, true, true, true, 1);
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        it('Tag page bundle Validation for Bon-Appetit when diets filter is applied and sortBy filter is set to Highest Rating', () => {
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "rating", "Highest Rating", true);
            tagPageData.filter = tagPageTestHelper.updateFilterData(tagPageData.filter, false, true, true, 1);
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        it('Tag page bundle Validation for Bon-Appetit when diets filter is applied and sortBy filter is set to Most Reviewed', () => {
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "reviewsCount", "Most Reviewed", true);
            tagPageData.filter = tagPageTestHelper.updateFilterData(tagPageData.filter, false, true, true, 1);
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        it('Tag page bundle Validation for Bon-Appetit when already applied diets filter is partially cleared from filter dropdown', () => {
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "reviewsCount", "Most Reviewed", false);
            tagPageData.filter = tagPageTestHelper.removeFilter(tagPageData.filter, "Vegetarian", "diet/vegetarian", 0, "Diets");
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        it('Tag page bundle Validation for Bon-Appetit when Cuisines & Flavors filter is applied and sortBy filter is set to Most Recent', () => {
            tagPageTestHelper.clearAllFilters();
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "pubDate", "Most Recent", true);
            tagPageData.filter = tagPageTestHelper.updateFilterData(tagPageData.filter, true, true, true, 2);
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        it('Tag page bundle Validation for Bon-Appetit when Cuisines & Flavors filter is applied and sortBy filter is set to Highest Rating', () => {
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "rating", "Highest Rating", true);
            tagPageData.filter = tagPageTestHelper.updateFilterData(tagPageData.filter, false, true, true, 2);
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        it('Tag page bundle Validation for Bon-Appetit when Cuisines & Flavors filter is applied and sortBy filter is set to Most Reviewed', () => {
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "reviewsCount", "Most Reviewed", true);
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        it('Tag page bundle Validation for Bon-Appetit when all filters are applied and sortBy filter is set to Most Recent', () => {
            tagPageTestHelper.clearAllFilters();
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "pubDate", "Most Recent", true);
            tagPageData.filter = tagPageTestHelper.updateFilterData(tagPageData.filter, true, true, true, "All");
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        it('Tag page bundle Validation for Bon-Appetit when all filters are applied and sortBy filter is set to Highest Rating', () => {
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "rating", "Highest Rating", true);
            tagPageData.filter = tagPageTestHelper.updateFilterData(tagPageData.filter, false, true, true, "All");
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        it('Tag page bundle Validation for Bon-Appetit when all filters are applied and sortBy filter is set to Most Reviewed', () => {
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "reviewsCount", "Most Reviewed", true);
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })

        it('Verify that url doesnot contain commas when multiple filters and sortBy options are selected', () => {
            tagPageTestHelper.verifyUrlSlug(tagPageConfig.urlSlug);
        })

        it('Tag page bundle Validation for Bon-Appetit when all filters are cleared and sortBy filter remains set to Most Reviewed', () => {
            tagPageData.sortBy = tagPageTestHelper.updateSortByData(tagPageData.sortBy, "reviewsCount", "Most Reviewed", false);
            tagPageTestHelper.clearAllFilters();
            tagPageData.filter = tagPageTestHelper.updateFilterData(tagPageData.filter, false, false, false, 0);
            tagPageTestHelper.getTagPageData(tagPageData, urlIndex).then((tagPageData) => {
                tagPageTestHelper.validateTagPageContent(tagPageData);
            })
        })
    })
}
testRunner(tagPageData);
