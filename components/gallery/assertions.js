import * as utils from "../../utils/commonUtils";
const { selectors } = require("../../selectors/verso/selectors");
let bundlePageSelectors = require("../../selectors/verso/bundles.json");
import * as tagPageConfig from "../../test-data/verso/tag/vogue-brand-config.json"

// validate gallery content: head image, caption credit text, Hed, Dek, bylink name, publish date, body text
Cypress.Commands.add('validateGalleryContentHeader', (galleryWorkFlow) => {
  let lede_Credit = galleryWorkFlow.lede ? galleryWorkFlow.lede.credit : undefined;
  let tout_Credit = galleryWorkFlow.tout.credit;
  let caption_Credit = lede_Credit ? lede_Credit : tout_Credit;
  let galleryContentDek = Cypress.$(selectors.gallery.galleryContentDek)
  let rubricLink = Cypress.$(selectors.gallery.rubricLink)
  if (rubricLink.length > 0) {
    cy.get(rubricLink).should('be.visible').then((hrefurl) => {
      cy.validateUrl(galleryWorkFlow, hrefurl.prop('href'))
    })
  }
  let leadImageLength = Cypress.$(bundlePageSelectors.parent['contentHeader-lead-image']).length;
  if (leadImageLength > 0) {
    cy.get(selectors.gallery.lead_content_photo).invoke('attr', 'src').then((imgSrcUrl) => {
      cy.validateUrl(galleryWorkFlow, imgSrcUrl)
    })
  }
  cy.get("body").then(($body) => {
    if ($body.find(selectors.gallery.caption_credit).length) {
      cy.textEquals(selectors.gallery.caption_credit, 0, caption_Credit);
    }
  });
  if (leadImageLength > 0) {
    cy.validateLeadImageInContentPage()
  }
  cy.validateContentHedInContentPage(galleryWorkFlow.hed)
  if (galleryContentDek.length > 0) {
    cy.textEquals(selectors.gallery.galleryContentDek, 0, galleryWorkFlow.dek);
  }
  cy.get(selectors.gallery.byline_Name_Link).then((hrefurl) => {
    let bylineLink = hrefurl.prop('href');
    cy.validateUrl(galleryWorkFlow, bylineLink)
  })
  cy.textEquals(selectors.gallery.byline_Name_Link, 0, galleryWorkFlow.allContributors.edges[0].node.name)
  cy.validatePublishedDateInContentPage(galleryWorkFlow.publishDate, bundlePageSelectors.parent['contentHeader-PubDate'], 'MMMM d, yyyy');
  cy.validateBodyContentIsNotEmpty();
})

