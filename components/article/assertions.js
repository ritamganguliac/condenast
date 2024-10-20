import * as utils from "../../utils/commonUtils";
let testData = require('../../test-data/verso/url.json');
const { selectors } = require("../../selectors/verso/selectors");
let bundlePageSelectors = require("../../selectors/verso/bundles.json");
let captionTestData = require('../../test-data/verso/cartoonCaption.config.json');
let coreAssertions = require('../../components/core/assertions')

// Validates Page Content Header & Body.
Cypress.Commands.add('validateArticleContentHeaderAndBody', (workFlowData, articleWorkFlow) => {
    let articleHed = articleWorkFlow.contextualHed ? articleWorkFlow.contextualHed : articleWorkFlow.hed
    let articleDek = articleWorkFlow.contextualDek ? articleWorkFlow.contextualDek : articleWorkFlow.dek
    let brandTranslations = workFlowData.brandConfigData.translations;
    let audioArticle_Length = Cypress.$(selectors.article.audio_article).length
    let productPage = workFlowData.brandConfigData.configContent.articleData["ComponentConfig.ArticlePage.settings.shouldCenterDisclaimer"]
    let showIssueDate = workFlowData.brandConfigData.configContent.articleData["ComponentConfig.ArticlePage.settings.showIssueDateInArticle"]
    let paywall = Cypress.$(selectors.article.paywall);
    let lede = articleWorkFlow.lede;
    if (!productPage) {
        if (paywall.length > 0) {
            cy.get(selectors.article.paywall).click();
        }
    }
    cy.get(selectors.article.contentHeaderWrapper).within(() => {
        cy.validateContentHedInContentPage(articleHed)
        cy.validateContentDekInContentPage(articleDek);
        cy.validateBylineInContentPage(articleWorkFlow, brandTranslations);
        cy.validatePublishedDateInContentPage(articleWorkFlow.pubDate, bundlePageSelectors.parent['contentHeader-PubDate'], 'MMMM d, yyyy');
        if (Cypress.$(`${selectors.tag.rubric}:contains("${articleWorkFlow.tags[0]?.name}")`).length > 0) {
            cy.textEquals(selectors.tag.ContentHeaderRubric, 0, articleWorkFlow.tags[0].name)
        }
        else {
            cy.textEquals(selectors.tag.ContentHeaderRubric, 0, articleWorkFlow.channel.name)
        }
        if (lede) {
            cy.validateLeadImageInContentPage()
            if (articleWorkFlow.lede.caption !== "" && articleWorkFlow.lede.caption !== null) {
                cy.textEquals(selectors.bundles.children.captionText, 0, articleWorkFlow.lede.caption)
            } else {
                cy.get(selectors.bundles.children.captionText).should('not.exist')
            }
            cy.validateCaptionCreditInContentPage(articleWorkFlow)
        }
    })
    if (audioArticle_Length > 0) {
        cy.get(selectors.article.audio_article).should('be.visible')
        cy.get(selectors.article.iframeDek).invoke('text').should('not.empty')
    }
    if (showIssueDate === true) {
        cy.validateIssueDate(articleWorkFlow.issueDate, brandTranslations)
    }
    cy.validateBodyContentIsNotEmpty();
})

Cypress.Commands.add('validateArticleConnectedEmbeds', (workFlowData, articleWorkFlow) => {
    if (Cypress.$(selectors.article.paywall).length > 0) {
        cy.get(selectors.article.paywall).wait(1000).click();
    }
    let cartoonEmbeds = articleWorkFlow.body.connectedEmbeds.edges
    let creditUI = new Array()
    let creditGQL = new Array()
    let creditUI_length = Cypress.$(selectors.bundles.parent['caption-credit']).length
    //Validation of Cartoon Credit. Credit is displaying in ascending order in GQL not fetched as per UI
    if (creditUI_length > 0) {
        cy.get(selectors.article.cartoonCredit).each(($el) => {
            creditUI.push($el.text())
        })
        cy.wrap(creditUI).invoke('sort').each((actualElement, index) => {
            expect(actualElement).to.equal(creditGQL[index]);
        });
    }

    //Validation of Cartoon image, Shop Url, CopyLink and Open CTA gallery button
    for (let i = 0; i < cartoonEmbeds.length; i++) {
        creditGQL.push(cartoonEmbeds[i].node.credit)
        cy.get(selectors.article.cartoonWrapper).eq(i).scrollIntoView().within(() => {
            cy.get(selectors.article.cartoonImage).then(($el) => {
                cy.validateUrl(workFlowData, $el.prop('href'))
            })
            cy.get(selectors.article.copyLink).click({ force: true })
            cy.get(selectors.article.copyLinkAlertPopUpMessage).invoke('text').should('exist')
            cy.get(selectors.article.shopCartIconLabel).invoke('text').should('exist')
            cy.window().then((win) => {
                cy.stub(win, 'open', url => {
                    win.location.href = testData[Cypress.env('environment')][workFlowData.brand]['shopCartoonUrl']
                }).as("condenast-Cartoons")
            })
            cy.get(selectors.article.shopCartIconButton).click({ force: true })
            cy.get('@condenast-Cartoons')
                .should("be.called")
            cy.go('back')

        })
        if (Cypress.$(selectors.article.paywall).length > 0) {
            cy.get(selectors.article.paywall).wait(1000).click();
        }
        cy.get(selectors.article.CTAButtonLabel).eq(i).invoke('text').should('exist')
        cy.get(selectors.article.CTAbutton).eq(i).click({ force: true })
        cy.wait(1000)
        cy.get(selectors.article.backToClose).click({ force: true })
    }
})

