let testData = require('../../test-data/verso/url.json');
let gqlQuery = require('../../test-data/verso/bundleGraphqlQuery');
let layoutQuery = require('../../test-data/verso/layoutConfigServiceQuery');

export function getBundleHistory(workFlowData) {
    return cy.request(testData[Cypress.env('environment')][workFlowData.brand]['apiUrl'] + '/bundles/' + workFlowData.bundleId + '/publish/history').then((historyData) => {
        return historyData.body;
    });
}

export function getBundleData(workFlowData) {
    gqlQuery.bundleQuery.variables.organizationId = testData[Cypress.env('environment')][workFlowData.brand]['orgId'];
    if (workFlowData.page != 'homepage')
        // few brands like Bon-Appetit and Epicurious won't fetch graphQL data when uri contains "/verso-channel"
        if (workFlowData.channelTypeIsNotVersoChannel || workFlowData.page === 'directoryUrl') {
            gqlQuery.bundleQuery.variables.uri = workFlowData.pageUri;
        }
        else {
            gqlQuery.bundleQuery.variables.uri = (workFlowData.page == 'channel') ? 'verso-channel/' + workFlowData.pageUri : workFlowData.pageUri;
        }
    return cy.queryGraphQL(gqlQuery.bundleQuery).then((bundleData) => {
        return bundleData.body;
    })
}

export function getChannelNavigationData(workFlowData, channelName) {
    return cy.queryChannelNavigationData(workFlowData, channelName).then((reponse) => {
        var navigationListData = reponse.body;
        return navigationListData;
    })
}

export function getBrandConfig(workFlowData, urlIndex = 0) {
    let channel = false;
    return cy.queryBrandConfig(workFlowData, channel, urlIndex).then((reponse) => {
        var brandDefaultConfigData = reponse.body;
        if (workFlowData.page == 'channel') {
            channel = true;
            return cy.queryBrandConfig(workFlowData, channel, urlIndex).then((channelResponse) => {
                if (channelResponse.status == 200)
                    return channelResponse.body;
                else
                    return brandDefaultConfigData;
            })
        }
        return brandDefaultConfigData;
    })
}

export function getTrendingStoriesInfo(workFlowData) {
    const trendingStoriesUrl = testData[Cypress.env('environment')][workFlowData.brand]['trendingStories']
    if (!trendingStoriesUrl) {
        return Cypress.Promise.resolve(null);
    }
    return cy.request({
        url: trendingStoriesUrl,
        headers: {
            'User-Agent': 'qa-cypress-test'
        }
    })
        .then((el) => {
            return el.body.data;
        });
}

export function getCuratedSearchResults(workFlowData, searchId) {
    return cy.request({
        url: testData[Cypress.env('environment')][workFlowData.brand]['apiUrl'] + '/curatedsearches/' + searchId + '/results',
        headers: {
            'User-Agent': 'qa-cypress-test'
        }
    }).then((data) => {
        return data.body.hits.hits;
    })
}

export function getCuratedListRels(workFlowData, searchId) {
    return cy.request({
        url: testData[Cypress.env('environment')][workFlowData.brand]['apiUrl'] + '/curatedlists/' + searchId + '/rels',
        headers: {
            'User-Agent': 'qa-cypress-test'
        }
    }).then((data) => {
        return data.body;
    })
}

export function getContentPageRecircContent(workFlowData) {
    let recircType = "";
    if (workFlowData.page === "gallery") {
        recircType = "galleryRecircContent";
    }
    else if (workFlowData.page === "article") {
        recircType = "articleRecircContent";
    }
    else if (workFlowData.page === "recipe" || workFlowData.page === "homepage") {
        recircType = "recipeRecircContent";
    }
    let url = testData[Cypress.env("environment")][[workFlowData.brand]][recircType];
    if (url.includes("{REPLACE_URI}")) {
        url = url.replace("{REPLACE_URI}", workFlowData.pageUri);
    }
    if (url.includes("{REPLACE_STRATEGY}")) {
        url = url.replace("{REPLACE_STRATEGY}", workFlowData.recircStrategy);
    }
    return cy.request({
        url, headers: {
            'User-Agent': 'qa-cypress-test'
        }
    }).then((res) => {
        workFlowData = res.body;
        return workFlowData
    })
}

//Fetch Layout Config Data
export function getLayoutConfigData(workFlowData) {
    layoutQuery.layoutConfigServiceQuery.variables.organizationId = workFlowData.bundleInfo.data.getBundle.organizationId;
    layoutQuery.layoutConfigServiceQuery.variables.query.contentId = workFlowData.bundleId
    layoutQuery.layoutConfigServiceQuery.variables.query.contentRevision = workFlowData.bundleInfo.data.getBundle.publishInfo.version
    return cy.layoutServiceGraphQL(layoutQuery.layoutConfigServiceQuery).then((response) => {
        return response.body;
    })
}

