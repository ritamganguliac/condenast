
import * as _ from 'lodash';
import * as dataHelper from "./contentDataHelper";
import * as configHelper from "./configHelper";
import * as utils from "../../utils/commonUtils";
import * as bundlUtils from "../../utils/bundleUtils";
const { selectors } = require("../../selectors/verso/selectors");

/**
 *  What is does -
 *      *Gets bundle data from content api and set it in workflow data
 *      *Gets trending stories data and set it in workflow data
 *      *Gets brand config and set it in workflow data
 *      *calls bundle converter function to convert the copilot data by mapping it to right verso component
 *  what it returns - the workflow data with keys bundleData , trendingStoriesData , brandConfigData
 */

export function getTestData(workFlowData, channelUrlIndex) {
    return cy.purgeUrl(utils.getPageUrl(workFlowData.brand, workFlowData.page, channelUrlIndex)).then(() => {
        cy.visit(utils.getPageUrl(workFlowData.brand, workFlowData.page, channelUrlIndex), { retryOnStatusCodeFailure: true });
        workFlowData.pageUri = utils.getPageUri(workFlowData.brand, workFlowData.page, channelUrlIndex);
        workFlowData.pageUri = workFlowData.pageUri.replace(/\?.*$/g, "")
        return getBundleInfo(workFlowData).then(() => {
            workFlowData.bundleData = workFlowData.bundleInfo.data.getBundle.containers.results;
            workFlowData.getInvalidSummarySection = bundlUtils.getInvalidSummarySection(workFlowData);
            dataHelper.getTrendingStoriesInfo(workFlowData).then((data) => {
                workFlowData.trendingStoriesData = data;
            })
        }).then(() => {
            return dataHelper.getBrandConfig(workFlowData, channelUrlIndex).then((data) => {
                workFlowData.brandConfigData = data;
                workFlowData.preferenceForCollectionGrid = configHelper.getPreferenceForCollectionGrid(workFlowData);
                workFlowData.multiPackageCollageTemplate = configHelper.getMultiPackageCollageTemplate(workFlowData);
                let { convertedData, sectionData } = bundlUtils.bundleDataConverter(workFlowData);
                workFlowData.bundleData = convertedData;
                workFlowData.sectionData = sectionData;
                if (workFlowData.trendingStoriesData) {
                    workFlowData.trendingStoriesData = bundlUtils.filterTrendingStories(workFlowData);
                }
                return workFlowData;
            })
        })
    })
}

export function validateBundle(workFlowData) {
    let globalPageSelectors = require("../../selectors/verso/global.json");
    let headerSelector = globalPageSelectors.header;
    if (Object.keys(workFlowData.bundleData)[0] && Object.keys(workFlowData.bundleData)[0] != 'sectionData') {
        if (workFlowData.bundleData[Object.keys(workFlowData.bundleData)[0]]) {
            if (workFlowData.shouldValidateChannelHedAndDek) {
                cy.validateChannelPageHedAndDek(workFlowData);
            }
            bundleDataHandler(workFlowData);
        }
    }
    else
        return null;
}

export function validateNextPage(workFlowData) {
    cy.validateNextPage(workFlowData);
}

export function validateMoreStoriesPage(workFlowData) {
    cy.validateMoreStoriesPage(workFlowData)
}

function bundleDataHandler(workFlowData) {
    workFlowData.currentComponentName = Object.keys(workFlowData.bundleData)[0];
    var firstIndexWithData = utils.getIndexWithData(workFlowData.bundleData[workFlowData.currentComponentName]);
    if (workFlowData.currentComponentName === 'carousel' && workFlowData.emptyCarousel)
        workFlowData.currentComponentIndex = firstIndexWithData - 1;
    else
        workFlowData.currentComponentIndex = firstIndexWithData;
    workFlowData.currentComponentData = workFlowData.bundleData[workFlowData.currentComponentName][firstIndexWithData];
    workFlowData = configHelper.getBundleConfig(workFlowData);
    var thisWorkFlowData = _.cloneDeep(workFlowData);
    thisWorkFlowData.sectionData = workFlowData.sectionData;
    let componentName = ['summaryCollageFiftyFifty', 'versoIssueFeature', 'spotlight-story', 'spotlight-contributor', 'featured-contributor', 'verso-curated-shows', 'versoCartoonFeature', 'verso-focus-package', 'verso-hero-curated-feature', 'verso-hero-search-feature']
    if (componentName.includes(workFlowData.currentComponentName)) {
        validateBundleComponent(thisWorkFlowData, 0, 0);          // To handle the difference in web and mobile TNY for verso Issue feature loop will be run only once to compare with bundle API
    }
    else {
        validateBundleComponent(thisWorkFlowData);
    }
    if (workFlowData.currentComponentName === 'carousel' && workFlowData.currentComponentData.length === 0)
        workFlowData.emptyCarousel = true
    if (workFlowData.bundleData[Object.keys(workFlowData.bundleData)[0]].filter(n => n).length === 1) {
        delete workFlowData.bundleData[workFlowData.currentComponentName];
        return;
    }
    else {
        delete workFlowData.bundleData[workFlowData.currentComponentName][firstIndexWithData];
        return;
    }
}

