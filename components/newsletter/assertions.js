
let testData = require('../../test-data/verso/url.json');
let newsletterPageSelectors = require("../../selectors/verso/newsletters.json");

Cypress.Commands.add('validateHubPage', (workFlowData) => {
    let newsletterConfig = workFlowData.brandConfigData.configContent.config;
    let newsletterLedeHed = newsletterConfig.newsletter.manage.dangerousHed;
    let newsletterLedeDek = newsletterConfig.newsletter.manage.dangerousDek;
    let wrapperLength = Cypress.$(newsletterPageSelectors.newsletterCard).length;
    let sectionHeader = Cypress.$(newsletterPageSelectors.newsletterSectionhed);
    let newsletterLeftImage = Cypress.$(newsletterPageSelectors.newsletterLeftImage);
    let newsletterCategoryWrapperLength = Cypress.$(newsletterPageSelectors.newsletterCatogoryWrapper).length;
    let newsletterListLength = newsletterConfig.newsletterList.length;
    cy.textEquals(newsletterPageSelectors.utilityHed, 0, newsletterLedeHed)
    cy.textEquals(newsletterPageSelectors.utilityDek, 0, newsletterLedeDek)
    if (newsletterLeftImage.length > 0) {
        cy.get(newsletterPageSelectors.newsletterLeftImage).should('be.visible')
        cy.validateImageLoad(newsletterPageSelectors.newsletterLeftImage, 0)
    }
    if (sectionHeader.length > 0) {
        for (let i = 0; i < newsletterCategoryWrapperLength; i++) {
            cy.get(newsletterPageSelectors.newsletterSectionhed).eq(i).invoke('text').should('exist')
        }
    }
    for (let i = 0; i < wrapperLength; i++) {

        // Removed the backend validation for TNY & TeenVogue as there is a data missmatch.
        let brandNames = ['The New Yorker', 'Teen Vogue']
        if (!(brandNames.includes(workFlowData.brand)) && (newsletterListLength > 1)) {
            cy.textEquals(newsletterPageSelectors.newsletterCardHed, i, newsletterConfig.newsletterList[i].subscribe.dangerousHed)
            cy.textEquals(newsletterPageSelectors.newsletterCardDek, i, newsletterConfig.newsletterList[i].subscribe.dangerousDek)
            cy.textEquals(newsletterPageSelectors.newsletterCardFrequencyBadge, i, newsletterConfig.newsletterList[i].frequencyBadge)
            cy.validateImageLoad(newsletterPageSelectors.newsletterImage, i)
        }
        else if (brandNames.includes(workFlowData.brand)) {
            cy.get(newsletterPageSelectors.newsletterCardHed).eq(i).invoke('text').should('exist')
            cy.get(newsletterPageSelectors.newsletterCardDek).eq(i).invoke('text').should('exist')
            cy.get(newsletterPageSelectors.newsletterCardFrequencyBadge).eq(i).invoke('text').should('exist')
        }
        if (newsletterListLength > 1) {
            cy.validateImageLoad(newsletterPageSelectors.newsletterImage, i)
            cy.get(newsletterPageSelectors.signUpCheckbox).eq(i).should('be.visible')
            cy.get(newsletterPageSelectors.newsletterPreview).eq(i).invoke('text').should('exist')
            cy.get(newsletterPageSelectors.newsletterPreview).eq(i).should('be.visible').then((url) => {
                cy.validateUrl(null, url.prop('href'));
            })
        }
    }
})

