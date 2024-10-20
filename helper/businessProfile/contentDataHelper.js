let testData = require('../../test-data/verso/url.json');
let gqlQuery = require('../../test-data/verso/galleryGraphqlQuery');

export function getBusinessData(workFlowData,query) {
    let profilePageUri = testData[Cypress.env('environment')][workFlowData.brand][workFlowData.page];
    gqlQuery.profilePageQuery.variables.uri = profilePageUri[0].replace("/",'')
    gqlQuery.profilePageQuery.variables.orgId = testData[Cypress.env('environment')][workFlowData.brand]['orgId'];
    return cy.queryGraphQL(query).then((response) => {
        workFlowData = response.body.data;
        return workFlowData
    })
}
