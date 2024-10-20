const { selectors } = require("../../selectors/verso/selectors");
let bundlePageSelectors = require('../../selectors/verso/bundles.json');
let childSelector = bundlePageSelectors.children;

import * as utils from "../../utils/commonUtils";

Cypress.Commands.add('validateContentHeader', function (workFlowData) {
    let featuredContentHeaderData = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template == 'featured-contributor')[workFlowData.currentComponentIndex].items.edges[0]
    let featureContributorTitle = workFlowData.bundleInfo.data.getBundle.containers.results[0].hed;
    let selectedStoriesData = featuredContentHeaderData.node.featuredStories.edges;
    let selectedStoriesCount = Cypress.$(childSelector['sideBySideWrapper']).length;
    let selectedStoriesDek = Cypress.$(childSelector['selectedStoriesDekItems']);
    cy.validateTickerImage(workFlowData)
    cy.textEquals(childSelector['featuredContributorHeaderName'], 0, featuredContentHeaderData.node.name)
    cy.get(childSelector['readMoreLabel']).should('have.text', 'Read more').click();
    cy.textEquals(childSelector['contributorFeaturedBio'], 0, featuredContentHeaderData.node.bio)
    cy.get(childSelector['readLessLabel']).should('have.text', 'Read less');
    cy.get(childSelector['featured-contributor']).eq(workFlowData.currentComponentIndex).within(() => {
        cy.textEquals(childSelector['defaultSectionTitleHed'], 0, featureContributorTitle)
        cy.get(childSelector['summaryItemFiftyFifty'].replace('<index>', workFlowData.currentItemIndex)).within(() => {
            cy.validateImageUrl(workFlowData, 0)
            cy.validateHedUrl(workFlowData, 0)
            cy.validateTickerImage(workFlowData, 0)
            cy.textEquals(childSelector['hed'], 0, selectedStoriesData[0].node.hed)
            cy.textEquals(childSelector['dek'], 0, selectedStoriesData[0].node.promoDek)
            cy.validatePublishDate(selectedStoriesData, 0, childSelector['summaryItemPublishDate'])
        })
        for (let i = 0; i <= selectedStoriesCount - 1; i++) {
            cy.get(childSelector['sideBySideWrapper']).eq(i).then(($url) => {
                cy.validateUrl(null, $url.prop('href'))
                expect(utils.normaliseText($url.text())).to.eq(utils.normaliseText(selectedStoriesData[i + 1].node.hed ? selectedStoriesData[i + 1].node.hed : selectedStoriesData[i + 1].node.promoHed))
                cy.textEquals(childSelector['oneWrapperPublishDate'], i, (selectedStoriesData[i + 1].node.issueDate ? selectedStoriesData[i + 1].node.issueDate : selectedStoriesData[i + 1].node.pubDate))
                if (selectedStoriesDek[i].innerText !== undefined) {
                    expect(utils.normaliseText(selectedStoriesDek[i].innerText)).to.eq(utils.normaliseText(selectedStoriesData[i + 1].node.promoDek))
                }
            })
            cy.validateTickerImage(workFlowData)
        }
    })
})

Cypress.Commands.add('validateAllFiction', function (workFlowData) {
    let allFictionData = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template == 'all-fictions')[workFlowData.currentComponentIndex].items.edges
    let allFictionTitle = workFlowData.sectionData.summaryCollectionGrid[0].hed;
    let allFictionViewMore = Cypress.$(childSelector['allFictionViewMore']).length
    cy.get(childSelector['all-fictions']).eq(workFlowData.currentComponentIndex).within(() => {
        let allFictionDekItem = Cypress.$(childSelector['allFictionDek'])
        cy.textEquals(childSelector['defaultSectionTitleHed'], 0, allFictionTitle)
        for (let i = 0; i < allFictionData.length; i++) {
            cy.validateImageUrl(workFlowData, i)
            cy.validateHedUrl(workFlowData, i)
            cy.textEquals(childSelector['hed'], i, (allFictionData[i].node.promoHed ? allFictionData[i].node.promoHed : allFictionData[i].node.hed))
            cy.get(allFictionDekItem).eq(i).then(($dek) => {
                let dekText = Cypress.$($dek.find(childSelector['dek'])).text()
                if ($dek.find(childSelector['dek']).length > 0) {
                    expect(utils.normaliseText(dekText)).to.eql(utils.normaliseText(allFictionData[i].node.promoDek ? allFictionData[i].node.promoDek : allFictionData[i].node.dek))
                }
                else {
                    cy.get($dek).find(childSelector['dek']).should('not.exist')
                }
            })
            cy.validatePublishDate(allFictionData, i, childSelector['summaryItemPublishDate'])
        }
    })
    if (allFictionViewMore > 0) {
        cy.get(childSelector['allFictionViewMore']).find('span').and('have.text', 'View more').click()
    }
    else {
        cy.get(childSelector['allFictionViewMore']).should('not.exist')
    }
})