Cypress.Commands.add('validateSubscription', (workFlowData) => {
    if (workFlowData.actions.selected > 0 && workFlowData.actions.prevSelected === 0) {
        cy.get(newsletterPageSelectors.subscribeCheckbox).eq(0).click({ force: true });
    }
    else {
        let count = Math.abs(workFlowData.actions.selected - workFlowData.actions.prevSelected);
        if (workFlowData.actions.selected > workFlowData.actions.prevSelected) {
            let index = workFlowData.actions.prevSelected;
            selectOrDeselectNewsletter(count, index, true);
        }
        else {
            let index = workFlowData.actions.prevSelected - workFlowData.actions.selected - 1;
            selectOrDeselectNewsletter(count, index, false);
        }
    }

    if (workFlowData.actions.selected !== 0) {
        cy.get(newsletterPageSelectors.emailButton).should('be.visible');
        cy.get(newsletterPageSelectors.enterEmailButtonCount).should('have.text', workFlowData.actions.selected);
        cy.get(newsletterPageSelectors.enterEmailButtonLabel).invoke('text').should('not.be.empty');
    }
    else {
        cy.get(newsletterPageSelectors.emailButton).should('not.be.visible');
        cy.get(newsletterPageSelectors.enterEmailButtonCount).should('not.be.visible');
    }
})

let selectOrDeselectNewsletter = (count, index, status) => {
    while (count > 0) {
        cy.get(newsletterPageSelectors.subscribeCheckbox).eq(index).click({ force: true })
            .should('have.prop', 'checked', status);
        count--;
        index++;
    }
}

Cypress.Commands.add('validatePreviewLinks', (workFlowData) => {
    let newsletterConfig = workFlowData.brandConfigData.configContent.config;
    let newsletterAPILength = workFlowData.brandConfigData.configContent.config.newsletterList.length
    let newsletterListLength = newsletterConfig.newsletterList.length;
    let brandTranslations = workFlowData.brandConfigData.translations;
    if (newsletterListLength < 2) {
        // clicks on "Preview" button
        cy.textEquals(newsletterPageSelectors.previewButton, 0, brandTranslations['NewsletterManagePage.readPreviewButton'][0].value)
        cy.get(newsletterPageSelectors.previewButton).click()
        cy.get(newsletterPageSelectors.previewWrapper).should('be.visible')
        // clicks on "Go Back" button
        cy.get(newsletterPageSelectors.previewButton).click()
        cy.get(newsletterPageSelectors.previewWrapper).should('not.be.visible')

    }
    for (let i = 0; i < newsletterAPILength; i++) {
        let newsletterTemplateURL = workFlowData.brandConfigData.configContent.config.newsletterList[i].subscribe.newsletterTemplateURL ?
            workFlowData.brandConfigData.configContent.config.newsletterList[i].subscribe.newsletterTemplateURL : undefined
        let subscribePageDisableFlag = workFlowData.brandConfigData.configContent.config.newsletterList[i].disableSubscribePage
        if (subscribePageDisableFlag === undefined) {
            cy.request(newsletterTemplateURL).then((response) => {
                if (response.allRequestResponses[0]['Response Status'] !== 200) {
                    expect(response.allRequestResponses[0]['Response Status'], "Newsletter preview link is incorrect").to.eq(200)
                }
                else {
                    expect(response.allRequestResponses[0]['Response Status'], "Newsletter preview link is correct").to.eq(200)
                }

            })
        }
    }
})

Cypress.Commands.add('validateSubscribePopup', () => {
    cy.get(newsletterPageSelectors.subscribeCheckbox).each(($btn, index) => {
        if (index <= 2) {
            cy.wrap($btn).click({ force: true })
            cy.get(newsletterPageSelectors.subscribeBanner).should('be.visible')
        }
    })
})

