/// <reference types="Cypress" /> 
import * as testHelper from "../../../helper/bundle/testHelper"
import * as dataHelper from "../../../helper/bundle/contentDataHelper";

let workFlowData =
{
    "brand": "Vogue",
    "page": "channel",
    "nextPageButtonText": 'Next Page',
    "shouldValidateChannelHedAndDek": true
}
let urlIndex = {
    "fashion": 0,
    "beauty": 1,
    "runway": 2
}
let maxTesIterationCount = 10;

function testRunner(workFlowData) {
    context(`Fetching the data needed for Vogue Fashion Page`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex.fashion).then((data) => {
                workFlowData = data;
            })
        })

        it('Channel Page Sub-Navigation Validation', () => {
            testHelper.validateSubNavigationLink(workFlowData);
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Channel Page TestRunnner ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }

        it('Newsletter Subscribe Form validation in Channel Page', () => {
            testHelper.validateNewsletterSubscribeForm(workFlowData)
        })

        it(`Validate navigation of next page button on Channel`, () => {
            testHelper.validateNextPage(workFlowData);
        })
    })

    context(`Fetching the data needed for Vogue Beauty Page`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex.beauty).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Beauty Page TestRunnner ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }

        it('Beauty Page "Must Read" content Validation', () => {
            testHelper.validateTrendingStories(workFlowData);
        })

    })

    context(`Fetching the data needed for Vogue Runway Page`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            workFlowData.shouldValidateChannelHedAndDek = false;
            testHelper.getTestData(workFlowData, urlIndex.runway).then((data) => {
                workFlowData = data;
            })
        })

        it('Runway Page curated list shows count', () => {
            let curatedShowsData = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template == 'verso-curated-shows')[0];
            let apiCuratedListCount = curatedShowsData.itemSets[0].items.edges[0].node.allShows.totalResults;
            testHelper.validateRunwayPageCuratedListCount(apiCuratedListCount, 'curatedList');
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Runway Page TestRunnner ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }

        it('Runway Page "Must Read" content Validation', () => {
            testHelper.validateTrendingStories(workFlowData);
        })

        it('Runway Page Header Menu Navigation Validation', () => {
            testHelper.validateChannelNavigationHeadermenu(workFlowData)
        })

        it('Runway Page seasons count in channels navigation list', () => {
            let channelName = 'seasons';
            let apiSeasonscount = 0;
            dataHelper.getChannelNavigationData(workFlowData, channelName).then((data) => {
                workFlowData.channelNavigationData = data
                for (let i = 0; i < workFlowData.channelNavigationData.allRunwaySeasons.length; i++)
                    apiSeasonscount += workFlowData.channelNavigationData.allRunwaySeasons[i].links.length;
                testHelper.validateRunwayPageCuratedListCount(apiSeasonscount, 'Seasons');
            })
        })

        it.skip('Runway Page designers count in channels navigation list', () => {
            let channelName = 'designers';
            let apiDesignersCount = 0;
            dataHelper.getChannelNavigationData(workFlowData, channelName).then((data) => {
                workFlowData.channelNavigationData = data
                for (let i = 0; i < workFlowData.channelNavigationData.allRunwayDesigners.length; i++)
                    apiDesignersCount += workFlowData.channelNavigationData.allRunwayDesigners[i].links.length;
                testHelper.validateRunwayPageCuratedListCount(apiDesignersCount, 'Designers');
            })
        })
    })
}

testRunner(workFlowData);
