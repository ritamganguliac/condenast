/// <reference types="Cypress" /> 
import * as testHelper from "../../../helper/bundle/testHelper"
const { selectors } = require("../../../selectors/verso/selectors");


let workFlowData =
{
    "brand": "Vogue",
    "page": "subChannel",
    "nextPageButtonText": 'Next Page',
    "currentComponentIndex": 0,
    "subChannelTitle": "Celebrity Style"
}
let urlIndex = {
    "channel": 0,
}
let maxTesIterationCount = 10;

function testRunner(workFlowData) {
    context(`Fetching the data needed for Vogue Sub Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex.channel).then((data) => {
                workFlowData = data;
            })
        })

        it('Sub Channel Page section Hed and Dek Validation', () => {
            testHelper.validateChannelPageHedAndDek(workFlowData);
        })
        it('Sub Channel highlighted Menu Validation', () => {
            testHelper.validateMenuHighlight(workFlowData.subChannelTitle, selectors.global.content.subMenuWrapper);
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Sub Channel Page TestRunnner ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}

testRunner(workFlowData);
