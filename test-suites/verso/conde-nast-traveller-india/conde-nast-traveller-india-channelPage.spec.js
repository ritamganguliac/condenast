import * as testHelper from "../../../helper/bundle/testHelper"

let workFlowData =
{
    "brand": "conde-nast-traveller-india",
    "page": "channel",
    "bundleData": {},
    "brandConfigData": {},
    "currentComponentConfig": {},
    "currentComponentName": undefined,
    "currentComponentData": {},
    "currentComponentIndex": 0,
    "currentItemIndex": 0,
}
let urlIndex = {
    "destinations": 0
}

let maxTesIterationCount = 10;

function testRunner(workFlowData) {
    context(`Fetching the data needed for validating destinations Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex.destinations).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Validate the Channel : destinations section' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}

testRunner(workFlowData);
