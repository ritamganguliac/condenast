import * as utils from "../../utils/commonUtils";
const { selectors } = require("../../selectors/verso/selectors");
let coreSelectors = require("../../selectors/verso/global.json");
let urlPath = require("../../test-data/verso/url.json")
import * as globalHelper from "../../helper/global/testHelper";
import * as businessCatergories from "../../test-data/verso/tag/business-categories.json";

let profileSelector = selectors.gallery.profilePage;
let applyPageSelector = selectors.gallery.applyPage;

// profile page header validation 
Cypress.Commands.add('validateProfileHed', (profilePageData) => {
    let brandConfigContent = profilePageData.brandConfigData.translations
    let profileName = profilePageData.getBusiness.name ? profilePageData.getBusiness.name : profilePageData.getBusiness.legalName
    cy.validateContentHedInContentPage(profileName)
    cy.textEquals(coreSelectors.content['sectionHeaderHed'], 0, brandConfigContent["BusinessProfile.EditorialTitleHed"][0].value)
    cy.get(coreSelectors.content['sectionHeaderDek']).eq(0).should('exist')
    cy.get(coreSelectors.content['sectionHeaderDek']).eq(1).then(($val) => {
        expect(utils.normaliseText($val.text())).eq(utils.normaliseText(profilePageData.getBusiness.description))
    })
    cy.get(profileSelector.bannerImage).should("have.attr", "src")
    cy.get(profileSelector.profileImage).should("have.attr", "src")
})
// profile page images validation 
Cypress.Commands.add('validateProfileImages', function () {
    cy.get(profileSelector.imageWrapper).each(($el, index) => {
        cy.validateImageLoad(profileSelector.imageWrapper, index)
    })
})
// profile page user address validation
Cypress.Commands.add('validateProfileAddress', function () {
    cy.get(profileSelector.addressWrapper).invoke('text').should('not.empty')
    cy.get(profileSelector.headerEmail).should('have.attr', 'href')
    cy.get(profileSelector.headerInsta).should('have.attr', 'href')

})

Cypress.Commands.add('validateProfileCard', (searchPageData) => {
    let legalNameUI = [];
    let legalNameGQL = [];
    let descriptionGQL = [];
    let descriptionUI = [];
    let listOfItems = Cypress.$(profileSelector.profileDisplayed).length
    cy.get(profileSelector.SearchResultsListDisclaimer).invoke('text').should('not.be.empty')
    cy.wait(1000)
    cy.get(profileSelector.profileCount).should('exist').then(($val) => {
        let getText = $val.text().match(/\d+/)
        let resultCount = getText ? parseInt(getText[0]) : null
        expect(resultCount).to.eq(searchPageData.search.content.totalResults)
    })
    for (let i = 0; i < listOfItems; i++) {
        //validation of legal name hyper link, profile city and CTA button
        cy.get(profileSelector.profileDisplayed).eq(i).within(() => {
            cy.get(profileSelector.legalNameHyperLink).should('have.attr', 'href')
            cy.get(profileSelector.city).invoke('text').should('not.be.empty')
            cy.get(profileSelector.profileBtn).should('be.visible')
        })
        legalNameGQL.push(searchPageData.search.content.results[i].legalName)
        descriptionGQL.push(searchPageData.search.content.results[i].knowsAbout)
    }
    // Validation of Leagal name and Profile Description
    if (listOfItems > 0) {
        cy.get(profileSelector.profileLegalName).each((item) => {
            legalNameUI.push(item.text())
        })
        cy.wrap(legalNameUI).invoke('sort').each((actualElement, index) => {
            expect(utils.normaliseText((actualElement))).to.equal(utils.normaliseText((legalNameGQL.sort()[index])))
        });
        cy.get(selectors.bundles.children.dek).each((item) => {
            descriptionUI.push(item.text())
        })
        cy.wrap(descriptionUI).invoke('sort').each((item, index) => {
            expect(utils.normaliseText((item))).to.equal(utils.normaliseText(descriptionGQL.sort()[index]))
        })
    }
})

