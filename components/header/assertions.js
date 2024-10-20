let globalPageSelectors = require("../../selectors/verso/global.json");
let bundlePageSelectors = require("../../selectors/verso/bundles.json");
import * as utils from "../../utils/commonUtils";
let headerSelector = globalPageSelectors.header;
let editorsPickFlag = false;
let megaMenuStickyFlag = false;
let editorsPickCount = 0;
let legacyUrls = ['https://addesignshow.architecturaldigest.in/', 'https://www.gq.com/coupons', '/sexe', '/partnerships/gq-heroes', 'https://www.wired.com/coupons', '/ad-weekender-2020/','https://member.vogue.com.tw/']

Cypress.Commands.add('validateHeaderLogo', (workFlowData) => {
    cy.get(headerSelector['header_logo_link']).scrollIntoView().should('be.visible');
    cy.get(headerSelector['response_image']).first().invoke('attr', 'src').then((imgSrcUrl) => {
        cy.validateUrl(workFlowData, imgSrcUrl);
    })
})

Cypress.Commands.add('validateHeaderHorizontalLinks', (workFlowData) => {
    const navItems = workFlowData.primaryLinks.filter(item => item.showInTopNav);
    let horizontal_links = Cypress.$(headerSelector['horizontal_links']);
    let horizontal_links_SiteHeader = Cypress.$(headerSelector['horiontal_links_SiteHeader'])
    let horizontal_megaMenu_links = Cypress.$(headerSelector['horizontal_megaMenu_links'] + ' > a');
    let more_label = Cypress.$(headerSelector['More_label']).text();
    let count = 0;
    if ((!workFlowData.standardNavVariation || !workFlowData.standardNavVariation.startsWith('LogoCenter') || workFlowData.standardNavVariation === "LogoCenterWithCM") && horizontal_megaMenu_links.length === 0) {
        if (horizontal_links.length > 0) {  // Stacked and Standard Navigation Horizontal Links
            for (let i = 0; i < horizontal_links.length; i++) {
                cy.get(headerSelector['horizontal_links']).eq(i).then($el => {
                    if ($el.prop('href').length > 0) {
                        let hrefUrl = $el.prop('href')
                        let horizontal_Links_Text = $el.text();
                        expect(horizontal_Links_Text).to.eq(navItems[i].text)
                        cy.validateUrl(workFlowData, hrefUrl);
                    }
                })
                count++;
            }
        }
        else if (horizontal_links_SiteHeader.length > 0) { // SiteHeader Horizontal Links
            for (let i = 0; i < horizontal_links_SiteHeader.length; i++) {
                cy.get(headerSelector['horiontal_links_SiteHeader']).eq(i).then($el => {
                    if ($el.prop('href').length > 0) {
                        let hrefUrl = $el.prop('href')
                        let horizontal_Links_Text = $el.text();
                        expect(horizontal_Links_Text).to.eq(navItems[i].text)
                        if (!(legacyUrls.includes(hrefUrl))) {  // This is legacy page in AD india which gives 502 error and not getting validated in our framework
                            cy.validateUrl(workFlowData, hrefUrl);
                        }
                    }
                })
                count++;
            }
        }
        if (count !== navItems.length && more_label.includes('More')) { // This code is added as for CNT brand alone  More menu is displayed in horizontal_links 
            let more_links = Cypress.$('a.more-menu__link').length;
            for (let i = 0; i < more_links; i++) {
                cy.get(headerSelector['More_dropdown']).click();
                cy.textEquals(headerSelector['More_Menu_link'], i, navItems[count].text)
                cy.get(headerSelector['More_Menu_link']).eq(i).then((menuUrl) => {
                    let menu_link = menuUrl.prop('href');
                    cy.validateUrl(workFlowData, menu_link);
                })
                count++
            }
        }
    }
    else if (horizontal_megaMenu_links.length > 0) { // SiteHeader Horizontal Links Validation for megaMenu
        let i = 0, j = 0;
        let subheader = '';
        while (i < horizontal_megaMenu_links.length) {
            if (navItems[i].hasChildren && megaMenuStickyFlag === false) {
                cy.validateMegaMenuChildLinks(headerSelector['horizontal_megaMenu_links'] + ' > a', i, navItems[i].text);
                cy.get(headerSelector['horizontal_megaMenu_links'] + ' > svg').eq(j).should('have.text', 'Chevron');
                // opening megaMenu dropdown
                cy.get(headerSelector['horizontal_megaMenu_links'] + ' > a').eq(i).click({ force: true });
                if (navItems[i].children[0].children !== undefined)
                    subheader = 'megaMenu_category_header';         // For Mega menu similar to Bon App: Here we have child within child
                else {
                    subheader = (navItems[i].children[0].groupName !== undefined) ? 'megaMenu_columnWrapper' : 'megaMenu_defaultWrapper';           // For Mega menu similar to Vogue: Here we have Child with no Childs
                }
                cy.get(headerSelector[subheader]).should('be.visible');
                cy.get(headerSelector['horizontal_megaMenu_links'] + ' > svg').eq(j).should('have.attr', 'isactive', 'true');
                const navChildItemsArray = navItems[i].children;
                if (subheader !== 'megaMenu_defaultWrapper')
                    cy.get(headerSelector[subheader]).should('have.length', navChildItemsArray.length);
                else
                    cy.get(headerSelector[subheader] + ' li').should('have.length', navChildItemsArray.length);
                // validation for category headers
                for (let navChildItems of navChildItemsArray) {
                    let childCount = navChildItemsArray.indexOf(navChildItems);
                    if (navChildItems.hasChildren) {
                        cy.validateMegaMenuChildLinks(headerSelector['megaMenu_category_header'] + " > a > span", childCount, navChildItems.text);
                        cy.get(headerSelector['megaMenu_category_header'] + ' > a > svg').eq(childCount).should('have.text', 'Chevron');
                        cy.get(headerSelector['megaMenu_category_header'] + ' > a ').eq(childCount).click({ force: true });
                        cy.get(headerSelector['megaMenu_category_header']).eq(childCount).should('have.attr', 'class', 'active');
                        const navHeaders = navChildItems.children;
                        let k = 0;
                        let count = navHeaders.length;
                        if (navChildItems.text in workFlowData.editorsPickData) {
                            navChildItems.editorsPickGQL = workFlowData.editorsPickData[navChildItems.text]
                            navChildItems.editorsPickCountGQL = workFlowData.editorsPickData[navChildItems.text].length;
                            count = count + navChildItems.editorsPickCountGQL;
                        }
                        while (k < count) {
                            // validation for navigation headers and links
                            if (!megaMenuStickyFlag) {
                                cy.validateMegaMenuNavigationHeadersAndEditorsPick(k, navHeaders, navChildItems);
                            }
                            k++;
                        }
                    }
                    else
                        cy.validateMegaMenuNavigationHeaderAndLinks(childCount, navChildItems, subheader);
                }

                if (subheader == 'megaMenu_columnWrapper') {
                    cy.get(headerSelector['megaMenu_DrawerNavLink']).should('exist').and('be.visible').then((menuUrl) => {
                        cy.validateUrl(null, menuUrl.prop('href'));
                    })
                }
                // closing megaMenu dropdown
                cy.get(headerSelector['megaMenu_close_link']).click();
                cy.get(headerSelector['megaMenu_category_header']).should('not.exist');
                j = j + 1;
            }
            else {
                cy.validateMegaMenuChildLinks(headerSelector['horizontal_megaMenu_links'] + ' > a', i, navItems[i].text);
            }
            i++;
        }
    }
    else {
        cy.get(headerSelector['horizontal_links']).should('not.exist');
        throw new Error("Horizontal headers not found");
    }
})

