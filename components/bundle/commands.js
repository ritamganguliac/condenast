import * as utils from "../../utils/commonUtils";
let bundlePageSelectors = require('../../selectors/verso/bundles.json');
const { selectors } = require("../../selectors/verso/selectors");
let childSelector = bundlePageSelectors.children;
Cypress.Commands.add('getBundleId', function () {
    return cy.get('#main-content').should('be.visible').then(() => {
        let x = Cypress.$('meta[name="id"]').attr('content');
        return x;
    })
})

Cypress.Commands.add('validateTickerImage', function (workFlowData) {
    cy.get(childSelector['ticker_image']).eq(workFlowData.currentItemIndex).invoke('attr', 'src').then((imgSrcUrl) => {
        cy.validateUrl(workFlowData, imgSrcUrl);
    })
})

Cypress.Commands.add('validateImageUrl', function (workFlowData, index, selector = "") {
    if (selector == "") {
        cy.get(childSelector['imageUrl']).eq(index).invoke('attr', 'href').then(($el) => {
            cy.validateUrl(workFlowData, $el)
        })
    }
    else {
        cy.get(selector).eq(index).invoke('attr', 'href').then(($el) => {
            cy.validateUrl(workFlowData, $el)
        })
    }
})

Cypress.Commands.add('validateHedUrl', function (workFlowData, index) {
    cy.get(childSelector['hedUrl']).eq(index).invoke('attr', 'href').then((hedUrl) => {
        cy.validateUrl(workFlowData, hedUrl)
    })
})

// this will set auth cookies in application
Cypress.Commands.add('getBrandsMagicLink', (auth, email) => {
    cy.then(() => {
        utils.getMagicLink(auth, email).then((magicLink) => {
            cy.visit(magicLink, {
                headers: {
                    'User-Agent': 'qa-cypress-test'
                }
            });
        });
    });
});

Cypress.Commands.add('accountLogOut', function () {
    cy.get(selectors.global.header.myAccount).then(($el) => {
        if ($el.attr('aria-expanded') === 'false') {
            cy.wrap($el).eq(0).click();
        }
    })
    cy.get(selectors.global.header.utility_logOut).eq(0).click();
})