Cypress.Commands.add('filterSearchPage', () => {
    cy.get(profileSelector.dropDownIndicator).eq(0).click({ force: true })
    cy.get(profileSelector.categoryOption).click()
    cy.get(profileSelector.dropDownIndicator).eq(1).click({ force: true })
    cy.get(profileSelector.professionOption).click()
    // cy.get(profileSelector.dropDownIndicator).eq(2).click({ force: true }) ....commenting out as part of AUTOMATION-1804. Please refer to the ticket.
    // cy.get(profileSelector.stateOption).click()
    cy.get(profileSelector.businessSearchButton).click({ force: true })
    // we can add extra wait for the page to load with filter results
    cy.get(profileSelector.profileHed).invoke('text').should('exist')
    cy.location('pathname')
        .should('include', urlPath.production["Architectural Digest"].search[0]);
})

// validating top two images of the search result pages
Cypress.Commands.add('validateSearchPageImages', function () {
    let listOfItems = Cypress.$(profileSelector.profileDisplayed).length
    let totalCount = listOfItems > 2 ? 3 : listOfItems
    for (let i = 0; i < totalCount; i++) {
        cy.validateImageLoad(profileSelector.profileDisplayed, i)
    }
})

Cypress.Commands.add('validateDropdownValues', function (searchPageData) {
    cy.get(profileSelector.dropDownWrapperValue).eq(0).invoke('text').should('exist')
    cy.get(profileSelector.dropDownWrapper).eq(1).should('have.class', 'dropdown__control--is-disabled')
    cy.get(profileSelector.dropDownWrapperValue).eq(2).invoke('text').should('exist')
    cy.get(profileSelector.dropDownIndicator).eq(0).click({ force: true })
    cy.get(profileSelector.categoryDropDown).then(($text) => {
        for (let i = 1; i < $text.length; i++) {
            cy.get(profileSelector.categoryDropDown).eq(i).scrollIntoView().invoke('text').should('exist')
            cy.get(profileSelector.categoryDropDown).eq(i).click() // click on each category to enabale it's respective professions
            cy.get(profileSelector.dropDownIndicator).eq(1).click({ force: true })
            cy.get(profileSelector.professionDropDown).then(($text) => {
                for (let j = 1; j < $text.length; j++) {
                    cy.get(profileSelector.professionDropDown).eq(j).scrollIntoView().invoke('text').should('exist')
                }
                cy.get(profileSelector.dropDownIndicator).eq(0).click({ force: true })
            })
        }
    })
    let content = JSON.parse(searchPageData.brandConfigData.configContent.businessData["defaultTenantConfig.application.countries"])
    let stateDropdownGQL = content[0].states.map(value => value.label);
    cy.get(profileSelector.dropDownIndicator).eq(2).click({ force: true })
    for (let i = 0; i < stateDropdownGQL.length; i++) {
        cy.get(profileSelector.stateDropDown).eq(i + 1).then((value) => {
            expect(value.text()).to.eq(stateDropdownGQL[i])
        })
    }
})

Cypress.Commands.add('uploadPhotos', function () {
    let uploadIndex = globalHelper.getRunTimeUrlIndex(6, 9);
    const photo = 'landscape.jpeg'
    cy.fixture('landscape.jpeg', { encoding: null }).as('photo')
    cy.get(applyPageSelector.photoInputField).eq(uploadIndex).selectFile({ contents: '@photo' }, { force: true }).then(() => {
        cy.intercept({
            method: 'POST',
            url: 'api/v1/photos'
        }).as('photos')
        cy.wait('@photos').its('response.statusCode').should('eq', 200)
        cy.get(applyPageSelector.imageDeleteBtn).should('be.visible')
        cy.validateImageLoad(applyPageSelector.imageSelector, 0)
        cy.wait(500)
        //wait and delete the uploaded image and check after deletion
        cy.get(applyPageSelector.imageDeleteBtn).click()
        cy.get(applyPageSelector.imageUploadBtn).eq(uploadIndex).contains('Upload')
    })
})

