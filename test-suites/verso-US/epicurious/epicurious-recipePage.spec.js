import * as recipeTestHelper from "../../../helper/recipe/testHelper"
import * as globalHelper from "../../../helper/global/testHelper";

let recipePageData =
{
    "brand": "epicurious",
    "page": "recipe"
}

let urlIndex = globalHelper.getRunTimeUrlIndex(2, 9);

function testRunner(recipePageData) {
    context(`Fetching recipe page data needed for test`, () => {
        before(function () {
            recipeTestHelper.getRecipePageData(recipePageData, urlIndex).then((gqlData) => {
                recipePageData = gqlData;
            })
        })
        beforeEach(function () {
            cy.clearCookies();
            cy.clearLocalStorage();
        })

        it('Validate recipe page data', () => {
            recipeTestHelper.validateRecipePageContent(recipePageData);
        })

        it('Validate paywall banner and cne video in recipe page', { retries: 3 }, () => {
            recipeTestHelper.validatePaywallAndCneVideo(recipePageData);
        })

        it("Recipe Page recirc unit Validation", () => {
            globalHelper.validateContentPageRecircContent(recipePageData);
        });
    })
}
testRunner(recipePageData);