export function validateTrendingStories(workFlowData) {
    workFlowData.currentComponentName = 'summaryCollectionRow';
    workFlowData = configHelper.getBundleConfig(workFlowData);
    if (workFlowData.currentComponentConfig.hideHomepageRelated == false)
        validateBundleComponent(workFlowData, 0, 2);
    else
        cy.validateTrendingStoriesDoesNotExists(workFlowData);
}

/***
 *  What is does -
 *      *Gets history of given bundle ID
 *      *From history it gets the latest revision number which is published
 *      *From that revision number it gets the bundle Data
 *      *In bundle data it checks whether curatedData exists in bundle , If yes , it gets the data and add it to the bundle data
 *  what it returns - the workflow data with keys bundleInfo which contains all the info needed for the test
 */

function getBundleInfo(workFlowData) {
    return cy.getBundleId().then((bundleId) => {
        workFlowData.bundleId = bundleId;
        return dataHelper.getBundleData(workFlowData).then((data) => {
            workFlowData.bundleInfo = data;
            return workFlowData;
        })
    })
}

function validateBundleComponent(workFlowData, startIndex = 0, endIndex = workFlowData.currentComponentData.length - 1) {
    if (workFlowData.currentComponentName === 'summaryCollageFiftyFifty' && workFlowData.currentComponentConfig.summaryCollageFiftyFiftyOneColumn != 'one-column')
        endIndex = workFlowData.currentComponentData.length - 1
    workFlowData.eventsNonCTAPresent = false;
    let sectionHed = workFlowData.sectionData[workFlowData.currentComponentName]?.[workFlowData.currentComponentIndex]?.hed ? workFlowData.sectionData[workFlowData.currentComponentName][workFlowData.currentComponentIndex].hed : '';
    for (var i = startIndex; i <= endIndex; i++) {
        if (i == 5 && workFlowData.currentComponentName === 'summaryCollageFive' || i == 1 && workFlowData.currentComponentName === 'verso-filterable-summary-list')
            return
        let thisWorkFlowData = _.cloneDeep(workFlowData);
        thisWorkFlowData.currentItemIndex = i;
        if (sectionHed !== "Editor recommendations")
            assertionsHandler(thisWorkFlowData);
        if (workFlowData.page === 'events') {
            let expectedCTALabel = thisWorkFlowData.currentComponentData[thisWorkFlowData.currentItemIndex]?.node?.ctaLabel ? thisWorkFlowData.currentComponentData[thisWorkFlowData.currentItemIndex].node.ctaLabel : undefined;
            workFlowData.eventsNonCTAPresent = expectedCTALabel === undefined ? true : false;
        }
    }
}

function assertionsHandler(workFlowData) {
    if (workFlowData.brand === 'bon-appetit' && workFlowData.page === 'channel') {
        if (workFlowData.currentComponentData[workFlowData.currentItemIndex].node.__typename === 'Gallery') {
            cy.validateSlideCount(workFlowData);
            cy.validateGalleryIcon(workFlowData);
        }
    }
    if (workFlowData.currentComponentName == 'ticker')
        cy.validateTicker(workFlowData);
    else if (workFlowData.currentComponentName == 'summaryCollageFiftyFifty' && workFlowData?.currentComponentData && !(workFlowData?.currentComponentData[workFlowData.currentItemIndex]?.node?.__typename === 'CNEVideo' || (workFlowData?.currentComponentData[workFlowData.currentItemIndex]?.__typename === 'CNEVideo'))) {
        cy.validateSummaryFiftyFifty(workFlowData);
    }
    else if (workFlowData.page === 'events') {
        cy.validateEventsSummary(workFlowData);
    }
    //skipping the validation for Video Item present in the summaryCollageThree, carousel,river items
    else if ((workFlowData.currentComponentName.includes('summary') && workFlowData?.currentComponentData && !(workFlowData?.currentComponentData[workFlowData.currentItemIndex]?.__typename === 'CNEVideo' || (workFlowData?.currentComponentData[workFlowData.currentItemIndex]?.node?.__typename === 'CNEVideo')))
        || (workFlowData.currentComponentName.includes('river') && workFlowData?.currentComponentData && !(workFlowData?.currentComponentData[workFlowData.currentItemIndex]?.node?.__typename === 'CNEVideo' || (workFlowData?.currentComponentData[workFlowData.currentItemIndex]?.__typename === 'CNEVideo')))
        || workFlowData.currentComponentName.includes('horizontalList')
        || workFlowData.currentComponentName.includes('summaryCollectionRow')
        || workFlowData.currentComponentName.includes('versoAudioArticle')
        || workFlowData.currentComponentName.includes('carousel') && workFlowData?.currentComponentData && !(workFlowData?.currentComponentData[workFlowData.currentItemIndex]?.node?.__typename === 'CNEVideo' || (workFlowData?.currentComponentData[workFlowData.currentItemIndex]?.__typename === 'CNEVideo'))) {
        cy.validateSummary(workFlowData);
    }
    //Making the below change to avoid the execution of promobox assertions. This change will be reverted once the change AUTOMATION-992 was done
    else if (workFlowData.currentComponentName === 'promobox' || workFlowData.currentComponentName === 'solo-promo') {
        cy.validatePromoBox(workFlowData);
    }
    else if (workFlowData.currentComponentName === 'versoCartoonFeature') {
        cy.validateCartoonFeature(workFlowData);
    }
    else if (workFlowData.currentComponentName == 'versoIssueFeature') {
        cy.validateIssueFeature(workFlowData);
    }
    else if (workFlowData.currentComponentName == 'spotlight-story') {
        cy.validateStorySpotlight(workFlowData);
    }
    else if (workFlowData.currentComponentName == 'spotlight-contributor') {
        cy.validateContributorSpotlight(workFlowData);
    }
    if (workFlowData.currentComponentName == 'versoCollectionGrid') {
        cy.validateSummary(workFlowData);
    }
    else if (workFlowData.currentComponentName == 'verso-filterable-summary-list') {
        cy.validateFilterableSummary(workFlowData)
    }
    else if (workFlowData.currentComponentName == 'verso-curated-shows') {
        cy.validateCuratedShows(workFlowData)
    }
    else if (workFlowData.currentComponentName.includes('versoSmartPackage')) {
        cy.validateSmartPackage(workFlowData)
    }
    else if (workFlowData.currentComponentName == 'verso-hero-curated-feature') {
        cy.validateHeroCuratedFeature(workFlowData)
    }
    else if (workFlowData.currentComponentName == 'verso-hero-search-feature') {
        cy.validateHeroSearchFeature(workFlowData)
    }
    else if (workFlowData.currentComponentName == 'cartoons') {
        cy.validateCartoons(workFlowData)
    }
}

