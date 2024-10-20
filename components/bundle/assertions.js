
let bundlePageSelectors = require('../../selectors/verso/bundles.json');
const { selectors } = require("../../selectors/verso/selectors");
const { format } = require('date-fns');
import * as bundlUtils from "../../utils/bundleUtils";
import * as utils from "../../utils/commonUtils";
let childSelector = bundlePageSelectors.children;
let coreAssertions = require('../../components/core/assertions.js')
import * as dataHelper from "../../helper/gallery/contentDataHelper";

let summaryItemDataSectionTitle = childSelector['summaryItemDataSection'];
export function assignParentSelector(workFlowData) {
    let parentSelector = bundlePageSelectors.parent[workFlowData.currentComponentName];
    if (workFlowData.currentComponentName == "carousel") {
        parentSelector = bundlePageSelectors.parent.carouselRow;
    }
    return parentSelector;
}

Cypress.Commands.add('validateTicker', function (workFlowData) {
    let tickerData = workFlowData.currentComponentData[0];
    let parentSelector = assignParentSelector(workFlowData);
    let config = workFlowData.currentComponentConfig;
    cy.get(parentSelector).eq(workFlowData.currentComponentIndex).within(() => {
        if (tickerData.node.tout) {
            cy.validateTickerImage(workFlowData)
        }
        else {
            cy.get(childSelector['ticker_image']).should('not.exist');
        }
        cy.textEquals(childSelector['ticker_text'], workFlowData.currentItemIndex, tickerData.contextualHed ? tickerData.contextualHed : tickerData.node.hed);
        if (config.hideTickerButton === true) {
            cy.get(childSelector['ticker_button']).should('not.exist');
            cy.get(childSelector['ticker_button_text']).should('not.exist');
        }
        else if (config.tickerButtonText !== undefined) {
            cy.textEquals(childSelector['ticker_button_text'], workFlowData.currentItemIndex, config.tickerButtonText ? config.tickerButtonText : tickerData.node.source);
            cy.get(childSelector['ticker_button']).eq(workFlowData.currentItemIndex).should('not.be.disabled');
            cy.get(childSelector['ticker_button']).eq(workFlowData.currentItemIndex).invoke('attr', 'href').then((referenceUrl) => {
                cy.validateUrl(workFlowData, referenceUrl);
                expect(referenceUrl).to.eql(config.tickerButtonUrl ? config.tickerButtonUrl : tickerData.node.url);
            })
        }
    })
    cy.get(bundlePageSelectors.parent['tickerView']).eq(workFlowData.currentComponentIndex).within(() => {
        if (config.showDataSectionTitle === true && !(workFlowData.brand === 'The New Yorker' && workFlowData.page === 'channel')) {
            cy.get('section.ticker-wrapper').should('have.attr', 'data-section-title').then((test1) => {
                expect(test1).to.exist // this is the temporary fix as the position count is displayed incorrect 
            })
        }
        else {
            cy.get('section.ticker-wrapper').should('not.have.attr', 'data-section-title');
        }
    })
})

Cypress.Commands.add('validateSummary', function (workFlowData) {
    let parentSelector = assignParentSelector(workFlowData);
    let { expectedHed, expectedDek, expectedHedUrl, expectedSectionHed, expectedSectionDek, expectedBylineAuthor, expectedBylinePhotographer, expectedContributorAuthors, expectedRubric } = bundlUtils.getSummaryItemData(workFlowData);
    let brandNames = ['ad-india', 'ad-germany', 'ad-italy', 'Architectural Digest', 'ad-france', 'Conde Nast Traveler', 'Self', 'gq-spain', 'vogue-italy', 'Allure', 'Glamour', 'glamour-uk', 'gq-germany', 'gq-india', 'vogue-uk', 'conde-nast-traveller-uk', 'Vogue', 'vogue-germany', 'vogue-france', 'vogue-spain', 'gq-uk', 'gq-us', 'world-of-interiors', 'Teen Vogue', 'epicurious', 'house-and-garden'] // brands which have mismatch data due to issue FPCORE-1258
    if (workFlowData.ignoreRubric) {
        brandNames.push(workFlowData.brand);
    }
    let componentWithNoByLine = ['summaryCollectionGridContributor', 'carousel'];
    let summaryItemLength = Cypress.$(parentSelector + ' ' + childSelector['summaryItem']).length
    if (workFlowData.brand === 'bon-appetit' && workFlowData.page === 'channel') {
        let expectedRiverItemsLength = workFlowData.currentComponentData.length;
        expect(summaryItemLength).to.deep.eq(expectedRiverItemsLength);
    }
    if (workFlowData.currentItemIndex == 0)
        cy.validateSectionHedAndDek(workFlowData, expectedSectionHed, expectedSectionDek);
    let dangerousHed = workFlowData.brandConfigData.configContent.homepageConfig["ComponentConfig.SummaryCollageFour.settings.dangerousHed"];
    let summaryNineVariation = workFlowData.brandConfigData.configContent.homepageConfig["ComponentConfig.SummaryCollageNine.settings.summaryListSummaryItemVariation"]     // Created this Label especially for VF. It is set as 'TextBelowDesktopOnlyNoAsset'. No other Brand has this value.
    let index;
    if (workFlowData.currentItemIndex > 0 && workFlowData.currentComponentName === 'summaryCollageFour' && dangerousHed === "") {
        summaryItemLength = summaryItemLength + 1;
        index = workFlowData.currentItemIndex - 1;
    }
    else if (workFlowData.currentComponentName === 'summaryCollageNine' && workFlowData.currentItemIndex > 3 && summaryNineVariation === 'TextBelowDesktopOnlyNoAsset') {
        index = workFlowData.currentItemIndex + 4;              // This is becoz, VF brand's CollageNine(CollageFour+CollageNineWrapper list) has GridWrapper which is duplicate of CollageFour wrapper defined in DOM() hence test cases were failiing after 4 items validation 
    }
    else
        index = workFlowData.currentItemIndex;
    // Content Limit set to 20 in verso for allure and BA.Hence code is now handled to check based on parent selector and the summary items within it for all brands. 
    // PRs for the references : https://github.com/CondeNast/verso/pull/19863
    if (workFlowData.currentItemIndex < summaryItemLength) {
        cy.get(parentSelector).eq(workFlowData.currentComponentIndex).within(() => {
            let overLayHedLength = Cypress.$(parentSelector + ' ' + childSelector['overlayHed']).eq(index).length;
            let hedPath = (Cypress.$(parentSelector + ' ' + childSelector['overlayHed']).eq(index).length > 0 && workFlowData.currentItemIndex == 0) ? childSelector['overlayHed'] : childSelector['hed'];
            if (workFlowData.currentComponentName !== 'summaryCollectionRow') {  // temporary  fix for trending stories due to incorrect data
                cy.get(hedPath).invoke('text').should('exist')
            }
            // Topic list will be replace from Flat and focus modules in new TNY Homepage
            if (workFlowData.currentComponentName !== 'horizontalList' && !bundlUtils.shouldHideDek(workFlowData, expectedDek)) {
                let dekLength = Cypress.$(parentSelector).eq(workFlowData.currentComponentIndex).children('.summary-item ').children('.summary-item__content').eq(workFlowData.currentItemIndex).children('.summary-item__dek').length; 
                let summaryItemDekWithInDekLength = Cypress.$(childSelector['summaryItem'] + ' ' + childSelector['dek'] + ' ' + childSelector['dek']).eq(workFlowData.currentItemIndex).length;
                // Below if condition is added because for some brands( ex: CNT india) , dek for summaryCollageFour is hidden. So failures occurred while validating summaryItem__Dek
                if (dekLength > 0) {
                    if (summaryItemDekWithInDekLength === 0) {
                        cy.get(childSelector['summaryItem']).eq(workFlowData.currentItemIndex).scrollIntoView().children(childSelector['dek']).should('be.visible');
                    }
                    else
                        cy.textEqualsWithChild([childSelector['summaryItem'], childSelector['dekWithIndek']], workFlowData.currentItemIndex, expectedDek);
                }
            }
            // skip below check if horizontal list sectionTitleHed is not present
            else if (workFlowData.currentComponentName !== 'horizontalList' && workFlowData.currentComponentConfig.horizontalListSectionHed !== null) {
                cy.get(childSelector['summaryItem']).eq(index).then($summaryItem => {
                    if ($summaryItem.find(childSelector['dek']).length > 0) {
                        cy.get(childSelector['summaryItem']).eq(index).children(childSelector['dek']).should('have.css', 'display', 'none')
                    }
                    else {
                        cy.get(childSelector['summaryItem']).eq(index).children(childSelector['dek']).should('not.exist');
                    }
                });
            }

            let rubricSelector = ['house-and-garden']
            //UnCommenting this code as there are other brands which are used to capture the rubric content.This Issue FPCORE-1258 is not fixed hence this code is commented for 2brands, AD and CNT UK .
            if (!(brandNames.includes(workFlowData.brand))) {
                if (expectedRubric.length > 1 && !workFlowData.currentComponentConfig.hideRubric) {
                    if (workFlowData.currentItemIndex == 0 && overLayHedLength > 0 && dangerousHed === "") {
                        cy.get(selectors.gallery.summaryItemRubric).should('be.visible');
                    }
                    else if (rubricSelector.includes(workFlowData.brand) && workFlowData.currentComponentName === "summaryCollageNine") {
                        cy.get(childSelector['summaryCollageFourMainRubricName']).eq(index).should('be.visible').then(($el) => {
                            cy.get($el).eq(0).should('exist')
                        })
                    }
                    else {
                        cy.get('.summary-item>div:nth-child(1)[class*= "summary"]').eq(index).parent().within(() => {
                            cy.get(childSelector['rubric']).should('be.visible');
                        })
                    }
                }
            }
            let bylineExist = workFlowData.brandConfigData.configContent.homepageConfig["ComponentConfig.SummaryCollageNine.settings.shouldHideBylinesInSummaryList"];
            if (componentWithNoByLine.indexOf(workFlowData.currentComponentName) == -1) {
                if (workFlowData.currentItemIndex > 3 && workFlowData.currentComponentName === 'summaryCollageNine' && bylineExist) {
                    cy.get(childSelector['summaryItem']).eq(index).within(() => {
                        cy.get(childSelector['byLineSection']).should('not.exist');
                    })
                }
                // else
                //     cy.validateByLineSection(workFlowData, expectedBylinePhotographer, expectedBylineAuthor, index, overLayHedLength);
            }
            if (workFlowData.currentComponentName == 'summaryCollectionGridContributor') {
                cy.get(childSelector['summaryItemContributor']).eq(workFlowData.currentItemIndex).within(() => {
                    cy.get(childSelector['contributorAuthor']).eq(0).should('be.visible');
                    cy.textEquals(childSelector['contributorAuthor'], 0, expectedContributorAuthors);
                })
            }
            if (workFlowData.currentItemIndex == 0 && overLayHedLength > 0 && dangerousHed === "") {
                cy.get(childSelector['overlaySummaryItem']).parent().invoke('attr', 'href').then((hedUrl) => {
                    expectedHedUrl = expectedHedUrl.startsWith('/') ? expectedHedUrl.slice(1) : expectedHedUrl;
                    cy.validateUrl(workFlowData, hedUrl);
                })
            }
            else {
                cy.get(childSelector['hedUrl']).eq(index).invoke('attr', 'href').then((hedUrl) => {
                    // for vogue-business, expectedHedUrl is set as /tag/vogue-business-index so removing the '/'.Below instruction is adding it already.
                   // expectedHedUrl = expectedHedUrl.startsWith('/') ? expectedHedUrl.slice(1) : expectedHedUrl;
                    //Not validating the url for trending storeies alone as the GUID in the url is keep on changing
                    if (workFlowData.currentComponentName !== 'summaryCollectionRow' && expectedHedUrl != null)
                        expect(hedUrl.endsWith('/') ? hedUrl.slice(0, -1) : hedUrl).to.exist
                    if (!(workFlowData.currentItemIndex > 5 && workFlowData.brand === 'bon-appetit' && workFlowData.page === 'channel'))
                        cy.validateUrl(workFlowData, hedUrl);
                })
            }
            if (Cypress.env('validateImageUrl') && bundlUtils.shouldValidateImageUrl(workFlowData)) {
                if (workFlowData.currentComponentName == 'river')
                    cy.get(childSelector['dek']).eq(workFlowData.currentItemIndex).scrollIntoView();
                else
                    cy.get(childSelector['image']).eq(workFlowData.currentItemIndex).scrollIntoView();
                cy.get(childSelector['image'] + '>img').eq(workFlowData.currentItemIndex).invoke('attr', 'src').then((imgSrcUrl) => {
                    cy.validateUrl(workFlowData, imgSrcUrl);
                })
            }
            if (workFlowData.currentItemIndex < Cypress.env('linksToHitPerSection')) {
                cy.get(childSelector['hed']).eq(workFlowData.currentItemIndex).click({ force: true });
            }
            if (summaryNineVariation === 'TextBelowDesktopOnlyNoAsset' && workFlowData.currentComponentName == 'summaryCollageNine')
                cy.get(summaryItemDataSectionTitle).should('not.have.attr', 'data-section-title')
            else
                cy.validateDataSectionTitle(workFlowData, summaryItemDataSectionTitle, expectedSectionHed, dangerousHed);
        })
    }
})

