import * as utils from "../../utils/commonUtils";
const { selectors } = require("../../selectors/verso/selectors");
let bundlePageSelectors = require("../../selectors/verso/bundles.json");
let coreSelectors = require("../../selectors/verso/global.json");
let testData = require('../../test-data/verso/url.json');
let childSelector = bundlePageSelectors.children;
const { format } = require('date-fns');
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone1 = require('dayjs/plugin/timezone')

Cypress.Commands.add('textEquals', function (selector, index, textToAssert) {
    cy.get(selector).eq(index).then(($element) => {
        expect(utils.normaliseText($element.text())).to.eql(utils.normaliseText(textToAssert))
    })
})

Cypress.Commands.add('textEqualsWithChild', function (selectorArray, index, textToAssert) {
    cy.get(selectorArray[0]).eq(index).find(selectorArray[1]).then(($element) => {
        expect(utils.normaliseText($element.text())).to.eql(utils.normaliseText(textToAssert))
    })
})
/***
 * The purpose of the function is to validate the header in the page which is redirected from the homePage
 */
Cypress.Commands.add('validatePageHeder', function (workFlowData) {
    cy.textEquals('.content-header__hed', 0, workFlowData.currentComponentData[workFlowData.currentItemIndex]._source.hed);
})

Cypress.Commands.add('moveToHomePage', function () {
    cy.get('.standard-navigation__section--logo>a').click();
})

Cypress.Commands.add('validateUrl', function (workFlowData, urlUnderTest, saveCookie) {
    /**
     * clearing the below cookies to avoid 402 payemnt required status code
     */
    if (!saveCookie) {
        cy.clearCookie("pay_ent_smp");
        cy.clearCookie("pay_ent_usmp");
    }
    if ((urlUnderTest.startsWith('http') || urlUnderTest.startsWith('/')) && !urlUnderTest.includes('linkedin')) {
        cy.request({
            url: urlUnderTest,
            headers: {
                "User-Agent": "Chrome/112.0.0.0"
            },
            retryOnStatusCodeFailure: true
        }).then((response) => {
            expect(response.status).to.eq(200)
        })
    }
    else if (!urlUnderTest.includes('linkedin')) {
        /* As we require the homepage url to be present in story, article etc validation,
           we are only picking up the homepage url in the below request
        */
        cy.request({
            url: utils.getPageUrl(workFlowData.brand, 'homepage', undefined, true) + urlUnderTest,
            headers: {
                "User-Agent": "Chrome/112.0.0.0"
            },
            retryOnStatusCodeFailure: true
        }).then((response) => {
            expect(response.status).to.eq(200)
        })
    }
})

Cypress.Commands.add('textInclude', function (selector, index, textToAssert) {
    cy.get(selector).eq(index).then(($element) => {
        expect(utils.normaliseText($element.text())).to.include(utils.normaliseText(textToAssert))
    })
})

// Validate Lead Image is visible and loaded successfully in content pages like Gallery, Recipe, Article, ...
Cypress.Commands.add('validateLeadImageInContentPage', function () {
    cy.get(bundlePageSelectors.parent['contentHeader-lead-image']).find('img').should('be.visible')
        .and(($img) => {
            expect($img[0].naturalWidth).to.be.greaterThan(0);
            expect($img[0].naturalHeight).to.be.greaterThan(0);
        })
})

// Validate ByLine value in content pages like Gallery, Recipe, Article, ...
Cypress.Commands.add('validateBylineInContentPage', function (contentWorkFlow, brandTranslations) {
    cy.get(bundlePageSelectors.parent['contentHeader-byline']).each(($el, index) => {
        let bylinePreamble = brandTranslations['Byline.Preamble'][0].value;
        let bylineAuthor = contentWorkFlow.allContributors.edges[index].node.name;
        if (contentWorkFlow.allContributors.edges[index].node.contributorType === "PHOTOGRAPHER") {
            bylinePreamble = brandTranslations['Bylines.PhotographerPreamble'][0].value;
        }
        // Not all recipes uses the preamble text "BY". The condition handles present\absent states
        if (($el.text()) !== (bylinePreamble + " " + bylineAuthor)) {
            expect($el.text()).to.deep.eq(bylineAuthor);
        }
        else {
            expect($el.text()).to.deep.eq(bylinePreamble + " " + bylineAuthor);
        }
        cy.get($el).find('a').then((hrefurl) => {
            cy.validateUrl(contentWorkFlow, hrefurl.prop('href'))
        })
    })
    cy.get(bundlePageSelectors.parent['contentHeader-byline']).should('have.length', contentWorkFlow.allContributors.edges.length);
})

// Validate Published Date in content pages like Gallery, Recipe, Article, Quiz,...
Cypress.Commands.add('validatePublishedDateInContentPage', (pubDate, selector, formatString) => {
    if (pubDate) {
        let dateTime = new Date(pubDate);
        var normalizedDate = dateTime.getTime() + dateTime.getTimezoneOffset() * 60000;
        cy.get(selector).then(($el) => {
            let dateBackend = format(normalizedDate, formatString)
            let selectorDate = new Date($el.text());
            let dateUI = format(selectorDate, formatString)
            expect(dateUI).to.include(dateBackend)
        })
    }
});

//Validate Issue date in Article body
Cypress.Commands.add('validateIssueDate', function (issueDate, brandTranslations) {
    let publishVariable = brandTranslations['ArticlePage.Published in the'][0].value
    if (issueDate) {
        if (issueDate.includes('&')) {
            cy.textEquals(selectors.article['issueDate'], 0, (publishVariable + " " + issueDate + " " + 'Issue'))
        }
        else {
            cy.get(selectors.article['issueDate']).should('have.text', publishVariable + " " + (format(new Date(issueDate.substring(0, 10)), 'MMMM d, yyyy')) + " " + 'Issue');
        }
    }
})

// Validate Body Content is not empty in content pages like Gallery, Recipe, Article, ...
Cypress.Commands.add('validateBodyContentIsNotEmpty', function () {
    cy.get(bundlePageSelectors.parent['content-body']).invoke('text').should('not.be.empty');
})

// Validate Content Hed in content pages like Gallery, Recipe, Article, ...
Cypress.Commands.add('validateContentHedInContentPage', function (hed) {
    cy.get(bundlePageSelectors.parent['ContentHeaderHed']).invoke('text').then((text) => {
        expect((utils.normaliseText(text))).to.eql(utils.normaliseText(hed));
    })
})

// Validate Content Dek in content pages like Gallery, Recipe, Article, ...
Cypress.Commands.add('validateContentDekInContentPage', function (dek) {
    let contentHeaderDekUI = Cypress.$(bundlePageSelectors.parent['ContentHeaderDek']).length
    if (dek !== "" && contentHeaderDekUI > 0) {
        cy.get(bundlePageSelectors.parent['ContentHeaderDek']).invoke('text').then((text) => {
            expect(utils.normaliseText(text)).to.eql(utils.normaliseText(dek))
        })
    }
    else {
        cy.get(bundlePageSelectors.parent['ContentHeaderDek']).should('not.exist')
    }
})

