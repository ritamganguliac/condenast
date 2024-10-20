import * as testHelper from "../../../helper/gallery/testHelper";
import * as globalHelper from "../../../helper/global/testHelper";

let workFlowData =
{
    "brand": "epicurious",
    "page": "gallery",
    "brandConfigData": {},
    "validateSlideNumber": true,
    "SlideButtonExists": true,
    "SlideButtonType": "Recipe"
}

let urlIndex = globalHelper.getRunTimeUrlIndex(2, 9);

function testRunner(workFlowData) {
    context(`Fetching the data needed for validating photo gallery `, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex).then((data) => {
                workFlowData = data;
            })
            testHelper.getGalleryInfo(workFlowData, urlIndex).then((data) => {
                workFlowData.galleryData = data;
            })
            testHelper.getGallerySlideItems(workFlowData, urlIndex).then((data) => {
                workFlowData.galleryItemData = data;
            })
        })

        it('Gallery Page Content Header Validation', () => {
            testHelper.validateGalleryContentHeader(workFlowData.galleryData);
        })

        it("Gallery Page CNE video Validation", () => {
            globalHelper.validateCNEVideoInContentPage(workFlowData);
        });

        it('Gallery Page Slides Validation', () => {
            testHelper.validateGalleryPageSlides(workFlowData);
        });

        it('Gallery Page Recirc Content Validation', () => {
            globalHelper.validateContentPageRecircContent(workFlowData);
        })
    })
}
testRunner(workFlowData);
