import * as globalConfigHelper from './configHelper'
import * as brandHelper from "../bundle/contentDataHelper";
let globalPageSelectors = require("../../selectors/verso/global.json");
let headerSelector = globalPageSelectors.header;

export function validateFooter(workFlowData) {
    if (Cypress.$(headerSelector['drawer_overlay']).length > 0) {
        cy.get(headerSelector['utility_close_icon']).eq(0).click();
    }
    cy.validateFooterLogo(workFlowData);
    workFlowData.socialLinks = globalConfigHelper.getSocialLinks(workFlowData);
    cy.validateSocialIconList(workFlowData);
    workFlowData.contactLinksHeading = globalConfigHelper.getContactHeading(workFlowData);
    workFlowData.contactLinks = globalConfigHelper.getContactLinks(workFlowData);
    cy.validateContactLinks(workFlowData);
    workFlowData.footerLinks = globalConfigHelper.getFooterLinks(workFlowData);
    workFlowData.footerLinksHeading = globalConfigHelper.getFooterHeading(workFlowData);
    cy.validateFooterLinks(workFlowData);
    workFlowData.noticesLinks = globalConfigHelper.getNoticeLinks(workFlowData);
    //cy.validateNoticeLinks(workFlowData);
    workFlowData.homeLocation = globalConfigHelper.getHomeLocation(workFlowData);
    cy.validateHomeLocation(workFlowData);
    workFlowData.internationalSitesLinks = globalConfigHelper.getInternationalLocation(workFlowData);
    cy.validateInternationalSites(workFlowData);
    cy.validateFooterAboutText();
    workFlowData.siteFooterLegalText = globalConfigHelper.getSiteFooterLegalText(workFlowData);
    cy.validateSiteFooterLegalText(workFlowData);
    workFlowData.siteFooterDisclaimerText = globalConfigHelper.getSiteFooterDisclaimerText(workFlowData);
    cy.validateSiteFooterDisclaimerText(workFlowData);
}

export function validateHeader(workFlowData) {
    cy.validateHeaderLogo(workFlowData);
    workFlowData.primaryLinks = globalConfigHelper.getDrawerPrimaryLinks(workFlowData);
    workFlowData.searchLink = globalConfigHelper.getDrawerSearchLink(workFlowData);
    workFlowData.signInLink = globalConfigHelper.getDrawerSignInLink(workFlowData);
    workFlowData.secondaryLinks = globalConfigHelper.getDrawerSecondaryLinks(workFlowData);
    workFlowData.utilityLinks = globalConfigHelper.getDrawerUtilityLinks(workFlowData);
    workFlowData.socialLinks = globalConfigHelper.getSocialLinks(workFlowData);
    workFlowData.homeLocation = globalConfigHelper.getHomeLocation(workFlowData);
    workFlowData.internationalSitesLinks = globalConfigHelper.getInternationalLocation(workFlowData);
    workFlowData.navPattern = globalConfigHelper.getNavPattern(workFlowData);
    workFlowData.enableAccount = JSON.parse(globalConfigHelper.getEnableAccount(workFlowData).toLowerCase());
    workFlowData.showSearch = JSON.parse(globalConfigHelper.getSearchValue(workFlowData).toLowerCase());
    workFlowData.hasSearch = globalConfigHelper.getHasSearch(workFlowData);
    workFlowData.drawerToggleConfig = globalConfigHelper.getDrawerToggle(workFlowData);
    workFlowData.standardNavVariation = globalConfigHelper.getStandardNavVaration(workFlowData);
    workFlowData.SiteHeaderVariationValue = globalConfigHelper.getSiteHeaderVariationValue(workFlowData);
    workFlowData.siteHeaderAccountEnabled = globalConfigHelper.getSiteHeaderAccountEnabled(workFlowData);
    workFlowData.signInFeatureActive = globalConfigHelper.getSignInFeatureActiveValue(workFlowData);
    workFlowData.loginFeature = globalConfigHelper.getLoginFeature(workFlowData);
    workFlowData.navigationDrawer = globalConfigHelper.getNavigationDrawer(workFlowData);
    workFlowData.overLayDrawer = globalConfigHelper.getOverlayDrawer(workFlowData);
    cy.validateHeaderHorizontalLinks(workFlowData);
    headerAssertionHandler(workFlowData);
}

function headerAssertionHandler(workFlowData) {
    if (workFlowData.navPattern === 'SiteHeader')
        cy.validateSiteHeader(workFlowData);
    else if (workFlowData.navPattern === 'StackedNavigation')
        cy.validateStackedNavigation(workFlowData);
    else if (workFlowData.navPattern === 'StandardNavigation')
        cy.validateStandardNavigation(workFlowData);
}

export function validatePromoHeader(workFlowData) {
    cy.validateHeaderLogo(workFlowData);
    cy.validatePromoHed(workFlowData);
}

export function validateCNEVideoInContentPage(workFlowData) {
    cy.validateCNEVideoInContentPage(workFlowData.brandConfigData.translations["VideoWrapper.headerText"][0].value)
}

export function validateGQCouponsInContentPage(workFlowData) {
    cy.validateGQCouponsInContentPage(workFlowData)
}

export function validateTagLinks(tags, tagHeader) {
    cy.validateTagLinks(tags, tagHeader);
}

export function validateContentPageRecircContent(workFlowData) {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.purgeUrl(workFlowData.url).then(() => {
        cy.visit(workFlowData.url, { retryOnStatusCodeFailure: true });
        cy.window().its('document.readyState').should('eq', 'complete').then(() => {
            let index = 0;
            let relatedContentData = [];
            let relatedContentLength = 0;
            let articleRelatedContent = workFlowData.articleData ? workFlowData.articleData.data.getArticle.relatedContent.results : "";
            if ((workFlowData.page === "gallery" && !(workFlowData.skipRelatedContent)) || (workFlowData.page === "article" && articleRelatedContent.length > 0)) {
                relatedContentData = workFlowData.galleryData ? workFlowData.galleryData.data.getGallery.relatedContent.results : articleRelatedContent;
                relatedContentLength = relatedContentData.length;
                if (relatedContentLength > 0) {
                    index = index + relatedContentLength;
                }
            }
            cy.getRecircStatergy(index).then((strategy) => {
                workFlowData.recircStrategy = strategy;
                brandHelper.getContentPageRecircContent(workFlowData).then((response) => {
                    workFlowData.recircContentData = relatedContentData.concat(response.data);
                    cy.validateContentPageRecircContent(workFlowData)
                })
            })
        })
    })
}

export function getRunTimeUrlIndex(actualRange, requiredRange) {
    var currentDateTime = new Date();
    var resultInSeconds = currentDateTime.getTime() / 1000;
    const lastDigitStr = String(resultInSeconds).slice(-1);
    if (actualRange !== undefined && requiredRange !== undefined) {
        return (Math.round((((Number(lastDigitStr) - 0) * (actualRange - 0)) / (requiredRange - 0)) + 0));
    }
    else {
        return Number(lastDigitStr);
    }
}
