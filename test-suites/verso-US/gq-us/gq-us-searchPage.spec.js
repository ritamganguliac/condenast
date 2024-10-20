/// <reference types="Cypress" />

import * as brandHelper from "../../../helper/bundle/contentDataHelper";
import * as testHelper from "../../../helper/businessProfile/testHelper"

let searchPageData =
{
    "brand": "gq-us",
    "page": "search"
}
let searchStoryText = "SNEAKERS"

let urlIndex = {
    "search": 0
}

function testRunner(searchPageData) {
    context(`Fetching the data needed for the test...`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getSearchPageInfo(searchPageData, urlIndex['search']).then((data) => {
                searchPageData = data
            })
            brandHelper.getBrandConfig(searchPageData, urlIndex['search']).then((data) => {
                searchPageData.brandConfigData = data;
            })

        })
        it('Validation in Search Page With Valid String', () => {
            testHelper.validateSearchPageWithValidString(searchStoryText, searchPageData)
        })

        it('Validation in Search Page With Sorting Option', () => {
            testHelper.validateSortingOption(searchPageData)
        })

        it('Validation in Search Page With Invalid String', () => {
            testHelper.validateSearchPageWithInvalidString(searchPageData)
        })
    })
}
testRunner(searchPageData);
