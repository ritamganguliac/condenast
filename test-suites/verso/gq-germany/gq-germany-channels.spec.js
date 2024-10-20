import * as testHelper from "../../../helper/bundle/testHelper"

let workFlowData =
{
    "brand": "gq-germany",
    "page": "channel",
    "currentComponentIndex": 0
}

let urlIndex = {
    "mode": 0,
    "body-care": 1,
    "mobilitaet": 2,
    "technik": 3,
    "lifestyle": 4,
    "entertainment": 5
}

let maxTesIterationCount = 4;

function testRunner(workFlowData) {
    context(`Fetching the data needed for validating modes Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['mode']).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Validate the Channel : modes - Section ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })

    context(`Fetching the data needed for validating body-care Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['body-care']).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Validate the Channel : body-care - Section ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })

    context(`Fetching the data needed for validating mobilitaet Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['mobilitaet']).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Validate the Channel : mobilitaet - Section ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })

    context(`Fetching the data needed for validating technik Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['technik']).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Validate the Channel : technik - Section ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })

    context(`Fetching the data needed for validating lifestyle Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['lifestyle']).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Validate the Channel : lifestyle - Section ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })

    context(`Fetching the data needed for validating entertainment Channel`, () => {
        before(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
            testHelper.getTestData(workFlowData, urlIndex['entertainment']).then((data) => {
                workFlowData = data;
            })
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Validate the Channel : entertainment - Section ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }
    })
}

testRunner(workFlowData);
