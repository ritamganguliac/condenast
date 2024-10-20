Cypress.Commands.add('getElementAttribute', function (selector, index, attributeName) {
    return cy.$$(selector)[index].getAttribute(attributeName);
})
