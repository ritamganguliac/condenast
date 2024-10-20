import * as testHelper from "../../../helper/bundle/testHelper"
import * as globalHelper from "../../../helper/global/testHelper";

let workFlowData =
{
    "brand": "epicurious",
    "page": "channel",
    "currentComponentIndex": 0,
    "nextPageButtonText": 'Next Page',
    "channelTypeIsNotVersoChannel": true,
    "shouldValidateChannelHedAndDek": true
}

let channels = ['Recipes & Menus', 'Expert Advice', 'What to Buy', 'Ingredients', 'Holidays & Events'];
let urlIndex = globalHelper.getRunTimeUrlIndex(4, 9);
let maxTesIterationCount = 10;

function testRunner(workFlowData) {
    context(`Fetching the data needed for validating Epicurious Channels`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            if (urlIndex === 2)
                workFlowData.channelTypeIsNotVersoChannel = false;
            testHelper.getTestData(workFlowData, urlIndex, true).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i <= maxTesIterationCount; i++) {
            it(`Validate the Channel : ${channels[urlIndex]} - Section: ` + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }

        it(`Validate the navigation to next page of Channel : ${channels[urlIndex]}`, () => {
            testHelper.validateNextPage(workFlowData);
        })
    })
}
testRunner(workFlowData);
