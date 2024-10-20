let testData = require('../../../test-data/verso/url.json');

let brands = ["vogue-tw", "Architectural Digest", "Conde Nast Traveler"]
let workFlowData =
{
    "page": "article",
    "brandConfigData": {}
}

function testRunner(workFlowData) {
    context(`Fetching the data needed for the test...`, () => {
        let array = Object.keys(testData.production).filter(key => brands.includes(key))

        it(`Validate Mixed Media Carousel viewport-(2090, 820)`, () => {
            cy.viewport(2090, 820)
            array.forEach(key => {
                cy.visit(testData.production[key].homePageUrl + testData.production[key].mixedCarousal)
                cy.validateMixedMediaCarousel()
            })
        })
        it(`Validate Mixed Media Carousel viewport-(1280, 720)`, () => {
            cy.viewport(1280, 720)
            array.forEach(key => {
                cy.visit(testData.production[key].homePageUrl + testData.production[key].mixedCarousal)
                cy.validateMixedMediaCarousel()
            })
        })
        it(`Validate Mixed Media Carousel viewport-(iphone-6)`, () => {
            cy.viewport('iphone-6')
            array.forEach(key => {
                cy.visit(testData.production[key].homePageUrl + testData.production[key].mixedCarousal)
                cy.validateMixedMediaCarousel()
            })
        })

    })
}
testRunner(workFlowData);
