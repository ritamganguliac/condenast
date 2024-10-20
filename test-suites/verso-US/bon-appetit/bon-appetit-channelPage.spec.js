import * as testHelper from "../../../helper/bundle/testHelper"
import * as globalHelper from "../../../helper/global/testHelper";

let workFlowData =
{
    "brand": "bon-appetit",
    "page": "channel",
    "currentComponentIndex": 0,
    "nextPageButtonText": 'Next Page',
    "channelTypeIsNotVersoChannel": true,
    "shouldValidateChannelHedAndDek": true
}

let channels = ['Cooking', 'Shopping', 'Restaurants'];
let urlIndex = globalHelper.getRunTimeUrlIndex(2, 9);

function testRunner(workFlowData) {
    context(`Fetching the data needed for validating Bon-Appetit Channels`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex, true).then((data) => {
                workFlowData = data;
            })
        })

        it(`Validate the Channel : ${channels[urlIndex]}`, () => {
            testHelper.validateBundle(workFlowData);
        })

        it(`Validate the navigation to next page of Channel : ${channels[urlIndex]}`, () => {
            testHelper.validateNextPage(workFlowData);
        })
    })
}
testRunner(workFlowData);