export function validateStarIcon(starIcon, index) {
    if (starIcon.length > 0) {
        cy.get(childSelector['starIcon']).eq(index).should('exist').should('have.text', 'Star')
    }
    else {
        cy.get(childSelector['starIcon']).should('does.not.exist')
    }
}
Cypress.Commands.add('validateSummaryFiftyFifty', function (workFlowData) {
    let config = workFlowData.currentComponentConfig;
    let parentSelector = assignParentSelector(workFlowData);
    let summaryColumnOneWrapperData = workFlowData.currentComponentData;
    let featuredColumn = Cypress.$(childSelector['featuredCardWrapper']).length > 0 ? 'featuredCardWrapper' : 'SummaryItemWrapper';
    let starIcon = Cypress.$(childSelector['starIcon'])
    let sideBySideCount = Cypress.$(childSelector['sideBySideCard']).length;
    let summaryFiftyFifty = Cypress.$(childSelector['summaryCollageFiftyFifty'])
    let { expectedHed, expectedDek, expectedHedUrl, expectedSectionHed, expectedSectionDek, expectedBylineAuthor, expectedBylinePhotographer } = bundlUtils.getSummaryItemData(workFlowData);
    if (workFlowData.currentItemIndex == 0) {
        cy.validateSectionHedAndDek(workFlowData, expectedSectionHed, expectedSectionDek);
    }
    cy.get(parentSelector).eq(workFlowData.currentComponentIndex).within(() => {
        if (config.summaryCollageFiftyFiftyOneColumn === 'one-column') {
            cy.get(childSelector[featuredColumn]).invoke('attr', 'href').then(($url) => {
                let hed = summaryColumnOneWrapperData[0].contextualHed ? summaryColumnOneWrapperData[0].contextualHed : summaryColumnOneWrapperData[0].node.promoHed ? summaryColumnOneWrapperData[0].node.promoHed : summaryColumnOneWrapperData[0].node.hed;
                let dek = summaryColumnOneWrapperData[0].contextualDek ? summaryColumnOneWrapperData[0].contextualDek : summaryColumnOneWrapperData[0].node.promoDek ? summaryColumnOneWrapperData[0].node.promoDek : summaryColumnOneWrapperData[0].node.dek;
                cy.validateUrl(workFlowData, $url)
                cy.validateTickerImage(workFlowData)
                cy.textEquals(childSelector['summaryColumnOneWrapperPrimaryHed'], 0, utils.normaliseText(hed))
                cy.textEquals(childSelector['summaryColumnOneWrapperPrimaryDek'], 0, dek)
                validateStarIcon(starIcon, 0) // validate star icon exist and visible
            })
            for (let i = 0; i < sideBySideCount; i++) {
                cy.validateTickerImage(workFlowData)
                cy.get(childSelector['sideBySideCard']).eq(i).then(($url) => {
                    let index = i + 1;
                    if (featuredColumn === 'SummaryItemWrapper')
                        index = i;
                    let hed = summaryColumnOneWrapperData[i + 1].contextualHed ? summaryColumnOneWrapperData[i + 1].contextualHed : summaryColumnOneWrapperData[i + 1].node.promoHed ? summaryColumnOneWrapperData[i + 1].node.promoHed : summaryColumnOneWrapperData[i + 1].node.hed;
                    let dek = summaryColumnOneWrapperData[i + 1].contextualDek ? summaryColumnOneWrapperData[i + 1].contextualDek : summaryColumnOneWrapperData[i + 1].node.promoDek ? summaryColumnOneWrapperData[i + 1].node.promoDek : summaryColumnOneWrapperData[i + 1].node.dek;
                    cy.validateUrl(null, $url.prop('href'))
                    cy.textEquals(childSelector['summaryColumnOneWrapperSecondaryHed'], index, (utils.normaliseText(hed)))
                    cy.textEquals(childSelector['summaryColumnOneWrapperSecondaryDek'], index, (utils.normaliseText(dek)))
                    validateStarIcon(starIcon, i)
                })
            }
        }
        else {
            if (summaryFiftyFifty.length > 0) {
                cy.get(childSelector['summaryItemFiftyFifty'].replace('<index>', workFlowData.currentItemIndex)).within(() => {
                    cy.textEquals(childSelector[workFlowData.currentItemIndex > 0 ? 'hed' : 'overlayHed'], 0, expectedHed);
                    let photographerIndex = 0;
                    if (expectedBylineAuthor.length > 0 && expectedBylinePhotographer.length > 0)
                        photographerIndex = 1;
                    if (expectedBylineAuthor.length > 0) {
                        for (let i = 0; i < expectedBylineAuthor.length; i++) {
                            cy.get(childSelector['byLineSection']).then(($element) => {
                                expect($element.text()).contains(expectedBylineAuthor[i]);
                            })
                        }
                        cy.get(childSelector['byLineSection']).eq(0).should('not.have.css', 'display', 'none');
                    }
                    if (expectedBylinePhotographer.length > 0) {
                        for (let i = 0; i < expectedBylinePhotographer.length; i++) {
                            cy.get(childSelector['byLineSection']).eq(photographerIndex).then(($photographer) => {
                                expect($photographer.text()).contains(expectedBylinePhotographer[i]);
                            })
                        }
                    }
                    if (workFlowData.currentItemIndex == 0) {
                        cy.get(childSelector['overlaySummaryItem']).parent().invoke('attr', 'href').then((hedUrl) => {
                            cy.validateUrl(workFlowData, hedUrl);
                        })
                    }
                    else {
                        cy.get(childSelector['hedUrl']).invoke('attr', 'href').then((hedUrl) => {
                            cy.validateUrl(workFlowData, hedUrl);
                        })
                    }
                })
            }
            else {
                cy.get(childSelector['summaryCollageFiftyFifty']).should('not.exist')
            }
        }
    })

})
Cypress.Commands.add('validateByLineSection', function (workFlowData, expectedBylinePhotographer, expectedBylineAuthor, index, overLayHedLength) {
    let config = workFlowData.currentComponentConfig;
    let parentSelector = assignParentSelector(workFlowData);
    let byLineVariation = workFlowData.brandConfigData.configContent.homepageConfig["ComponentConfig.SummaryItem.settings.bylineVariation"];   // Using this for World of Interiors
    if (config.hideByLine != true && config.hideSummaryCollageOneByLine != true && expectedBylineAuthor.length > 0 && expectedBylinePhotographer.length > 0 && workFlowData.currentComponentName !== 'summaryCollectionRow') {
        cy.get(childSelector['summaryItem']).eq(workFlowData.currentItemIndex).within(() => {
            for (let i = 0; i < expectedBylineAuthor.length; i++) {
                cy.get(childSelector['byLineSection']).eq(0).then(($author) => {
                    expect($author.text()).contains(expectedBylineAuthor[i]);
                })
            }
            for (let i = 0; i < expectedBylinePhotographer.length; i++) {
                cy.get(childSelector['byLineSection']).eq(1).then(($photographer) => {
                    expect($photographer.text()).contains(expectedBylinePhotographer[i]);
                })
            }
            cy.get(childSelector['byLineSection']).eq(0).should('be.visible');
            cy.get(childSelector['byLineSection']).eq(1).should('be.visible');
        })
    }
    else if (config.hideByLine != true && config.hideSummaryCollageOneByLine != true && expectedBylinePhotographer.length > 0 && workFlowData.currentComponentName != 'summaryCollectionRow') {
        cy.get(childSelector['summaryItem']).eq(workFlowData.currentItemIndex).within(() => {
            for (let i = 0; i < expectedBylinePhotographer.length; i++) {
                cy.get(childSelector['byLineSection']).eq(0).then(($photographer) => {
                    expect($photographer.text()).contains(expectedBylinePhotographer[i]);
                })
            }
            cy.get(childSelector['byLineSection']).eq(0).should('be.visible');
        })
    }
    else if ((config.hideByLine !== true && config.hideSummaryCollageOneByLine !== true && expectedBylineAuthor.length > 0 && workFlowData.currentComponentName !== 'summaryCollectionRow') || (config.hideByLine === true && config.hideSummaryCollageOneByLine !== true && expectedBylineAuthor.length > 0 && workFlowData.currentComponentName === 'summaryCollectionRow') || (byLineVariation != undefined && workFlowData.currentComponentName == 'river' && expectedBylineAuthor.length > 0)) {
        let path = (workFlowData.currentItemIndex === 0 && workFlowData.currentComponentName === 'summaryCollageFour' && overLayHedLength > 0) ? 'overlaySummaryItem' : 'summaryItem';
        let byLineLength = Cypress.$(parentSelector).eq(workFlowData.currentComponentIndex).children('.summary-item').children('.summary-item__content ').eq(workFlowData.currentItemIndex).children('.summary-item__byline-date-icon--pre-dek').length
        let byLineLength2 = Cypress.$(parentSelector).eq(workFlowData.currentComponentIndex).children('.summary-item').children('.summary-item__content ').eq(workFlowData.currentItemIndex).children('.summary-item__byline-date-icon').length
        let tagPageByline = Cypress.$(parentSelector + ' ' + childSelector['byLineForTag']).eq(workFlowData.currentComponentIndex).children('.summary-item').children('.summary-item__content').eq(workFlowData.currentItemIndex).children('.summary-item__byline-date-icon').length
        if (byLineLength > 0 || byLineLength2 > 0 || tagPageByline > 0) {
            cy.get(childSelector[path]).eq(index).within(() => {
                for (let i = 0; i < expectedBylineAuthor.length; i++) {
                    cy.get(childSelector['byLineSection']).then(($element) => {
                        if (byLineVariation == 'ItemWithContributorTypePreamble') {
                            let title = utils.normaliseText(workFlowData.currentComponentData[workFlowData.currentItemIndex].node.allContributors.edges[0].node.type);
                            if (i == 0)
                                expect(utils.normaliseText($element.get(0).innerText)).contains(utils.normaliseText(title + ":" + expectedBylineAuthor[i].replace('By', '')));
                            else
                                expect(utils.normaliseText($element.get(0).innerText)).contains(utils.normaliseText(expectedBylineAuthor[i].replace('By', '')));
                        }
                        else if (byLineVariation == 'ItemWithoutPreamble') {
                            expect(utils.normaliseText($element.get(0).innerText)).contains(utils.normaliseText(expectedBylineAuthor[i].replace('By', '')));
                        }
                        else if (i < 3) {
                            expect(utils.normaliseText($element.get(0).innerText)).contains(utils.normaliseText(expectedBylineAuthor[i]));
                        }
                    })
                }
                for (let i = 0; i < expectedBylinePhotographer.length; i++) {
                    cy.get(childSelector['byLineSection']).then(($element) => {
                        if (byLineVariation !== undefined) {
                            let title = utils.normaliseText(workFlowData.currentComponentData[workFlowData.currentItemIndex].node.allContributors.edges[1].node.type);
                            expect(utils.normaliseText($element.get(1).innerText)).contains(utils.normaliseText(title + ":" + expectedBylinePhotographer[i].replace('Photography by', '')));
                        }
                        else if (i < 3) {
                            expect(utils.normaliseText($element.get(1).innerText)).contains(utils.normaliseText(expectedBylinePhotographer[i]));
                        }
                    })
                }
                cy.get(childSelector['byLineSection']).eq(0).should('be.visible');
            })
        }
    }
    else if ((workFlowData.page === 'directoryUrl' && config.hideByLine == true && expectedBylineAuthor.length > 0 && workFlowData.currentComponentName == 'summaryCollectionGrid') || (config.hideByLine !== true && config.hideSummaryCollageOneByLine !== true && expectedBylineAuthor.length > 0 && workFlowData.currentComponentName === 'summaryCollectionRow')) {
        cy.get(childSelector['summaryItem']).eq(workFlowData.currentItemIndex).within(() => {
            for (let i = 0; i < expectedBylineAuthor.length; i++) {
                cy.get(childSelector['byLineSection']).then(($element) => {
                    expect(utils.normaliseText($element.get(0).innerText)).contains(utils.normaliseText(expectedBylineAuthor[i]));
                })
                cy.get(childSelector['byLineSection']).eq(0).should('be.visible');
            }
            for (let i = 0; i < expectedBylinePhotographer.length; i++) {
                cy.get(childSelector['byLineSection']).eq(1).then(($photographer) => {
                    expect(utils.normaliseText($photographer.get(0).innerText)).contains(utils.normaliseText(expectedBylinePhotographer[i]));
                })
            }
        })
    }
    else if (config.hideByLine == true && config.hideSummaryCollageOneByLine == true) {
        cy.get(childSelector['summaryItem']).eq(workFlowData.currentItemIndex).within(() => {
            cy.get(childSelector['byLineSection']).should('not.exist');
        })
    }
})