//validate gallery slides: images, Hed, Dek, caption credit, price, seller name and product_offer_url
Cypress.Commands.add("validateGallerySlidesBody", (workFlowData) => {
  let galleryWorkFlow = workFlowData.galleryItemData.data.getGallery;
  let captionCreditIndexDiff = 0;
  workFlowData.totalSlidesCount = galleryWorkFlow.itemsPageN.items.length;
  let gallerySlideHedLength = Cypress.$(selectors.gallery.slideCaptionHedText).length;
  if (!(gallerySlideHedLength > 0)) {
    cy.get(selectors.gallery.gallerySlideWrapper).each(($ele, index) => {
      cy.validateImageLoad(selectors.gallery.gallerySlideAsset, index);
      let backEndCaption = galleryWorkFlow.itemsPageN.items[index].item.contextualCaption !== null ? galleryWorkFlow.itemsPageN.items[index].item.contextualCaption : galleryWorkFlow.itemsPageN.items[index].item.caption
      cy.get(selectors.gallery.gallerySlideCaptionDekContainer).eq(index).then(($el) => {
        if ($el.text().length > 0)
          cy.textEquals(selectors.gallery.gallerySlideCaptionDekContainer, index, backEndCaption)
      })
      cy.textEquals(selectors.gallery.slideCaptionCredit, index, galleryWorkFlow.itemsPageN.items[index].item.credit)
      cy.validateSlideNumber(workFlowData, index);
    })
  }
  else {
    cy.get(selectors.gallery.galleryPageSlides).each(($slides, index) => {
      let gallerySlidesHed = galleryWorkFlow.itemsPageN.items[index].item;
      gallerySlidesHed = gallerySlidesHed.contextualTitle ? gallerySlidesHed.contextualTitle : (gallerySlidesHed.hed ? gallerySlidesHed.hed : gallerySlidesHed.promoHed);
      cy.get(selectors.gallery.slideCaptionHedText).eq(index).then(($ele) => {
        expect(utils.normaliseText(gallerySlidesHed)).to.deep.eq(utils.normaliseText($ele.text()))
      })
      if ((index < 5) || (index === workFlowData.totalSlidesCount - 1) || (index === Math.round(workFlowData.totalSlidesCount / 2))) {
        cy.validateImageLoad(selectors.gallery.gallerySlideImage, index);
      }
      cy.get(selectors.gallery.galleryPageSlides).eq(index).within(() => {
        let gallerySlideMediaSocialShare = JSON.parse(workFlowData.brandConfigData.configContent.galleryData['defaultTenantConfig.mediaSocialShares']);
        if (gallerySlideMediaSocialShare.length > 0) {
          cy.get(selectors.bundles.children.gallerySlidesPinterestLink).should('be.visible').then((hrefurl) => {
            let pinterestUrl = hrefurl.prop('href');
            cy.validateUrl(galleryWorkFlow, pinterestUrl)
          })
        }
      })
      cy.get(selectors.gallery.gallerySlideCaptionDekContainer).eq(index).should('not.be.empty');
      let dekContainerOfferBtn = Cypress.$(selectors.gallery.slideProductOffer).length
      if (dekContainerOfferBtn > 0) {
        cy.get(selectors.gallery.slideProductOffer).should('be.visible').then((href) => {
          let storeUrl = href.prop('href')
          cy.validateUrl(galleryWorkFlow, storeUrl)
        })
      }
      cy.get("body").then(($body) => {
        if ($body.find(selectors.gallery.slideCaptionCredit).length) {
          let gallerySlidesCaptionCredit = galleryWorkFlow.itemsPageN.items[index].item;
          gallerySlidesCaptionCredit = gallerySlidesCaptionCredit.credit ? gallerySlidesCaptionCredit.credit : gallerySlidesCaptionCredit.tout.credit;
          if (gallerySlidesCaptionCredit !== "") {
            cy.textEquals(selectors.gallery.slideCaptionCredit, index - captionCreditIndexDiff, gallerySlidesCaptionCredit);
          }
          else {
            captionCreditIndexDiff = captionCreditIndexDiff + 1;
          }
        } else {
          cy.get(selectors.global.content.shopNowBtn).eq(index).should('not.be.empty')
          cy.get(selectors.gallery.gallerySlideWrapper).eq(index).within(() => {
            let price = galleryWorkFlow.itemsPageN.items[index].item;
            cy.get(selectors.global.content.price).each(($el, index) => {
              let sellersPrice = (price.offers[index].price).toString();
              cy.textInclude($el, 0, sellersPrice)
              cy.get(selectors.global.content.productOfferUrl).eq(index).then((hrefurl) => {
                let productLink = hrefurl.prop('href');
                cy.validateUrl(galleryWorkFlow, productLink)
              })
              if (price.offers[index].sellerName != null) {
                cy.textInclude(selectors.global.content.sellerTitle, index, price.offers[index].sellerName)
              }
            })
            cy.get(selectors.global.content.price).should("have.length", galleryWorkFlow.itemsPageN.items[index].item.offers.length);
          })
        }
      })
      if (workFlowData.SlideButtonExists) {
        let gallerySlideButton = workFlowData.brandConfigData;
        if (workFlowData.SlideButtonType === "Recipe") {
          gallerySlideButton = gallerySlideButton.configContent?.galleryData["ComponentConfig.GallerySlide.settings.cta.recipe"] ? gallerySlideButton.configContent.galleryData["ComponentConfig.GallerySlide.settings.cta.recipe"] : gallerySlideButton.translations['GallerySlide.RecipeCta'][0].value;
        }
        cy.get(selectors.gallery.galleryPageSlidesButton).eq(index).should('be.visible').should('have.text', gallerySlideButton);
      }
      cy.validateSlideNumber(workFlowData, index);
    });
  }
  cy.get(selectors.gallery.galleryPageSlides).should('have.length', workFlowData.totalSlidesCount);
})