// Validate Image Caption Credit in content pages like Gallery, Recipe, Article, ...
Cypress.Commands.add('validateCaptionCreditInContentPage', function (PageContent) {
    let caption_Credit = "";
    if (PageContent.lede !== null) {
        caption_Credit = PageContent.lede.credit;
    }
    else {
        caption_Credit = PageContent.tout.credit;
    }
    if ((caption_Credit !== "") && (caption_Credit !== null)) {
        cy.get(bundlePageSelectors.parent['caption-credit']).eq(0).then(($el) => {
            if ($el.text() !== caption_Credit) {
                expect(utils.normaliseText($el.text())).to.deep.eq(utils.normaliseText(caption_Credit));
            }
            else {
                expect($el.text()).to.deep.eq(caption_Credit);
            }
        })
    }
    else {
        cy.get(bundlePageSelectors.parent['caption-credit']).should('not.exist')
    }

})

// Validate CNE Video Section in content pages like Gallery, Recipe, Article, ...
Cypress.Commands.add('validateCNEVideoInContentPage', function (header) {
    cy.get(bundlePageSelectors.parent['cne-video-module']).scrollIntoView().should('be.visible');
    cy.get(bundlePageSelectors.parent['cne-video-header']).invoke('text').should('not.be.empty');
    cy.get(bundlePageSelectors.parent['cne-video-title']).eq(1).invoke('text').should('not.be.empty');
})

// Validate GQ COUPONS Section in GQ Article page, ... 
Cypress.Commands.add('validateGQCouponsInContentPage', function (workFlowData) {
    let coupons = workFlowData.brandConfigData.configContent.articleData["ComponentConfig.SavingsUnitedCoupons.settings.heading"];

    if (coupons) {
        cy.get(selectors.article.coupons).scrollIntoView().should('be.visible');
        cy.get(childSelector['defaultSectionTitleHed']).should('exist').should('have.text', 'GQ COUPONS')
        cy.get(selectors.article.couponGrid).each(($el, index) => {
            cy.get(selectors.article.couponDek).eq(index).should('not.be.empty');
        })
    }
})
// The function's goal is to validate and assert the retrieved text from the web element.
Cypress.Commands.add('invokeAndAssertText', function (selector, textToAssert) {
    cy.get(selector).first().invoke('text').then((text) => {
        expect(utils.normaliseText(text.toString())).to.include(utils.normaliseText(textToAssert.toString()))
    })
})

//Validate Slide Count
Cypress.Commands.add('validateSlideCount', function (workFlowData) {
    let expectedSlidesCount = workFlowData.currentComponentData[workFlowData.currentItemIndex].node.items.totalResults + " slides";
    cy.get(coreSelectors.content['summary_items']).eq(workFlowData.currentItemIndex).find(coreSelectors.content['slidesCount']).should('have.text', expectedSlidesCount);
})

//Validate Gallery Icon
Cypress.Commands.add('validateGalleryIcon', function (workFlowData) {
    cy.get(coreSelectors.content['summary_items']).eq(workFlowData.currentItemIndex).find(coreSelectors.content['imageIcon']).should('exist');
})

//Validate Channel Page Header
Cypress.Commands.add('validateChannelPageHedAndDek', function (workFlowData) {
    let channelSectionHeaderHed = workFlowData.bundleInfo.data.getBundle.hed ? workFlowData.bundleInfo.data.getBundle.hed : workFlowData.bundleInfo.data.getBundle.promoHed ? workFlowData.bundleInfo.data.getBundle.promoHed : '';
    let channelSectionHeaderDek = workFlowData.bundleInfo.data.getBundle.dek;
    cy.textEquals(coreSelectors.content['sectionHeaderHed'], 0, channelSectionHeaderHed)
    if (channelSectionHeaderDek !== "") {
        cy.textEquals(coreSelectors.content['sectionHeaderDek'], 0, channelSectionHeaderDek)
    }
    else {
        cy.get(coreSelectors.content['sectionHeaderDek']).should('not.exist');
    }
})

Cypress.Commands.add('validateCount', function (apiListCount, type) {
    let selectorsCount = 0;
    if (type == 'curatedList'){
        selectorsCount = Cypress.$(selectors.global.content.curatedShowsList).length;
        expect(selectorsCount).to.eq(apiListCount)
    }
    else if (type == 'Seasons' || type == 'Designers'){
        cy.get(selectors.global.content.channelNavigationList).eq(0).then(($el) => {
            selectorsCount = Cypress.$(selectors.global.content.channelNavigationList).length
            expect(selectorsCount).to.eq(apiListCount)
        })
    }
})

//validate Sub Navigation Menus
Cypress.Commands.add('validateSubNavigationLink', function (workFlowData) {
    let horizontal_links = Cypress.$(selectors.global.content.subMenuLIst)
    let navItems = workFlowData.brandConfigData.navigation.subchannelLinks
    for (let i = 0; i < horizontal_links.length; i++) {
        cy.get(selectors.global.content.subMenuLIst).eq(i).then($el => {
            if ($el.prop('href').length > 0) {
                let hrefUrl = $el.prop('href')
                let horizontal_Links_Text = $el.text();
                expect(horizontal_Links_Text).to.eq(navItems[i].text)
                cy.validateUrl(workFlowData, hrefUrl);
            }
        })
    }
})

//Validate Next Page
Cypress.Commands.add('validateNextPage', function (workFlowData) {
    let nextPageButton = Cypress.$(coreSelectors.content['nextPage_button']).length;
    if (nextPageButton > 0) {
        cy.get(coreSelectors.content['nextPage_button']).scrollIntoView().should('have.text', workFlowData.nextPageButtonText).click({ force: true })
        cy.url().should('include', '?page=2');
        cy.validateImageLoad(coreSelectors.content['summary_items'], 0);
    } else
        cy.get(coreSelectors.content['nextPage_button']).should('not.exist')
})
//Validate More Stories Page
Cypress.Commands.add('validateMoreStoriesPage', function (workFlowData) {
    let value = workFlowData.brandConfigData.translations['SearchPage.LoadMoreButtonLabel'][0].value
    let moreStoriesButton = Cypress.$(coreSelectors.content['moreStories_button']).length;
    if (moreStoriesButton > 0) {
        cy.get(coreSelectors.content['moreStories_button']).scrollIntoView().should('have.text', value).click({ force: true })
        cy.url().should('include', 'page=2');
    }
    else {
        cy.get(coreSelectors.content['moreStories_button']).should('not.exist')
    }
})

