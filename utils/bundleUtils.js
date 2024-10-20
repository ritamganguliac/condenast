let converter = require('number-to-words');
import * as _ from 'lodash';
let versoFeatures = ['verso-features', 'verso-multi-package-feature'];

let collageSplit =
{
    "summaryCollageSeven":
    {
        "splitStartIndex": 3
    },
    "summaryCollageEight":
    {
        "splitStartIndex": 4
    },
    "summaryCollageNine":
    {
        "splitStartIndex": 4
    }
}
let splitSummaryCollage = Object.keys(collageSplit);
let splitStartIndex;

export function getCurationContainerType(containerData) {
    if (containerData.items.edges.length != 0) {
        return containerData.template;
    }
    else
        return undefined;
}

export function getCurrentComponentName(workFlowData, layoutName) {
    let cartoonConfig = workFlowData.brandConfigData.configContent.homepageConfig["ComponentConfig.MultiPackages.settings.summaryCollageOneVariation"]
    if (workFlowData.curationContainerType == 'verso-ticker')
        return 'ticker';
    else if (workFlowData.curationContainerType == 'verso-promobox' || workFlowData.curationContainerType == 'solo-promo')
        return 'promobox';
    else if (workFlowData.curationContainerType == 'spotlight-story')
        return 'spotlight-story';
    else if ((workFlowData.curationContainerType == 'verso-featured-item' && (cartoonConfig === '' && cartoonConfig !== undefined)) || (workFlowData.curationContainerType == 'verso-featured-item' && workFlowData.componentLength == 1))
        return 'summaryCollageOne';
    else if (workFlowData.curationContainerType === 'verso-featured-item' && cartoonConfig === 'DailyCartoon')
        return 'versoCartoonFeature';
    else if (workFlowData.curationContainerType.includes('fifty-fifty'))
        return 'summaryCollageFiftyFifty';
    else if (workFlowData.curationContainerType == 'verso-river' || workFlowData.curationContainerType == 'verso-river-list')
        return 'river';
    else if (layoutName.includes('Collage'))
        return 'summaryCollage' + layoutName.replace('Collage', '');
    else if (workFlowData.curationContainerType === 'verso-features' && layoutName === 'SummaryCollectionRow')
        return 'summaryColumnfourGrid';
    else if ((workFlowData.curationContainerType !== 'verso-flat-package') && !workFlowData.curationContainerType.includes(workFlowData.multiPackageCollageTemplate) && (((versoFeatures.indexOf(workFlowData.curationContainerType) >= 0) && (workFlowData.preferenceForCollectionGrid && workFlowData.componentLength % 2 == 0)) || ([2, 8].indexOf(workFlowData.componentLength) >= 0)))
        return 'summaryCollectionGrid';
    else if (versoFeatures.indexOf(workFlowData.curationContainerType) >= 0 || (workFlowData.curationContainerType == 'verso-search-features' && layoutName === 'CollageFour') || (workFlowData.curationContainerType == 'verso-search-features' && workFlowData.componentLength % 2 != 0) || (workFlowData.curationContainerType == 'verso-features-rows'))
        return 'summaryCollage' + converter.toWords(workFlowData.componentLength).charAt(0).toUpperCase() + converter.toWords(workFlowData.componentLength).slice(1);
    else if (workFlowData.curationContainerType == 'verso-search-features')
        return 'summaryCollectionGrid';
    else if (workFlowData.curationContainerType == 'verso-collection-grid')
        return 'versoCollectionGrid';
    else if (workFlowData.curationContainerType == 'verso-topics-list')
        return 'horizontalList';
    else if (workFlowData.curationContainerType == 'verso-issue-feature')
        return 'versoIssueFeature';
    else if (workFlowData.curationContainerType == 'spotlight-contributor')
        return 'spotlight-contributor';
    else if (workFlowData.curationContainerType == 'verso-audio-article')
        return 'versoAudioArticle';
    else if (workFlowData.curationContainerType == 'verso-filterable-summary-list' || workFlowData.curationContainerType == 'verso-article-filterable-feature')
        return 'verso-filterable-summary-list';
    else if (workFlowData.curationContainerType == 'verso-curated-shows')
        return 'verso-curated-shows';
    else if (workFlowData.curationContainerType == 'verso-top-story-package' || workFlowData.curationContainerType == 'verso-flat-package' || workFlowData.curationContainerType == 'verso-focus-package' || workFlowData.curationContainerType == 'verso-puzzles-games-package')
        return 'versoSmartPackage';
    else if (workFlowData.curationContainerType == 'verso-hero-curated-feature')
        return 'verso-hero-curated-feature';
    else if (workFlowData.curationContainerType == 'verso-hero-search-feature')
        return 'verso-hero-search-feature';
    else if (workFlowData.curationContainerType == 'cartoons')
        return 'cartoons';
}