//validated gallery trending story: Title, hed, href, image with image_url, body text, byline
Cypress.Commands.add("validateGalleryMostPopularContent", (workFlowData) => {
  cy.clearCookies()
  cy.clearLocalStorage()
  let mostPopularLen = Cypress.$(selectors.gallery.mostPopularContainer).length;
  let configItemWithoutPreamble = workFlowData.brandConfigData.configContent.galleryData["ComponentConfig.RecircMostPopular.settings.bylineVariation"]
  let mostPopularWithoutImage = workFlowData.brandConfigData.configContent.galleryData["ComponentConfig.RecircMostPopular.variation"]
  cy.scrollTo("center");
  if (mostPopularLen != 0) {
    cy.get(selectors.gallery.mostPopularHead).first().invoke('text').should('not.be.empty');
    cy.get(selectors.gallery.mostPopularContainer).first().scrollIntoView().should("be.visible").and("have.length.at.least", 1);
    cy.get(selectors.gallery.mostPopularContainer).first().within(() => {
      cy.get(selectors.global.content.summary_items).each(($ele, index) => {
        if (workFlowData.trendingStoriesData.body.data[index].authors.length !== 0) {
          if (configItemWithoutPreamble === 'ItemWithoutPreamble') {
            cy.get(selectors.bundles.children.byLineName).eq(index).invoke('text').should('not.be.empty')
          } else {
            cy.get(selectors.bundles.children.byLineName).eq(index).invoke('text').should('not.be.empty')
          }
        }
        cy.get(selectors.bundles.children.hed).invoke('text').should('not.be.empty')
        cy.validateHedUrl(workFlowData, index);
        if (mostPopularWithoutImage !== "NumberedListBySummary") {
          cy.validateImageUrl(workFlowData, index);
        }
        let mostPopularHideRubric = workFlowData.brandConfigData.configContent.articleData["ComponentConfig.RecircMostPopular.settings.shouldHideRubric"]
        if (mostPopularHideRubric == "false") {
          cy.get(selectors.bundles.children.rubric).eq(index).invoke('text').should('not.be.empty')
        }
      });
    });
  } else {
    cy.get(selectors.gallery.mostPopularContainer).should('not.exist');
  }
});

Cypress.Commands.add('forceVisit', url => {
  cy.window().then(win => {
    return win.open(url, '_self');
  });
});