Cypress.Commands.add('applyPageValidation', function (searchPageData) {
    let hrefLength = Cypress.$(applyPageSelector.hrefs).length;
    let brandConfigContent = searchPageData.brandConfigData.configContent.businessData
    cy.textEquals(coreSelectors.content['sectionHeaderHed'], 0, brandConfigContent["defaultTenantConfig.join.title"])
    cy.textEquals(coreSelectors.content['sectionHeaderDek'], 0, brandConfigContent["defaultTenantConfig.join.subTitle"])
    for (let i = 0; i < hrefLength; i++) {
        cy.get(applyPageSelector.businessJoin).eq(i).invoke('text').should('not.be.empty')
        cy.get(applyPageSelector.businessJoinHref).eq(i).invoke('attr', 'href').then((referenceUrl) => { cy.validateUrl(searchPageData, referenceUrl); })
    }
    cy.textEquals(applyPageSelector.applyButton, 0, brandConfigContent["defaultTenantConfig.join.submitText"])
    cy.textEquals(applyPageSelector.signIn, 0, brandConfigContent["defaultTenantConfig.join.loginText"])
    cy.get(applyPageSelector.signInHref).invoke('attr', 'href').then((referenceUrl) => { cy.validateUrl(searchPageData, referenceUrl); })
})