Cypress.Commands.add('validateSectionHedAndDek', function (workFlowData, expectedSectionHed, expectedSectionDek) {
    let itemsWithCustomisedSectionHed = ["summaryCollageSeven", "summaryCollageNine", "carousel"];
    let config = workFlowData.currentComponentConfig;
    let parentSelector = assignParentSelector(workFlowData);
    let parentSelectorTitle;
    let sectionTitleHed;
    let summaryItemHedTag = workFlowData.brandConfigData.configContent.homepageConfig["ComponentConfig.SummaryItem.settings.hedTag"];
    let brandNames = ['wired']

    //Validating the sectionHed based on the config value shouldUseDekAsHed for TNY
    workFlowData.displayHed = bundlUtils.shouldUseDekAsHed(workFlowData, expectedSectionHed, expectedSectionDek);

    /**
     * Change Note : 
     * Previous behaviour : We validated the sectionHed directly
     * New behaviour : we had added extra layer in the validation process ie., first we are going to picking the title of any section and look for the hed and dek within it
     * Reason for change : Certain section has more than one sectionHed selectors , in order to validate the intended sectionHed we are using an additional selector
     */
    if (itemsWithCustomisedSectionHed.includes(workFlowData.currentComponentName))
        parentSelectorTitle = bundlePageSelectors.children[workFlowData.currentComponentName + 'Title'];
    else
        parentSelectorTitle = bundlePageSelectors.children['defaultSectionTitle'];
    let titleHedLength = Cypress.$(parentSelector).eq(workFlowData.currentComponentIndex).children(parentSelectorTitle).children(bundlePageSelectors.children.defaultSectionTitleHed).length
    if (workFlowData.currentComponentName === 'carousel' && titleHedLength === 0)
        sectionTitleHed = bundlePageSelectors.children.carouselHedTitle;
    else
        sectionTitleHed = bundlePageSelectors.children.defaultSectionTitleHed;
    cy.get(parentSelector).eq(workFlowData.currentComponentIndex).within(($summarySection) => {
        /**
         * If-else condition to validate SectionHed for summaryCollageNine / SummaryCollageEight based on shouldUseDekAsHed config for TNY
         */
        if ((workFlowData.currentComponentName === 'summaryCollageEight' || workFlowData.currentComponentName === 'summaryCollageNine') && workFlowData.displayHed.length > 1) {
            let collageNineFeaturedTitle = workFlowData.brandConfigData.configContent.homepageConfig["ComponentConfig.SummaryCollageNine.settings.shouldUseFeaturedTitleAndFooter"];
            let collageNineFeaturedTitleValue = workFlowData.brandConfigData.configContent.homepageConfig["ComponentConfig.VersoFeatures.settings.featuredTitleAndFooter.titlePrefix"];
            if (collageNineFeaturedTitle && workFlowData.currentComponentName === 'summaryCollageNine')
                workFlowData.displayHed = collageNineFeaturedTitleValue
            cy.get(sectionTitleHed).eq(workFlowData.currentItemIndex).should('be.visible');
            return
        }

        /***
         * If-else condtion to validate the SectionHed within the section Title
         */
        let viewAllButton = workFlowData.brandConfigData.configContent.homepageConfig['ComponentConfig.SummaryCarousel.settings.customViewAllButtonText'];
        if (($summarySection.find(parentSelectorTitle).length > 0) && (workFlowData.currentComponentName !== 'summaryCollageEight' && workFlowData.currentComponentName !== 'summaryCollageNine') && expectedSectionHed.length > 1 && workFlowData.currentComponentName != 'river' || expectedSectionHed.length > 1 && workFlowData.currentComponentName == 'river' && config.showRiverHed) {
            if (workFlowData.currentComponentConfig.horizontalListSectionHed !== null) {   // skip below check if horizontal list sectionTitleHed is not present
                if (brandNames.includes(workFlowData.brand) && workFlowData.currentComponentName == 'verso-hero-curated-feature') {
                    cy.get(parentSelectorTitle).eq(1).children(sectionTitleHed).should('be.visible');
                }
                else {
                    if (workFlowData.currentComponentName === 'carousel' && viewAllButton !== undefined) {
                        cy.get(parentSelectorTitle + ' ' + sectionTitleHed).then(($el) => {
                            expect($el.text()).to.exist
                        })
                        cy.get(parentSelectorTitle + ' ' + bundlePageSelectors.children.carouselViewAll).then(($el) => {
                            expect(utils.normaliseText($el.text())).to.include(utils.normaliseText(viewAllButton))
                            cy.validateUrl(null, ($el).find('a').prop('href'))
                        })
                    }
                    else {
                        cy.get(parentSelectorTitle).eq(0).children(sectionTitleHed).should('be.visible');
                    }
                }
            }
            else {
                if ($summarySection.find(parentSelectorTitle).length > 0) {
                    cy.get(parentSelectorTitle).should("exist");
                    cy.get(parentSelectorTitle).children(sectionTitleHed).should("exist");
                }
                if (brandNames.includes(workFlowData.brand) && workFlowData.currentComponentName == 'verso-hero-search-feature') {
                    cy.get(parentSelector + bundlePageSelectors.parent['verso-hero-search-list']).within(() => {
                        cy.get(parentSelectorTitle).eq(0).children(sectionTitleHed).should('be.visible');
                    })
                }
                else
                    cy.get(parentSelectorTitle).should("not.exist");
                return;
            }

            /***
            * If-else condtion to validate the SectionDek within the section Title, ex: summaryCollageNine / summaryCollageEight
            */
            if (expectedSectionDek.length > 1 && workFlowData.currentComponentName !== 'summaryCollectionGrid' && workFlowData.currentComponentName !== 'carousel' && workFlowData.currentComponentName === 'versoAudioArticle' && workFlowData.currentComponentName === 'versoFlatPackage') { //When the Dek is enable for carousel component, will enable validation for dek again.
                if (cy.get(childSelector['sectionDekTitleLink'])) {
                    cy.textEquals(childSelector['sectionDekTitleLink'], 0, expectedSectionDek);
                    cy.get(childSelector['sectionDekTitleLink']).eq(0).should('be.visible');
                }
                else {
                    cy.textEqualsWithChild([parentSelectorTitle, childSelector['sectionDekTitle']], 0, expectedSectionDek);
                    cy.get(parentSelectorTitle).eq(0).children(childSelector['sectionDekTitle']).should('be.visible');
                }
            }
            else if (workFlowData.currentComponentName !== 'summaryCollectionGrid' && workFlowData.currentComponentName !== 'versoFlatPackage' && workFlowData.currentComponentName !== 'versoAudioArticle') {
                if ($summarySection.find(parentSelectorTitle).length > 0)
                    cy.get(parentSelectorTitle).children(childSelector['sectionDekTitle']).should("not.exist");
                else
                    cy.get(parentSelectorTitle).should("not.exist");
            }

            /***
            * If-else condtion to validate the SectionDek under grid content, ex: summaryCollectionGrid
            */

            if ((expectedSectionDek.length > 1 && workFlowData.currentComponentName == 'summaryCollectionGrid') || (expectedSectionDek.length > 1 && workFlowData.currentComponentName === 'versoAudioArticle')) {
                if (expectedSectionDek.includes('[More »]')) {                 // check Section Dek title link in Case of More Items Links, instead of collection Grid dek
                    cy.textEquals(childSelector['sectionDekTitleLink'], 0, expectedSectionDek);
                    cy.get(childSelector['sectionDekTitleLink']).eq(0).should('be.visible');
                }
                else {
                    cy.textEquals(childSelector['summaryCollectionGridDek'], 0, expectedSectionDek);
                    cy.get(childSelector['summaryCollectionGridDek']).eq(0).should('be.visible');
                }
            }
            else if (workFlowData.currentComponentName == 'summaryCollectionGrid')
                cy.get(childSelector['summaryCollectionGridDek']).should("not.exist");
        }
    })
})