// validate function for megaMenu navigation headers
Cypress.Commands.add('validateMegaMenuNavigationHeadersAndEditorsPick', (k, navHeaders, navChildItems) => {
    cy.get(headerSelector['megaMenu_navigation_header']).eq(k).then($el => {
        if ($el.find('p').length > 0) {
            // validate navigation headers and image links which are Editor's Pick
            if (($el.find('p').prop('id') === "editors_picks") || ($el.find('p').prop('id') === "editors_pick")) {
                editorsPickFlag = true;
                let megaMenu_navigation_head_Text = $el.find('p').text();

                if ($el.find('p').prop('id') === "editors_picks") {
                    expect(megaMenu_navigation_head_Text).to.eq("Editors' Picks");
                }
                else {
                    expect(megaMenu_navigation_head_Text).to.eq("Editors' Pick");
                }
            }
        }

        if (editorsPickFlag) {
            let editorsPickImageCount = editorsPickCount;
            editorsPickCount = editorsPickCount + 1;
            // "Editors' Picks" validation for megaMenu
            cy.get(headerSelector['megaMenu_navigation_header']).eq(k).find('a').should('not.be.disabled');
            cy.get(headerSelector['megaMenu_navigation_header']).eq(k).find('svg').should('not.be.disabled');
            cy.get(headerSelector['megaMenu_navigation_header']).eq(k).find(bundlePageSelectors.children['hedUrl']).then($el => {
                cy.validateUrl(null, $el.prop('href'));
                expect($el.text()).to.deep.eq(navChildItems.editorsPickGQL[editorsPickImageCount].cardData.dangerousHed);
            })
            cy.get(headerSelector['megaMenu_navigation_header']).eq(k).find('img').invoke('attr', 'src').then((imgSrcUrl) => {
                cy.validateUrl(null, imgSrcUrl);
            })
            cy.validateImageLoad(headerSelector['megaMenu_navigation_header'], k);
            // validating "SEE MORE" link in "Editors' Pick" section
            if (navChildItems.hasClickOut) {
                cy.get(headerSelector['megaMenu_navigation_header']).eq(k).find('li').then($el => {
                    if ($el.eq(1).find('a').length > 0) {
                        expect($el.eq(1).find('a').text()).to.eq(navChildItems.clickOutText);
                        cy.validateUrl(null, $el.eq(1).find('a').prop('href'));
                    }
                })
            }
        }
        else {
            // validation of navigation headers and links
            cy.validateMegaMenuNavigationHeaderAndLinks(k, navHeaders);
        }
        if (k == (navHeaders.length + navChildItems.editorsPickCountGQL - 1)) {
            // validation for Editor's Pick count
            let expectedCount = navChildItems.editorsPickCountGQL;
            if (editorsPickCount != expectedCount) {
                throw new Error("Editor's Pick image count, Expected: " + expectedCount + ";  Actual:" + editorsPickCount);
            }
            editorsPickCount = 0;
            editorsPickFlag = false;
        }
    })
})