//Validate first 10 Voting buttons. For markets not behind Reg Gate, voting will happen directly. 
// Markets with Reg Gate, Validate Registration Pop-up appears and click close. 
Cypress.Commands.add('validateVoting', function (brandIndex, workFlowData, pageType) {
  let numberofImages = 0;
  let brandConfig = tagPageConfig.favLook
  if (pageType === 'onTheme')
    brandConfig = tagPageConfig.onTheme
  cy.get(selectors.gallery.galleryHed).invoke('text').then(($hedText) => {
    expect(utils.normaliseText($hedText)).to.equals(utils.normaliseText(brandConfig[brandIndex].galleryHed));
  })
  cy.get(selectors.gallery.galleryPageSlidesCount).first().invoke('text').then((text) => {
    numberofImages = text.split('/')[1];
    let timesToValidate = numberofImages > workFlowData.timesToValidate ? workFlowData.timesToValidate : numberofImages;
    for (let i = 0; i < timesToValidate; i++) {
      cy.get(selectors.gallery.votingQuestion).eq(0).invoke('text').then(($text) => {
        expect(utils.normaliseText($text)).to.equals(utils.normaliseText(brandConfig[brandIndex].prompt));
      })
      if (brandConfig[brandIndex].behindRegGate === 'yes') {      // validate enter credentials pop-up appears for Reg Gate markets.
        cy.get(selectors.gallery.votingButton).eq((i * 2) + 1).scrollIntoView({ offset: { top: -450 } }).click({ force: true })   // Click 2nd voting button 'YES'
        cy.wait(500)
        cy.get(selectors.gallery.createAccountPopUp).should('be.visible');
        cy.get(selectors.gallery.closeLoginPopUP).click();
      }
      else {
        checkContentAggregatorApi(i, "/api/user-content-aggregator", 'no');
        validateResponse(i, brandIndex);
      }
    }
  })
})

export function checkContentAggregatorApi(i, apiUrl, behindRegGate) {
  cy.intercept(apiUrl, (req) => {
    let apiRequest = behindRegGate === 'yes' ? req.body.query : req.body
    if (apiRequest.includes('mutation'))
      req.alias = 'addRequest'
    else if (apiRequest.includes('GetGalleryUserPoll'))
      req.alias = 'reloadRequest'
  })

  cy.get(selectors.gallery.votingButton).eq((i * 2) + 1).scrollIntoView({ offset: { top: -450 } }).click({ force: true }).then(() => {    // Click 2nd voting button 'YES'
    cy.wait(500)
    cy.wait('@addRequest').then((req) => {
      let apiRequest = behindRegGate === 'yes' ? req.request.body.query : req.request.body
      let apiResponse = behindRegGate === 'yes' ? req.response.body.data : req.response.body.userContentAggregator
      expect(apiRequest).to.contains('MutateGallery')
      expect(req.response.statusCode).to.eq(200)
      if (i === 0 && behindRegGate === 'no') {
        expect(apiResponse.addPoll.votes[0].imageId).not.to.be.empty;
        expect(apiResponse.addPoll.votes[0].result).to.eq(true)  // since we are clicking on Yes, verifying with True
        expect(apiResponse.addPoll.userId).not.to.be.empty;
      }
      else {
        expect(apiResponse.addVote.votes[0].imageId).not.to.be.empty;
        expect(apiResponse.addVote.votes[0].result).to.eq(true)   // since we are clicking on Yes, verifying with True
        expect(apiResponse.addVote.userId).not.to.be.empty;
      }
    })
  })
}

// If Market is behind Reg Gate, Login to Domain and proceed with Voting. 
Cypress.Commands.add('voteGallery', function (workFlowData, brandIndex) {
  let numberofImages;
  cy.get(selectors.gallery.galleryPageSlidesCount).first().invoke('text').then((text) => {
    numberofImages = text.split('/')[1];
    let timesToValidate = numberofImages > workFlowData.timesToValidate ? workFlowData.timesToValidate : numberofImages;
    cy.get(selectors.gallery.galleryPageSlidesCount).eq(1).scrollIntoView();
    cy.checkAndCollapsePaywall();
    for (let i = 0; i < timesToValidate; i++)
      cy.get(selectors.gallery.votingButton).eq((i * 2)).should('be.visible').scrollIntoView({ offset: { top: -450 } }).click({ force: true });   // Click 2nd voting button 'YES'
    for (let i = 0; i < timesToValidate; i++) {
      checkContentAggregatorApi(i, "/api/v2/user-content-aggregator", 'yes');
      validateResponse(i, brandIndex);
    }
  })
})

