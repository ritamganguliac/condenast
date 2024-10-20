//Fetch article data
let testData = require('../../test-data/verso/url.json');
let gqlQuery = require('../../test-data/verso/articleGraphqlQuery');
let gqlCaptionQuery = require('../../test-data/verso/cartoonCaptionQuery');
let gqlEventsQuery = require('../../test-data/verso/eventQuery');
let articleUpcData;

export function getArticleData(workFlowData, articleData, UrlIndex = 0) {
    let articleUri = testData[Cypress.env('environment')][workFlowData.brand][workFlowData.page];
    gqlQuery.articleQuery.variables.uri = articleUri[UrlIndex].replace("/", '')
    gqlQuery.articleQuery.variables.orgId = testData[Cypress.env('environment')][workFlowData.brand]['orgId'];
    return cy.queryGraphQL(gqlQuery.articleQuery).then((response) => {
        articleData = response.body;
        return articleData
    })
}

export function getUpcData(query) {
    return cy.queryGraphQL(query).then((response) => {
        articleUpcData = response.body.data;
        return articleUpcData
    })
}

export function getCartoonCaptionData(cartoonCaptionData, captionStage) {
    gqlCaptionQuery.cartoonCaptionQuery.variables.contestStages = captionStage
    return cy.queryGraphQL(gqlCaptionQuery.cartoonCaptionQuery, 'tnyCartoon').then((response) => {
        cartoonCaptionData = response.body;
        return cartoonCaptionData
    })
}

export function getEventData(workFlowData, eventData, urlIndex) {
    let eventUri = testData[Cypress.env('environment')][workFlowData.brand][workFlowData.page];
    gqlEventsQuery.eventQuery.variables.uri = eventUri[urlIndex].replace("/", '')
    gqlEventsQuery.eventQuery.variables.organizationId = testData[Cypress.env('environment')][workFlowData.brand]['orgId'];
    return cy.queryGraphQL(gqlEventsQuery.eventQuery).then((response) => {
        return response.body.data.getCulturalEvent;
    })
}