// validate function for megaMenu navigation header text and links
Cypress.Commands.add('validateMegaMenuNavigationHeaderAndLinks', (k, navHeaders, subheader) => {
    // validation of navigation headers
    let navHeadersData = navHeaders[k] ? navHeaders[k] : navHeaders;
    if (navHeadersData.groupName !== undefined) {
        cy.get(headerSelector['megaMenu_navigation_header']).eq(k).then($el => {
            if ($el.find('p').length > 0) {
                expect($el.find('p').text()).to.eq(navHeadersData.groupName);
                if ($el.find('p > a').length > 0) {
                    cy.wrap($el).find('p > a').invoke("attr", "href").should('exist').and('not.be.empty');
                }
            }
        })
    }
    const navLinks = navHeadersData.links;
    // validation of navigation links text
    if (navLinks !== undefined) {
        cy.get(headerSelector['megaMenu_navigation_header']).eq(k).find('li').should('have.length', navLinks.length);
        let navLinkTextArrayGraphQL = navLinks.map(($el) => { return $el.text; });
        let navLinkTextArrayUI = new Array();
        cy.get(headerSelector['megaMenu_navigation_header']).eq(k).find('li > a').each(($el, index) => {
            navLinkTextArrayUI.push($el.text());
            cy.wrap($el).invoke("attr", "href").should('exist').and('not.be.empty');
            expect(navLinkTextArrayGraphQL[index]).to.deep.eq(navLinkTextArrayUI[index]);
            if (subheader == 'megaMenu_columnWrapper' && megaMenuStickyFlag === false)
                cy.validateUrl(null, $el.prop('href'));
        })
    }
    else {
        cy.get(headerSelector['megaMenu_navigation_header'] + ' li > a').eq(k).then(($el) => {
            expect(utils.normaliseText($el.text())).to.eql(utils.normaliseText(navHeadersData.text))
            cy.validateUrl(null, $el.prop('href'));
        })
    }
})