/**
 *  What is does -
 *      *Parse throught the bundle data
 *      * based on the curation type , number of items in the conainer and config values the appropriate verso component will be decided
 *      * After the verso component is decided the container data will added as a node under the key of that verso component
 *  what it returns - the converted bundle data , where various verso components (like fiveSummaryCollage,river,summaryCollectionGird)acts are parent node and the copilot container data mapped under it
 */

export function bundleDataConverter(workFlowData) {
    let convertedData = [];
    let supportedLayout = ['carousel']
    let sectionData = {};
    for (var i = 0; i < workFlowData.bundleData.length; i++) {
        var thisContainerPath = 'bundleData[' + i + ']';
        workFlowData.curationContainerType = getCurationContainerType(_.get(workFlowData, 'bundleData[' + i + ']'));
        if (workFlowData.curationContainerType == 'verso-multi-package-feature' && workFlowData.bundleData[i].items.edges[0].node.__typename.startsWith('Curated')) {
            workFlowData.bundleData[i].items.edges = workFlowData.bundleData[i].items.edges[1] ? [...workFlowData.bundleData[i].items.edges[0].node.items.results, ...workFlowData.bundleData[i].items.edges[1].node.items.results] : [...workFlowData.bundleData[i].items.edges[0].node.items.results];
        }
        workFlowData.componentLength = _.get(workFlowData, thisContainerPath + '.items.edges').length;
        var layoutName = _.get(workFlowData, thisContainerPath + '.layout');
        if (workFlowData.bundleData[i].template == 'summary-carousel') {
            layoutName = 'carousel'
        }
        let currentComponentName;
        if (layoutName != '' && supportedLayout.indexOf(layoutName.toLowerCase()) >= 0) {
            if (workFlowData.bundleData[i].items.edges.length < 1)
                continue;
            currentComponentName = layoutName.toLowerCase();
        }
        else
            currentComponentName = workFlowData.curationContainerType ? getCurrentComponentName(workFlowData, layoutName) : undefined;
        if (convertedData[currentComponentName]) {
            convertedData[currentComponentName].push(workFlowData.bundleData[i].items.edges.filter(item => item?.node?.hed || item?.title || item?.node?.cnehed || item?.node?.designer || item?.hed || item?.node?.legalName || item?.node?.name || item?.node?.editorial));
            sectionData[currentComponentName].push(this.getSectionData(workFlowData.bundleData[i]));
        }
        else {
            convertedData[currentComponentName] = [];
            sectionData[currentComponentName] = [];
            sectionData[currentComponentName].push(this.getSectionData(workFlowData.bundleData[i]));
            convertedData[currentComponentName].push(workFlowData.bundleData[i].items.edges.filter(item => item?.node?.hed || item?.title || item?.node?.cnehed || item?.node?.designer || item?.node?.legalName || item?.promoHed || item?.hed || item?.node?.editorial));
        }
    }
    delete convertedData['undefined'];
    delete sectionData['undefined'];
    return { convertedData, sectionData };
}

export function getSectionData(containerData) {
    var sectionData = {};
    sectionData.hed = containerData.hed;
    sectionData.dek = containerData.dek;
    return sectionData;
}