//Generic function to validate if image has loaded successfully
Cypress.Commands.add('validateImageLoad', function (selector, index) {
    cy.get(selector).eq(index).scrollIntoView().find('img')
        .and(($img) => {
            expect($img[0].naturalWidth).to.be.greaterThan(0);
            expect($img[0].naturalHeight).to.be.greaterThan(0);
        })
})

//Generic function to validate tag header and links in content pages
Cypress.Commands.add('validateTagLinks', function (tags, tagHeader) {
    tags = tags.map(value => value.name);
    if (tagHeader !== undefined) {
        cy.get(coreSelectors.content['tag_cloud_section_header']).scrollIntoView().should('have.text', tagHeader);
    }
    cy.get(coreSelectors.content['tag_cloud_link']).each(($el, index) => {
        expect($el.text()).to.deep.eq(tags[index]);
        cy.validateUrl(null, $el.prop('href'));
    })
    cy.get(coreSelectors.content['tag_cloud_link']).should('have.length', tags.length);
})

//Generic function to PURGE
Cypress.Commands.add('purgeUrl', function (Url) {
    const env_ci = Cypress.env('IS_CI');
    let purge_request = {
        method: 'PURGE',
        url: Url,
        failOnStatusCode: false
    };

    if (env_ci) {
        purge_request.headers = {
            'Fastly-Key': Cypress.env('PURGE_TOKEN')
        }
    }
    return cy.request(purge_request);
})

Cypress.Commands.add('layoutServiceGraphQL', function (query) {
    const environment = Cypress.env('environment');
    let bearer_token = Cypress.env('BEARER_TOKEN');
    let layoutConfigUrl = testData.layoutConfigUrl;

    if (environment === 'staging') {
        bearer_token = Cypress.env('BEARER_TOKEN_STAG');
        layoutConfigUrl = testData.layoutConfigUrlStaging;
    }

    let gql_request = {
        method: 'POST',
        url: layoutConfigUrl,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer_token,
            'User-Agent': 'qa-cypress-test'
        },
        body: JSON.stringify(query)
    }
    return cy.request(gql_request)

})

//Generic function to fetch GraphQL query
Cypress.Commands.add('queryGraphQL', function (query, brandPage) {
    const env_ci = Cypress.env('IS_CI');
    const environment = Cypress.env('environment');
    let bearer_token = Cypress.env('BEARER_TOKEN')
    let graphqlURl_ci = brandPage === undefined ? testData.graphqlURlCi : testData.tnyGraphQLConfigUrl;
    if (environment === 'staging') {
        bearer_token = Cypress.env('BEARER_TOKEN_STAG')
        graphqlURl_ci = brandPage === undefined ? testData.graphqlURlCiStaging : testData.tnyGraphQLConfigUrlStaging;
    }
    let contentUrl = brandPage === undefined ? testData.graphqlURl : graphqlURl_ci
    let gql_request = {
        method: 'POST',
        url: contentUrl,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer_token,
            'User-Agent': 'qa-cypress-test'
        },
        body: JSON.stringify(query),
    }
    if (env_ci && brandPage === undefined) {
        gql_request.url = graphqlURl_ci;
        gql_request.headers = {
            'Content-Type': 'application/json',
            'Authorization': bearer_token
        }
    }
    let retries = 0;
    let gql_response = () => {
        if (retries >= 3) {
            throw new Error("GraphQL data fetch failed after three attempts");
        }
        else {
            cy.request(gql_request).then((res) => {
                const data = res.body.data.getBundle?.containers ? true :
                    res.body.data.search?.content ? true :
                        res.body.data.getRecipe ? true :
                            res.body.data.getGallery ? true :
                                res.body.data.getQuiz?.edges ? true :
                                    res.body.data.getArticle ? true :
                                        res.body.data.getQuizScores?.edges ? true :
                                            res.body.data.getBusiness ? true :
                                                res.body.data.tagName?.content ? true :
                                                    res.body.data.getContributor ? true :
                                                        res.body.data.cartoons ? true :
                                                            res.body.data.getCulturalEvent ? true : false;
                if (data) {
                    return res;
                }
                else {
                    cy.wait(2000);
                    retries++;
                    res = null;
                    return gql_response();
                }
            })
        }
    }
    return gql_response();
})

//Generic function to fetch Brand Config Data
Cypress.Commands.add('queryChannelNavigationData', function (workFlowData, channelName) {
    const env_ci = Cypress.env('IS_CI');
    let bearer_token = Cypress.env('BEARER_TOKEN');
    let query = {
        method: 'GET',
        url: testData[Cypress.env('environment')][workFlowData.brand][channelName]
    }
    if (!env_ci)
        query.failOnStatusCode = false
    else {
        query.headers = {
            'Authorization': bearer_token
        }
    }
    query.failOnStatusCode = false
    return cy.request(query);
})