// Generic Validate function for megaMenu header text and links
Cypress.Commands.add('validateMegaMenuChildLinks', (selector, i, text) => {
    cy.get(selector).eq(i).then($el => {
        if ($el.prop('href')) {
            expect($el.text()).to.eq(text);
            cy.validateUrl(null, $el.prop('href'));
        }
        else {
            expect($el.text()).to.eq(text)
        }
    })
})

//Validating Drawer SignIn link
Cypress.Commands.add('validateDrawerSignInLink', (workFlowData) => {
    let showOverlayNavigation = workFlowData.brandConfigData.configContent.homepageConfig["ComponentConfig.StackedNavigation.settings.showOverlayNavigation"] ? workFlowData.brandConfigData.configContent.homepageConfig["ComponentConfig.StackedNavigation.settings.showOverlayNavigation"] : false;
    var overlayNavigationSignInLabel = workFlowData.brandConfigData?.translations['OverlayNavigation.OverlayNavigationSignInLabel'][0]?.value ? workFlowData.brandConfigData.translations['OverlayNavigation.OverlayNavigationSignInLabel'][0].value : 'Sign in';
    var secondarySignInLabel = workFlowData.brandConfigData?.translations['SecondaryMenu.SignInLinkText'][0]?.value ? workFlowData.brandConfigData.translations['SecondaryMenu.SignInLinkText'][0].value : 'Sign in';
    let signInText = showOverlayNavigation ? overlayNavigationSignInLabel : secondarySignInLabel
    let signInSelector = workFlowData.overlaySearchWrapper ? 'drawer_overlay_SignIn_links' : 'drawer_SignIn_links';
    if (workFlowData.enableAccount == true || workFlowData.signInFeatureActive === "true") {
        cy.validateUrl(workFlowData, workFlowData.signInLink);
        cy.xpath(headerSelector[signInSelector].replace('Sign in', signInText)).eq(0).should('have.text', signInText)
    }
    else {
        cy.xpath(headerSelector[signInSelector].replace('Sign in', signInText)).should('not.exist')
    }
})

//Validating Drawer Search Link
Cypress.Commands.add('validateDrawerSearchLink', (workFlowData) => {
    var translatedSearchText = workFlowData.brandConfigData?.translations['SecondaryMenu.SearchLinkText'][0]?.value ? workFlowData.brandConfigData?.translations['SecondaryMenu.SearchLinkText'][0]?.value : 'Search';
    let brandNames = ['vogue-tw', 'vogue-japan']
    let searchSelector = workFlowData.overlaySearchWrapper ? 'drawer_overlay_search_links' : 'drawer_Search_links';
    if ((workFlowData.showSearch === true || workFlowData.hasSearch === true) && (!(brandNames.includes(workFlowData.brand)))) {
        cy.validateUrl(workFlowData, workFlowData.searchLink);
        cy.xpath(headerSelector[searchSelector].replace('Search', translatedSearchText)).should('exist').and('be.visible')
    }
    else {
        cy.xpath(headerSelector[searchSelector].replace('Search', translatedSearchText)).should('not.exist')
    }
})

