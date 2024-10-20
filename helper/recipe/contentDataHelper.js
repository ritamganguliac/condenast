let testData = require('../../test-data/verso/url.json');
let gqlQuery = require('../../test-data/verso/recipePageGraphqlQuery');

//Fetch recipe page data
export function getRecipePageData(recipePageData) {
    gqlQuery.recipePageQuery.variables.organizationId = testData[Cypress.env('environment')][recipePageData.brand]['orgId'];
    gqlQuery.recipePageQuery.variables.uri = recipePageData.pageUri;
    return cy.queryGraphQL(gqlQuery.recipePageQuery).then((response) => {
        gqlQuery = response.body;
        return gqlQuery;
    })
}
