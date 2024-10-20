import { brand } from "../../../test-data/brand-auth-data.json"
import * as testHelper from "../../../helper/businessProfile/testHelper"
import * as brandHelper from "../../../helper/bundle/contentDataHelper";

let SearchPageData =
{
    "brand": "Architectural Digest",
    "page": "formPage"
}

let urlIndex = {
    "formPage": 0
}
function testRunner(searchPageData) {
    context(`Fetching the data needed for the test...`,
        {
            // env: {
            //     environment: 'staging',
            // },
        },
        () => {
            before(function () {
                cy.clearCookies();
                cy.clearLocalStorage();
                testHelper.getSearchPageInfo(searchPageData, urlIndex['formPage']).then((data) => {
                    searchPageData = data
                })
                brandHelper.getBrandConfig(searchPageData, urlIndex['formPage']).then((data) => {
                    searchPageData.brandConfigData = data;
                })
            })

            it.skip('validate application apply page', () => { // .. Skipping this test with respect to AUTOMATION-1808.
                cy.clearCookies();
                cy.clearLocalStorage();
                testHelper.applyPageValidation(searchPageData)
            })


            it('Validate application form fields', () => {
                cy.getBrandsMagicLink(brand.directory, brand.email);
                cy.formPageValidation(searchPageData);
            })

            it('Validate photo upload', () => {
                // Photo upload POC-AUTOMATION-1442
                cy.uploadPhotos();
            })
        })
}
testRunner(SearchPageData);