//Validating the Drawer Utility Links 
Cypress.Commands.add('validateDrawerUtilityLinks', (workFlowData) => {
    workFlowData.utilityLinks = workFlowData.utilityLinks.filter(item => item.text);
    let utilityLinkSelector = (workFlowData.overLayDrawer != undefined) ? 'overLay_utility_links' : 'drawer_utility_links';
    let index = 0;
    for (let j = 0; workFlowData.utilityLinks.length > 0 && j < workFlowData.utilityLinks.length; j++) {
        if (!(workFlowData.utilityLinks[j].hideFromSecondaryMenu)) {
            let newIndex = index
            if (workFlowData.overlaySearchWrapper)
                newIndex = index + 1;
            cy.textEquals(headerSelector[utilityLinkSelector], newIndex, workFlowData.utilityLinks[j].text);
            cy.get(headerSelector[utilityLinkSelector]).eq(newIndex).invoke('attr', 'href').then((hrefUrl) => {
                if (!(legacyUrls.includes(hrefUrl))) {  // This is legacy page in GQ for coupans which gives 502 error and not getting validated in our framework
                    cy.validateUrl(workFlowData, hrefUrl);
                }
            })
            index = index + 1;
        }
    }
})

//Validating the Drawer Secondary Links
Cypress.Commands.add('validateDrawerSecondaryLinks', (workFlowData) => {
    let secondaryLinkSelector = (workFlowData.overLayDrawer != undefined) ? 'overLay_secondary_links' : 'drawer_secondary_links';
    if (workFlowData.secondaryLinks.length > 0) {
        for (let i = 0; i < workFlowData.secondaryLinks.length; i++) {
            cy.textEquals(headerSelector[secondaryLinkSelector], i, workFlowData.secondaryLinks[i].text)
            cy.get(headerSelector[secondaryLinkSelector]).eq(i).invoke('attr', 'href').then((hrefUrl) => {
                if (!(legacyUrls.includes(hrefUrl))) {
                    cy.validateUrl(workFlowData, hrefUrl);
                }
            })
        }
    }
})

//Validating the Drawer Primary Links
Cypress.Commands.add('validateDrawerPrimaryLinks', (workFlowData) => {
    let primaryLinkSelector = (workFlowData.overLayDrawer != undefined) ? 'overLay_primary_links' : 'drawer_primary_links';
    if (workFlowData.primaryLinks.length > 0) {
        for (let i = 0; i < workFlowData.primaryLinks.length; i++) {
            cy.textEquals(headerSelector[primaryLinkSelector], i, workFlowData.primaryLinks[i].text)
            cy.get(headerSelector[primaryLinkSelector]).eq(i).invoke('attr', 'href').then((hrefUrl) => {
                cy.validateUrl(workFlowData, hrefUrl);
            })
        }
    }
})

//Validating the Utility Secondary Links
Cypress.Commands.add('validateUtilityOverlaySecondaryLinks', (workFlowData) => {
    if (workFlowData.secondaryLinks.length > 0) {
        for (let i = 0; i < workFlowData.secondaryLinks.length; i++) {
            cy.textEquals(headerSelector['utility_overlay_secondary_links'], i, workFlowData.secondaryLinks[i].text);
            cy.get(headerSelector['utility_overlay_secondary_links']).eq(i).invoke('attr', 'href').then((hrefUrl) => {
                if (!(legacyUrls.includes(hrefUrl))) { // this condition is added to skip this url "/sexe" error which occurred in GQ france
                    cy.validateUrl(workFlowData, hrefUrl);
                }
            })
        }
    }
})

//Validating the Utility Primary Links
Cypress.Commands.add('validateUtilityOverlayPrimaryLinks', (workFlowData) => {
    if (workFlowData.primaryLinks.length > 0) {
        for (let i = 0; i < workFlowData.primaryLinks.length; i++) {
            cy.textEquals(headerSelector['utility_overlay_primary_links'], i, workFlowData.primaryLinks[i].text)
            cy.get(headerSelector['utility_overlay_primary_links']).eq(i).invoke('attr', 'href').then((hrefUrl) => {
                cy.validateUrl(workFlowData, hrefUrl);
            })
        }
    }
})