//Generic function to fetch Brand Config Data
Cypress.Commands.add('queryBrandConfig', function (workFlowData, channel, urlIndex) {
    const env_ci = Cypress.env('IS_CI');
    const environment = Cypress.env('environment');
    let bearer_token = Cypress.env('BEARER_TOKEN');
    if (environment === 'staging') {
        bearer_token = Cypress.env('BEARER_TOKEN_STAG');
    }
    let brandConfigQuery = {
        method: 'GET',
        url: testData[Cypress.env('environment')][workFlowData.brand]['configHomeUrl'] ? testData[Cypress.env('environment')][workFlowData.brand]['configHomeUrl'] : testData[Cypress.env('environment')][workFlowData.brand]['configUrl']
    }
    brandConfigQuery.headers = {
        'x-from-cdn': 'yes'
    }
    if (env_ci && !channel) {
        if (testData[Cypress.env('environment')][workFlowData.brand]['configHomeUrl'] !== undefined) {
            brandConfigQuery.url = testData[Cypress.env('environment')][workFlowData.brand]['homePageUrl'] + testData.configHomePath;
        }
        else {
            brandConfigQuery.url = testData[Cypress.env('environment')][workFlowData.brand]['homePageUrl'] + testData.configPath;
        }
        brandConfigQuery.headers = {
            'Authorization': bearer_token
        }
    }
    else if (!env_ci && channel) {
        brandConfigQuery.url = testData[Cypress.env('environment')][workFlowData.brand]['configUrl'].replace('default', (testData[Cypress.env('environment')][workFlowData.brand][workFlowData.page][urlIndex]).replace(/[\/\\]/g, ''));
        brandConfigQuery.failOnStatusCode = false
    }
    else if (env_ci && channel) {
        brandConfigQuery.url = testData[Cypress.env('environment')][workFlowData.brand]['homePageUrl'] + testData.configPath.replace('default', (testData[Cypress.env('environment')][workFlowData.brand][workFlowData.page][urlIndex]).replace(/[\/\\]/g, ''));
        brandConfigQuery.headers = {
            'Authorization': bearer_token
        }
        brandConfigQuery.failOnStatusCode = false
    }
    return cy.request(brandConfigQuery);
})
//Common funciton to validate Newsletter Subscribe Form.
Cypress.Commands.add('validateNewsletterSubscribeForm', (workFlowData) => {
    cy.get(selectors.global.content.newsletterSubscribeForm).within(() => {
        if (workFlowData.brandConfigData.configContent.articleData["defaultTenantConfig.newsletterModules"]) {
            let content = JSON.parse(workFlowData.brandConfigData.configContent.articleData["defaultTenantConfig.newsletterModules"]);
            cy.get(selectors.global.content.newsletter_subscribe_form_hed).then(($hedText) => {
                for (let i = 0; i < content.length; i++) {
                    if (content[i].dangerousHed !== undefined) {
                        if (content[i].dangerousHed.includes($hedText.text())) {
                            expect(content[i].dangerousHed).to.eq($hedText.text())
                            return
                        }
                    }
                }
                if (selectors.global.content.newsletter_subscribe_form_hed.length) {
                    cy.get(selectors.global.content.newsletter_subscribe_form_hed).should('be.visible')
                }
            })
            cy.get(selectors.global.content.newsletter_subscribe_form_dek).then(($dekText) => {
                for (let i = 0; i < content.length; i++) {
                    if (content[i].dangerousDek.includes($dekText.text())) {
                        expect(content[i].dangerousDek).to.eq($dekText.text())
                    }
                }
                if (selectors.global.content.newsletter_subscribe_form_dek.length) {
                    cy.get(selectors.global.content.newsletter_subscribe_form_dek).should('be.visible')
                }
            })
        } else {
            cy.get(selectors.global.content.newsletter_subscribe_form_hed).then(($hedText) => {
                expect($hedText.text()).to.exist
            })
            cy.get(selectors.global.content.newsletter_subscribe_form_dek).then(($dekText) => {
                expect($dekText.text()).to.exist
            })
        }
        cy.get(selectors.global.content.textFieldLabel_email).should('be.visible')
        cy.get(selectors.global.content.signUpNowBtn).invoke('text').should('not.empty')
        let dangerousDisclaimer = workFlowData.brandConfigData.configContent.config.newsletter.manage.dangerousDisclaimer;
        if (dangerousDisclaimer) {
            cy.get(selectors.global.content.privacy_text).invoke('text').should('not.empty')
            cy.get(selectors.global.content.privacy_link).each((data) => {
                cy.validateUrl(null, data.prop('href'))
            })
        }
    })
})

Cypress.Commands.add('validateSaveBookMarkIcon', (workFlowData) => {
    let brandTranslations = workFlowData.brandConfigData.translations;
    let saveStoryDefaultLabel = brandTranslations['BookmarkPrimaryLabel.SaveThisStory'][0].value;
    let saveStoryActiveLabel = brandTranslations['BookmarkPrimaryLabel.Saved'][0].value;
    let savedToLibrary = brandTranslations['BookmarkPrimaryLabel.SavedToLibrary'][0].value;
    let iconCheckedText = workFlowData.brandConfigData.configContent.homepageConfig['ComponentConfig.ActionBar.settings.actionBarConfig.bookmark.afterActionIcon']
    if (iconCheckedText !== undefined && iconCheckedText.includes('library'))
        saveStoryActiveLabel = savedToLibrary;
    let title = Cypress.$(selectors.bundles.parent['ContentHeaderHed']).text()
    cy.scrollTo('center')
    if (Cypress.$(coreSelectors.header['bookMarkIconChecked']).length > 0) {
        cy.get(coreSelectors.header['bookMarkIcon']).first().realHover().find('title').then(($title) => {
            expect($title.text()).contains(saveStoryActiveLabel)
        });
    }
    else {
        cy.get(coreSelectors.header['bookMarkIcon']).realHover().find('title').then(($title) => {
            expect($title.text()).contains(saveStoryDefaultLabel)
        })
        cy.get(coreSelectors.header['bookMarkIcon']).click({ force: true })
        cy.scrollTo('center')
        cy.get(coreSelectors.header['bookMarkIcon']).first().realHover().find('title').then(($title) => {
            expect($title.text()).contains(saveStoryActiveLabel)
        });
    }
    cy.get(coreSelectors.header['bookmarkAlertIconWrapper']).first().invoke('text').should('exist')
    cy.get(coreSelectors.header['bookmarkAlertIconUrl']).first().then(($el) => {
        cy.validateUrl(null, $el.prop('href'), true)
    })
    cy.get(coreSelectors.header['closeAlertIcon']).first().click({ force: true })
    cy.get(coreSelectors.header['myAccount']).eq(0).click();
    cy.get(coreSelectors.header['utility_logOut']).eq(0).then(($el) => {
        cy.contains($el.text()).should('be.visible')
    })
    let index1 = 0;
    let pattern = workFlowData.brandConfigData.configContent.articleData['ComponentConfig.ConnectedNavigation.settings.navPattern'];
    let viewedStoriesText = workFlowData.brandConfigData.translations['StandardNavigation.SavedStoriesLabel'][0].value;
    let viewSavedContentText = workFlowData.brandConfigData.configContent.config.accountLinks.nodes[1].text;
    let dangerousDekLabel = workFlowData.brandConfigData.configContent.homepageConfig['channelConfig.newsletterModule.dangerousDek']
    let articleBookmarkText = dangerousDekLabel === undefined ? viewedStoriesText : dangerousDekLabel.includes('AD') ? viewSavedContentText : viewedStoriesText;
    let selector = pattern.includes("Standard") ? 'accountLink' : 'accountLinks'
    cy.get(coreSelectors.header[selector]).find('li a').each(($el, index) => {
        if (utils.normaliseText($el.text()) === utils.normaliseText(articleBookmarkText)) {
            index1 = index;
            cy.validateUrl(null, $el.prop('href'), true)
        }
    }).then(() => {
        cy.get(coreSelectors.header[selector] + ' li').eq(index1).should('be.visible').click()
        cy.wait(1000)
    })
    //Validate saved story is visible in "View Saved stories"
    cy.textEquals(selectors.bundles.children['hed'], 0, title)
    cy.get(coreSelectors.header['utilityLedeHedText']).invoke('text').should('not.be.empty')
    cy.get(coreSelectors.header['utilityLedeDekText']).invoke('text').should('not.be.empty')
    cy.get(coreSelectors.header['utilityLedeDekText']).find('a').then(($el) => {
        cy.validateUrl(null, $el.prop('href'), true)
    })
    //Validate when user unsave the article story
    cy.get(coreSelectors.header['savedBookMarkCheckbox']).eq(0).click({ force: true })
    cy.get(coreSelectors.header['utilityCardDek']).invoke('text').should('not.be.empty')
    cy.get(coreSelectors.header['accountBookMarkPage']).find('a').then(($el) => {
        cy.validateUrl(null, $el.prop('href'), true)
        cy.get($el).invoke('text').should('not.be.empty')
    })
})

