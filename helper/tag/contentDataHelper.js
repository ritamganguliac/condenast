let testData = require('../../test-data/verso/url.json');
let gqlQuery = require('../../test-data/verso/tagPageGraphqlQuery');

//Fetch tag page data
export function getTagPageData(tagPageData) {
    gqlQuery.tagPageQuery.variables.organizationId = testData[Cypress.env('environment')][tagPageData.brand]['orgId'];
    if (tagPageData.filter.modifyFilterValueGQL) {
        let filterquery = "hierarchy: tags/" + tagPageData.uri;
        let modifyFilterList = tagPageData.filter.modifyFilterList;
        for (let i = 0; i < modifyFilterList.length; i++) {
            for (let j = 0; j < modifyFilterList[i].gql_list.length; j++) {
                filterquery = filterquery + " hierarchy: tags/" + modifyFilterList[i].gql_list[j];
            }
        }
        gqlQuery.tagPageQuery.variables.query = filterquery;
    }
    else if (tagPageData.updateFilterHeirarchy) {
        gqlQuery.tagPageQuery.variables.filters.hierarchies[0] = "tags/" + tagPageData.uri;
    }
    else {
        gqlQuery.tagPageQuery.variables.query = "hierarchy: tags/" + tagPageData.uri;
    }
    gqlQuery.tagPageQuery.variables.sort[0].field = tagPageData.sortBy.filter;
    if (tagPageData.pageNumber) {
        gqlQuery.tagPageQuery.variables.page = tagPageData.pageNumber;
    }
    if (tagPageData.pageLimit) {
        gqlQuery.tagPageQuery.variables.limit = tagPageData.pageLimit;
    }
    tagPageData = requestGraphQL(gqlQuery.tagPageQuery);
    return tagPageData
}

//Fetch tag page header
export function getTagPageHeader(tagPageData) {
    gqlQuery.tagPageHeaderQuery.variables.organizationId = testData[Cypress.env('environment')][tagPageData.brand]['orgId'];
    var slug = tagPageData.uri;
    slug = slug.substring(slug.lastIndexOf("/") + 1);
    gqlQuery.tagPageHeaderQuery.variables.query = "slug: " + slug;
    tagPageData = requestGraphQL(gqlQuery.tagPageHeaderQuery);
    return tagPageData
}

export function requestGraphQL(gqlQuery) {
    cy.clearCookies();
    cy.clearLocalStorage();
    return cy.queryGraphQL(gqlQuery).then((response) => {
        gqlQuery = response.body;
        return gqlQuery;
    })
}

export function getTopicPageData(tagPageData) {
    gqlQuery.topicPageQuery.variables.organizationId = testData[Cypress.env('environment')][tagPageData.brand]['orgId'];
    let searchType = tagPageData.types
    gqlQuery.topicPageQuery.variables.query = searchType;
    gqlQuery.topicPageQuery.variables.filters.hierarchies[0] = "tags/" + tagPageData.uri;
    tagPageData = requestGraphQL(gqlQuery.topicPageQuery);
    return tagPageData

}