Cypress.Commands.add('formPageValidation', function (searchPageData) {
    let formTranslations = searchPageData.brandConfigData.translations
    let minWorkImages = searchPageData.brandConfigData.configContent.businessData["defaultTenantConfig.application.minWorkImages"]+ '.'
    const keys = Object.keys(businessCatergories.categories)
    const value = Object.values(businessCatergories.categories)
    cy.textEquals(coreSelectors.content['sectionHeaderHed'], 0, formTranslations["BusinessApplication.ApplicationPageSectionHeader"][0].value)
    cy.textEquals(coreSelectors.content['sectionHeaderDek'], 0, formTranslations["BusinessApplication.ApplicationPageSectionSubHeader"][0].value)
    cy.textEquals(applyPageSelector.applicationFormSubHeader, 0, formTranslations["BusinessApplication.ApplicationFormSectionSubHeader"][0].value)
    cy.textEquals(applyPageSelector.applicationFormHeader, 0, formTranslations["BusinessApplication.ApplicationFormSectionHeader"][0].value)
    cy.textEquals(applyPageSelector.categoryHed, 0, formTranslations["BusinessApplication.CompanyBusinessTypeLabel"][0].value)
    cy.get(applyPageSelector.categories).then((el) => {
        for (let i = 0; i < keys.length; i++) {
            expect(utils.normaliseText(el.get(i).innerText)).eq(utils.normaliseText(keys[i]))
            cy.get(applyPageSelector.categories).eq(i).click()
            cy.get(applyPageSelector.professions).each((el, index) => {
                expect(utils.normaliseText(el.text())).eq(utils.normaliseText(value[i][index]))
            })
        }
    })
    cy.textEquals(applyPageSelector.companyField, 0, formTranslations["BusinessApplication.CompanyNameLabel"][0].value)
    cy.textEquals(applyPageSelector.countryField, 0, formTranslations["BusinessApplication.CompanyCountryLabel"][0].value)
    cy.get(applyPageSelector.countryFieldDisabled).should('have.attr', 'aria-invalid', 'false')
    cy.get(applyPageSelector.overseasRegistrater).invoke('attr', 'href').then((referenceUrl) => { cy.validateUrl(searchPageData, referenceUrl) })
    cy.textEquals(applyPageSelector.streetAddress, 0, formTranslations["BusinessApplication.CompanyStreetAddressLabel"][0].value)
    cy.textEquals(applyPageSelector.formCity, 0, formTranslations["BusinessApplication.CompanyCityLabel"][0].value)
    cy.textEquals(applyPageSelector.formState, 0, formTranslations["BusinessApplication.CompanyStateLabel"][0].value)

    let content = JSON.parse(searchPageData.brandConfigData.configContent.businessData["defaultTenantConfig.application.countries"])
    let stateDropdownGQL = content[0].states.map(value => value.label);
    cy.get(profileSelector.dropDownIndicator).click({ force: true })
    for (let i = 0; i < stateDropdownGQL.length; i++) {
        cy.get(applyPageSelector.formStateDropdown).eq(i).then((value) => { expect(value.text()).to.eq(stateDropdownGQL[i]) })
    }
    cy.textEquals(applyPageSelector.companyZip, 0, formTranslations["BusinessApplication.CompanyZipCodeLabel"][0].value)
    cy.textEquals(applyPageSelector.companyContact, 0, formTranslations["BusinessApplication.CompanyPhoneLabel"][0].value)
    cy.textEquals(applyPageSelector.companyEmail, 0, formTranslations["BusinessApplication.CompanyEmailLabel"][0].value)
    cy.textEquals(applyPageSelector.companyWebsite, 0, formTranslations["BusinessApplication.CompanyWebsiteLabel"][0].value)
    cy.textEquals(applyPageSelector.companySocial, 0, formTranslations["BusinessApplication.CompanySocialUrlLabel"][0].value)
    cy.textEquals(applyPageSelector.applicationFormHeader, 1, formTranslations["BusinessApplication.ApplicationFormBusinessHeader"][0].value)
    cy.textEquals(applyPageSelector.companyTag, 0, formTranslations["BusinessApplication.CompanyTaglineLabel"][0].value)
    let prefixLength = Cypress.$(applyPageSelector.prefixCount).length
    for (let i = 0; i < prefixLength; i++) {
        cy.get(applyPageSelector.prefixCount).eq(i).should('have.class', 'text-count__prefix')
    }
    cy.get(applyPageSelector.descriptionLimit).eq(0).invoke('text').then((el) => { expect(el).contains('120 characters (at least 80 characters are required)') })
    cy.get(applyPageSelector.descriptionLimit).eq(1).invoke('text').then((el) => { expect(el).contains('2,000 characters (at least 1,000 characters are required)') })
    cy.textEquals(applyPageSelector.applicationFormHeader, 2, formTranslations["BusinessApplication.ApplicationPhotoLabel"][0].value)
    cy.textEquals(applyPageSelector.photoDetails, 0, formTranslations["BusinessApplication.ApplicationProfileImageTitle"][0].value)
    cy.textEquals(applyPageSelector.photoDetails, 1, formTranslations["BusinessApplication.ApplicationProfileImageDesc"][0].value)
    cy.textEquals(applyPageSelector.photoDetails, 2, formTranslations["BusinessApplication.ApplicationBannerImageTitle"][0].value)
    cy.textEquals(applyPageSelector.photoDetails, 3, formTranslations["BusinessApplication.ApplicationBannerImageDesc"][0].value)
    cy.textEquals(applyPageSelector.photoDetails, 4, formTranslations["BusinessApplication.ApplicationWorkImageTitle"][0].value)
    cy.textEquals(applyPageSelector.photoDetails, 5, formTranslations["BusinessApplication.ApplicationWorkImageDesc"][0].value + minWorkImages)
    cy.textEquals(applyPageSelector.additionalInfo, 0, formTranslations["BusinessApplication.applicationWorkImageAdditionalDesc"][0].value)
    let formConsentLength = Cypress.$(applyPageSelector.formConsent).length
    for (let i = 0; i < formConsentLength; i++) {
        cy.get(applyPageSelector.formConsent).eq(i).invoke("text").should('not.be.empty')
        cy.get(applyPageSelector.formConsentHrefs).eq(i).invoke('attr', 'href').then((referenceUrl) => { cy.validateUrl(searchPageData, referenceUrl); })
    }
    cy.get(applyPageSelector.applicationSubmitBtn).should('not.be.disabled').then((value) => {
        expect(value.text()).to.eq(formTranslations["BusinessApplication.FormSubmitButtonLabel"][0].value)
    })
    cy.get(applyPageSelector.saveApplication).invoke('text').should('not.be.empty')
    cy.get(applyPageSelector.saveApplicationLink).should('have.attr', 'href')

})

