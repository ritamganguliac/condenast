/// <reference types="Cypress" />

import * as testHelper from "../../../helper/gallery/testHelper"
import * as tagPageConfig from "../../../test-data/verso/tag/vogue-brand-config.json"

let workFlowData =
{
    "page": "homepage",
    "bannerLogo" : "VW Banner 2024",
    //"bannerLogo" : "Met Gala 2024",
    "brandConfigData": {}
}

function testRunner(workFlowData) {
    beforeEach(function () {
        cy.clearCookies();
        cy.clearLocalStorage();
    })
    
    context(`vogue world link banner validation...`, () => {
        let bannerConfig = ''
        if (workFlowData.bannerLogo === 'VW Banner 2024')
            bannerConfig = tagPageConfig.vogueWorldBanner
        else if (workFlowData.bannerLogo === 'Met Gala')
            bannerConfig = tagPageConfig.metGalaBanner
        for (let i = 0; i < bannerConfig.length; i++) {
            it('Validate ' + bannerConfig[i].brandname + ' link banner ', () => {
                testHelper.navigateGalleryPage(bannerConfig[i].brandname, workFlowData.page, 0);
                workFlowData.brand = bannerConfig[i].brandname;
                testHelper.validateLinkBanner(bannerConfig[i], workFlowData)
            })
        }
    })
}
testRunner(workFlowData);