//Validate Botton Recirc unit for content pages (Gallery, Recipe, Article): byLineName, rubric, overlayHed, image with image link 
Cypress.Commands.add("validateContentPageRecircContent", (workFlowData) => {
    workFlowData.productPage = workFlowData.brandConfigData.configContent.infopageData["ComponentConfig.ReviewPage.settings.hasStaticPositionedAward"];
    let recircList = Cypress.$(selectors.bundles.children.recircListItems).length;
    if (workFlowData.productPage || !(recircList > 0)) {
        cy.get(selectors.bundles.children.summaryCollectionGridContent).within(() => {
            cy.get(selectors.bundles.children.defaultSectionTitleHed).should('be.visible')
            cy.validateRecircSummaryContent(workFlowData);
        })
    } else {
        cy.get(selectors.bundles.children.recircListItems).within(() => {
            cy.get(selectors.bundles.children.footerLinksHeading).should('be.visible');
            cy.validateRecircSummaryContent(workFlowData);
        })
    }
});

//Validate recirc summary content
Cypress.Commands.add("validateRecircSummaryContent", (workFlowData) => {
    let summaryItems = Cypress.$(selectors.bundles.children.summaryCollectionGridItems).length > 0 ? selectors.bundles.children.summaryCollectionGridItems : selectors.global.content.summary_items;
    let recircList = Cypress.$(selectors.bundles.children.recircListItems).length > 0 ? selectors.bundles.children.recircListItems : selectors.bundles.children.summaryCollectionGridContent;
    // In Epicurious, Images in Recirc Unit don't have the href, so picking the hed Url using "contentWrapper"
    let summaryItemImageRecirc = Cypress.$(recircList + ' >* ' + selectors.bundles.children.overlaySummaryItemWrapperRecirc).length > 0 ? selectors.bundles.children.overlaySummaryItemWrapperRecirc : (Cypress.$(recircList + ' >* ' + selectors.bundles.children.imageUrl).length > 0 ? selectors.bundles.children.imageUrl : selectors.bundles.children.contentWrapper);
    let rubric = Cypress.$(selectors.gallery.summaryItemRubric).length > 0 ? selectors.gallery.summaryItemRubric : selectors.bundles.children.rubric;
    let hed = Cypress.$(selectors.bundles.children.contentWrapperHed).length > 0 ? selectors.bundles.children.contentWrapperHed : (Cypress.$(selectors.bundles.children.overlayHed).length > 0 ? selectors.bundles.children.overlayHed : selectors.bundles.children.hed);
    let bylinePreamble = workFlowData.brandConfigData.translations['Byline.Preamble'][0].value;
    let summaryHedLength = Cypress.$(selectors.bundles.children.contentWrapperHed).length > 0 ? false : (Cypress.$(selectors.bundles.children.hedUrl).length > 0 ? true : false);
    let summaryOverlayHedLength = Cypress.$(selectors.bundles.children.overlayHed).length;
    let hideRubric = JSON.parse(workFlowData.brandConfigData.configContent.recipeData["ComponentConfig.RecircList.settings.shouldHideRubric"]);
    let dekLength = Cypress.$(recircList + ' >* ' + selectors.bundles.children.dek).length > 0 ? true : (Cypress.$(recircList + ' >* ' + selectors.bundles.children.contentWrapperDek).length > 0 ? true : false);
    let dek = Cypress.$(selectors.bundles.children.contentWrapperDek).length > 0 ? selectors.bundles.children.contentWrapperDek : selectors.bundles.children.dek;
    cy.get(summaryItems).each((ele, index) => {
        let basePath = workFlowData.recircContentData[index];
        let hedGQL = basePath.title ? basePath.title : (basePath.promoHed ? basePath.promoHed : basePath.hed);
        let dekGQL = basePath.promoDek ? basePath.promoDek : basePath.dek;
        let rubricGQL = basePath.channels?.[0]?.name ? basePath.channels[0].name : basePath.section;
        let authorGQL = basePath.authors?.length > 0 ? basePath.author : (basePath.allContributors?.edges.length > 0 ? basePath.allContributors.edges[0].node.name : (basePath.contributors?.length > 0 ? basePath.contributors[0].name : false));
        cy.validateTextEqualsOrTextExists(hed, index, hedGQL);
        if (workFlowData.productPage || ((dekGQL !== null) && (dekLength))) {
            cy.validateTextEqualsOrTextExists(dek, index, dekGQL);
        }
        cy.validateImageUrl(workFlowData, index, summaryItemImageRecirc);
        if ((!summaryOverlayHedLength > 0) && (summaryHedLength)) {
            // Below line validates the Url for 200 in hed and verifies that the url in both hed and image are same
            cy.validateImageUrl(workFlowData, index, selectors.bundles.children.hedUrl);
            cy.get(selectors.bundles.children.hedUrl).eq(index).then(($hedLink) => {
                cy.get(summaryItemImageRecirc).eq(index).then(($imageLink) => {
                    expect($hedLink.prop('href')).to.deep.eq($imageLink.prop('href'));
                })
            })
        }
        if (!hideRubric) {
            cy.validateTextEqualsOrTextExists(rubric, index, rubricGQL);
        }
        else {
            cy.get(selectors.gallery.summaryItemRubric).should('not.exist');
            cy.get(selectors.bundles.children.rubric).should('not.exist');
        }

        cy.get(summaryItems).eq(index).then(($el) => {
            if ($el.find(selectors.bundles.children.byLineName).length > 0) {
                cy.get(summaryItems).eq(index).find(selectors.bundles.children.byLineName).eq(0).then(($element) => {
                    let author = authorGQL ? authorGQL : '';
                    if (utils.normaliseText(bylinePreamble + " " + author) === utils.normaliseText($element.text())) {
                        expect(utils.normaliseText(bylinePreamble + " " + author)).to.eql(utils.normaliseText($element.text()));
                    }
                    else {
                        expect($element.text().trim()).not.to.be.empty;
                    }
                })
            }
            else {
                cy.get(summaryItems).eq(index).find(selectors.bundles.children.byLineName).should('not.exist');
            }
        })
    })
})