export function validateTopStories(workFlowData) {
    if (('#top-stories').length > 0) {
        cy.textEquals(selectors.bundles.children.defaultSectionTitle, 0, workFlowData.bundleInfo.data.getBundle.containers.results[2].hed)
        cy.get(selectors.bundles.children.topStoriesSection).within(() => {
            let authorPreamble = workFlowData.brandConfigData.translations['Bylines.AuthorPreamble'][0].value;
            let byLineIndex = 0;
            cy.get(selectors.bundles.children.hedUrl).each(($ele, index) => {
                cy.validateUrl(workFlowData, $ele.prop('href'))
                let hed = workFlowData.getInvalidSummarySection.items.edges[index].promoHed ? workFlowData.getInvalidSummarySection.items.edges[index].promoHed : workFlowData.getInvalidSummarySection.items.edges[index].hed;
                cy.textEquals(selectors.bundles.children.topStoriesHed, index, hed)
                let byLine = workFlowData.getInvalidSummarySection.items.edges[index].allContributors.edges.length > 0 ? workFlowData.getInvalidSummarySection.items.edges[index].allContributors.edges[0].node.name : '';
                if (byLine == '')
                    byLineIndex -= 1;
                else
                    cy.textEquals(selectors.bundles.children.byLineName, byLineIndex, authorPreamble + ' ' + byLine)
                byLineIndex += 1;
            })
        })
    }
}

export function validateNewsletterSubscribeForm(workFlowData) {
    cy.validateNewsletterSubscribeForm(workFlowData)
}

export function validateSubNavigationLink(workFlowData) {
    cy.validateSubNavigationLink(workFlowData);
}

export function validateChannelPageHedAndDek(workFlowData) {
    cy.validateChannelPageHedAndDek(workFlowData);
}

export function validateRunwayPageCuratedListCount(apiListCount, type) {
    if (type === 'curatedList') {
        cy.validateCount(apiListCount, type)
    }
    else if (type === 'Seasons' || type === 'Designers') {
        cy.get(selectors.global.content.runwaysChannelsLink + type + "]").click()
        cy.wait(500)
        cy.validateCount(apiListCount, type)
    }
}
export function validateChannelNavigationHeadermenu(workFlowData) {
    cy.get(selectors.bundles.children.channelNavigationLogo).should('be.visible')
    cy.get(selectors.bundles.children.promo_image).first().invoke('attr', 'src').then((imgSrcUrl) => {
        cy.validateUrl(workFlowData, imgSrcUrl);
    })
    cy.get(selectors.bundles.children.channelNavigationLink).each(($el, index) => {
        let link = $el.prop('href')
        cy.validateUrl(workFlowData, link)
    })
    cy.validateDrawerSignInLink(workFlowData)
}

export function validateMenuHighlight(menuTitle, locator) {
    //Validate the highlighted select submenu.
    cy.get(locator).first().within(() => {
        cy.get(selectors.global.content.navListItem).each(($el) => {
            const before = getComputedStyle($el[0], '::before')
            const bgColor = before.getPropertyValue('background-color')
            if ($el.text() === menuTitle) {
                expect(bgColor).to.not.equal('rgba(0, 0, 0, 0)')
            } else
                expect(bgColor).to.equal('rgba(0, 0, 0, 0)')
        })
    })
}

export function validateBundleHeader(eventData) {
    cy.validateBundleHeader(eventData)
}