function validatePodcastItems(workFlowData, i, newYorkerPodcastData) {
    let audio = Cypress.$(childSelector['headIcon'])
    let carousalImageUrl = {}
    carousalImageUrl = Cypress.$(childSelector['carousalListImageItem'])
    cy.get(carousalImageUrl).eq(i).then(($btn) => {
        if ($btn.find(childSelector['imageUrl']).length > 0) {
            cy.get(childSelector['imageUrl']).invoke('attr', 'href').then(($el) => {
                cy.validateUrl(workFlowData, $el)
            })
        }
        else {
            cy.get($btn).find(childSelector['imageUrl']).should('not.exist')
        }
    })
    cy.validateHedUrl(workFlowData, i)
    if (audio.length > 0) {
        cy.get(childSelector['headIcon']).eq(i).find('title').should('have.text', 'Headphone')
    }
    else {
        cy.get(childSelector['headIcon']).should('not.exist')
    }
    cy.textEquals(childSelector['rubric'], i, newYorkerPodcastData[i].node.channels[0].name)
    cy.textEquals(childSelector['hed'], i, (newYorkerPodcastData[i].node.promoHed ? newYorkerPodcastData[i].node.promoHed : newYorkerPodcastData[i].node.hed))
    cy.validatePublishDate(newYorkerPodcastData, i, childSelector['summaryItemPublishDate'])
}

Cypress.Commands.add('validateNewYorkerPodcast', function (workFlowData) {
    let carousalSliderCount = Cypress.$(childSelector['carousalListSlider']).length
    let newYorkerPodcastMain = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template == 'podcast-articles')
    let newYorkerPodcastData = newYorkerPodcastMain[0].items.edges
    cy.get(childSelector['newYorkerPodcastSection']).eq(workFlowData.currentComponentIndex).within(() => {
        cy.textEquals(childSelector['defaultSectionTitleHed'], 0, utils.normaliseText(newYorkerPodcastMain[0].hed))
        for (let i = 0; i < carousalSliderCount; i++) {
            if (i < 3 || i == 3) {
                validatePodcastItems(workFlowData, i, newYorkerPodcastData)
            }
            else {
                cy.get(childSelector['carousalListSlider']).eq(i).scrollIntoView()
                validatePodcastItems(workFlowData, i, newYorkerPodcastData)
            }
        }
    })
})
Cypress.Commands.add('validateAboutAuthor', function (workFlowData) {
    let aboutAuthorDataMain = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template == 'articles-about-author')[workFlowData.currentComponentIndex]
    let aboutAuthorData = aboutAuthorDataMain.items.edges;
    let byLineAuthor, AuthorPreamble;
    cy.get(childSelector['authorSection']).eq(workFlowData.currentComponentIndex).within(() => {
        cy.textEquals(childSelector['defaultSectionTitleHed'], 0, utils.normaliseText(aboutAuthorDataMain.hed))
        for (let i = 0; i < aboutAuthorData.length; i++) {
            cy.validateImageUrl(workFlowData, i)
            cy.validateHedUrl(workFlowData, i)
            cy.textEquals(childSelector['rubric'], i, aboutAuthorData[i].node.channels[0].name)
            cy.textEquals(childSelector['hed'], i, (aboutAuthorData[i].node.promoHed ? aboutAuthorData[i].node.promoHed : aboutAuthorData[i].node.hed))
            cy.textEquals(childSelector['dek'], i, (aboutAuthorData[i].node.promoDek ? aboutAuthorData[i].node.promoDek : aboutAuthorData[i].node.promoDek))
            byLineAuthor = aboutAuthorData[i].node.contributors[0] ? aboutAuthorData[i].node.contributors[0].name : undefined;
            AuthorPreamble = workFlowData.brandConfigData.translations['Bylines.AuthorPreamble'] ? workFlowData.brandConfigData.translations['Bylines.AuthorPreamble'][0]?.value ? (workFlowData.brandConfigData.translations['Bylines.AuthorPreamble'][0]?.value + ' ' + byLineAuthor) : byLineAuthor : workFlowData.brandConfigData.translations['Bylines.AuthorPreamble'][0]?.value ? (workFlowData.brandConfigData.translations['Bylines.WithPreamble'][0]?.value + ' ' + byLineAuthor) : byLineAuthor
            if (byLineAuthor !== undefined) {
                cy.textEquals(childSelector['byLineSection'], i, AuthorPreamble);
            }
            cy.get(childSelector['byLineSection']).find('a').invoke('attr', 'href').then(($url) => {
                cy.validateUrl(workFlowData, $url)
            })
            cy.validatePublishDate(aboutAuthorData, i, childSelector['summaryItemPublishDate'])
        }
    })
})