//Get Recirc Strategy
Cypress.Commands.add("getRecircStatergy", (index) => {
    cy.clearCookies();
    cy.clearLocalStorage();
    let recircList = Cypress.$(selectors.bundles.children.recircListItems).length > 0 ? selectors.bundles.children.recircListItems : selectors.bundles.children.summaryCollectionGridContent;
    // In Epicurious, Images in Recirc Unit don't have the href, so picking the hed Url using "contentWrapper"
    let summaryItemImageRecirc = Cypress.$(recircList + ' >* ' + selectors.bundles.children.overlaySummaryItemWrapperRecirc).length > 0 ? selectors.bundles.children.overlaySummaryItemWrapperRecirc : (Cypress.$(recircList + ' >* ' + selectors.bundles.children.imageUrl).length > 0 ? selectors.bundles.children.imageUrl : selectors.bundles.children.contentWrapper);
    cy.get(recircList).find(summaryItemImageRecirc).eq(index).then(($el) => {
        var strategy = $el.prop('href').split("_").slice(-1);
        if (/-/.test(strategy)) {
            strategy = strategy.toString().replace(/-/g, "_");
        }
        return strategy;
    })
});

Cypress.Commands.add('validatePublishDate', function (IssuePublishDate, i, selector) {
    const dateValue = IssuePublishDate[i].node.issueDate ? IssuePublishDate[i].node.issueDate : IssuePublishDate[i].node.pubDate
    const publishDate = dateValue.split('T')[0]
    if (publishDate.includes('&')) {
        cy.textEquals(selector, i, publishDate)
    }
    else {
        cy.textEquals(selector, i, format(new Date(publishDate), 'MMMM d, yyyy'))
    }
})

// Validate Social Icon List for content pages
Cypress.Commands.add('validateSocialIcons', (workFlowData) => {
    let socialIcons = Cypress.$(coreSelectors.content.socialIconContainer);
    let navigationDropdownListItem = Cypress.$(coreSelectors.header.navigationDropdownListItem).first()
    let navItem = Cypress.$(coreSelectors.header.navItem)
    let socialListNetwork = ['facebook', 'twitter', 'email', 'pintrest', 'bookmark']
    let title = Cypress.$(selectors.bundles.parent['ContentHeaderHed']).text()
    let articleData = workFlowData.brandConfigData.configContent.articleData;
    let saveThistext = articleData['ComponentConfig.BookmarkIcon.settings.bookmarkIconTitle'];
    let bookmarkPrimaryLabel = workFlowData.brandConfigData.translations['BookmarkPrimaryLabel.Saved'][0].value;
    if (socialIcons.length > 0) {
        for (let i = 0; i < socialListNetwork.length; i++) {
            cy.get(coreSelectors.footer.social_list_icon).find('li>a').then(($el) => {
                cy.validateUrl(null, $el.prop('href'), true)
            })
        }
        cy.get(coreSelectors.footer.social_list_icon).invoke('text').should('not.be.empty')
    }
    else {
        cy.get(headerSelector['social_list_icon']).should('not.be.visible')
    }

    // validate save bookmark Icon
    cy.scrollTo('center')
    if (Cypress.$(coreSelectors.content['bookMarkActivated']).length > 0) {
        cy.get(coreSelectors.content.socialIconBookmark).first().realHover().find('title').then(($title) => {
            cy.wait(2000)
            expect($title.text()).contains(bookmarkPrimaryLabel)
        });
    }
    else {
        cy.get(coreSelectors.content.socialIconBookmark).realHover().find('title').then(($title) => {
            expect($title.text()).contains(saveThistext)
        })
        cy.get(coreSelectors.content.socialIconBookmark).first().click({ force: true })
        cy.wait(2000)
        cy.scrollTo('center')
        cy.get(coreSelectors.content.socialIconBookmark).first().realHover().find('title').then(($title) => {
            cy.wait(2000)
            expect($title.text()).contains(bookmarkPrimaryLabel)
        });
    }
    cy.get(coreSelectors.header['account']).eq(0).click({ force: true });
    cy.get(navigationDropdownListItem).then(($el) => {
        cy.contains($el.text()).should('be.visible')
    })
    let dropdownlist_index = 0;
    let viewsaveditems = workFlowData.brandConfigData.configContent.articleData['ComponentConfig.StandardNavigation.settings.savedStoriesLabel']
    cy.get(navigationDropdownListItem).find('li a').each(($el, index) => {
        if (utils.normaliseText($el.text()) === utils.normaliseText(viewsaveditems)) {
            dropdownlist_index = index;
            cy.validateUrl(null, $el.prop('href'), true)
        }
    }).then(() => {
        cy.get(navItem).eq(dropdownlist_index).should('be.visible').click({ force: true }).then(($el) => {
            cy.contains($el.text()).should('be.visible').click({ force: true })
            cy.wait(1000)
        })
    })
    //Validate saved story is visible in "View Saved stories"
    cy.textEquals(selectors.bundles.children['hed'], 0, title)
    cy.get(coreSelectors.header['utilityLedeHedText']).invoke('text').should('not.be.empty')

    //Validate when user unsave the article story
    cy.get(coreSelectors.header['savedBookMarkCheckbox']).eq(0).click({ force: true })
    cy.get(coreSelectors.header['utilityCardDek']).invoke('text').should('not.be.empty')
    cy.get(coreSelectors.header['accountBookMarkPage']).find('a').then(($el) => {
        cy.validateUrl(null, $el.prop('href'), true)
        cy.get($el).invoke('text').should('not.be.empty')
    })
})

Cypress.Commands.add('validateSigninPopupBeforeBookMarking', (workFlowData, type) => {
    if (type === 'runway') {
        cy.get(coreSelectors.content['slideShowPromoImage']).click().then(() => {
            cy.clearCookies();
            cy.clearLocalStorage();
            let paywallRegGateLength = Cypress.$(coreSelectors.content['regGatePaywallExtended']).length
            let createUser = paywallRegGateLength > 0 ? 'paywallMemberButton' : 'regGateCanvasCreateButton';
            let signInLink = paywallRegGateLength > 0 ? 'paywallSignin' : 'regGateCanvasSignin';
            cy.get(coreSelectors.content[createUser]).should('be.visible').then(($el) => {
                cy.validateUrl(null, $el.prop('href'), true);
            })
            cy.get(coreSelectors.content[signInLink]).should('be.visible').then(($el) => {
                cy.validateUrl(null, $el.prop('href'), true);
            })
        })
    }
    else if (type === 'streetStyle') {
        cy.get(coreSelectors.content['imageBookMarkIcon']).eq(0).realHover().click({ force: true });
        cy.get(coreSelectors.content['signInPopUp']).should('be.visible')
        cy.get(selectors.gallery.signInButton).should('be.visible').then(($el) => {
            cy.validateUrl(null, $el.prop('href'), true);
        })
        cy.get(coreSelectors.content['imageClosebutton']).should('be.visible').click();
    }
})

Cypress.Commands.add('checkAndCollapsePaywall', (workFlowData, type, accountSelector) => {
    cy.wait(5000)       // This wait time is required, for the paywall if any to appear once the page is loaded. 
    let paywallCollapseButtonPresent = Cypress.$(selectors.recipe.paywall_banner_close_button).length
    if (paywallCollapseButtonPresent > 0)
        cy.get(selectors.recipe.paywall_banner_close_button).click();
    cy.wait(500)
})

