import * as testHelper from "../../../helper/businessProfile/testHelper"
import * as brandHelper from "../../../helper/bundle/contentDataHelper";

let profilePageData =
{
    "brand": "Architectural Digest",
    "page": "profile"
}

let urlIndex = {
    "profile": 0
}

function testRunner(profilePageData) {
    context(`Fetching the data needed for the test...`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getProfileInfo(profilePageData, urlIndex['profile']).then((data) => {
                profilePageData = data
            })
            brandHelper.getBrandConfig(profilePageData, urlIndex['search']).then((data) => {
                profilePageData.brandConfigData = data;
            })
        })

        it('Validate Profile Header ', () => {
            testHelper.validateProfileHed(profilePageData)
        })
        it('Validate Profile Images',() => {
            testHelper.validateProfileImages()
        })
    })
}
testRunner(profilePageData);
