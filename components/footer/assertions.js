let globalPageSelectors = require("../../selectors/verso/global.json");
import * as utils from "../../utils/commonUtils";
let legacyUrls = ['https://www.gq.com/coupons', 'https://www.glamour.com/masthead', '/services/presscenter', '/sex-love-life/relationships', '/partnerships/gq-heroes']

Cypress.Commands.add('validateFooterLogo', (workFlowData) => {
  let footerSelector = globalPageSelectors.footer;
  cy.scrollTo('bottom');
  cy.get(footerSelector['footer_logo']).should('exist').and('be.visible');
  cy.get(footerSelector['response_image']).should('be.visible');
  cy.get(footerSelector['response_image']).invoke('attr', 'src').then((imgSrcUrl) => {
    cy.validateUrl(workFlowData, imgSrcUrl);
  })
})

Cypress.Commands.add('validateSocialIconList', (workFlowData) => {
  let footerSelector = globalPageSelectors.footer;
  let socialListNetwork = ['instagram', 'linkedin', 'rss', 'tiktok']
  cy.get(footerSelector['social_list_icon']).find('li>a').should('have.attr', 'href');
  if (workFlowData.socialLinks.length > 0) {
    for (let i = 0; i < workFlowData.socialLinks.length; i++) {
      cy.get(footerSelector['social_list_icon']).find('[aria-label="' + workFlowData.socialLinks[i].label + '"]').should('be.visible');
      cy.get(footerSelector['social_list_icon']).find('[href="' + workFlowData.socialLinks[i].url + '"]').should('be.visible');
      //The "rss" check is added for ad-italy , Once feed/rss is fixed this check will be removed
      //Tiktok is failing in drone due to 403 status(Forbidden error). 
      if (!(socialListNetwork.includes(workFlowData.socialLinks[i].network)))
        cy.get(footerSelector['social-icons__list-url']).eq(i).invoke('attr', 'href').then((socialIconUrl) => {
          cy.validateUrl(workFlowData, socialIconUrl);
        })
    }
  }
})

Cypress.Commands.add('validateContactLinks', (workFlowData) => {
  let footerSelector = globalPageSelectors.footer;
  let contactHeading = Cypress.$(footerSelector['site_footer_navigation_contact_heading']);
  let brandNames = ['wired']
  if (!brandNames.includes(workFlowData.brand)) {
    if (contactHeading.length > 0) {
      cy.textEquals(footerSelector['site_footer_navigation_contact_heading'], 0, workFlowData.contactLinksHeading);
    }
    if (workFlowData.contactLinks.length > 0) {
      for (let i = 0; i < workFlowData.contactLinks.length; i++) {
        cy.textEquals(footerSelector['site_footer_navigation_contact_list'], i, workFlowData.contactLinks[i].text);
        cy.get(footerSelector['site_footer_navigation_contact_list']).eq(i).invoke('attr', 'href').then((contactUrl) => {
          if (!(legacyUrls.includes(contactUrl))) {  // This page does not exist in glamour. This is raised to glamour team. Once issue fixed we can remove this check.
            cy.validateUrl(workFlowData, contactUrl);
          }
        })
      }
    }
  }
})

Cypress.Commands.add('validateFooterLinks', (workFlowData) => {
  let footerSelector = globalPageSelectors.footer;
  var footerHeading = Cypress.$(footerSelector['site_footer_navigation_footer_heading']);
  if (footerHeading.length > 0) {
    cy.textEquals(footerSelector['site_footer_navigation_footer_heading'], 0, workFlowData.footerLinksHeading);
  }
  if (workFlowData.footerLinks.length > 0) {
    for (let i = 0; i < workFlowData.footerLinks.length; i++) {
      cy.textEquals(footerSelector['site_footer_navigation_footer_list'], i, workFlowData.footerLinks[i].text)
      cy.get(footerSelector['site_footer_navigation_footer_list']).eq(i).then($el => {
        let hrefUrl = $el.prop('href')
        if (hrefUrl.length > 0) {
          if (!(legacyUrls.includes(hrefUrl))) {  // This is legacy page in GQ-US & Glamour which gives 502 error and not getting validated in our framework
            cy.validateUrl(workFlowData, hrefUrl);
          }
        }
      })
    }
  }
})

Cypress.Commands.add('validateNoticeLinks', (workFlowData) => {
  let footerSelector = globalPageSelectors.footer;
  if (workFlowData.noticesLinks.length > 0) {
    for (let i = 0; i < workFlowData.noticesLinks.length; i++) {
      cy.textEquals(footerSelector['site_footer_notices_list'], i, workFlowData.noticesLinks[i].text);
      cy.get(footerSelector['site_footer_notices_list']).eq(i).invoke('attr', 'href').then((noticesUrl) => {
        cy.validateUrl(workFlowData, noticesUrl);
      })
    }
  }
})

Cypress.Commands.add('validateHomeLocation', (workFlowData) => {
  let footerSelector = globalPageSelectors.footer;
  let footerDropdown = Cypress.$(footerSelector['site_footer_menu_dropdown_button']);
  let footerDropdownValue = footerDropdown.text();
  if (footerDropdownValue.length > 0) {
    cy.get(footerSelector['site_footer_menu_dropdown_button']).should('contain', workFlowData.homeLocation.name);
  }
})

Cypress.Commands.add('validateInternationalSites', (workFlowData) => {
  let footerSelector = globalPageSelectors.footer;
  let internationalSites = Cypress.$(footerSelector['site_footer_menu_dropdown_button']);
  let brandNames = ['wired']
  if (internationalSites.length > 0 && (!brandNames.includes(workFlowData.brand))) { // wired has the selector length but is not displayed on UI
    cy.get(footerSelector['site_footer_menu_dropdown_button']).click({ force: true });
    for (let i = 0; i < workFlowData.internationalSitesLinks.length; i++) {
      cy.get('[aria-labelledby=assistive-label-site-footer-dropdown]').contains(workFlowData.internationalSitesLinks[i].name).scrollIntoView().should('be.visible');
    }
    cy.get(footerSelector['site_footer_menu_dropdown_button']).click({ force: true });
  }
})

Cypress.Commands.add('validateFooterAboutText', () => {
  let footerSelector = globalPageSelectors.footer;
  let aboutText = Cypress.$(footerSelector['site_footer_about_text']);
  let aboutFooterText = aboutText.text();
  if (aboutFooterText.length > 0) {
    cy.get(aboutText).should('contain', aboutFooterText);
  }
})

Cypress.Commands.add('validateSiteFooterLegalText', () => {
  cy.get(globalPageSelectors.footer.site_footer_legal_text).should('not.be.empty')
})

Cypress.Commands.add('validateSiteFooterDisclaimerText', (workFlowData) => {
  let footerSelector = globalPageSelectors.footer;
  let disclaimerText = Cypress.$(footerSelector['site_footer_disclaimer_text']);
  if (disclaimerText.length > 0) {
    cy.textEquals(footerSelector['site_footer_disclaimer_text'], 0, utils.htmlEliminator(workFlowData.siteFooterDisclaimerText).replace("BrandName", utils.getBrandNameAsPerFooter(workFlowData)));
  }
})