Cypress.Commands.add('verifyVotingResultsPersist', function (behindRegGate) {
  let votingResultBeforePageReload = [];
  let votingResultAfterPageReload = [];
  getVotingResults(votingResultBeforePageReload)
  cy.reload(true).wait(1000)
  cy.wait('@reloadRequest').then((req) => {
    let apiRequest = behindRegGate === 'yes' ? req.request.body.query : req.request.body
    let apiResponse = behindRegGate === 'yes' ? req.response.body.data : req.response.body.userContentAggregator
    expect(apiRequest).to.includes('GetGalleryUserPoll')
    expect(req.response.statusCode).to.eq(200)
    expect(apiResponse.getUserPoll).not.to.be.empty;
    expect(apiResponse.getUserPoll.galleryId).not.to.be.empty;
    expect(apiResponse.getUserPoll.orgId).not.to.be.empty;
    expect(apiResponse.getUserPoll.userId).not.to.be.empty;
  });

  cy.scrollTo('top')
  getVotingResults(votingResultAfterPageReload)
  let result = _.isEqual(votingResultBeforePageReload, votingResultAfterPageReload)
  expect(result).to.eql(true)
})

export function getVotingResults(votingResult) {
  for (let i = 0; i < 3; i++) {
    cy.get(selectors.gallery.votingResponse).eq(i).scrollIntoView().invoke('text').then(($response) => {
      votingResult.push($response)
    })
  }
  return votingResult;
}

Cypress.Commands.add('validateLinkBanner', function (linkBanner, workFlowData) {
  cy.wait(1000)
  cy.get(selectors.global.content.eventBanner).should('be.visible')
  cy.get(selectors.global.content.vogueEventBanner + ' a').invoke('attr', 'href').then(($text) => {
    expect(utils.normaliseText($text)).to.equals(utils.normaliseText(linkBanner.LiveOnLink));
    cy.validateUrl(null, $text)
  })
  cy.get(selectors.global.content.vogueEventBanner + ' img').invoke('attr', 'alt').then(($text) => {
    expect(utils.normaliseText($text)).to.equals(utils.normaliseText(workFlowData.bannerLogo));
  })
  cy.textEquals(selectors.global.content.bannerDek, 0, linkBanner.dek)
  cy.get(selectors.global.content.timeFormat).each(($ele, index) => {   // this each loop validates Days, Hours, Minutes and Seconds
    expect(utils.normaliseText($ele.text())).to.equals(utils.normaliseText(linkBanner.timeFormat[index]));
  })
    cy.get(selectors.global.content.notify).invoke('attr', 'href').then(($text) => {
      expect(utils.normaliseText($text)).to.equals(utils.normaliseText(linkBanner.newsLetterLink));
      cy.validateUrl(null, $text)
    })
    cy.textEquals(selectors.global.content.notify, 0, linkBanner.notify)
  cy.get(selectors.global.content.eventLink).invoke('attr', 'href').then(($text) => {
    expect(utils.normaliseText($text)).to.equals(utils.normaliseText(linkBanner.LiveOnLink));
    cy.validateUrl(null, $text)
  })
  cy.textEquals(selectors.global.content.eventLink, 0, linkBanner.liveOnVogue)
})

export function validateResponse(i, brandIndex) {
  cy.wait(1000)
  cy.get(selectors.gallery.votingResponse).eq(i).invoke('text').then(($text) => {
    if ($text.includes(tagPageConfig.favLook[brandIndex].votingResultsSoon))
      expect(utils.normaliseText($text)).to.equals(utils.normaliseText(tagPageConfig.favLook[brandIndex].votingResultsSoon));
    else {
      expect(isNaN($text.split('%')[0])).to.equals(false);
      expect(utils.normaliseText($text)).to.include(utils.normaliseText(tagPageConfig.favLook[brandIndex].votingResultPercent))
    }
  })
}

//validate slide number
Cypress.Commands.add("validateSlideNumber", (workFlowData, index) => {
  if (workFlowData.validateSlideNumber) {
    cy.get(selectors.gallery.galleryPageSlidesCount).eq(index).should('have.text', + index + 1 + "/" + workFlowData.totalSlidesCount);
  }
})