Cypress.Commands.add('validateTrendingStoriesDoesNotExists', function (workFlowData) {
    cy.get(bundlePageSelectors.parent[workFlowData.currentComponentName]).should("not.exist");
})

Cypress.Commands.add('validatePromoBox', function (workFlowData) {
    let promoData = workFlowData.currentComponentData[0];
    let parentSelector = assignParentSelector(workFlowData);
    let promoImageLength = Cypress.$(parentSelector + ' ' + childSelector['promo_image']).length;
    let promoVideoLength = Cypress.$(parentSelector + ' ' + childSelector['promo_video']).length;
    let promoBoxType = promoData.node?.tout?.__typename ? promoData.node.tout.__typename : promoData.node.__typename

    cy.get(childSelector['promo_url']).eq(workFlowData.currentComponentIndex).invoke('attr', 'href').then((referenceUrl) => {
        cy.validateUrl(workFlowData, referenceUrl);
        let refUrl = referenceUrl.startsWith('/') ? referenceUrl.slice(1) : referenceUrl
        expect(refUrl).to.eql(promoData.node.url);
    })
    cy.get(parentSelector).eq(workFlowData.currentComponentIndex).within(() => {

        if (promoBoxType.length > 0 && promoImageLength > 0) {
            cy.get(childSelector['promo_image']).eq(workFlowData.currentItemIndex).should('be.visible');
            cy.get(childSelector['promo_image']).eq(workFlowData.currentItemIndex).invoke('attr', 'src').then((imgSrcUrl) => {
                cy.validateUrl(workFlowData, imgSrcUrl);
            })
        }
        else if (promoVideoLength > 0)
            cy.get(childSelector['promo_video']).eq(workFlowData.currentItemIndex).should('be.visible');
        else {
            cy.get(childSelector['promo_image']).should('not.exist');
        }

        let promoDataHed = promoData.contextualHed ? promoData.contextualHed : promoData.node.hed
        let promoDataDek = promoData.contextualDek ? promoData.contextualDek : promoData.node.dek
        if (promoDataDek !== "" && workFlowData.curationContainerType === 'solo-promo') {
            let soloPromoDek = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template == 'solo-promo')[workFlowData.currentComponentIndex].dek
            cy.get(childSelector['promo_callout']).eq(workFlowData.currentItemIndex).invoke('text').then((value) => {
                expect(promoData.node.channels[0].name).to.include(value)
            })
            cy.get(childSelector['promo_dek']).should('be.visible').then((value) => {
                expect(utils.normaliseText(soloPromoDek)).to.include(utils.normaliseText(value.text()))
            })
            cy.get(childSelector['promo_primaryButton']).then(($url) => {
                cy.validateUrl(null, $url.prop('href'))
                expect($url.text()).to.exist
            })
        }
        else if (promoDataDek !== "" && workFlowData.curationContainerType !== 'solo-promo') {
            cy.get(childSelector['promo_callout']).eq(workFlowData.currentItemIndex).invoke('text').then((value) => {
                expect(value).to.exist
            })
            cy.get(childSelector['promo_dek']).should('be.visible').then((value) => {
                expect(utils.normaliseText(promoDataDek)).to.eq(utils.normaliseText(value.text()).replace(/\s+/g, ' ').trim())
            })
        }
        else {
            cy.get(childSelector['promo_dek']).should('not.exist')
        }

        if (promoData.node.source !== undefined && promoData.node.source.length > 0)
            cy.textEquals(childSelector['promo_primaryButton'], workFlowData.currentItemIndex, promoData.node.source)
    })
})

Cypress.Commands.add('validateDataSectionTitle', function (workFlowData, dataSectionTitle, expectedSectionHed, dangerousHed) {
    let config = workFlowData.currentComponentConfig;
    let elementIndex = workFlowData.currentItemIndex + 1;
    let dataEightNineSectionTitle;
    let summarycollageEightNineFourItems;
    let summaryCollageFive;
    let summaryCollageOneSingleFeature;
    let collageFiveDataSection = [config.summaryCollageFiveCenter, config.summaryCollageFiveAside]
    let dataSectionTitleFromApi = [config.summaryCollageEightNineMainHero, config.summaryCollageEightNineMainUnder, config.summaryCollageEightNineMainAside, config.summaryCollageEightNineMainAside];
    if (workFlowData.currentComponentName === 'summaryCollageEight' || workFlowData.currentComponentName === 'summaryCollageNine') {
        dataEightNineSectionTitle = childSelector['summaryEightNineListItems'];
    }
    if (workFlowData.currentComponentName === 'summaryCollageEight') {
        summarycollageEightNineFourItems = childSelector['summaryCollageEightFourItems']
    }
    else if (workFlowData.currentComponentName === 'summaryCollageNine') {
        summarycollageEightNineFourItems = childSelector['summaryCollageNineFourItems']
    }
    else if (workFlowData.currentComponentName === 'summaryCollageFive') {
        summaryCollageFive = childSelector['summaryCollageFive']
    }
    else if (workFlowData.currentComponentName === 'summaryCollageOne') {
        summaryCollageOneSingleFeature = childSelector['summaryCollageOneSingleFeature']
    }
    config.summaryRiverTrackingSpace = (workFlowData.page === 'tag') ? config.summaryRiverTrackingSpaceGalleryPage : config.summaryRiverTrackingSpaceHomePage;
    //Carousel does not have data-section-title in it.
    if (config.showDataSectionTitle === true && workFlowData.currentComponentName !== 'carousel') {
        if (workFlowData.currentComponentName === 'summaryCollageEight' || workFlowData.currentComponentName === 'summaryCollageNine') {
            if (workFlowData.currentItemIndex === 0 || workFlowData.currentItemIndex === 1) {
                cy.get(summarycollageEightNineFourItems).eq(workFlowData.currentItemIndex).should('have.attr', 'data-section-title').then((value) => {
                    expect(value).to.eq(dataSectionTitleFromApi[workFlowData.currentItemIndex].replaceAll('"', ''));
                })
            }
            else if (workFlowData.currentItemIndex < 4) {
                cy.get(dataEightNineSectionTitle).eq(workFlowData.currentItemIndex - 2).should('have.attr', 'data-section-title').then((value) => {
                    expect(value).to.eq(dataSectionTitleFromApi[workFlowData.currentItemIndex].replaceAll('"', '') + " " + (workFlowData.currentItemIndex - 1));
                })
            }
            else if (workFlowData.currentComponentName === 'summaryCollageEight' && workFlowData.currentItemIndex > 3 && ((workFlowData.currentItemIndex - 3) < 4)) {
                cy.get(dataEightNineSectionTitle).eq(workFlowData.currentItemIndex - 2).should('have.attr', 'data-section-title').then((value) => {
                    expect(value).to.eq(config.summaryCollageEightNineRightRail.replaceAll('"', '') + " " + (workFlowData.currentItemIndex - 3));
                })
            }
            else if (workFlowData.currentComponentName === 'summaryCollageNine' && workFlowData.currentItemIndex > 3) {
                cy.get(dataEightNineSectionTitle).eq(workFlowData.currentItemIndex - 2).should('have.attr', 'data-section-title').then((value) => {
                    expect(value).to.eq(config.summaryCollageEightNineRightRail.replaceAll('"', '') + " " + (workFlowData.currentItemIndex - 3));
                })
            }
        }
        //Validation of SummaryCollageFive,River & CollectionGrid DataSection based on config Value.
        else if (collageFiveDataSection.length !== undefined && collageFiveDataSection.length > 0 && workFlowData.currentComponentName === 'summaryCollageFive') {
            if (workFlowData.currentItemIndex === 0 && config.summaryCollageFiveCenter !== undefined) {
                cy.get(childSelector['summaryCollageFive']).eq(workFlowData.currentItemIndex).should('have.attr', 'data-section-title').then((value) => {
                    expect(utils.normaliseText(value)).to.eq(config.summaryCollageFiveCenter.replaceAll('"', ''));
                })

            }
            else if (workFlowData.currentItemIndex > 0 && config.summaryCollageFiveAside !== undefined) {
                if (cy.get(childSelector['summaryCollageFive']).eq(workFlowData.currentItemIndex)) {
                    cy.get(childSelector['summaryCollageFive']).eq(workFlowData.currentItemIndex).should('have.attr', 'data-section-title').then((value) => {
                        expect(utils.normaliseText(value)).contains(config.summaryCollageFiveAside.replaceAll('"', ''));
                    })
                }
                else {
                    cy.get(childSelector['summaryCollageFiveDataSection']).eq(workFlowData.currentItemIndex).should('have.attr', 'data-section-title').then((value) => {
                        expect(utils.normaliseText(value)).to.eq(config.summaryCollageFiveAside.replaceAll('"', '') + " " + workFlowData.currentItemIndex);
                    })
                }
            }
        }
        else if (config.summaryRiverTrackingSpace !== undefined && config.summaryRiverTrackingSpace.length > 0 && workFlowData.currentComponentName === 'river') {
            let summaryTrackingSpace = utils.normaliseText(config.summaryRiverTrackingSpace.replaceAll('"', ''));
            cy.get(childSelector['summaryRiverItemsDataSection']).eq(workFlowData.currentItemIndex).should('have.attr', 'data-section-title').then((value) => {
                expect(utils.normaliseText(value)).to.contain(summaryTrackingSpace);
            })
        }
        else if (expectedSectionHed !== '' && (workFlowData.currentComponentName === 'summaryCollectionGrid' || workFlowData.currentComponentName === 'summaryCollectionGridContributor' || workFlowData.currentComponentName === 'river' || workFlowData.currentComponentName === 'versoAudioArticle')) {
            if (!(workFlowData.brand === 'bon-appetit' && workFlowData.page === 'channel' || workFlowData.brand === 'The New Yorker' && workFlowData.page === 'channel')) {
                cy.get(childSelector['summaryRiverItemsDataSection']).eq(workFlowData.currentItemIndex).should('have.attr', 'data-section-title').then((value) => {
                    expect(utils.normaliseText(value.split(' ').join(''))).to.eq(utils.normaliseText(expectedSectionHed + " " + elementIndex).split(' ').join(''));
                })
            }
        }

        else if (workFlowData.currentComponentName === 'summaryCollageOne' && config.summaryCollageFiftyFiftyOneColumn === 'one-column') {
            cy.get(dataSectionTitle).eq(workFlowData.currentItemIndex).should('not.have.attr', 'data-section-title')
        }

        else {
            // skip below check if horizontal list sectionTitleHed is not present
            if (expectedSectionHed.length > 1 && workFlowData.currentComponentConfig.horizontalListSectionHed !== null && (workFlowData.currentComponentName !== 'versoFlatPackage' && workFlowData.currentComponentName !== 'horizontalList')) {
                if (!(workFlowData.brand === 'bon-appetit' && workFlowData.page === 'channel')) {
                    if (!(workFlowData.currentComponentName === "summaryCollageFour" && dangerousHed === "") && !(workFlowData.currentComponentName === 'summaryCollectionRow')) {    // dont validate below for vogue mexcio summaryCollageFour
                        cy.get(dataSectionTitle).eq(workFlowData.currentItemIndex).should('have.attr', 'data-section-title').then((value) => {
                            expect(utils.normaliseText(value)).to.exist;
                        })
                    }
                }
            }
        }
    }
    else {
        if (workFlowData.currentComponentName === 'carousel' && config.showDataSectionTitle === true && expectedSectionHed.length > 1) {   // FIX AUTOMATION-1574
            cy.get(dataSectionTitle).eq(workFlowData.currentItemIndex).should('have.attr', 'data-section-title').then((value) => {
                expect(utils.normaliseText(value.split(' ').join(''))).to.eq(utils.normaliseText(expectedSectionHed + " " + elementIndex).split(' ').join(''));
            })
        }
        else {
            cy.get(dataSectionTitle).should('not.have.attr', 'data-section-title')
        }
    }
})

