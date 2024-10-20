/// <reference types="Cypress" /> 
import * as testHelper from "../../../helper/bundle/testHelper"
const { selectors } = require("../../../selectors/verso/selectors");

let workFlowData =
{
    "brand": "Conde Nast Traveler",
    "page": "channel",
    "nextPageButtonText": 'Next Page',
    "currentComponentIndex": 0,
    "channelTitle": "Inspiration"
}
let urlIndex = {
    "channel": 0 
}

function testRunner(workFlowData) {
    context(`Fetching the data needed for CNT Channel Page`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex.channel).then((data) => {
                workFlowData = data;
            })
        })
        it('Newsletter Subscribe Form validation in Channel Page', { retries: 2 },() => {
            testHelper.validateNewsletterSubscribeForm(workFlowData)
        })
        it('Validation of highlighed menu for the selected channel', { retries: 2 },() => {
            testHelper.validateMenuHighlight(workFlowData.channelTitle, selectors.global.content.navListWrapper);
        })

        it(`Validate navigation of next page button on Channel`, { retries: 2 },() => {
            testHelper.validateNextPage(workFlowData);
        })
    })
}

testRunner(workFlowData);