//Validating the social Links
Cypress.Commands.add('validateSocialLinks', (workFlowData) => {
    let socialIcons = Cypress.$(headerSelector['social_list_icon']);
    let socialListNetwork = ['instagram', 'linkedin', 'tiktok']
    //There is bug ins CNT for hiding social icon "GPA-7705 Unable to see social links in Header secondary Menu" Once this fixed the visibility check will be removed 
    if (socialIcons.is(':visible') && workFlowData.socialLinks.length > 0) {
        for (let i = 0; i < workFlowData.socialLinks.length; i++) {
            cy.get(headerSelector['social_list_icon']).find('[aria-label="' + workFlowData.socialLinks[i].label + '"]').should('be.visible');
            //Tiktok is failing in drone due to 403 status(Forbidden error). 
            if (!(socialListNetwork.includes(workFlowData.socialLinks[i].network)))
                cy.get(headerSelector['social_list_icon_url']).eq(i).invoke('attr', 'href').then((socialIconUrl) => {
                    cy.validateUrl(workFlowData, socialIconUrl);
                })
        }
    }
    else {
        cy.get(headerSelector['social_list_icon']).should('not.be.visible')
    }
})

//Validating the Utility Overlay Links
Cypress.Commands.add('validateUtilityOverlayLinks', (workFlowData) => {
    for (let j = 0; workFlowData.utilityLinks.length > 0 && j < workFlowData.utilityLinks.length && workFlowData.utilityLinks[j].text; j++) {
        if (j == 0 && workFlowData.hasSearch == true) {
            var translatedSearchText = workFlowData.brandConfigData?.translations['OverlayNavigation.OverlayNavigationSearchLabel'][0]?.value ? workFlowData.brandConfigData?.translations['OverlayNavigation.OverlayNavigationSearchLabel'][0]?.value : 'Search';
            cy.validateUrl(workFlowData, workFlowData.searchLink);
            cy.xpath(headerSelector['utility_overlay_link'].replace('Search', translatedSearchText)).should('exist').and('be.visible');
        }
        cy.xpath(headerSelector['utility_overlay_link'].replace('Search', workFlowData.utilityLinks[j].text)).should('exist').and('be.visible');
        cy.validateUrl(workFlowData, workFlowData.utilityLinks[j].url);
    }
})

//Validating Utility SignIn link
Cypress.Commands.add('validateUtilitySignInLink', (workFlowData) => {
    let logInLabelLength = Cypress.$(headerSelector['utilitySiteHeaderSignIn']).length;
    let signInLabelLength = Cypress.$(headerSelector['utilitySignIn']).length;
    let signInText = workFlowData.brandConfigData.translations['StandardNavigation.SignInLabel'][0].value;
    if ((workFlowData.siteHeaderAccountEnabled === 'true' || workFlowData.signInFeatureActive === 'true') && (logInLabelLength > 0 || signInLabelLength > 0)) {
        var signInpath = logInLabelLength > 0 ? 'utilitySiteHeaderSignIn' : 'utilitySignIn'
        cy.get(headerSelector[signInpath]).first().invoke('attr', 'href').then((hrefurl) => {
            cy.validateUrl(workFlowData, hrefurl);
        })
        cy.textEquals(headerSelector[signInpath], 0, signInText)

        return
    }
    else if ((workFlowData.enableAccount != true && (workFlowData.siteHeaderAccountEnabled != 'true' || workFlowData.signInFeatureActive != 'true'))) {
        cy.get(headerSelector['utilitySiteHeaderSignIn']).should('not.exist')
        return
    }
    if (workFlowData.enableAccount === true && Cypress.$(headerSelector['utilitySignIn']).length > 0) {
        cy.get(headerSelector['utilitySignIn']).invoke('attr', 'href').then((hrefurl) => {
            cy.validateUrl(workFlowData, hrefurl);
        })
        cy.get(headerSelector['utilitySignIn']).should('have.text', signInText)
    }
    else {
        cy.get(headerSelector['utilitySignIn']).should('not.exist')
    }
})