Cypress.Commands.add('validateIssueFeature', function (workFlowData) {
    let brandNames = ['world-of-interiors']
    let versoIssueFeatureData = workFlowData.currentComponentData[0];
    let parentSelector = assignParentSelector(workFlowData);
    let { expectedSectionHed, expectedSectionDek } = bundlUtils.getSummaryItemData(workFlowData);
    let config = workFlowData.currentComponentConfig;
    let versoIssueCaption = Cypress.$(childSelector['versoIssueFeatureCaption']);
    let dekValue = brandNames.includes(workFlowData.brand) ? versoIssueFeatureData.node.dek : versoIssueFeatureData.contextualDek
    if (workFlowData.currentItemIndex == 0 && config.hideSectionTitle != true) {
        cy.validateSectionHedAndDek(workFlowData, expectedSectionHed, 0)
    }
    cy.get(parentSelector).eq(workFlowData.currentComponentIndex).within(() => {
        if (config.hideSectionTitle != true && config.hideItemHed != false) {
            cy.textEquals(childSelector['versoIssueLandingPage'], 0, expectedSectionDek)
            cy.get(childSelector['versoIssueLandingPage']).find('span > a').then(($anchorLink) => {
                let landingPageUrl = $anchorLink.prop('href');
                cy.validateUrl(workFlowData, landingPageUrl);
            })
        }
        cy.get(childSelector['versoIssueFeatureDek']).then(($value) => {
            let issueFeatureDekValue = $value.get(0).innerText;
            expect(utils.normaliseText(issueFeatureDekValue)).to.equal(utils.normaliseText(dekValue));
        })
        if (versoIssueFeatureData.contextualDek.includes('http')) {
            cy.get(childSelector['versoIssueFeatureDek']).eq(workFlowData.currentItemIndex).find('a').each((referenceUrl) => {
                let issueFeatureDekUrl = referenceUrl.prop('href');
                cy.validateUrl(workFlowData, issueFeatureDekUrl);
            })
        }
        cy.get(childSelector['versoIssueFeatureToc']).eq(workFlowData.currentItemIndex).find('a').then(($tocLink) => {
            let featureIssueTocLink = $tocLink.prop('href');
            let featureIssueTocValue = $tocLink.text();
            cy.validateUrl(workFlowData, featureIssueTocLink);
            expect(featureIssueTocValue).to.exist;
        })
        cy.get(childSelector['versoIssueFeatureMagazineImage']).should('be.visible');
        if (config.hideItemHed != false) {
            let hed = versoIssueFeatureData.contextualHed ? versoIssueFeatureData.contextualHed : versoIssueFeatureData.node.hed ? versoIssueFeatureData.node.hed : ''; // fix AUTOMATION-1578
            cy.textEquals(childSelector['versoIssueMagazineDate'], 0, hed);
        }
        else {
            cy.get(childSelector['versoIssueMagazineDate']).should('not.exist');
        }
        if (versoIssueFeatureData.node.dek.length > 0 && config.hideSourceDek != true) {
            let dek = versoIssueFeatureData.contextualDek ? versoIssueFeatureData.contextualDek : versoIssueFeatureData.node.dek ? versoIssueFeatureData.node.dek : ''; // fix AUTOMATION-1578
            cy.textEquals(childSelector['versoIssueMagazineName'], 0, dek);
        }
        else {
            cy.get(childSelector['versoIssueMagazineName']).should('not.exist');
        }
        cy.validateTickerImage(workFlowData)
        if (versoIssueCaption.length > 0) {
            cy.textEquals(childSelector['versoIssueFeatureCaption'], 0, utils.normaliseText(versoIssueFeatureData.node.tout.caption));
        }
        else {
            cy.get(childSelector['versoIssueFeatureCaption']).should('not.exist');
        }
        /*
           Comparing the dataSectionTitle displayed from UI with API data
        */
        if (config.showDataSectionTitle === true) {
            cy.get(childSelector['versoIssueFeatureDek']).invoke('attr', 'data-section-title').then((value) => {
                expect(value).to.equal((config.versoIssueInlineLinks).replaceAll('"', ''));
            })
            cy.get(childSelector['versoIssueFeatureToc']).invoke('attr', 'data-section-title').then((value) => {
                expect(value).to.equal((config.versoIssueToc).replaceAll('"', ''));
            })
            cy.get(childSelector['versoIssueFeatureMagazineImage']).invoke('attr', 'data-section-title').then((value) => {
                expect(value).to.equal((config.versoIssueCover).replaceAll('"', ''));
            })
        }
        else {
            cy.get(childSelector['versoIssueFeatureDek']).parent().should('not.have.attr', 'data-section-title');
        }
    })
})

Cypress.Commands.add('validateCartoonFeature', function (workFlowData) {
    let versoCartoonFeatureData = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template == 'verso-featured-item')[workFlowData.currentComponentIndex];
    let cartoonItemsData = versoCartoonFeatureData.items.edges[0].node;
    let parentSelector = assignParentSelector(workFlowData);
    let { expectedSectionHed, expectedSectionDek } = bundlUtils.getSummaryItemData(workFlowData);
    if (workFlowData.currentItemIndex == 0) {
        cy.validateSectionHedAndDek(workFlowData, expectedSectionHed, expectedSectionDek)
    }

    cy.get(parentSelector).eq(workFlowData.currentComponentIndex).within(() => {
        let captionText = Cypress.$(childSelector['captionText']);
        cy.textEquals(childSelector['versoIssueLandingPage'], 0, expectedSectionDek) // Common selector for Cartoon landing Page Url 
        cy.get(childSelector['versoIssueLandingPage']).find('span > a').then(($anchorLink) => {
            let landingPageUrl = $anchorLink.prop('href');
            cy.validateUrl(workFlowData, landingPageUrl);
        })
        cy.get(childSelector['cartoon_image_link']).scrollIntoView();
        cy.validateTickerImage(workFlowData)
        if ((cartoonItemsData.caption !== '' && cartoonItemsData.caption !== null) && captionText.length > 0) {
            cy.textEquals(childSelector['captionText'], 0, cartoonItemsData.caption);
        }
        else {
            cy.get(childSelector['captionText']).should('not.exist');
        }
        if (cartoonItemsData.credit.length > 0 && cartoonItemsData.credit !== '') {
            cy.textEquals(selectors.bundles.parent['caption-credit'], 0, cartoonItemsData.credit);
        }
        else {
            cy.get(selectors.bundles.parent['caption-credit']).should('not.exist');
        }
    })
})

Cypress.Commands.add('validateStorySpotlight', function (workFlowData) {
    let summarySpotlightData = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template == 'spotlight-story')[workFlowData.currentComponentIndex].items.edges[0]
    let captionText = Cypress.$(childSelector['spotlightCaptionCredit']).text();
    let parentSelector = assignParentSelector(workFlowData);
    let { expectedSectionHed, expectedSectionDek, expectedBylineAuthor } = bundlUtils.getSummaryItemData(workFlowData);
    let storyFictionTitle = 'Story Spotlight/Fiction'
    if (workFlowData.currentItemIndex == 0) {
        cy.validateSectionHedAndDek(workFlowData, expectedSectionHed, 0)
    }
    cy.get(parentSelector).eq(workFlowData.currentComponentIndex).within(() => {
        cy.get(childSelector['summarySpotlightFeatureHeader']).eq(workFlowData.currentComponentIndex).then(($link) => {
            let headerUrl = $link.prop('href');
            let headerText = $link.text();
            cy.validateUrl(workFlowData, headerUrl);
            expect(headerText).to.exist
        })

        cy.get(childSelector['summarySpotlightFeatureHeader']).invoke('attr', 'data-section-title').then((value) => {
            expect(value).to.equal(storyFictionTitle + " " + (workFlowData.currentComponentIndex + 1));
        })
        cy.validateImageLoad(childSelector['SpotlightImage'], workFlowData.currentItemIndex)

        if (expectedBylineAuthor.length > 0) {
            expectedBylineAuthor = '' + expectedBylineAuthor;
            cy.get(childSelector['byLineSection']).eq(0).should('be.visible');
        }

        if (captionText.length > 0) {
            cy.textEquals(childSelector['spotlightCaptionCredit'], 0, summarySpotlightData.node.tout.credit)
        }
        else {
            cy.get(childSelector['spotlightCaptionCredit']).should('not.exist')
        }

        cy.get(childSelector['spotlightFeatureContent']).then(($Content) => {
            let featureText = $Content.text();
            expect(utils.normaliseText(featureText)).contains(utils.normaliseText(summarySpotlightData.contextualDek))
        })

        cy.get(childSelector['spotlightFeatureContent']).find('a').invoke('attr', 'data-section-title').then((value) => {
            expect(value).to.equal(storyFictionTitle + " " + (workFlowData.currentComponentIndex + 1));
        })

        cy.get(childSelector['spotlightFeatureContentLink']).eq(workFlowData.currentComponentIndex).each(($link) => {
            let contentLink = $link.prop('href')
            cy.validateUrl(workFlowData, contentLink)
        })

        for (let i = 0; i < summarySpotlightData.length - 1; i++) {
            cy.get(childSelector['spotlightRelatedItemContent']).eq(i).then(($el) => {
                expect($el.text()).to.equal(summarySpotlightData[i + 1].contextualHed)
            })
            cy.get(childSelector['spotlightStoryRubric']).eq(i).then(($el) => {
                expect($el.text()).to.equal(summarySpotlightData[i + 1].node.channels[0].name)
            })
            cy.get(childSelector['spotlightRelatedItemDataSection']).eq(i).invoke('attr', 'data-section-title').then((value) => {
                expect(value).to.equal(storyFictionTitle + " " + (i + 2));
            })
        }
        cy.get(childSelector['SpotlightDangerousBottomDek']).find('a').then(($anchorLink) => {
            let dekUrl = $anchorLink.prop('href')
            let dekValue = utils.normaliseText($anchorLink.text());
            cy.validateUrl(workFlowData, dekUrl);
            expect(dekValue).contains(utils.normaliseText(expectedSectionDek))
        })
    })
})

