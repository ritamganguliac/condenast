/// <reference types="Cypress"/>
require('cypress-terminal-report/src/installLogsCollector')();
require('@cypress/skip-test/support')
require('cypress-xpath')

Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

beforeEach(function () {
  cy.viewport('macbook-15')
})

import './core/'
import './bundle/'
import 'cypress-iframe'
import './footer/'
import './header/'
import './quiz/'
import './gallery/'
import './contributor/'
import './tag/'
import './recipe/'
import './article/'
import './profilePage/'
import './newsletter'
import 'cypress-real-events';
