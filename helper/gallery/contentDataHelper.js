let testData = require('../../test-data/verso/url.json');
let gqlQuery = require('../../test-data/verso/galleryGraphqlQuery');



//Fetch gallery data
export function getGalleryData(galleryData) {
    gqlQuery.galleryQuery.variables.uri = galleryData.uri;
    gqlQuery.galleryQuery.variables.organizationId = testData[Cypress.env('environment')][galleryData.brand]['orgId'];
    return cy.queryGraphQL(gqlQuery.galleryQuery).then((response) => {
        galleryData = response.body;
        return galleryData
    })
}
export function getGallerySlideItems(galleryData) {
    gqlQuery.galleryItemsQuery.variables.uri = galleryData.uri;
    gqlQuery.galleryItemsQuery.variables.organizationId = testData[Cypress.env('environment')][galleryData.brand]['orgId'];
    return cy.queryGraphQL(gqlQuery.galleryItemsQuery).then((response) => {
        galleryData = response.body;
        return galleryData
    })
}

export function getGalleryMostPopularContent(workFlowData) {
    return cy.request({
        url: testData[Cypress.env("environment")][[workFlowData.brand]]["galleryMostPopularContent"],
        headers: {
            'User-Agent': 'qa-cypress-test'
        }
    }).then((res) => {
        workFlowData = res;
        return workFlowData
    })
}
