import * as testHelper from "../../../helper/article/testHelper";

let workFlowData =
{
    "brand": "vogue-uk",
    "page": "events",
    "brandConfigData": {}
}
let eventData = {}
let urlIndex = {
    "eventPage": 1
}

function testRunner(eventData) {
    context(`Fetching the data needed for the test...`, () => {
        it('Validate Cultural event Page', () => {
            testHelper.getEventPageInfo(workFlowData, eventData, urlIndex['eventPage']).then((data) => {
                eventData = data
                testHelper.validateEventPage(eventData)
            })

        })
    })
}
testRunner(eventData);
