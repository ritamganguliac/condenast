let globalConfigPaths = require('./configPath.json');
export function getSocialLinks(workFlowData) {
    let socialSharePath = globalConfigPaths.footer.socialShares;
    let socialLinksData = _.get(workFlowData.brandConfigData, socialSharePath);
    return socialLinksData;
}
export function getContactLinks(workFlowData) {
    let contactSharePath = globalConfigPaths.footer.contactLinks;
    let contactLinksData = _.get(workFlowData.brandConfigData, contactSharePath);
    return contactLinksData;
}

export function getContactHeading(workFlowData) {
    let contactHeading = globalConfigPaths.footer.contactLinksHeading;
    let contactHeadingData = _.get(workFlowData.brandConfigData, contactHeading);
    return contactHeadingData;
}

export function getFooterLinks(workFlowData) {
    let footerSharePath = globalConfigPaths.footer.footerLinks;
    let footerLinksData = _.get(workFlowData.brandConfigData, footerSharePath);
    return footerLinksData;
}

export function getFooterHeading(workFlowData) {
    let footerHeading = globalConfigPaths.footer.footerLinksHeading;
    let footerHeadingData = _.get(workFlowData.brandConfigData, footerHeading);
    return footerHeadingData;
}

export function getNoticeLinks(workFlowData) {
    let noticesLinksPath = globalConfigPaths.footer.noticesLinks;
    let noticesLinksData = _.get(workFlowData.brandConfigData, noticesLinksPath);
    return noticesLinksData;
}

export function getHomeLocation(workFlowData) {
    let homeLocationPath = globalConfigPaths.footer.homeLocation;
    let homeLocationData = _.get(workFlowData.brandConfigData, homeLocationPath);
    return homeLocationData;
}

export function getInternationalLocation(workFlowData) {
    let internationalSitesPath = globalConfigPaths.footer.internationalSites;
    let internationalSitesData = _.get(workFlowData.brandConfigData, internationalSitesPath);
    return internationalSitesData;
}

export function getSiteFooterLegalText(workFlowData) {
    let siteFooterLegalData = undefined;
    let siteFooterLegalPath = globalConfigPaths.footer.siteFooterText;
    let defaultLegalText = globalConfigPaths.footer.defaultLegalTextValue;
    if (siteFooterLegalPath !== undefined) {
        siteFooterLegalData = _.get(workFlowData.brandConfigData, siteFooterLegalPath);
    }
    return siteFooterLegalData != undefined ? siteFooterLegalData : defaultLegalText;
}

export function getSiteFooterDisclaimerText(workFlowData) {
    let siteFooterDisclaimerText = globalConfigPaths.footer.siteFooterDisclaimerText;
    let siteFooterDisclaimerData = _.get(workFlowData.brandConfigData, siteFooterDisclaimerText);
    return siteFooterDisclaimerData;
}

export function getDrawerPrimaryLinks(workFlowData) {
    let primaryLinkPath = globalConfigPaths.header.primaryLinks;
    let primaryLinksData = _.get(workFlowData.brandConfigData, primaryLinkPath);
    return primaryLinksData;
}

export function getDrawerSearchLink(workFlowData) {
    let searchLinkPath = globalConfigPaths.header.searchLink;
    let searchLinkData = _.get(workFlowData.brandConfigData, searchLinkPath);
    return searchLinkData;
}

export function getDrawerSignInLink(workFlowData) {
    let signInLinkPath = globalConfigPaths.header.signInLink;
    let signInLinkData = _.get(workFlowData.brandConfigData, signInLinkPath);
    return signInLinkData;
}

export function getDrawerSecondaryLinks(workFlowData) {
    let secondaryLinksPath = globalConfigPaths.header.secondaryLinks;
    let secondaryLinksData = _.get(workFlowData.brandConfigData, secondaryLinksPath);
    return secondaryLinksData;
}

