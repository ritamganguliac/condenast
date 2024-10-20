import * as testHelper from "../../../helper/gallery/testHelper";
import * as globalHelper from "../../../helper/global/testHelper";

let workFlowData =
{
    "brand": "vanity-fair",
    "page": "gallery",
    "brandConfigData": {}
}

let urlIndex = {
    "photo": 0,
    "product": 1

}

function testRunner(workFlowData) {
    context(`Fetching the data needed for validating photo gallery `, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['photo']).then((data) => {
                workFlowData = data;
            })
            testHelper.getGalleryInfo(workFlowData, urlIndex['photo']).then((data) => {
                workFlowData.galleryData = data;
            })
            testHelper.getGallerySlideItems(workFlowData, urlIndex['photo']).then((data) => {
                workFlowData.galleryItemData = data;
            })
        })

        it('Gallery Page Content Header Validation', () => {
            testHelper.validateGalleryContentHeader(workFlowData.galleryData)
        })

        it('Gallery Page Slides Validation', () => {
            testHelper.validateGalleryPageSlides(workFlowData)
        });

        it("Gallery Page CNE video Validation", () => {
            globalHelper.validateCNEVideoInContentPage(workFlowData);
        });

        it('Gallery Page Most Popular section Validation', () => {
            testHelper.validateGalleryMostPopularContent(workFlowData)
        })

    })
}

testRunner(workFlowData);
