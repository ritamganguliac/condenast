import * as testHelper from "../../../helper/gallery/testHelper";
import * as globalHelper from "../../../helper/global/testHelper";

let workFlowData =
{
    "brand": "wired",
    "page": "gallery",
    "brandConfigData": {},
    "validateSlideNumber": false
}

let urlIndex = {
    "gallery": 0
}

function testRunner(workFlowData) {
    context(`Fetching the data needed for validating photo gallery `, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['gallery']).then((data) => {
                workFlowData = data;
            })
            testHelper.getGalleryInfo(workFlowData, urlIndex['gallery']).then((data) => {
                workFlowData.galleryData = data;
            })
            testHelper.getGallerySlideItems(workFlowData, urlIndex['gallery']).then((data) => {
                workFlowData.galleryItemData = data;
            })
            
        })

        it('Gallery Page Content Header Validation', () => {
            testHelper.validateGalleryContentHeader(workFlowData.galleryData)
        })

        it('Gallery Page Slides Validation', () => {
            testHelper.validateGalleryPageSlides(workFlowData)
        });

    })
}

testRunner(workFlowData);
