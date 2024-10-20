
let testData = require('../../../test-data/verso/url.json');
let brand = 'Conde Nast Traveler';

context(`amp page test cases`, () => {
    beforeEach(function () {
        cy.viewport('iphone-x')
    })
    it('validation whether only us amp ad is visible when the geoLocation is US', () => {
        cy.onlyOn(Cypress.env('geoLocation') == 'US')
        cy.visit(testData[Cypress.env('environment')][brand]['ampUrls'][0]);
        cy.get('.ad-us').eq(0).should('not.be.hidden');
        cy.get('.ad-international').eq(0).should('be.hidden');
    })
    it('validation whether only international amp ad is visible when the geoLocation is UK', () => {
        cy.onlyOn(Cypress.env('geoLocation') != 'US')
        cy.visit(testData[Cypress.env('environment')][brand]['ampUrls'][0]);
        cy.get('.ad-us').eq(0).should('be.hidden');
        cy.get('.ad-international').eq(0).should('not.be.hidden');
    })
})