//Data fetch is different for Contributor spotlight then other containers
Cypress.Commands.add('validateContributorSpotlight', function (workFlowData) {
    let summarySpotlightData = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template == 'spotlight-contributor')[workFlowData.currentComponentIndex].items.edges[0]
    let contributorRelatedAuthorData = summarySpotlightData.node.relatedContent.edges
    let contributorFeatureStoriesData = summarySpotlightData.node.featuredStories.edges
    let captionText = Cypress.$(childSelector['spotlightCaptionCredit']).text();
    let parentSelector = assignParentSelector(workFlowData);
    let { expectedSectionHed, expectedSectionDek } = bundlUtils.getSummaryItemData(workFlowData);
    if (workFlowData.currentItemIndex == 0) {
        cy.validateSectionHedAndDek(workFlowData, expectedSectionHed, 0)
    }
    cy.get(parentSelector).last().eq(workFlowData.currentComponentIndex).within(() => {
        cy.get(childSelector['summarySpotlightFeatureHeader']).eq(workFlowData.currentComponentIndex).then(($link) => {
            let headerUrl = $link.prop('href');
            let headerText = $link.text();
            cy.validateUrl(workFlowData, headerUrl);
            expect(headerText).to.exist
        })
        cy.validateImageLoad(childSelector['SpotlightImage'], workFlowData.currentItemIndex)
        if (captionText.length > 0) {
            cy.textEquals(childSelector['spotlightCaptionCredit'], 0, summarySpotlightData.node.featuredImage.edges[0].node.credit)
        }
        else {
            cy.get(childSelector['spotlightCaptionCredit']).should('not.exist')
        }

        cy.get(childSelector['spotlightFeatureContent']).then(($Content) => {
            let featureText = $Content.text();
            expect(utils.normaliseText(featureText)).to.eql(utils.normaliseText(summarySpotlightData.node.featuredBio))
        })
        cy.get(childSelector['spotlightAuthorSelectedStoriesTitle']).should('have.text', 'Selected Stories')
        for (let j = 0; j < contributorFeatureStoriesData.length; j++) {
            cy.get(childSelector['spotlightAuthorFeatureStoriesLink']).eq(j).then(($el) => {
                let storiesUrl = $el.prop('href')
                cy.validateUrl(workFlowData, storiesUrl)
            })
            cy.textEquals(childSelector['spotlightAuthorFeatureStoriesHed'], j, (contributorFeatureStoriesData[j].node.promoHed ? contributorFeatureStoriesData[j].node.promoHed : contributorFeatureStoriesData[j].node.hed))
            cy.textEquals(childSelector['spotlightAuthorFeatureStoriesDek'], j, (contributorFeatureStoriesData[j].node.promoDek ? contributorFeatureStoriesData[j].node.promoDek : contributorFeatureStoriesData[j].node.dek))
        }
        for (let i = 0; i < contributorRelatedAuthorData.length; i++) {
            cy.get(childSelector['spotlightRelatedItemContent']).eq(i).then(($el) => {
                expect(utils.normaliseText($el.text())).to.equal(utils.normaliseText((contributorRelatedAuthorData[i].node.promoHed ? contributorRelatedAuthorData[i].node.promoHed : contributorRelatedAuthorData[i].node.hed)))
            })
            cy.get(childSelector['spotlightRelatedItemContent']).find('a').eq(i).then(($el) => {
                let relatedItemUrl = $el.prop('href')
                cy.validateUrl(workFlowData, relatedItemUrl)
            })
            if (Cypress.$(childSelector['spotlightAuthorRubric']).length > 0)
                cy.textEquals(childSelector['spotlightAuthorRubric'], i, contributorRelatedAuthorData[i].node.channels[0].name)
        }
        cy.get(childSelector['SpotlightDangerousBottomDek']).then((bottomDekText) => {
            let dekValue = utils.normaliseText(bottomDekText.text());
            expect(dekValue).eq(utils.normaliseText(expectedSectionDek))
        })
    })
})

Cypress.Commands.add('validatePromoHed', (workFlowData) => {
    let bundleHeaderDek = workFlowData.bundleInfo.data.getBundle.dek
    let bundleHeaderHed = workFlowData.bundleInfo.data.getBundle.hed
    if (bundleHeaderDek.length > 0){ 
        cy.textEquals(bundlePageSelectors.parent['bundle-header-dek'], 0, bundleHeaderDek)
    }
    cy.textEquals(bundlePageSelectors.parent['bundle-hed'], 0, bundleHeaderHed)
    cy.get(bundlePageSelectors.parent['category-wrapper']).each(($value) => {
        cy.wrap($value.get(0).innerText).should('exist');
    })
    cy.get(bundlePageSelectors.parent['category-wrapperHref']).each(($el) => {
        let headerUrl = $el.prop('href')
        cy.validateUrl(workFlowData, headerUrl)
    })
})

Cypress.Commands.add("validateFilterableSummary", (workFlowData) => {
    cy.get(bundlePageSelectors.parent['verso-filterable-summary-list']).eq(workFlowData.currentComponentIndex).within(() => {
        let filterableSummaryContent = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template == 'verso-filterable-summary-list')[workFlowData.currentComponentIndex];
        let articleFilterableFeature = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template == 'verso-article-filterable-feature')[workFlowData.currentComponentIndex];
        let hed = Cypress.$(selectors.tag.hed).length > 0 ? selectors.tag.hed : selectors.bundles.children.topStoriesHed;

        //validate first button content and makesure the button selected
        cy.get(selectors.global.content.toggle).eq(1).click({ force: true }).should('have.attr', 'aria-checked').should('eq', 'true')
        cy.get(hed).each(($el, index) => {
            if (!articleFilterableFeature) {
                cy.textEquals(hed, index, filterableSummaryContent.itemSets[0].items.edges[index].node.promoHed ? filterableSummaryContent.itemSets[0].items.edges[index].node.promoHed : filterableSummaryContent.itemSets[0].items.edges[index].node.hed)
                cy.validateImageUrl(workFlowData, index, selectors.tag.hed);
            }
            else {
                cy.textEquals(hed, index, articleFilterableFeature.itemSets[1].items.edges[index].node.promoHed ? articleFilterableFeature.itemSets[1].items.edges[index].node.promoHed : articleFilterableFeature.itemSets[1].items.edges[index].node.hed)
                cy.validateImageUrl(workFlowData, index, selectors.bundles.children.hedUrl);
            }
        })

        //validate second button content and makesure the button selected
        cy.get(selectors.global.content.toggle).eq(2).click({ force: true }).should('have.attr', 'aria-checked').should('eq', 'true')
        cy.get(selectors.global.content.toggle).eq(1).should('have.attr', 'aria-checked').should('eq', 'false')
        cy.get(hed).each(($el, index) => {
            if (!articleFilterableFeature) {
                cy.textEquals(hed, index, filterableSummaryContent.itemSets[1].items.edges[index].node.promoHed ? filterableSummaryContent.itemSets[1].items.edges[index].node.promoHed : filterableSummaryContent.itemSets[1].items.edges[index].node.hed)
                cy.validateImageUrl(workFlowData, index, selectors.tag.hed);
            }
            else {
                cy.textEquals(hed, index, articleFilterableFeature.itemSets[2].items.edges[index].node.promoHed ? articleFilterableFeature.itemSets[2].items.edges[index].node.promoHed : articleFilterableFeature.itemSets[2].items.edges[index].node.hed)
                cy.validateImageUrl(workFlowData, index, selectors.bundles.children.hedUrl);
            }
        })
    })
});

export function validateCuratedItems(curatedShowsData, workFlowData, viewMoreButton) {
    let backenddataIndex = 0;
    cy.get(selectors.global.content.summaryItemSimple).each(($el, index) => {
        let itemsLength = curatedShowsData.items.edges[0].node.curatedShows.edges.length;
        if (viewMoreButton) {
            index = index + 10;
            backenddataIndex = index;
        }
        let gridDekExist = Cypress.$('[class *="CuratedShowsWrapper"] .grid--item a').eq(index).children('p').text();
        let sponsoredItemFound = false;
        if (gridDekExist.trim() !== 'Sponsored' && index <= itemsLength - 1 && index < 20) {
            if (curatedShowsData.items.edges[0].node.curatedShows.edges[index].node.isSponsored === true) {   // If backend item contains sponsored item, consider next item for matching
                backenddataIndex += 1;
                sponsoredItemFound = true;
            }
            if (!(sponsoredItemFound && backenddataIndex > itemsLength - 1)) {
                cy.textEquals(selectors.global.content.summaryItemSimpleHed, index, curatedShowsData.items.edges[0].node.curatedShows.edges[backenddataIndex].node.designer.name)    // FIX AUTOMATION-1576
                cy.validateImageUrl(workFlowData, index, selectors.global.content.summaryItemSimple)
            }
        }
        backenddataIndex += 1;
    })
}

