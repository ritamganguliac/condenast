import * as testHelper from "../../../helper/businessProfile/testHelper"
import * as brandHelper from "../../../helper/bundle/contentDataHelper";

let SearchPageData =
{
    "brand": "Architectural Digest",
    "page": "search"
}

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
        it('Validate Dropdown Options', () => {
            testHelper.validateDropdownValues(searchPageData)
        })

        it('Validate Profile Images', () => {
            testHelper.validateSearchPageImages()
        })

        it('Validate Profile Cards ', () => {
            testHelper.validateProfileCard(searchPageData);
        })


    })
}
testRunner(SearchPageData);