export function parseMultiPackageFeature(workFlowData, convertedData, thisContainerPath) {
    let currentComponentData = _.get(workFlowData, thisContainerPath + '.items');
    currentComponentData.edges = [...currentComponentData.edges[0].node.items.results, ...currentComponentData.edges[1].node.items.results];
    workFlowData.componentLength = currentComponentData.edges.length;
    let currentComponentName = getCurrentComponentName(workFlowData);
    if (currentComponentName) {
        convertedData[currentComponentName] = [];
        convertedData[currentComponentName].push(currentComponentData.edges);
    }
    return convertedData;
}

export function getSummaryItemData(workFlowData) {
    let expectedHed;
    let expectedHedUrl;
    let expectedDek;
    let expectedRubric;
    let expectedSectionHed;
    let expectedSectionDek;
    let expectedContributorAuthors;
    let expectedBylineAuthor = [];
    let expectedBylinePhotographer = [];
    if (workFlowData.currentComponentName == 'summaryCollectionRow') {
        expectedHed = workFlowData.trendingStoriesData[workFlowData.currentItemIndex].title;
        expectedDek = workFlowData.trendingStoriesData[workFlowData.currentItemIndex].dek;
        expectedRubric = workFlowData.trendingStoriesData[workFlowData.currentItemIndex].section;
        expectedSectionHed = workFlowData.currentComponentConfig.recommendedHed;
        expectedSectionDek = '';
        expectedHedUrl = workFlowData.trendingStoriesData[workFlowData.currentItemIndex].url;
        let authorPreamble = workFlowData.brandConfigData.translations['Bylines.AuthorPreamble'] ? workFlowData.brandConfigData.translations['Bylines.AuthorPreamble'][0]?.value ? (workFlowData.brandConfigData.translations['Bylines.AuthorPreamble'][0]?.value + ' ' + expectedBylineAuthor.join(' ')) : expectedBylineAuthor.join(' ') : '';
        for (var i = 0; i < workFlowData.trendingStoriesData[workFlowData.currentItemIndex].authors.length; i++) {
            if (i == 0 && workFlowData.trendingStoriesData[workFlowData.currentItemIndex].authors.length > 0)
                expectedBylineAuthor.push(authorPreamble);
            expectedBylineAuthor.push(workFlowData.trendingStoriesData[workFlowData.currentItemIndex]?.authors ? workFlowData.trendingStoriesData[workFlowData.currentItemIndex]?.authors[i] : '');
        }
    }
    else {
        let summaryData = workFlowData.currentComponentData;
        if (summaryData.length > 0) {
            expectedHed = summaryData[workFlowData.currentItemIndex].contextualHed ? summaryData[workFlowData.currentItemIndex].contextualHed :
                summaryData[workFlowData.currentItemIndex]?.node?.promoHed ? summaryData[workFlowData.currentItemIndex]?.node?.promoHed :
                    summaryData[workFlowData.currentItemIndex]?.node?.hed ? summaryData[workFlowData.currentItemIndex].node.hed :
                        summaryData[workFlowData.currentItemIndex].promoHed ? summaryData[workFlowData.currentItemIndex].promoHed :
                            summaryData[workFlowData.currentItemIndex].hed ? summaryData[workFlowData.currentItemIndex].hed :
                                summaryData[workFlowData.currentItemIndex]?.node?.cnehed ? summaryData[workFlowData.currentItemIndex].node.cnehed :
                                    summaryData[workFlowData.currentItemIndex].node.legalName ? summaryData[workFlowData.currentItemIndex].node.legalName : '';
            expectedDek = summaryData[workFlowData.currentItemIndex].contextualDek ? summaryData[workFlowData.currentItemIndex].contextualDek :
                summaryData[workFlowData.currentItemIndex]?.node?.promoDek ? summaryData[workFlowData.currentItemIndex].node.promoDek :
                    summaryData[workFlowData.currentItemIndex]?.node?.dek ? summaryData[workFlowData.currentItemIndex].node.dek :
                        summaryData[workFlowData.currentItemIndex].promoDek ? summaryData[workFlowData.currentItemIndex].promoDek :
                            summaryData[workFlowData.currentItemIndex].dek ? summaryData[workFlowData.currentItemIndex].dek :
                                summaryData[workFlowData.currentItemIndex].cnedek ? summaryData[workFlowData.currentItemIndex].cnedek :
                                    summaryData[workFlowData.currentItemIndex].node.knowsAbout ? summaryData[workFlowData.currentItemIndex].node.knowsAbout : '';
            expectedRubric = getExpectedRubric(workFlowData);
        }
        //For few Runway articles in Vogue.com designer name is displayed as hed and season name is displayed as dek
        if (summaryData[workFlowData.currentItemIndex]?.node?.season && summaryData[workFlowData.currentItemIndex]?.node?.designer) {
            expectedHed = summaryData[workFlowData.currentItemIndex].node.promoTitle ? summaryData[workFlowData.currentItemIndex].node.promoTitle : summaryData[workFlowData.currentItemIndex].node.designer.name;
            expectedDek = summaryData[workFlowData.currentItemIndex].node.season.name;
        }
        if (workFlowData.currentComponentName === 'carousel' && workFlowData.emptyCarousel) {
            expectedSectionHed = workFlowData.sectionData[workFlowData.currentComponentName][workFlowData.currentComponentIndex + 1].hed;
            expectedSectionDek = workFlowData.sectionData[workFlowData.currentComponentName][workFlowData.currentComponentIndex + 1].dek;
        }
        else {
            expectedSectionHed = workFlowData.sectionData[workFlowData.currentComponentName][workFlowData.currentComponentIndex].hed;
            expectedSectionDek = workFlowData.sectionData[workFlowData.currentComponentName][workFlowData.currentComponentIndex].dek;
        }
        expectedHedUrl = summaryData[workFlowData.currentItemIndex]?.node?.url ? summaryData[workFlowData.currentItemIndex].node.url :
            summaryData[workFlowData.currentItemIndex]?.node?.publishedRevisions.results[0].uri ? summaryData[workFlowData.currentItemIndex].node.publishedRevisions.results[0].uri : summaryData[workFlowData.currentItemIndex]?.url ? summaryData[workFlowData.currentItemIndex]?.url : null;
        [expectedBylineAuthor, expectedBylinePhotographer, expectedContributorAuthors] = getBylineText(summaryData, workFlowData);
    }
    return { expectedHed, expectedDek, expectedHedUrl, expectedSectionHed, expectedSectionDek, expectedBylineAuthor, expectedBylinePhotographer, expectedContributorAuthors, expectedRubric };
}