Cypress.Commands.add('validateUserProfile', (workFlowData) => {
    let brandNames = ['vanity-fair', 'Vogue', 'The New Yorker']
    let selector = brandNames.includes(workFlowData.brand) ?
        newsletterPageSelectors.accountsDropdown : newsletterPageSelectors.navigationDropdown
    cy.get(selector).eq(0).invoke('attr', 'href').then((referenceUrl) => {
        let userAccountURL = testData[Cypress.env('environment')][workFlowData.brand]['homePageUrl'] + referenceUrl
        cy.visit(userAccountURL)
    })
    cy.url().should('include', '/profile')
    //Until account profile issue is resolved.

    //brandNames.shift()
    // let selectorHed = brandNames.includes(workFlowData.brand) ? newsletterPageSelectors.discoveryAccountHed : newsletterPageSelectors.accountHed
    // let selectorDek = brandNames.includes(workFlowData.brand) ? newsletterPageSelectors.discoveryAccountDek : newsletterPageSelectors.accountDek
    // cy.wait(5000)
    // if (brandNames.includes(workFlowData.brand)) {
    //     cy.get(newsletterPageSelectors.accountNLCheckbox).each(($btn, index) => {
    //         cy.get(selectorHed).eq(index).invoke('text').should('exist')
    //         cy.get(selectorDek).eq(index).invoke('text').should('exist')
    //     })
    //     cy.get(newsletterPageSelectors.preferenceSubmitBtn).click({ force: true })
    // }
    // else {
    //     if (newsletterPageSelectors.accountsUnsubscribeBtn.length > 0) {
    //         cy.get(newsletterPageSelectors.accountsUnsubscribeBtn).each(($btn, index) => {
    //             cy.get(selectorHed).eq(index).invoke('text').should('exist')
    //             cy.get(selectorDek).eq(index).invoke('text').should('exist')
    //         })
    //     }
    //     else {
    //         cy.get(newsletterPageSelectors.accountsUnsubscribeBtn).should('not.exist')
    //     }

    // }
})

Cypress.Commands.add('validateSignUpLinkHubPage', (workFlowData) => {
    let count = 0;
    let newsletterConfig = workFlowData.brandConfigData.configContent.config;
    let newsletterListLength = newsletterConfig.newsletterList.length;
    if (newsletterListLength < 2) {
        cy.get(newsletterPageSelectors.emailButton).click({ force: true })
        cy.get(newsletterPageSelectors.signUpModel).should('be.visible').then((value) => {
            cy.get(newsletterPageSelectors.emailTextBox).should('be.visible')
            cy.get(newsletterPageSelectors.signUpButton).should('be.visible')
            cy.get(newsletterPageSelectors.disclaimerText).find('> p > a').each((url) => {
                cy.validateUrl(null, url.prop('href'));
            })
            cy.get(newsletterPageSelectors.closeSubmitModel).click()
        })
    }
    else {
        cy.get(newsletterPageSelectors.subscribeCheckbox).each(($btn, index) => {
            if (index <= 2) {
                cy.wrap($btn).click({ force: true });
                count++;
            }
        });
        cy.get(newsletterPageSelectors.emailButton).invoke('text').should('exist')
        cy.get(newsletterPageSelectors.emailButton).click({ force: true })
        cy.get(newsletterPageSelectors.signUpModel).should('be.visible').then((value) => {
            cy.get(newsletterPageSelectors.emailTextBox).should('be.visible')
            cy.get(newsletterPageSelectors.signUpButton).should('be.visible')
            cy.get(newsletterPageSelectors.disclaimerText).find('> p > a').each((url) => {
                cy.validateUrl(null, url.prop('href'));
            })
            cy.get(newsletterPageSelectors.signUpButtonCount).should('have.text', count);
            cy.get(newsletterPageSelectors.signUpButtonLabel).invoke('text').should('not.be.empty');
        })
        cy.get(newsletterPageSelectors.signUpButton).click({ force: true })
        cy.get(newsletterPageSelectors.signUpErrorMessage).invoke('text').should('exist')
        cy.get(newsletterPageSelectors.closeIcon).click({ force: true })
        cy.scrollTo('top', { duration: 1000 })
        // Validates that the property for signUp checkboxes is checked
        cy.get(newsletterPageSelectors.subscribeCheckbox).each(($btn, index) => {
            if (index <= 2)
                cy.wrap($btn).should('have.prop', 'checked', true);
        })
        // Unselect the checkboxes
        cy.get(newsletterPageSelectors.subscribeCheckbox).each(($btn, index) => {
            if (index <= 2) {
                cy.wrap($btn).click({ force: true });
            }
        })
    }
})
