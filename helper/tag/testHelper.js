import * as dataHelper from "./contentDataHelper";
import * as utils from "../../utils/commonUtils";
let gqlQuery = require('../../test-data/verso/tagPageGraphqlQuery');

//Fetching tag page Data from graphql
export function getTagPageData(tagPageData, tagPageUrlIndex) {
    return cy.purgeUrl(utils.getPageUrl(tagPageData.brand, tagPageData.page, tagPageUrlIndex)).then(() => {
        if(tagPageData.tagUri !== undefined) {
            tagPageData.url = utils.getPageUrl(tagPageData.brand, tagPageData.page, tagPageUrlIndex);
            tagPageData.uri = tagPageData.tagUri;
        }
        else {
            tagPageData.url = utils.getPageUrl(tagPageData.brand, tagPageData.pageUrl, tagPageUrlIndex);
            tagPageData.uri = utils.getPageUri(tagPageData.brand, tagPageData.page, tagPageUrlIndex);
        }
        return dataHelper.getTagPageData(tagPageData).then((response) => {
            tagPageData.tag = response.data.search.content;
            if (!tagPageData.sortBy.modifySortByValue) {
                return dataHelper.getTagPageHeader(tagPageData).then((response) => {
                    tagPageData.Header = response.data.tagName.content.results[0].name;
                    return tagPageData;
                })
            }
            return tagPageData;
        })
    })
}

export function launchUrl(url) {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(url, { retryOnStatusCodeFailure: true });
}

export function validateTagPageContent(tagPageData) {
    if (tagPageData.brand === "bon-appetit") {
        cy.validateSortBy(tagPageData.sortBy);
        cy.validateFilter(tagPageData);
    }
    cy.validateTagBundleContent(tagPageData);
}

export function validateTagPageContentOnNextPage(tagPageData) {
    if (tagPageData.brand === "bon-appetit") {
        cy.validateSortBy(tagPageData.sortBy);
        cy.validateFilter(tagPageData);
    }
    cy.validateTagPageBundleContentOnNextPage(tagPageData, true);
}

export function updateSortByData(sortBy, filter, sortByValue, modifySortByValue) {
    sortBy.filter = filter;
    sortBy.sortByValue = sortByValue;
    sortBy.modifySortByValue = modifySortByValue;
    return sortBy;
}

export function updateFilterData(filter, modifyFilterUI, modifyFilterGQL, verifyFilterLabel, filterCombinationIndex) {
    filter.modifyFilterValue = modifyFilterUI;
    filter.modifyFilterValueGQL = modifyFilterGQL;
    filter.verifyFilterLabel = verifyFilterLabel;
    if (modifyFilterUI && modifyFilterGQL) {
        if (filterCombinationIndex === "All") {
            filter.modifyFilterList = filter.filterCombination;
        }
        else {
            filter.modifyFilterList = filter.filterCombination.filter(item => item.index === filterCombinationIndex);
        }
    }
    return filter;
}

export function clearAllFilters() {
    cy.clearFilters();
}

export function verifyUrlSlug(urlSlug) {
    cy.verifyUrlSlug(urlSlug);
}

export function navigateToNextPage(tagPageData) {
    cy.navigateToNextPage(tagPageData);
}

export function removeFilter(filter, removeFilterValue, removeFilterValueGQL, filterIndex, filterName) {
    filter.modifyFilterList[filterIndex].list = filter.modifyFilterList[filterIndex].list.filter(value => value !== removeFilterValue);
    filter.modifyFilterList[filterIndex].gql_list = filter.modifyFilterList[filterIndex].gql_list.filter(value => value !== removeFilterValueGQL);
    if (filterName) {
        cy.removeFilterFromDropdown(filterName, removeFilterValue);
    }
    else {
        cy.removeFilter(removeFilterValue);
    }
    return filter;
}

export function validateVogueTagPage(tagPageData) {
    cy.validateVogueTagBundleData(tagPageData)
}

export function getTopicPageData(tagPageData, channelUrlIndex) {
    cy.visit(utils.getPageUrl(tagPageData.brand, tagPageData.page, channelUrlIndex), { retryOnStatusCodeFailure: true });
    return dataHelper.getTopicPageData(tagPageData).then((response) => {
        tagPageData = response.data.search.content;
        return tagPageData;
    })
}