//Validating Utility Search Icon
Cypress.Commands.add('validateUtilitySearchIcon', (workFlowData) => {
    let searchIconFlag = workFlowData.brandConfigData.configContent.homepageConfig["ComponentConfig.StackedNavigation.settings.hasSearch"];
    if (workFlowData.searchLink.length > 0 && workFlowData.drawerToggleConfig === 'FixedHeaderLogoWithSearchBar') {
        cy.get(headerSelector['megaMenuSearchIcon']).should('be.visible');
    }

    else if (searchIconFlag == "true" || (workFlowData.searchLink.length > 0 && workFlowData.drawerToggleConfig !== 'FixedHeaderLogoWithSearchBar' && workFlowData.hasSearch === true && workFlowData.drawerToggleConfig !== "FixedHeaderLargeLogoWithRightMenu")) {
        cy.get(headerSelector['utilitySearchIcon']).parents('a').invoke('attr', 'href').then((searchUrl) => {
            cy.validateUrl(workFlowData, searchUrl);
        })
        cy.get(headerSelector['utilitySearchIcon']).should('be.visible');
    }

    else if (workFlowData.hasSearch === false) {
        cy.get(headerSelector['utilitySearchIcon']).should('not.exist')
    }

    else {
        cy.get(headerSelector['utilitySearchIcon']).should('not.exist')
    }
})


//Validating the Utility Nav InternationalSite links
Cypress.Commands.add('validateInternationalSitesLinks', (workFlowData) => {
    if (workFlowData.homeLocation) {
        if (workFlowData.homeLocation.length > 0) {
            cy.get(headerSelector['utility_button_navigation']).should('contain', workFlowData.homeLocation.name);
        }
        if (workFlowData.internationalSites !== null) {
            cy.get(headerSelector['utility_button_navigation']).click({ force: true });
            for (let i = 0; i < workFlowData.internationalSitesLinks.length; i++) {
                cy.get('[aria-labelledby=assistive-label-navigation-dropdown]').contains(workFlowData.internationalSitesLinks[i].name).scrollIntoView().should('be.visible');
            }
            cy.get(headerSelector['utility_button_navigation']).click({ force: true });
        }
        else {
            cy.get(headerSelector['utility_button_navigation']).should('not.exist')
        }
    }

})

//Validating the Utitliy Links which are displayed in TopNav
Cypress.Commands.add('validateUtilityLinksInTopNav', (workFlowData) => {
    if (workFlowData.utilityLinks.length > 0) {
        const navItems = workFlowData.utilityLinks.filter(item => item.showInTopNav);
        let i = 0;
        for (const utility_links of navItems) {
            if (utility_links.hideFromUtilityNavigation === undefined || utility_links.hideFromUtilityNavigation === false) { // This line will check if any utility_links are not present then it will ignore that. Specific to Subscription button.
                cy.textEquals(headerSelector['utility_TopNav'], i++, utility_links.text)
                cy.get(headerSelector['utility_TopNav']).invoke('attr', 'href').then((hrefUrl) => {
                    cy.validateUrl(workFlowData, hrefUrl);
                })
            }
        }
    }
})

//Validating the Drawer icon present for standard navigation brands
//Validating all primary,secondary,utility,search,signIn Links and Social Icons
Cypress.Commands.add('validateDrawerFeature', (workFlowData, isDrawerEnabled) => {
    let drawer_toggle = Cypress.$(headerSelector['drawer_button_toggle'])
    if (isDrawerEnabled == true) {
        workFlowData.overlaySearchWrapper = Cypress.$(headerSelector['drawer_secondary_Search']).length > 0 ? true : false
        cy.get(headerSelector['drawer_button_toggle']).should('exist');
        cy.get(headerSelector['drawer_button_toggle']).eq(0).click();
        cy.validateDrawerPrimaryLinks(workFlowData)
        cy.validateDrawerSearchLink(workFlowData)
        cy.validateDrawerSignInLink(workFlowData)
        cy.validateDrawerUtilityLinks(workFlowData)
        cy.validateDrawerSecondaryLinks(workFlowData)
        cy.validateSocialLinks(workFlowData)
        cy.get(headerSelector['drawer_Close_Menu']).first().click();
    } else if (drawer_toggle) {
        cy.get(headerSelector['drawer_button_toggle']).should('exist')
    } else if (!drawer_toggle) {
        cy.get(headerSelector['drawer_button_toggle']).should('not.to.be.visible')
    }
})