Cypress.Commands.add('validateCuratedShows', (workFlowData) => {
    let itemSelection = []
    let designersList = []
    let curatedShowsData = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template == 'verso-curated-shows')[workFlowData.currentComponentIndex];
    cy.textEquals(selectors.global.content.sectionHeaderHed, 0, curatedShowsData.hed);
    validateCuratedItems(curatedShowsData, workFlowData, false);
    // show more button validation. 
    if (cy.$$(selectors.global.content.showMoreBtn).length > 0) {
        cy.get(selectors.global.content.showMoreBtn).click({ force: true })
        validateCuratedItems(curatedShowsData, workFlowData, true);
    }
    let hideCuratedShowsList = workFlowData.brandConfigData.configContent.homepageConfig['ComponentConfig.MultiPackages.settings.hideCuratedShowsList'];
    if (!hideCuratedShowsList) {
        cy.get(selectors.global.content.groupedNavigationWrapper).within(() => {
            // search designer name using index 
            cy.get(selectors.global.content.designersList).each(($el) => {
                designersList.push($el.text())
            }).then(() => {
                let indexSelection = ((designersList[(Math.floor(Math.random() * designersList.length))]))
                cy.get(selectors.global.content.designersList).contains(indexSelection).click({ force: true }).then(($el, index) => {
                    let link = $el.prop('href')
                    cy.validateUrl(workFlowData, link)
                })
            })
            cy.get(selectors.global.content.navigationListItemWrapper).each(($el) => {
                itemSelection.push($el.text())
            }).then(() => {
                let itemInput = ((itemSelection[(Math.floor(Math.random() * itemSelection.length))]))
                let partialText = ((itemSelection[(Math.floor(Math.random() * itemSelection.length))])).slice(0, 2)
                // search valid designer name using full text
                cy.get(selectors.global.content.groupedNavigationFilterInput).type(itemInput).click()
                cy.get(selectors.global.content.navigationInternalLink).then(($el) => {
                    let link = $el.prop('href')
                    cy.validateUrl(workFlowData, link)
                    cy.textEquals(selectors.global.content.navigationInternalLink, 0, itemInput)
                })
                // search valid designer name using partial text
                cy.get(selectors.global.content.groupedNavigationFilterInput).clear({ force: true }).type(partialText, { force: true }).click()
                cy.get(selectors.global.content.navigationInternalLink).each(($el, index) => {
                    let link = $el.prop('href')
                    cy.validateUrl(workFlowData, link)
                    cy.textInclude(selectors.global.content.navigationInternalLink, index, partialText)
                })
                // Invalid text search
                cy.scrollTo('top', { duration: 1000 })
                cy.get(selectors.global.content.groupedNavigationFilterInput).clear({ force: true }).type("invalidItem", { force: true }).click()
                cy.get(selectors.global.content.groupedNavigationLinks).should('be.empty')
            })
        })
    }
})

Cypress.Commands.add('validateSmartPackage', (workFlowData) => {
    let componentName = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template.includes('package'))[workFlowData.currentComponentIndex].template
    let layoutConfigData = workFlowData.layoutConfig.data.layoutConfigs.layouts[workFlowData.currentComponentIndex].componentConfigs.SmartItem.settings.content
    let expectedSectionHed = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template.includes('package'))[workFlowData.currentComponentIndex].hed
    let expectedSectionDek = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template.includes('package'))[workFlowData.currentComponentIndex].dek
    let parentSelector = assignParentSelector(workFlowData);
    let packageData = workFlowData.bundleInfo.data.getBundle.containers.results.filter(item => item.template.includes('package'))[workFlowData.currentComponentIndex].items.edges
    let componentWrapper;
    let hed, dek
    let smartRubric
    if (componentName === 'verso-top-story-package' || componentName === 'verso-focus-package') {
        componentWrapper = childSelector['focusPackageUnit']
        workFlowData.currentItemIndex = 0
    }
    else if (componentName === 'verso-flat-package') {
        componentWrapper = childSelector['smartFlatItemWrapper']
    }
    else if (componentName === 'verso-puzzles-games-package') {
        componentWrapper = childSelector['cardUnitWrapper']
    }

    //Validate Section title hed and dek for Flat Packages and puzzles and games
    //Validate Hed,Dek,Byline,Publish Date, Image for all smart components
    cy.get(parentSelector).eq(workFlowData.currentComponentIndex).within(() => {
        if (workFlowData.currentItemIndex === 0)
            if (componentName === 'verso-flat-package' || componentName === 'verso-puzzles-games-package') {
                cy.get(childSelector['smartContainerHeader']).eq(0).within(() => {
                    cy.get(childSelector['smartContainerHeaderHed']).eq(0).should('be.exist')
                    if (expectedSectionDek !== '' && expectedSectionDek.length > 0) {
                        cy.get(childSelector['smartContainerHeaderDek']).then(($el) => {
                            expect(utils.normaliseText($el.text())).to.eq(utils.normaliseText(expectedSectionDek))
                            if (($el).find('a').length > 0) {
                                cy.validateUrl(null, ($el).find('a').prop('href'))
                            }
                        })
                    }
                })
            }
        if (Cypress.$(childSelector['smartItemImage']).length > 0) {
            cy.validateImageLoad(childSelector['smartItemImage'], workFlowData.currentItemIndex);
        }
        else {
            cy.get(childSelector['smartItemImage']).should('not.exist')
        }

        if (componentName !== 'verso-puzzles-games-package') {
            if (packageData[workFlowData.currentItemIndex] !== undefined) {
                hed = packageData[workFlowData.currentItemIndex].contextualHed ? packageData[workFlowData.currentItemIndex].contextualHed : packageData[workFlowData.currentItemIndex].node.promoHed ? packageData[workFlowData.currentItemIndex].node.promoHed : packageData[workFlowData.currentItemIndex].node.hed
                dek = packageData[workFlowData.currentItemIndex].contextualDek ? packageData[workFlowData.currentItemIndex].contextualDek : packageData[workFlowData.currentItemIndex].node.promoDek ? packageData[workFlowData.currentItemIndex].node.promoDek : packageData[workFlowData.currentItemIndex].node.dek
                smartRubric = packageData[workFlowData.currentItemIndex]?.node?.channels?.[0]?.name;
            }
            cy.get(componentWrapper).eq(workFlowData.currentItemIndex).find(childSelector['smartItemHedLink']).then(($el) => {
                expect($el.text()).to.exist
                cy.validateUrl(workFlowData, $el.prop('href'));
            })
            if (layoutConfigData.showRubric) {
                if (smartRubric !== '')
                    cy.get(childSelector['smartItemRubric']).eq(workFlowData.currentItemIndex).invoke('text').then(($text) => {
                        expect(smartRubric).contains($text)
                    })
            }
            else {
                cy.get(childSelector['smartItemRubric']).should('not.exist')
            }
            if (layoutConfigData.showPublishDate) {
                cy.validatePublishDate(packageData, workFlowData.currentItemIndex, childSelector['smartItemPublishedDate'])
            }
            else {
                cy.get(childSelector['smartItemPublishedDate']).should('not.exist')
            }
            if (layoutConfigData.showBylines) {
                let contributorLength = packageData[workFlowData.currentItemIndex]?.node?.allContributors.edges.length
                for (let i = 0; i < contributorLength; i++) {
                    cy.get(childSelector['byLineSection']).eq(workFlowData.currentItemIndex).invoke('text').then(($text) => {
                        if (contributorLength == 1) {
                            expect(utils.normaliseText($text)).to.exist
                        }
                        else if (contributorLength == 2) {
                            expect(utils.normaliseText($text)).to.exist
                        }
                    })
                }
            }
            else {
                cy.get(childSelector['byLineSection']).should('not.exist');
            }
        }
        if (layoutConfigData.showDek) {
            if (componentName !== 'verso-puzzles-games-package') {
                cy.get(componentWrapper).eq(workFlowData.currentItemIndex).find(childSelector['smartContainerDek']).then(($el) => {
                    expect(utils.normaliseText($el.text())).to.eq(utils.normaliseText(dek))
                })
            }
            else {
                //For puzzles and games data is directly picked from dek instead of contextual dek. Query is raised for editorial team - CG-3811
                cy.get(componentWrapper).eq(workFlowData.currentItemIndex).find(childSelector['smartContainerDek']).then(($el) => {
                    expect(utils.normaliseText($el.text())).to.eq(utils.normaliseText(packageData[workFlowData.currentItemIndex].node.dek))
                })
            }
        }
        else {
            cy.get(componentWrapper).eq(workFlowData.currentItemIndex).find(childSelector['smartContainerDek']).should('not.exist')
        }
        if (componentName === 'verso-puzzles-games-package') {
            cy.get(childSelector['smartItemCTA']).then(($el) => {
                cy.validateUrl(workFlowData, $el.prop('href'));
            })
        }
    })
})

Cypress.Commands.add('validateEventsSummary', function (workFlowData) {
    // For Event type item: Dek, rubric, CTA Labe, Event status , Venue name items are different. Hence below code
    let summaryData = workFlowData.currentComponentData;
    let parentSelector = assignParentSelector(workFlowData);
    let { expectedHed, expectedDek, expectedHedUrl, expectedSectionHed, expectedSectionDek, expectedBylineAuthor, expectedBylinePhotographer, expectedRubric } = bundlUtils.getSummaryItemData(workFlowData);
    let expectedEventRubric = summaryData[workFlowData.currentItemIndex]?.node?.eventRubric ? summaryData[workFlowData.currentItemIndex].node.eventRubric : undefined;
    let expectedEventDek = summaryData[workFlowData.currentItemIndex]?.contextualDek ? summaryData[workFlowData.currentItemIndex].contextualDek : undefined;
    let expectedVenueName = summaryData[workFlowData.currentItemIndex]?.node?.connected?.edges[0]?.node?.address?.city ? summaryData[workFlowData.currentItemIndex].node.connected.edges[0].node.address.city : undefined;
    if (expectedVenueName !== undefined)
        expectedVenueName = expectedVenueName + ' ' + summaryData[workFlowData.currentItemIndex].node.connected.edges[0].node.address.region + ' ' + summaryData[workFlowData.currentItemIndex].node.connected.edges[0].node.address.country;
    let expectedStartDate = summaryData[workFlowData.currentItemIndex]?.node?.startDate ? summaryData[workFlowData.currentItemIndex].node.startDate : undefined;
    let timeZone = summaryData[workFlowData.currentItemIndex]?.node?.timeZone;
    let expectedEventStatus = summaryData[workFlowData.currentItemIndex]?.node?.eventStatus ? summaryData[workFlowData.currentItemIndex].node.eventStatus : undefined;
    let expectedCTALabel = summaryData[workFlowData.currentItemIndex]?.node?.ctaLabel ? summaryData[workFlowData.currentItemIndex].node.ctaLabel : undefined;

    if (workFlowData.currentItemIndex == 0)
        cy.validateSectionHedAndDek(workFlowData, expectedSectionHed, expectedSectionDek);
    cy.get(parentSelector).eq(workFlowData.currentComponentIndex).within(() => {
        cy.textEquals(childSelector['hed'], workFlowData.currentItemIndex, expectedHed);
        cy.get(childSelector['hedUrl']).eq(workFlowData.currentItemIndex).invoke('attr', 'href').then((hedUrl) => {
            expectedHedUrl = expectedHedUrl.startsWith('/') ? expectedHedUrl.slice(1) : expectedHedUrl;
            cy.validateUrl(workFlowData, hedUrl);
        })
        expectedRubric = expectedEventRubric ? expectedEventRubric : expectedRubric
        cy.get(childSelector['rubric']).should('be.visible');
        // Few of the items on Events page are non-event type
        if (expectedCTALabel === undefined) {
            if (expectedDek.length > 0) {
                cy.textEqualsWithChild([childSelector['summaryItem'], childSelector['dek']], workFlowData.currentItemIndex, expectedDek);
            }
            if (expectedBylineAuthor.length > 0) {
                let overLayHedLength = Cypress.$(parentSelector + ' ' + childSelector['overlayHed']).eq(workFlowData.currentItemIndex).length;
            }
        }
        else {    // Validate Event type items
            let index = workFlowData.eventsNonCTAPresent === true ? workFlowData.currentItemIndex - 1 : workFlowData.currentItemIndex;
            cy.textEquals(childSelector['eventVenue'], index, expectedVenueName);
            coreAssertions.validateEventDate(childSelector['eventStartDate'], index, expectedStartDate, timeZone)
            cy.textEquals(childSelector['eventStatus'], index, expectedEventStatus);
            cy.textEquals(childSelector['eventCTALabel'], index, expectedCTALabel);
        }
    })
})