//Validation of More Great Fashion Stories List and it's Urls
Cypress.Commands.add('validateMoreGreatFashionStoriesList', (articleWorkFlow) => {
    cy.get(selectors.article.linkStackList).within(() => {
        cy.textEquals(selectors.bundles.children.defaultSectionTitle, 0, articleWorkFlow.data.getArticle.linkList[0].hed)
        cy.get(selectors.article.linkStackBulletLine).each((data, index) => {
            let stackLink = data.prop('href');
            expect(utils.normaliseText(articleWorkFlow.data.getArticle.linkList[0].textItems[index].content)).to.include(utils.normaliseText(data.text()))
            cy.validateUrl(articleWorkFlow, stackLink)
        })
    })
})

Cypress.Commands.add('captionContent', (cartoonCaptionData, captionContentHed, captionContentDek, index) => {
    let captionData = cartoonCaptionData.data.cartoons
    cy.get(captionContentHed).eq(index).should('not.be.empty').invoke('text').then(($text) => {
        expect($text).to.be.exist
    })
    cy.get(captionContentDek).eq(index).should('be.visible').invoke('text').then(($text) => {
        expect($text).to.contain(captionData[0].title)
    })
    cy.textEquals(selectors.bundles.parent['caption-credit'], index, (selectors.article.captionContest.cartoonBy + ' ' + captionData[0].credit))
})

//Validate Cartoon caption Submissions
Cypress.Commands.add('validateCartoonCaptionSubmissions', (cartoonCaptionData) => {
    cy.captionContent(cartoonCaptionData, selectors.article.captionContest.captionContentHed, selectors.article.captionContest.captionContentDek, 0)
    cy.get(selectors.article.captionContest.captionInstructionButton).click({ force: true });
    cy.validateImageLoad(selectors.article.captionContest.captionInstructionImage, 0)
    cy.get(selectors.article.captionContest.captionInstructionBody).invoke('text').then(($text) => {
        expect(utils.normaliseText($text)).contains(utils.normaliseText(captionTestData.instructions.dek))
    })
    cy.wait(2000)
    cy.get(selectors.article.captionContest.captionInstructionCloseIcon).click()
    cy.get(selectors.article.captionContest.captionTextField).should('be.enabled').and('be.empty')
    cy.get(selectors.article.captionContest.submitCaptionButton).invoke('text').then(($text) => {
        expect($text).to.exist
    })
    cy.get(selectors.article.captionContest.submitCaptionButton).should('be.enabled')
    cy.get(selectors.article.captionContest.captionDisclaimerText).then(($text) => {
        expect($text.text()).to.be.exist
    }).find('a').invoke('attr', 'href').then(($url) => {
        cy.validateUrl(null, $url)
    })
    cy.get(selectors.article.captionContest.captionItemCount).should('have.text', '0 /250 characters')

})

//Validate Cartoon caption Rating Page
Cypress.Commands.add('validateCartoonCaptionRating', (cartoonCaptionData) => {
    cy.captionContent(cartoonCaptionData, selectors.article.captionContest.captionContentHed, selectors.article.captionContest.captionContentDek, 1)
    cy.get(selectors.article.captionContest.captionRateText).invoke('text').then(($text) => {
        expect($text).to.exist
    });
    cy.get(selectors.article.captionContest.submitCaptionButton).should('be.enabled')
    cy.get(selectors.article.captionContest.captionDisclaimerText).then(($text) => {
        expect($text.text()).to.be.exist
    })
})

//Validate Cartoon caption Voting Page
Cypress.Commands.add('validateCartoonCaptionVoting', (cartoonCaptionData) => {
    let captionData = cartoonCaptionData.data.cartoons
    cy.captionContent(cartoonCaptionData, selectors.article.captionContest.captionContentHed, selectors.article.captionContest.captionContentDek, 2)
    cy.get(selectors.article.captionContest.captionVotingListWrapper).within(() => {
        cy.get(selectors.article.captionContest.captionVotingListHed).each(($ele, index) => {
            expect(utils.normaliseText(captionData[0].contestFinalists[index].text)).to.equal(utils.normaliseText($ele.text()))
        })
        cy.get(selectors.article.captionContest.captionVotingListDek).each(($ele, index) => {
            expect(utils.normaliseText((captionData[0].contestFinalists[index].userInfo))).to.equal(utils.normaliseText($ele.text()))
        })
    })
    cy.get(selectors.article.captionContest.submitCaptionButton).should('be.enabled')
    cy.get(selectors.article.captionContest.captionDisclaimerText).then(($text) => {
        expect($text.text()).to.be.exist
    })
})