Cypress.Commands.add('validateSearchPageWithValidString', (validText, searchPageData) => {
    //search valid text verification
    cy.get(selectors.global.content.sectionHeaderHed).should('exist')
    cy.get(selectors.global.content.searchTextField).type(validText, {force: true}).type('{enter}')
    cy.textInclude(selectors.gallery.profilePage.profileCount, 0, validText)
    cy.get(selectors.global.content.summary_items).each(($el, index) => {
        let rubricLen = cy.$$(selectors.bundles.children.rubric).eq(index)
        let bylinelength = cy.$$(selectors.bundles.children.byLinePreamble).eq(index)
        let rubricLinkLen = cy.$$(selectors.gallery.rubricLink).eq(index)
        let storyDek = cy.$$(selectors.bundles.children.topStoriesDek).eq(index)
        cy.validateImageUrl(searchPageData, index, selectors.global.content.summaryItemImageLink);
        if (rubricLinkLen.length > 0) {
            cy.get(selectors.gallery.rubricLink).eq(index).then(($el) => {
                cy.validateUrl(rubricLinkLen, $el.prop('href'))
            })
        }
        cy.get(selectors.bundles.children.topStoriesHed).eq(index).should('be.visible')
        cy.get(selectors.bundles.children.topStoriesHedLink).eq(index).then(($val) => {
            cy.validateUrl(selectors.bundles.children.topStoriesHedLink, $val.prop('href'))
        })
        //rubric tile, byline and dek verification
        if (storyDek > 0)
            cy.get(selectors.bundles.children.topStoriesDek).eq(index).should('be.visible')
        if (rubricLen.length > 0)
            cy.get(selectors.bundles.children.rubric).eq(index).should('be.visible')
        if (bylinelength.length > 0)
            cy.get(selectors.bundles.children.bylineName).eq(index).should('be.visible')
        cy.get(selectors.global.content.summaryItemBylinePublishDate).eq(index).should('be.visible')
    })
    cy.get(selectors.bundles.children.moreSearchBtn).should('be.enabled') // To check if the button is clickable
})

Cypress.Commands.add('validateSearchPageWithInvalidString', (searchPageData) => {
    let invalidText = 'a9a9a9a9a9a9'
    let searchTranslation = searchPageData.brandConfigData.translations;
    let noStoryHed = searchTranslation['SearchPage.NoResultsHed'][0].value;
    cy.get(selectors.global.content.searchTextField).clear({force: true}).type(invalidText, {force: true}).type('{enter}')
    cy.textEquals(selectors.global.content.sectionHeaderHed, 0, noStoryHed)
    cy.get(selectors.gallery.profilePage.profileCount).then(($el) => {
        let tx = ($el.text()).replace(/"/g, '')
        expect(utils.normaliseText(tx)).to.eq(utils.normaliseText(`0 stories about ${invalidText}`))
        if (cy.$$(selectors.bundles.children.searchIndicatorSubHead).length > 0)
            cy.textEquals(selectors.bundles.children.searchIndicatorSubHead, 0, searchTranslation['SearchResultsIndicator.EmptyResultText'][0].value)
    })
})

Cypress.Commands.add('validateSortingOption', (searchPageData) => {
    let publishDates = []
    cy.get(selectors.global.content.dropdownIndicators).click({ force: true })
    cy.get(selectors.global.content.sortOption).click({ force: true })
    cy.get(selectors.global.content.summaryItemBylinePublishDate).each(($el) => {
        publishDates.push(new Date($el.text()).getTime())
    }).then(() => {
        const isDescending = areDatesDescending(publishDates);
        expect(isDescending).to.be.true
    })
})

/**
 * Checks if the given array of dates is in Descending [sorting with newest stories] order.
 */
function areDatesDescending(dates) {
    for (let i = 0; i < dates.length - 1; i++) {
        if (dates[i] < dates[i + 1]) {
            return false;
        }
    }
    return true;
}