/**
 * Description - This function takes the contributors node from bundle data as input
 * and return the expected byline authors and byline photographers text (if the same was defined in the bundle) in the designated formats
 */
export function getBylineText(summaryData, workFlowData) {
    let expectedBylineAuthor = [];
    let expectBylinePhotographer = [];
    let authorPreamble = workFlowData.brandConfigData.translations['Bylines.AuthorPreamble'] ? workFlowData.brandConfigData.translations['Bylines.AuthorPreamble'][0]?.value ? (workFlowData.brandConfigData.translations['Bylines.AuthorPreamble'][0]?.value + ' ' + expectedBylineAuthor.join(' ')) : expectedBylineAuthor.join(' ') : '';
    let photographerPreamble = workFlowData.brandConfigData.translations['Bylines.PhotographerPreamble'][0].value;
    if (summaryData.length > 0) {
        if (!summaryData[workFlowData.currentItemIndex]?.node?.allContributors && summaryData[workFlowData.currentItemIndex].allContributors) {
            summaryData[workFlowData.currentItemIndex].node = {};
            summaryData[workFlowData.currentItemIndex].node.allContributors = summaryData[workFlowData.currentItemIndex].allContributors;
        }
        let authorPreambleAdded = false;
        let photographerPreambleAdded = false;
        for (let i = 0; summaryData[workFlowData.currentItemIndex]?.node?.allContributors && i < summaryData[workFlowData.currentItemIndex].node.allContributors.edges.length; i++) {
            if (summaryData[workFlowData.currentItemIndex].node.allContributors.edges[i].node.type == 'AUTHOR') {
                if (!authorPreambleAdded)
                    expectedBylineAuthor.push(authorPreamble + summaryData[workFlowData.currentItemIndex].node.allContributors.edges[i].node.name);
                else
                    expectedBylineAuthor.push(summaryData[workFlowData.currentItemIndex].node.allContributors.edges[i].node.name);
                authorPreambleAdded = true;
            }
            if (summaryData[workFlowData.currentItemIndex].node.allContributors.edges[i].node.type == 'PHOTOGRAPHER') {
                if (!photographerPreambleAdded)
                    expectBylinePhotographer.push(photographerPreamble + ' ' + summaryData[workFlowData.currentItemIndex].node.allContributors.edges[i].node.name);
                else
                    expectBylinePhotographer.push(summaryData[workFlowData.currentItemIndex].node.allContributors.edges[i].node.name);
                photographerPreambleAdded = true;
            }
        }
    }
    let expectedContributorAuthors = expectedBylineAuthor.length > 0 ? expectedBylineAuthor.join(' ').replace('By', '') : '';
    return [expectedBylineAuthor, expectBylinePhotographer, expectedContributorAuthors];
}