//Validate Cartoon caption Winner Page
Cypress.Commands.add('validateCartoonCaptionDisplayWinner', (cartoonCaptionData) => {
    let captionData = cartoonCaptionData.data.cartoons
    cy.captionContent(cartoonCaptionData, selectors.article.captionContest.captionContentHed, selectors.article.captionContest.captionContentDek, 3)
    cy.get(selectors.article.captionContest.captionWinnerWrapper).within(() => {
        cy.get(selectors.article.captionContest.captionWinnerItemHed).each(($ele, index) => {
            expect(utils.normaliseText(captionData[0].contestFinalists[index].text)).to.equal(utils.normaliseText($ele.text()))
        })
        cy.get(selectors.article.captionContest.captionWinnerItemDek).each(($ele, index) => {
            expect(utils.normaliseText((captionData[0].contestFinalists[index].userInfo))).to.equal(utils.normaliseText($ele.text()))
        })
    })
})


//Validate Event page
Cypress.Commands.add('validateEventPage', (eventData) => {
    let eventHedSubHed = eventData.eventRubric;
    let eventHeaderHed = eventData.hed;
    let eventLocation = eventData.eventVenues.edges[0].node.address.city + ' ' + eventData.eventVenues.edges[0].node.address.country + ' ' + eventData.eventVenues.edges[0].node.address.region;
    let eventDate = eventData.startDate;
    let timeZone = eventData.timeZone
    let eventPageStatus = eventData.eventStatus;
    let eventPageButtonText = eventData.ctaLabel;
    let eventPageBody = eventData.body.content;
    cy.validateImageLoad(selectors.tag.eventImage, 0)
    cy.textEquals(selectors.tag.eventSubHed, 0, eventHedSubHed);
    cy.textEquals(selectors.tag.eventHed, 0, eventHeaderHed);
    cy.textEquals(selectors.tag.eventVenue, 0, eventLocation);
    cy.textEquals(selectors.tag.eventStatus, 0, eventPageStatus);
    cy.textEquals(selectors.tag.eventPageButton, 0, eventPageButtonText);
    cy.get(selectors.tag.eventPageButton).should('exist').then((url) => {
        cy.validateUrl(null, url.prop('href'));
    })
    cy.textEquals(selectors.tag.eventPageBody, 0, eventPageBody);
    coreAssertions.validateEventDate(selectors.tag.eventStartTime, 0, eventDate, timeZone)
    if (eventData.relatedContent.results.length > 0) {
        // Validation of cultural events
        let relatedContentResults = eventData.relatedContent.results;
        let itemsLength = Cypress.$(selectors.tag.eventSummaryGrid + ' .summary-item').length
        for (let i = 0; i < itemsLength; i++) {
            cy.get(selectors.tag.eventSummaryGrid + ' .summary-item').eq(i).within(() => {
                cy.textEquals(bundlePageSelectors.children.rubric, 0, relatedContentResults[i].eventRubric);
                cy.textEquals(bundlePageSelectors.children.hed, 0, relatedContentResults[i].hed);
                cy.textEquals(bundlePageSelectors.children.eventVenue, 0, relatedContentResults[i].eventVenues.edges[0].node.address.city);
                coreAssertions.validateEventDate(bundlePageSelectors.children.eventStartDate, 0, relatedContentResults[i].startDate, relatedContentResults[i].timeZone)
                cy.textEquals(bundlePageSelectors.children.eventStatus, 0, relatedContentResults[i].eventStatus);
                cy.textEquals(bundlePageSelectors.children.eventCTALabel, 0, relatedContentResults[i].ctaLabel);
            })
        }

    }
})

Cypress.Commands.add('validateMixedMediaCarousel', () => {
    let carouselComponentLength = Cypress.$(bundlePageSelectors.children.mixedMediaCarouselContent).length
    for (let i = 0; i < carouselComponentLength; i++) {
        cy.get(bundlePageSelectors.children.mixedMediaCarouselBack).should('be.disabled')
        cy.get(bundlePageSelectors.children.mixedMediaCarouselForward).eq(i).should('be.enabled').click({ force: true })
        cy.get(bundlePageSelectors.children.mixedMediaCarouselContent).eq(i).scrollIntoView().within(() => {
            cy.get(bundlePageSelectors.children.mixedMediaCarouselItem).eq(1).scrollIntoView()
        })
        cy.get(bundlePageSelectors.children.mixedMediaCarouselBack).should('be.enabled')
    }
})