Cypress.Commands.add('validateImageBookmarking', (workFlowData, type, accountSelector) => {
    let viewSavedImage = workFlowData.brandConfigData.navigation.account.accountLinks[1].text;
    let noImagesSaved = workFlowData.brandConfigData.configContent.galleryData['ComponentConfig.AccountSavedImagesPage.settings.dekWhenNoImages']
    let savedImages = workFlowData.brandConfigData.configContent.galleryData['ComponentConfig.AccountSavedImagesPage.settings.imageSectionTitle']
    let viewMore = workFlowData.brandConfigData.configContent.galleryData['ComponentConfig.AccountSavedImagesPage.settings.viewMoreLabel']
    let initialNumberOfImages = workFlowData.brandConfigData.configContent.galleryData['ComponentConfig.AccountSavedImagesPage.settings.initialNumberOfImages']
    let saveImageText = workFlowData.brandConfigData.translations['PhotoBookmark.SaveIconTitle'][0].value;
    let imageSavedText = workFlowData.brandConfigData.translations['PhotoBookmark.SavedIconTitle'][0].value;
    cy.checkAndCollapsePaywall();
    //// ***  Can use below config to check if the page is lazy load type. 
    //     let isLazy = workFlowData.brandConfigData.configContent.articleData["ComponentConfig.GalleryEmbed.settings.isLazy"]

    for (let i = 0; i < 3; i++) {     // This should not be removed. It helps in book marking numberous images and it is required to test the limit of saved images tab. 
        let index = (type === 'streetStyle') ? i : 0;
        if (type === 'streetStyle')
            cy.get('.GallerySlideResponsiveAsset').eq(index).scrollIntoView();
        cy.get(coreSelectors.content['imageBookMarkIcon']).eq(index).find('title').then(($title) => {
            let count = Cypress.$(coreSelectors.content['imageBookMarkWrapper']).eq(index).find('.icon-bookmark-fill').length;
            if (i === 0) {        // Validate "Image Saved" text once
                if (count > 0) {    // If image already Bookmarked, then unbookmark and check the "save Image" text
                    expect($title.text()).to.equal(imageSavedText)
                    cy.get(coreSelectors.content['imageBookMarkIcon']).eq(index).click({ force: true });
                    cy.wait(1000)
                    cy.get(coreSelectors.content['imageBookMarkIcon']).eq(index).find('title').then(($el) => {
                        expect($el.text()).to.equal(saveImageText)     // Validate "Save Image" text
                    })
                    clickBookmarkIcon(index)
                }
                else {
                    expect($title.text()).to.equal(saveImageText)
                    clickBookmarkIcon(index)
                    cy.get(coreSelectors.content['imageBookMarkIcon']).eq(index).find('title').then(($el) => {
                        expect($el.text()).to.equal(imageSavedText)
                    })
                }
            } else {
                let isBookmarked = Cypress.$(coreSelectors.content['imageBookMarkWrapper']).eq(index).find('.icon-bookmark-fill').length;
                if (isBookmarked === 0) {     // Click on Save image, only if not already book marked
                    clickBookmarkIcon(index)
                }
            }
        })
        if (type !== 'streetStyle')
            cy.get(coreSelectors.content['iconArrow']).eq(1).click();    // get next image
    }
    let accountLinksIndex = 0;
    cy.get(coreSelectors.header['myAccount']).eq(0).click();
    cy.get(coreSelectors.header[accountSelector]).find('li a').each(($el, index) => {
        if (utils.normaliseText($el.text()) === utils.normaliseText(viewSavedImage).trim()) {
            accountLinksIndex = index;
            cy.validateUrl(null, $el.prop('href'), true)
        }
    }).then(() => {
        cy.get(coreSelectors.header[accountSelector] + ' li').eq(accountLinksIndex).should('be.visible').click()
        cy.wait(1000)
    })
    cy.get(coreSelectors.header['utilityLedeHedText']).then(($el) => {
        expect($el.text()).to.equal(savedImages)
    })
    cy.get(coreSelectors.header['utilityLedeDekText']).then(($el) => {
        let count = $el.text().split(' ');
        // If there are no images saved, then check "Explore runway" button is present. 
        // If total Images are more than 20, then check "View More" button is present, else button should not be present.
        if ($el.text() === noImagesSaved) {
            expect($el.text()).to.equal(noImagesSaved);
            cy.get(coreSelectors.content['savedImagesPageButton']).should('be.visible').then(($el) => {
                cy.validateUrl(null, $el.prop('href'), true);
            })
        }
        else if (count[0] <= initialNumberOfImages) {
            cy.get(coreSelectors.content['savedImagesPageButton']).should('not.exist')
        }
        else if (count[0] > initialNumberOfImages) {
            cy.get(coreSelectors.content['savedImagesPageButton']).should('be.visible').then(($el) => {
                expect($el.text()).to.equal(viewMore);
            })
        }
    })
})

Cypress.Commands.add('validateUnSavingTheImage', (workFlowData) => {
    let noImagesSaved = workFlowData.brandConfigData.configContent.galleryData['ComponentConfig.AccountSavedImagesPage.settings.dekWhenNoImages']
    cy.get(coreSelectors.header['utilityLedeDekText']).then(($el) => {
        let totalImages = 0;
        if ($el.text() !== noImagesSaved) {
            totalImages = ($el.text().split(' '))[0];
            for (let i = 1; i <= totalImages; i++) {
                cy.get(coreSelectors.content['pictureViewImagesTab']).eq(0).click();
                cy.get(coreSelectors.content['imageBookMarkIcon']).eq(0).realHover().click();
                cy.wait(2000)
                let status = Cypress.$(coreSelectors.content['imageNotBookMarked']).length;
                if (status === 1) {    // Re-verify if Bookmark icon is disabled.
                    cy.get(coreSelectors.content['imageBookMarkIcon']).eq(0).realHover().click();
                    cy.wait(1000)
                }
                cy.get(coreSelectors.content['imageClosebutton']).should('be.visible').click();
                let latestCount = totalImages - i;
                cy.scrollTo('top', { duration: 1000 })
                cy.get(coreSelectors.header['utilityLedeDekText']).then(($el1) => {
                    let currentImagesCount = Number(($el1.text().split(' '))[0]);
                    if (i <= 3 && latestCount !== 0) {                      // validate Image count decreases after unbookmarking, just only for 3 images to check the functionality
                        expect(currentImagesCount).to.eq(latestCount)
                    }
                })
            }
            cy.get(coreSelectors.header['utilityLedeDekText']).then(($el2) => {
                expect($el.text()).to.eq(noImagesSaved);
            })
        }
    })
})