Cypress.Commands.add('validateMoreByAuthor', function (workFlowData) {
    let moreByAuthorDataMain = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template == 'more-by-author')[workFlowData.currentComponentIndex]
    let moreByAuthorData = moreByAuthorDataMain.items.edges
    let viewMore = Cypress.$(childSelector['moreByAuthorViewMore']).length
    cy.get(childSelector['authorSection']).last().eq(workFlowData.currentComponentIndex).within(() => {
        cy.textEquals(childSelector['defaultSectionTitleHed'], 0, utils.normaliseText(moreByAuthorDataMain.hed))
        for (let i = 0; i < moreByAuthorData.length; i++) {
            cy.validateImageUrl(workFlowData, i)
            cy.validateHedUrl(workFlowData, i)
            cy.textEquals(childSelector['rubric'], i, moreByAuthorData[i].node.channels[0].name)
            cy.textEquals(childSelector['hed'], i, (moreByAuthorData[i].node.promoHed ? moreByAuthorData[i].node.promoHed : moreByAuthorData[i].node.hed))
            cy.validatePublishDate(moreByAuthorData, i, childSelector['summaryItemPublishDate'])
        }
    })
    if (viewMore > 0) {
        cy.get(childSelector['moreByAuthorViewMore']).find('span').and('have.text', 'View more').click()
    }
    else {
        cy.get(childSelector['moreByAuthorViewMore']).should('not.exist')
    }
})

Cypress.Commands.add('validateContributorPageHeader', (workFlowData) => {
    let name = workFlowData.getContributor.name
    let bio = workFlowData.getContributor.bio
    cy.get(selectors.contributor.contributorHeaderWrapper).within(() => {
        cy.get(selectors.contributor.contributorAvatarImage).should('be.visible')
        cy.textEquals(selectors.bundles.children.featuredContributorHeaderName, 0, name)
        if (bio !== '')
            cy.textEquals(selectors.bundles.children.contributorFeaturedBio, 0, bio)
        cy.get(selectors.contributor.socialIconsListItem).each(($el, index) => {
            cy.validateUrl(workFlowData, $el.prop('href'))
        })
    })
})

Cypress.Commands.add('validateContributorPageContent', (workFlowData) => {
    // check the contributor page stories (link, hed, publish date)
    let len = cy.$$(selectors.gallery.profilePage.legalNameHyperLink).length;
    for (let index = 0; index < len; index++) {
        validateContributorPage(workFlowData, index)
    }
    //check the complete page contents (link, hed, publish date) by clicking the MoreStories Button.
    cy.get(selectors.contributor.moreStoriesBtn).click({ force: true }).then(() => {
        cy.get(selectors.gallery.profilePage.legalNameHyperLink).eq(len + 1).should('be.visible').then(() => {
            let len2 = cy.$$(selectors.gallery.profilePage.legalNameHyperLink).length;
            for (let index = len; index < len2; index++) {
                validateContributorPage(workFlowData, index)
            }
        })
    })
})

function validateContributorPage(workFlowData, index) {
    let rubricLinkLen = cy.$$(selectors.gallery.rubricLink)
    if (workFlowData.contributorContentData.search.content.results[index].hed !== undefined) {
        cy.get(selectors.gallery.profilePage.legalNameHyperLink).eq(index).then(($el) => {
            expect(utils.normaliseText($el.text())).to.equals(utils.normaliseText(workFlowData.contributorContentData.search.content.results[index].hed))
            cy.validateUrl(workFlowData, $el.prop('href'))
        })
        if (rubricLinkLen.length > 0) {
            cy.get(selectors.gallery.rubricLink).then(($el) => {
                cy.validateUrl(rubricLinkLen, $el.prop('href'))
            })
        }
    }
    cy.get(selectors.bundles.children.summaryItemPublishDate).eq(index).then((txt) => {
        expect(txt.text()).to.exist
    })
}