function getExpectedRubric(workFlowData) {
    let summaryData = workFlowData.currentComponentData;
    summaryData[workFlowData.currentItemIndex].channels = summaryData[workFlowData.currentItemIndex]?.channels ? summaryData[workFlowData.currentItemIndex].channels : summaryData[workFlowData.currentItemIndex]?.node?.channels ? summaryData[workFlowData.currentItemIndex].node.channels : '';
    summaryData[workFlowData.currentItemIndex].sections = summaryData[workFlowData.currentItemIndex]?.sections ? summaryData[workFlowData.currentItemIndex].sections : summaryData[workFlowData.currentItemIndex]?.node?.sections ? summaryData[workFlowData.currentItemIndex].node.sections : '';
    summaryData[workFlowData.currentItemIndex].rubric = summaryData[workFlowData.currentItemIndex]?.rubric ? summaryData[workFlowData.currentItemIndex].rubric : summaryData[workFlowData.currentItemIndex]?.node?.rubric ? summaryData[workFlowData.currentItemIndex].node.rubric : '';
    if (workFlowData.brandConfigData.featureFlags.bundleTeaser == 'channel-only')
        return summaryData[workFlowData.currentItemIndex]?.channels?.length >= 1 ? summaryData[workFlowData.currentItemIndex].channels[0].name : '';
    else if (workFlowData.brandConfigData.featureFlags.bundleTeaser == 'rubric-only' || workFlowData.brandConfigData.featureFlags.bundleTeaser == 'tag-or-channel')
        return summaryData[workFlowData.currentItemIndex]?.rubric ? summaryData[workFlowData.currentItemIndex].rubric : '';
    else if (workFlowData.brandConfigData.featureFlags.bundleTeaser == 'rubric-or-channel' || workFlowData.brandConfigData.featureFlags.bundleTeaser == 'location-or-channel-or-rubric' || workFlowData.brandConfigData.featureFlags.contentTeaser == 'rubric-or-channel')
        return summaryData[workFlowData.currentItemIndex]?.rubric ? summaryData[workFlowData.currentItemIndex].rubric : summaryData[workFlowData.currentItemIndex]?.channels.length > 0 ? summaryData[workFlowData.currentItemIndex].channels[0].name : '';      // FIX AUTOMATION-1577
    else if (workFlowData.brandConfigData.featureFlags.bundleTeaser.includes('rubric-or-channel-or-section'))
        return summaryData[workFlowData.currentItemIndex]?.rubric ? summaryData[workFlowData.currentItemIndex].rubric : summaryData[workFlowData.currentItemIndex]?.channels?.length >= 1 ? summaryData[workFlowData.currentItemIndex].channels[0].name : summaryData[workFlowData.currentItemIndex]?.sections?.length >= 1 ? summaryData[workFlowData.currentItemIndex].sections[0].name : '';
}

