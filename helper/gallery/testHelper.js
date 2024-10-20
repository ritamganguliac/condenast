import * as dataHelper from "./contentDataHelper";
import * as utils from "../../utils/commonUtils";
import * as brandHelper from "../bundle/contentDataHelper";
import { brand } from "../../test-data/brand-auth-data.json";

//Fetching gallery Data from graphql
export function getGalleryInfo(galleryData, channelUrlIndex) {
    galleryData.uri = utils.getPageUri(galleryData.brand, galleryData.page, channelUrlIndex);
    return dataHelper.getGalleryData(galleryData).then((data) => {
        galleryData = data
        return galleryData;
    })

}
export function getGallerySlideItems(galleryItemData, channelUrlIndex) {
    galleryItemData.uri = utils.getPageUri(galleryItemData.brand, galleryItemData.page, channelUrlIndex);
    return dataHelper.getGallerySlideItems(galleryItemData).then((data) => {
        galleryItemData = data
        return galleryItemData;
    })
}

export function getTestData(workFlowData, channelUrlIndex) {
    workFlowData.url = utils.getPageUrl(workFlowData.brand, workFlowData.page, channelUrlIndex);
    workFlowData.pageUri = utils.getPageUri(workFlowData.brand, workFlowData.page, channelUrlIndex);
    return cy.purgeUrl(workFlowData.url).then(() => {
        cy.visit(workFlowData.url, { retryOnStatusCodeFailure: true });
        return brandHelper.getBrandConfig(workFlowData, channelUrlIndex).then((data) => {
            workFlowData.brandConfigData = data;
            return workFlowData;
        })
    })
}

export function navigateGalleryPage(brandName, page, urlIndex) {
    cy.wait(1000)
    return cy.request('GET', utils.getPageUrl(brandName, page, urlIndex)).then(() => {
        cy.visit(utils.getPageUrl(brandName, page, urlIndex), { retryOnStatusCodeFailure: true });
    })
}

export function navigatePolaroidPage(brandName, page, urlIndex) {
    cy.wait(1000)
    return cy.request('GET', utils.getPolaroidUrl(brandName, page)).then(() => {
        cy.visit(utils.getPolaroidUrl(brandName, page), { retryOnStatusCodeFailure: true });
    })
}

export function validateGalleryContentHeader(galleryData) {
    let galleryWorkFlow = galleryData.data.getGallery;
    cy.validateGalleryContentHeader(galleryWorkFlow)
}

export function validateGalleryPageSlides(workFlowData) {
    cy.validateGallerySlidesBody(workFlowData)
}

export function validateGalleryMostPopularContent(workFlowData) {
    dataHelper.getGalleryMostPopularContent(workFlowData).then((data) => {
        workFlowData.trendingStoriesData = data;
    })
    cy.validateGalleryMostPopularContent(workFlowData)
}

export function validateVoting(brandIndex, workFlowData, pageType) {
    cy.validateVoting(brandIndex, workFlowData, pageType);
}

export function validateLinkBanner(linkBanner, workFlowData) {
    cy.validateLinkBanner(linkBanner, workFlowData);
    return brandHelper.getBrandConfig(workFlowData, 0).then((data) => {
        workFlowData.brandConfigData = data;
        let signinEnabled = workFlowData.brandConfigData.configContent.homepageConfig['ComponentConfig.SignInModal.settings.shouldUseLargeMargins']
        let signinActive = workFlowData.brandConfigData.configContent.generalData['feature.signInActive']
        // Below code re-validates the link banner to make sure the banner is present even for Logged in users
        if (signinEnabled === 'true' || signinActive === 'true') {
            if (workFlowData.brand === 'Vogue') {
                brand.vogue.body.state = "{\"redirectURL\":\"\"}"
                cy.getBrandsMagicLink(brand.vogue, brand.email);
            }
            else if (workFlowData.brand === 'vogue-uk') {
                brand.vogueUK.body.state = "{\"redirectURL\":\"\"}"
                cy.getBrandsMagicLink(brand.vogueUK, brand.email);
            }
            else if (workFlowData.brand === 'vogue-germany') {
                brand.vogueGermany.body.state = "{\"redirectURL\":\"\"}"
                cy.getBrandsMagicLink(brand.vogueGermany, "activearchive@vogue.com");
            }
            cy.validateLinkBanner(linkBanner, workFlowData);
            cy.accountLogOut();
        }
    })
}
