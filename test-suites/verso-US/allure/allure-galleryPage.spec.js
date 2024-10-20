import * as testHelper from "../../../helper/gallery/testHelper";
import * as globalHelper from "../../../helper/global/testHelper";

let workFlowData =
{
    "brand": "Allure",
    "page": "gallery",
    "brandConfigData": {},
    "validateSlideNumber": true,
    "skipRelatedContent": true
}

let urlIndex = {
    "product": 0
}

function testRunner(workFlowData) {
    context(`Fetching the data needed for validating photo gallery `, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['product']).then((data) => {
                workFlowData = data;
            })
            testHelper.getGalleryInfo(workFlowData, urlIndex['product']).then((data) => {
                workFlowData.galleryData = data;
            })
            testHelper.getGallerySlideItems(workFlowData, urlIndex['product']).then((data) => {
                workFlowData.galleryItemData = data;
            })
        })

        it('Gallery Page Content Header Validation', () => {
            testHelper.validateGalleryContentHeader(workFlowData.galleryData)
        })

        it('Gallery Page Slides Validation', () => {
            testHelper.validateGalleryPageSlides(workFlowData)
        });

        it('Gallery Page Most Popular section Validation', () => {
            testHelper.validateGalleryMostPopularContent(workFlowData)
        })

        it('Gallery Page Recirc Content Validation', () => {
            globalHelper.validateContentPageRecircContent(workFlowData)
        })
    })
}

testRunner(workFlowData);