Cypress.Commands.add('validateHeroCuratedFeature', function (workFlowData) {
    let heroCuratedSummaryCollageFour = workFlowData.currentComponentData;
    let heroCuratedSummaryCollageFourItems = heroCuratedSummaryCollageFour.slice(1);
    let parentSelector = assignParentSelector(workFlowData);
    let badgeConfig = workFlowData.brandConfigData.configContent.homepageConfig['ComponentConfig.SummaryCollageEight.settings.shouldShowRecipeBadge']
    let { expectedSectionHed, expectedSectionDek } = bundlUtils.getSummaryItemData(workFlowData);
    if (workFlowData.currentItemIndex == 0) {
        cy.validateSectionHedAndDek(workFlowData, expectedSectionHed, expectedSectionDek)
    }
    cy.get(parentSelector).eq(workFlowData.currentComponentIndex).scrollIntoView().within(() => {
        cy.get(bundlePageSelectors.parent['summaryCollageFour']).within(() => {
            if (workFlowData.currentItemIndex == 0) {
                if (badgeConfig) {
                    cy.validateImageLoad(childSelector['summaryCollageFourMainBadge'], 0);
                }
                cy.validateImageLoad(childSelector['summaryCollageFourMain'], 0);
                cy.validateHeroComponentData(workFlowData, "summaryCollageFourMain", heroCuratedSummaryCollageFour, 0);
            }
            for (let i = 0; i < heroCuratedSummaryCollageFourItems.length; i++) {
                if (workFlowData.brandConfigData.configContent.homepageConfig['ComponentConfig.SummaryCollageEight.settings.hideSummaryListDeks']) {
                    cy.validateHeroComponentData(workFlowData, "summaryCollageEightGrid", heroCuratedSummaryCollageFourItems, i, true);
                }
                else {
                    cy.validateHeroComponentData(workFlowData, "summaryCollageEightGrid", heroCuratedSummaryCollageFourItems, i);
                }
            }
        })
    })
})

Cypress.Commands.add('validateHeroSearchFeature', function (workFlowData) {
    let heroCuratedSummaryGridItems = workFlowData.currentComponentData;
    let parentSelector = assignParentSelector(workFlowData);
    let { expectedSectionHed, expectedSectionDek } = bundlUtils.getSummaryItemData(workFlowData);
    let brandNames = ['wired']
    if (workFlowData.currentItemIndex == 0) {
        cy.validateSectionHedAndDek(workFlowData, expectedSectionHed, expectedSectionDek)
    }
    if (brandNames.includes(workFlowData.brand) && workFlowData.currentComponentName == 'verso-hero-search-feature') {
        parentSelector += bundlePageSelectors.parent['verso-hero-search-list']

    }
    cy.get(parentSelector).eq(workFlowData.currentComponentIndex).scrollIntoView().within(() => {
        // Setting the iteration count to 5, since only 5 elements will be present in UI
        for (let i = 0; i < 5; i++) {
            cy.validateHeroComponentData(workFlowData, "summaryCollageEightGrid", heroCuratedSummaryGridItems, i);
        }
    })
})

Cypress.Commands.add('validateHeroComponentData', function (workFlowData, selector, data, index, hideDek) {
    if (workFlowData.brand === 'Vogue')
        return
    let parentSelector = assignParentSelector(workFlowData);
    parentSelector = workFlowData.currentComponentName == 'verso-hero-search-feature' ? parentSelector + bundlePageSelectors.parent['verso-hero-search-list'] : parentSelector
    let brandNames = ['wired']
    cy.get(childSelector[selector]).eq(index).then(($el) => {
        let bylineAuthor = []
        let hed = data[index].node.promoHed ? data[index].node.promoHed : data[index].node.hed;
        let dek = data[index].contextualDek ? data[index].contextualDek : data[index].node.dek;
        let selectorHed = brandNames.includes(workFlowData.brand) ? childSelector['summaryContentWrapperHed'] : childSelector['contentWrapperHed']
        let selectorDek = brandNames.includes(workFlowData.brand) ? childSelector['summaryContentWrapperDek'] : childSelector['contentWrapperDek']
        let rubricSelector = brandNames.includes(workFlowData.brand) ? childSelector['summaryCollageFourMainRubricName'] : childSelector['summaryCollageFourMainRubric']
        let rubricData = brandNames.includes(workFlowData.brand) ? data[index].node.rubric : data[index].node.channels[0].name
        let dekSelectorLength = Cypress.$(childSelector[selector] + ' ' + selectorDek).length
        let rubricNameLength = Cypress.$(parentSelector + ' ' + childSelector[selector] + ' ' + childSelector['summaryCollageFourMainRubricName']).eq(index).length
        let rubricLinkLength = Cypress.$(childSelector[selector] + ' ' + childSelector['summaryCollageFourMainRubric']).length
        let byLineLength = Cypress.$(childSelector[selector]).eq(index).children('.summary-item__content').children('.summary-item__byline-date-icon').length
        let contributorLength = data[index]?.node?.allContributors.edges.length
        for (let i = 0; i < contributorLength; i++) {
            bylineAuthor += data[index]?.node?.allContributors?.edges[i].node.name;
        }

        if (hideDek || dekSelectorLength == 0) {
            dek = false;
        }
        cy.wrap($el).find(selectorHed).then((value) => {
            expect(value.text()).to.exist;
        })
        if (dek) {
            cy.wrap($el).find(selectorDek).then((value) => {
                expect(utils.normaliseText(value.text())).to.eq(utils.normaliseText(dek));
            })
        }
        if (rubricNameLength) {
            cy.wrap($el).find(rubricSelector).then((value) => {
                expect(utils.normaliseText(value.text())).to.exist;
                if (rubricLinkLength) {
                    cy.validateUrl(null, value.prop('href'));
                }
            })
        }
        if (byLineLength) {
            cy.wrap($el).find(childSelector['byLineName']).then((value) => {
                expect(utils.normaliseText(value.text())).to.eq(utils.normaliseText(bylineAuthor))
            })
        }
        if (data[index].node.aggregateRating) {
            cy.wrap($el).find(childSelector['ratingStars']).should('be.visible');
        }
    })
})

Cypress.Commands.add('validateCartoons', function (workFlowData) {
    let cartoonData = workFlowData.currentComponentData[0];
    let galleryData = {
        "brand": workFlowData.brand,
        "page": "gallery",
        "uri": cartoonData.node.url
    }
    let parentSelector = assignParentSelector(workFlowData);
    let gallerySlideData = {}
    let { expectedSectionHed, expectedSectionDek } = bundlUtils.getSummaryItemData(workFlowData);
    if (workFlowData.currentItemIndex == 0) {
        cy.validateSectionHedAndDek(workFlowData, expectedSectionHed, expectedSectionDek)
    }
    dataHelper.getGallerySlideItems(galleryData).then((data) => {
        galleryData = data
        gallerySlideData = galleryData.data.getGallery.itemsPageN.items
        cy.get(parentSelector).within(() => {
            // there are more than 10 cartoons so hence checking only 3 cartoons slide
            // caption from UI is not same as backend. Hence excluded caption validation. Once corrected will add the same
            for (let i = 0; i < 3; i++) {
                cy.validateImageLoad(childSelector['cartoonImage'], i)
                if (gallerySlideData[i].item.credit !== '' && gallerySlideData[i].item.credit !== null)
                    cy.textEquals(selectors.bundles.parent['caption-credit'], i, gallerySlideData[i].item.credit)
                else {
                    cy.get(selectors.bundles.parent['caption-credit']).eq(i).should('not.exist')
                }
                cy.get(selectors.article.copyLink).eq(0).click({ force: true })
                cy.get(selectors.article.copyLinkAlertPopUpMessage).eq(i).invoke('text').should('exist')
                cy.get(selectors.article.shopCartIconLabel).eq(i).invoke('text').should('exist')
                cy.textEquals(childSelector['galleryCount'], 1, ((i + 1) + "/" + cartoonData.node.items.totalResults))
                cy.get(childSelector['galleryNextButton']).eq(0).click({ force: true })
                cy.wait(2000)
            }
        })
    })
})

//Validate BundleHeader For Magazine Page
Cypress.Commands.add('validateBundleHeader', (workFlowData) => {
    let bundleHeaderHed = workFlowData.bundleInfo.data.getBundle.hed
    cy.textEquals(selectors.bundles.parent['bundle-header-dek'], 0, bundleHeaderHed)
    cy.get(selectors.bundles.parent['bundleHeaderHed']).invoke('text').should('exist')
    let captionText = Cypress.$(selectors.bundles.children['captionText']);
    cy.validateImageLoad(selectors.bundles.children['assetEmbedImage'], 0)
    if (captionText.length > 0 && captionText !== '')
        cy.textEquals(selectors.bundles.children['captionText'], 0, workFlowData.bundleInfo.data.getBundle.tout.caption)
    else
        cy.get(selectors.bundles.children['captionText']).should('not.exist')
    cy.get(childSelector['navDisabledButton']).invoke('text').should('to.exist')
    cy.get(childSelector['navDisabledButton']).should('not.have.attr', 'href')
    cy.get(childSelector['navActiveButton']).invoke('text').should('to.exist')
    cy.get(childSelector['navActiveButton']).then(($el) => {
        cy.validateUrl(null, $el.prop('href'))
        cy.get(childSelector['navActiveButton']).click()
        cy.url().should('include', $el.prop('href'))
    })
    cy.get(childSelector['navActiveButton']).contains('Next').click()
    cy.url().should('include', '/magazine')
})
