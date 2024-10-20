import * as dataHelper from "./contentDataHelper";
import * as utils from "../../utils/commonUtils";
import * as brandHelper from "../bundle/contentDataHelper";
let testData = require('../../test-data/verso/url.json');

//Fetching hero recipe url
export function getHeroRecipe(recipePageData) {
    return cy.visit(utils.getPageUrl(recipePageData.brand, recipePageData.page), { retryOnStatusCodeFailure: true }).then(() => {
        return cy.getHeroRecipe(recipePageData);
    })
}

//Fetching recipe page Data from graphql
export function getRecipePageData(recipePageData, recipeUrlIndex) {
    if (recipeUrlIndex !== undefined){
        recipePageData.url = utils.getPageUrl(recipePageData.brand, recipePageData.page, recipeUrlIndex);
        recipePageData.pageUri = utils.getPageUri(recipePageData.brand, recipePageData.page, recipeUrlIndex);
        recipePageData.urlWithoutTestParameters = recipePageData.url.replace(testData.urlParameters, "");
    }
    return cy.purgeUrl(recipePageData.url).then(() => {
        cy.visit(recipePageData.url, { retryOnStatusCodeFailure: true });
        return dataHelper.getRecipePageData(recipePageData).then((response) => {
            recipePageData.recipe = response.data.getRecipe;
            return brandHelper.getBrandConfig(recipePageData).then((data) => {
                recipePageData.brandConfigData = data;
                return recipePageData;
            })
        })
    })
}

//Validate recipe page data
export function validateRecipePageContent(recipePageData) {
    cy.validateRecipePageContent(recipePageData);
}

//Validate paywall banner and cne video
export function validatePaywallAndCneVideo(recipePageData) {
    cy.purgeUrl(recipePageData.urlWithoutTestParameters).then(() => {
        cy.visit(recipePageData.urlWithoutTestParameters, { retryOnStatusCodeFailure: true }).then(() => {
            cy.validatePaywallAndCneVideo(recipePageData);
        })
    })
}
