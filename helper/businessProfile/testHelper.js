import * as testDataHelper from "./contentDataHelper.js";
import * as utils from "../../utils/commonUtils";
let gqlQuery = require('../../test-data/verso/galleryGraphqlQuery');

export function getProfileInfo(profilePageData, channelUrlIndex) {
    cy.visit(utils.getPageUrl(profilePageData.brand, profilePageData.page, channelUrlIndex), { retryOnStatusCodeFailure: true });
    return testDataHelper.getBusinessData(profilePageData, gqlQuery.profilePageQuery).then((data) => {
        profilePageData = data;
        return profilePageData;
    })
}
export function validateProfileHed(profilePageData) {
    cy.validateProfileHed(profilePageData)
    cy.validateProfileAddress();
}
export function validateProfileImages() {
    cy.validateProfileImages();
}

export function getSearchPageInfo(searchPageData, channelUrlIndex) {
    cy.visit(utils.getPageUrl(searchPageData.brand, searchPageData.page, channelUrlIndex), { retryOnStatusCodeFailure: true });
    return testDataHelper.getBusinessData(searchPageData, gqlQuery.profileSearchPage).then((data) => {
        searchPageData = data;
        return searchPageData;
    })
}


export function validateProfileCard(searchPageData) {
    cy.validateProfileCard(searchPageData)
}

export function validateSearchPageImages() {
    cy.filterSearchPage();
    cy.validateSearchPageImages()
}

export function validateDropdownValues(searchPageData) {
    cy.validateDropdownValues(searchPageData)
}

export function applyPageValidation(searchPageData){
    cy.applyPageValidation(searchPageData)
}

export function formPageValidation(searchPageData){
    cy.formPageValidation(searchPageData)
}

export function validateSearchPageWithValidString(validText, searchPageData){
    cy.validateSearchPageWithValidString(validText, searchPageData)
}

export function validateSearchPageWithInvalidString(SearchPageData){
    cy.validateSearchPageWithInvalidString(SearchPageData)
}

export function validateSortingOption(SearchPageData){
    cy.validateSortingOption(SearchPageData)
}
