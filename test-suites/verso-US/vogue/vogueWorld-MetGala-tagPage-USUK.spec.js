import * as testHelper from "../../../helper/bundle/testHelper"
import * as tagPageConfig from "../../../test-data/verso/tag/vogue-brand-config.json"

let workFlowData =
{
    "brand": "",
    "page": "tag",
    "bundleData": {},
    "brandConfigData": {},
    "currentComponentConfig": {},
    "currentComponentName": undefined,
    "currentComponentData": {},
    "currentComponentIndex": 0,
    "currentItemIndex": 0,
    "nextPageButtonText": 'Next Page'
}

let maxTesIterationCount = 8;
let urlIndex = {
    "vogueWorld": 0,
    "metGala": 1
}

function testRunner(workFlowData) {
    // Only vogue US and UK are handled here as they are bundle type. The remaining Vouge World Brands are tag type hence they are handled in separate file. 
    context(`Validating Vogue world or Met Gala tag pages - US  ...`, () => {
        it(`Validate section wrapper- ${tagPageConfig.brands[0].brandName}`, () => {
            workFlowData.brand = tagPageConfig.brands[0].brandName
            testHelper.getTestData(workFlowData, urlIndex.metGala).then((data) => {
                workFlowData = data;
                testHelper.validateChannelPageHedAndDek(workFlowData);
            })
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Home Page TestRunnner ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }

        it(`Validate navigation of next page button on Channel`, () => {
            testHelper.validateNextPage(workFlowData);
        })
    })

    context(`Validating Vogue world or Met Gala tag pages - UK ...`, () => {
        it(`Validate section wrapper- ${tagPageConfig.brands[1].brandName}`, () => {
            workFlowData.brand = tagPageConfig.brands[1].brandName
            testHelper.getTestData(workFlowData, urlIndex.metGala).then((data) => {
                workFlowData = data;
                testHelper.validateChannelPageHedAndDek(workFlowData);
            })
        })

        for (var i = 1; i < maxTesIterationCount; i++) {
            it('Home Page TestRunnner ' + i, () => {
                testHelper.validateBundle(workFlowData);
            })
        }

        it(`Validate navigation of next page button on Channel`, () => {
            testHelper.validateNextPage(workFlowData);
        })
    })
}

testRunner(workFlowData);
