//Fetch article data
let testData = require('../../test-data/verso/url.json');
let gqlQuery = require('../../test-data/verso/contributorGraphqlQuery');


export function getContributorInfo(workFlowData) {
    gqlQuery.contributorQuery.variables.uri = workFlowData.pageUri
    gqlQuery.contributorQuery.variables.organizationId = testData[Cypress.env('environment')][workFlowData.brand]['orgId'];
    return cy.queryGraphQL(gqlQuery.contributorQuery).then((response) => {
        workFlowData = response.body.data;
        return workFlowData
    })
}

export function getContributorContentInfo(workFlowData) {
    gqlQuery.contributorContentQuery.variables.organizationId = testData[Cypress.env('environment')][workFlowData.brand]['orgId'];
    return cy.queryGraphQL(gqlQuery.contributorContentQuery).then((response) => {
        workFlowData = response.body.data;
        return workFlowData
    })
}