//Validating the Utility nav bar 
//Validating all the internationalSites dropdown list,TopNav,OverlayLinks including primary, secondary and social Links
Cypress.Commands.add('validateSiteHeader', (workFlowData) => {
    cy.validateUtilityLinksInTopNav(workFlowData)
    cy.validateUtilitySignInLink(workFlowData)
    //Validating utility Menu bar
    if (workFlowData.SiteHeaderVariationValue === 'TopRule' || workFlowData.siteHeaderVariationValue === 'CustomeTopRule') {
        cy.validateInternationalSitesLinks(workFlowData)
        cy.get(headerSelector['utility_menu_link']).find('title').should('have.text', 'Menu');
        cy.get(headerSelector['utility_menu_link']).click();
        cy.validateUtilityOverlayLinks(workFlowData)
        cy.validateUtilityOverlayPrimaryLinks(workFlowData)
        cy.validateUtilityOverlaySecondaryLinks(workFlowData);
        cy.validateSocialLinks(workFlowData)
        cy.get(headerSelector['utility_close_icon']).click();
        //Scroll to bottom and validate the Primary Sticky Nav which includes horizontal links and brand logo
        //Scroll up and click on Utility Nav bar
        cy.get(headerSelector['SiteFooter']).scrollIntoView({ duration: 1000 })
        cy.get(headerSelector['response_image']).first().invoke('attr', 'alt').then((brandText) => {
            cy.get(brandText).should('not.exist')
        })
        cy.get(headerSelector['utility_menu_link']).should('not.be.visible')
        if (Cypress.$(headerSelector['horiontal_links_SiteHeader']).length === 0) {
            cy.get(headerSelector['horiontal_links_SiteHeader']).should('not.be.visible')
        }
        cy.scrollTo('top')
        cy.wait(1000);
        cy.get(headerSelector['utility_menu_link']).click()
        cy.get(headerSelector['utility_close_icon']).click();
    }
})

//Validating Utility Links,Search and SignIn Links on TopNav
Cypress.Commands.add('validateStackedNavigation', (workFlowData) => {
    let isDrawerEnabled;
    cy.validateUtilityLinksInTopNav(workFlowData)
    cy.validateUtilitySignInLink(workFlowData)
    cy.validateUtilitySearchIcon(workFlowData)
    let fixedHeader = workFlowData.brandConfigData.configContent.homepageConfig["ComponentConfig.StackedNavigation.settings.variations.isDrawerEnabled"]
    if ((workFlowData.drawerToggleConfig != undefined && workFlowData.drawerToggleConfig.startsWith('FixedHeader') || fixedHeader === "true") && workFlowData.navigationDrawer == undefined && workFlowData.overLayDrawer == undefined) {
        isDrawerEnabled = false;
    }
    else {
        isDrawerEnabled = true;
    }
    cy.validateDrawerFeature(workFlowData, isDrawerEnabled)
    cy.validateDrawerStickyNav(workFlowData, isDrawerEnabled)
})

//Validating Utility Links,Search Icon in TopNav 
//validating the drawer feature
Cypress.Commands.add('validateStandardNavigation', (workFlowData) => {
    cy.validateUtilityLinksInTopNav(workFlowData)
    cy.validateUtilitySignInLink(workFlowData)
    cy.validateUtilitySearchIcon(workFlowData)
    cy.validateDrawerFeature(workFlowData, true)
    cy.validateDrawerStickyNav(workFlowData, true)
})

Cypress.Commands.add('validateDrawerStickyNav', (workFlowData, isDrawerEnabled) => {
    //Scroll to bottom and validate the Primary Sticky which includes horizontal links and brand logo for stacked and standard Navigation
    //Scroll Top to Validate drawer Sticky
    cy.get(headerSelector['SiteFooter']).scrollIntoView({ duration: 2000 })
    cy.get(headerSelector['response_image']).first().invoke('attr', 'src').then((imgSrcUrl) => {
        cy.validateUrl(workFlowData, imgSrcUrl);
    })
    megaMenuStickyFlag = true;
    cy.validateHeaderHorizontalLinks(workFlowData)
    if (isDrawerEnabled == true) {
        cy.get(headerSelector['drawer_Close_Menu']).first().click({ force: true });
    }
})