export function shouldHideDek(workFlowData, expecteDek) {
    let config = workFlowData.currentComponentConfig;
    var result = true;
    var componentsWithNoDek = ['summaryCollectionGridContributor', 'summaryCollectionRow']
    if (splitSummaryCollage.includes(workFlowData.currentComponentName)) {
        splitStartIndex = collageSplit[workFlowData.currentComponentName].splitStartIndex;
    }
    let typeName;
    if (config.runwayEvent != undefined) {
        typeName = workFlowData.currentComponentData[workFlowData.currentItemIndex]?.node?.__typename ? workFlowData.currentComponentData[workFlowData.currentItemIndex].node.__typename : '';
    }
    if (expecteDek?.length > 1 && componentsWithNoDek.indexOf(workFlowData.currentComponentName) == -1) {
        if (splitSummaryCollage.includes(workFlowData.currentComponentName) && workFlowData.currentItemIndex < splitStartIndex && config.hideDek != true) {
            result = false;
        }
        else if (config.hideDek === true && typeName === 'RunwayShow')
            result = false
        else if (config.shouldHideDangerousDekInSummaryList === false || !splitSummaryCollage.includes(workFlowData.currentComponentName) && config.hideDek != true && workFlowData.currentItemIndex < config.hideFeatureDekFromIndex) {
            result = false;
        }
    }
    return result;
}

export function shouldValidateImageUrl(workFlowData) {
    if (Cypress.env('validateImageUrl')) {
        if (workFlowData.currentComponentName == 'summaryCollageSeven' && workFlowData.currentItemIndex < 3) {
            return true;
        }
        else if (workFlowData.currentComponentName != 'summaryCollageSeven') {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

/**
 * This function will filter the items with copilot IDs which already exists in the summary section which is location at the top of the trending stories
 */

export function filterTrendingStories(workFlowData) {
    let getInvalidSummarySection = workFlowData.getInvalidSummarySection;
    let trendingStoriesData = workFlowData.trendingStoriesData;
    let j = 0;
    if (workFlowData.page == 'homepage' || workFlowData.page == 'channel') {
        while (j < 3) {
            if (trendingStoriesData[j] !== undefined && trendingStoriesData[j].copilotID !== '') {
                let id = new RegExp('\"id\":\"' + trendingStoriesData[j].copilotID + '\"');
                if (id.test(JSON.stringify(getInvalidSummarySection))) {
                    trendingStoriesData.splice(j, 1);
                    j--;
                }
            }
            j++;
        }
    }
    return trendingStoriesData.splice(0, 3);
}

/**
 * The scope of this function is to return summary section's data of the section which is present at the top of the trending stories section
 */

export function getInvalidSummarySection(workFlowData) {
    let topSummaryContainers = ['verso-features', 'verso-multi-package-feature'];
    let invalidSummarySection = {};
    for (var i = 0; i < workFlowData.bundleData.length; i++) {
        if (topSummaryContainers.indexOf(workFlowData.bundleData[i].template) >= 0 && workFlowData.bundleData[i].items.edges.length >= 1) {
            invalidSummarySection = workFlowData.bundleData[i];
            break;
        }
    }
    return invalidSummarySection;
}

export function shouldUseDekAsHed(workFlowData, expectedSectionHed, expectedSectionDek) {
    let config = workFlowData.currentComponentConfig;
    let displayHed;
    if (config.shouldUseDekAsHed && expectedSectionDek?.length > 1 && expectedSectionHed?.length > 1) {
        displayHed = expectedSectionDek;
    }
    else {
        displayHed = expectedSectionHed;
    }
    return displayHed;
}
