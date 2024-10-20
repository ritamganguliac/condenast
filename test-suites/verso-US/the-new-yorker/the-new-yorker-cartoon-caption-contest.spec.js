import * as testHelper from "../../../helper/article/testHelper";
import * as stage from "../../../test-data/verso/cartoonCaption.config.json"
const { selectors } = require("../../../selectors/verso/selectors");

let workFlowData =
{
    "brand": "The New Yorker",
    "page": "cartoonCaption",
    "brandConfigData": {}
}
let cartoonCaptionData = {}
let urlIndex = {
    "SubmitCaption": 0,
    "Rate": 1,
    "Vote": 2,
    "Winner": 3
}

function testRunner(cartoonCaptionData) {
    context(`Fetching the data needed for the test...`, () => {
        it('Submit Caption Page', () => {
            testHelper.getCartoonCaptionInfo(workFlowData, cartoonCaptionData, urlIndex['SubmitCaption'], stage.captionStages[0].key).then((data) => {
                cartoonCaptionData = data
                testHelper.validateCartoonCaptionSubmissions(cartoonCaptionData)
            })
        })

        it('Rating Caption Page', () => {
            cy.get(selectors.article.captionContest.captionTabLabel).eq(1).click({ force: true })
            cy.wait(1000)
            testHelper.getCartoonCaptionInfo(workFlowData, cartoonCaptionData, urlIndex['Rate'], stage.captionStages[1].key).then((data) => {
                cartoonCaptionData = data
                testHelper.validateCartoonCaptionRating(cartoonCaptionData)
            })
        })

        it('Voting Caption Page', () => {
            cy.get(selectors.article.captionContest.captionTabLabel).eq(2).click({ force: true })
            cy.wait(1000)
            testHelper.getCartoonCaptionInfo(workFlowData, cartoonCaptionData, urlIndex['Vote'], stage.captionStages[2].key).then((data) => {
                cartoonCaptionData = data
                testHelper.validateCartoonCaptionVoting(cartoonCaptionData)
            })
        })

        it('Winner Caption Page', () => {
            cy.get(selectors.article.captionContest.captionTabLabel).eq(3).click({ force: true })
            cy.wait(1000)
            testHelper.getCartoonCaptionInfo(workFlowData, cartoonCaptionData, urlIndex['Winner'], stage.captionStages[3].key).then((data) => {
                cartoonCaptionData = data
                testHelper.validateCartoonCaptionDisplayWinner(cartoonCaptionData)
            })
        })
    })
}
testRunner(cartoonCaptionData);
