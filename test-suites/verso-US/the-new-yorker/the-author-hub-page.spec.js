/// <reference types="Cypress" />

import * as testHelper from "../../../helper/bundle/testHelper"
import * as contributorTestHelper from "../../../helper/contributor/testHelper"
import * as globalHelper from "../../../helper/global/testHelper"
let bundlePageSelectors = require('../../../selectors/verso/bundles.json');

let workFlowData =
{
    "brand": "The New Yorker",
    "page": "contributors",
    "bundleData": {},
    "brandConfigData": {},
    "currentComponentConfig": {},
    "currentComponentName": undefined,
    "currentComponentData": {},
    "currentComponentIndex": 0,
    "currentItemIndex": 0
}
let urlIndex = {
    "contributors": 0
}

function testRunner(workFlowData) {
    context(`Fetching the data needed for the test...`, () => {
        before(function () {
            testHelper.getTestData(workFlowData, urlIndex['contributors']).then((data) => {
                workFlowData = data;
            })
        })

        it('Author Hub Validation for Content Header and Selected stories', () => {
            contributorTestHelper.validateContentHeader(workFlowData);
        })

        it('Author Hub Validation for All Fiction items', () => {
            contributorTestHelper.validateAllFiction(workFlowData);
        })

        it('Author Hub Validation for NewYorker Podcasts', () => {
            contributorTestHelper.validateNewYorkerPodcast(workFlowData);
        })

        it('Author Hub Validation for About Author', () => {
            contributorTestHelper.validateAboutAuthor(workFlowData);
        })

        it('Author Hub Validation for More By Author', () => {
            contributorTestHelper.validateMoreByAuthor(workFlowData);
        })
    })
}
testRunner(workFlowData);