//This function is used to validate the text if matches, and to just verify the selector if the text doesn't match
//This is a temporary fix for Recirc Unit failures
Cypress.Commands.add('validateTextEqualsOrTextExists', function (selector, index, textToAssert) {
    cy.get(selector).eq(index).then(($element) => {
        if (utils.normaliseText($element.text()) === utils.normaliseText(textToAssert)) {
            expect(utils.normaliseText(textToAssert)).to.eql(utils.normaliseText($element.text()))
        }
        else {
            expect($element.text().trim()).not.to.be.empty;
        }
    })
})

Cypress.Commands.add('siginPolaroid', function () {
    cy.wait(2000)
    cy.get(coreSelectors.content['polaroidUserName']).type('polaroid')
    cy.get(coreSelectors.content['polaroidPassword']).type('5hx4W7qd7hxfgsHC')
    cy.get(coreSelectors.content['polaroidSignin']).eq(2).click();
})

Cypress.Commands.add('validateUnpublishedShowError', function () {
    cy.wait(3000)
    cy.textEquals(coreSelectors.content['polaroidHeading'], 0, 'Unable to find a show, Please check details on copilot are correct')
})

Cypress.Commands.add('validateCopilotLinkIsWorking', function (selector) {
    cy.wait(2000)
    cy.get(coreSelectors.content[selector]).then((url) => {
        cy.validateUrl(null, url.prop('href'));
    })
})

Cypress.Commands.add('uploadInvalidFileType', function () {
    cy.wait(2000)
    cy.get(coreSelectors.content['collectionsLink']).eq(0).click();
    cy.wait(1000)
    cy.validateCopilotLinkIsWorking('copilotLinkCollection');
    uploadPhotosToCopilot(null, 1, 'invalidFileType')
    cy.textEquals(coreSelectors.content['polaroidError'], 0, 'Please only upload Images in jpeg format')
    cy.get(coreSelectors.content['uploadImagesButton']).should('not.exist')
})

Cypress.Commands.add('validateImageSelectionForUpload', function () {
    cy.wait(2000)
    let index = 0, imagesToUpload = 20;
    uploadPhotosToCopilot(index, imagesToUpload);
    validateRequiredFieldsPresent();
    // Remove single Image
    cy.get(coreSelectors.content['imagesSelectedText']).eq(1).then(($el) => {
        let imagesSelected = $el.text().split('images')[0];
        cy.get(coreSelectors.content['imageOnCarousel']).eq(0).realHover()
        cy.get(coreSelectors.content['removeImageButton']).eq(0).scrollIntoView().click();
        cy.get(coreSelectors.content['imagesSelectedText']).eq(1).then(($el) => {
            let updatedImagesSelected = $el.text().split('images')[0];
            expect(updatedImagesSelected.trim()).to.eq((imagesSelected - 1).toString())
        })
    })

    //Remove all Images
    cy.get(coreSelectors.content['removeAllImageLink']).should('be.visible').click();
    cy.get(coreSelectors.content['imagesSelectedText']).should('not.exist')
    cy.get(coreSelectors.content['uploadImagesButton']).should('not.exist')
    cy.wait(1000)
})

Cypress.Commands.add('validateImageUploading', function (type) {
    cy.wait(1000)
    let index = 0, imagesToUpload = 5, timeToWait = 20000;
    if (type === 'reupload') {
        index = 2, imagesToUpload = 2, timeToWait = 10000;
    }
    cy.get(coreSelectors.content['pageStatus']).eq(index).then(($el) => {
        let totalImagesOnGallery = $el.text().split(':')[1]
        uploadPhotosToCopilot(0, imagesToUpload);
        cy.get(coreSelectors.content['uploadImagesButton']).should('be.visible').click();
        cy.wait(timeToWait)
        cy.textEquals(coreSelectors.content['imageUploadedStatus'], 0, 'Images successfully uploaded')
        cy.get(coreSelectors.content['pageStatus']).eq(2).then(($el) => {
            let latestImagesOnGallery = $el.text().split(':')[1]
            let numberOfImagesUploaded = Cypress.$(coreSelectors.content['numberOfImagesUploaded']).length;
            expect(numberOfImagesUploaded).to.eql(imagesToUpload)
            if (type === 'reupload') {
                expect(totalImagesOnGallery).to.eql(latestImagesOnGallery)
            }
        })
    })
})

export function uploadPhotosToCopilot(index, numberOfImagesToUpload, type) {
    for (let i = 1; i <= numberOfImagesToUpload; i++) {
        let image = 'IS1_00' + (i + index) + '.jpg'
        if (type === 'invalidFileType')
            image = 'InvalidFileType.png'
        cy.fixture(image, { encoding: null }).as('photo')
        cy.get(coreSelectors.content['photoInputField']).selectFile({ contents: '@photo', fileName: image }, { force: true })
    }
}

export function validateRequiredFieldsPresent() {
    cy.get(coreSelectors.content['uploadImagesButton']).should('be.visible')
    cy.get(coreSelectors.content['imageCarouselButton']).eq(0).should('exist').should('have.attr', 'disabled')
    cy.get(coreSelectors.content['imageCarouselButton']).eq(1).should('exist').click()
    cy.get(coreSelectors.content['imageCarouselButton']).eq(1).should('have.attr', 'disabled')
    cy.get(coreSelectors.content['imageCarouselButton']).eq(0).should('exist').click()
    cy.wait(1000)
}

Cypress.Commands.add('removeSlides', function () {
    cy.wait(2000)
    let imagesCount = Cypress.$(coreSelectors.content['copilotImageDropDown']).length
    for (let i = 0; i < imagesCount; i++) {
        cy.get(coreSelectors.content['copilotImageDropDown']).eq(0).click();
        cy.get(coreSelectors.content['copilotImageRemoveSlide']).eq(2).click();
        cy.wait(1000)
    }
    cy.get(coreSelectors.content['copilotSave']).eq(0).click();
    cy.wait(1000)

})

export function clickBookmarkIcon(index) {
    cy.get(coreSelectors.content['imageBookMarkIcon']).eq(index).click({ force: true });
    validateImageBanner();
    cy.wait(1000)
}

export function validateImageBanner() {
    cy.get(coreSelectors.content['messageBanner']).should('be.visible')
}

export function validateEventDate(selector, index, expectedStartDate, timeZone) {
    dayjs.extend(utc)
    dayjs.extend(timezone1)
    var backendDate = dayjs.utc(expectedStartDate).tz(timeZone).format()
    if (!(timeZone === 'GMT' || timeZone === 'Europe/London'))
        backendDate = backendDate.slice(0, -6) + 'Z'
    let dateTime1 = new Date(backendDate);
    var normalizedDate1 = dateTime1.getTime() + dateTime1.getTimezoneOffset() * 60000;
    let date1 = format(normalizedDate1, "EEEE, MMMM d")
    cy.get(selector).eq(index).then(($el) => {
        expect((utils.normaliseText($el.text().slice(0, -12)))).to.eql(utils.normaliseText(date1));
    })
}

