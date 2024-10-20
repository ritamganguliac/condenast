import * as testHelper from "../../../helper/gallery/testHelper";
import * as globalHelper from "../../../helper/global/testHelper";

let workFlowData =
{
    "brand": "gq-us",
    "page": "gallery",
    "brandConfigData": {},
    "validateSlideNumber": true,
    "ignoreRubric": true,
    "skipRelatedContent": true
}

let urlIndex = {
    "photo": 0,
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

        it('Gallery Page Recirc Content Validation', () => {
            globalHelper.validateContentPageRecircContent(workFlowData);
        })

        it("Gallery Page CNE video Validation", () => {
            globalHelper.validateCNEVideoInContentPage(workFlowData);
        });

        // There is no backend data available for GQ coupons currently. Following up with the devs. Validation only frontend data meanwhile.
        it("Gallery Page GQ COUPONS Validation", () => {
            globalHelper.validateGQCouponsInContentPage(workFlowData);
        });
    })
}

testRunner(workFlowData);