export function getDrawerUtilityLinks(workFlowData) {
    let utilityLinksPath = globalConfigPaths.header.utilityLinks;
    let utilityLinksData = _.get(workFlowData.brandConfigData, utilityLinksPath);
    return utilityLinksData;
}

export function getNavPattern(workFlowData) {
    let navPatternPath = globalConfigPaths.header.navPattern;
    let navPatternData = _.get(workFlowData.brandConfigData, navPatternPath);
    return navPatternData;
}

export function getStandardNavVaration(workFlowData) {
    let standardNavVariationPath = globalConfigPaths.header.standardNavVariation;
    let standardNavVariationData = _.get(workFlowData.brandConfigData, standardNavVariationPath);
    return standardNavVariationData;
}

export function getEnableAccount(workFlowData) {
    let enableAccountData, featureEnableAccount = undefined;
    let enableAccountPath = globalConfigPaths.header.enableAccount;
    let featureEnableAccountPath = globalConfigPaths.header.featureEnableAccount;
    if (enableAccountPath != undefined) {
        enableAccountData = _.get(workFlowData.brandConfigData, enableAccountPath);
    }
    if (featureEnableAccountPath != undefined) {
        featureEnableAccount = _.get(workFlowData.brandConfigData, featureEnableAccountPath);
    }
    return enableAccountData != undefined ? enableAccountData : featureEnableAccount;
}

export function getSearchValue(workFlowData) {
    let showSearchData = undefined;
    let showSearchPath = globalConfigPaths.header.showSearch;
    let showSearchDefaultValue = globalConfigPaths.header.defaultHasSearchValue;
    if (showSearchPath != undefined) {
        showSearchData = _.get(workFlowData.brandConfigData, showSearchPath);
    }
    return showSearchData != undefined ? showSearchData : showSearchDefaultValue;
}

export function getDrawerToggle(workFlowData) {
    let drawerTogglePath = globalConfigPaths.header.drawerToggleConfig;
    let drawerToggleData = _.get(workFlowData.brandConfigData, drawerTogglePath);
    return drawerToggleData;
}

export function getHasSearch(workFlowData) {
    let hasSearchPath = globalConfigPaths.header.hasSearch;
    let hasSearchData = _.get(workFlowData.brandConfigData, hasSearchPath);
    return hasSearchData;
}

export function getSiteHeaderVariationValue(workFlowData) {
    let siteHeaderVariationPath = globalConfigPaths.header.siteHeaderVariation;
    let siteHeaderVariationData = _.get(workFlowData.brandConfigData, siteHeaderVariationPath);
    return siteHeaderVariationData;
}

export function getSiteHeaderAccountEnabled(workFlowData) {
    let SiteHeaderAccountEnabledPath = globalConfigPaths.header.siteHeaderAccountEnabled;
    let SiteHeaderAccountEnabledData = _.get(workFlowData.brandConfigData, SiteHeaderAccountEnabledPath);
    return SiteHeaderAccountEnabledData;
}

export function getSignInFeatureActiveValue(workFlowData) {
    let SiteHeaderSignInActivePath = globalConfigPaths.header.signInFeatureActive; 
    let SiteHeaderSignInActiveData = _.get(workFlowData.brandConfigData, SiteHeaderSignInActivePath);
    return SiteHeaderSignInActiveData    
}

export function getLoginFeature(workFlowData) {
    let siteHeaderLoginPath = globalConfigPaths.header.loginFeature; 
    let siteHeaderLoginData = _.get(workFlowData.brandConfigData, siteHeaderLoginPath);
    return siteHeaderLoginData    
}
export function getNavigationDrawer(workFlowData) {
    let navDrawerPath = globalConfigPaths.header.navigationDrawer;
    let navDrawerData = _.get(workFlowData.brandConfigData, navDrawerPath)
    return navDrawerData
}

export function getOverlayDrawer(workFlowData) {
    let overlayDrawerPath = globalConfigPaths.header.overLayDrawer
    let overlayDrawerData = _.get(workFlowData.brandConfigData, overlayDrawerPath)
    return overlayDrawerData 
}
