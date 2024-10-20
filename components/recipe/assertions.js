import * as utils from "../../utils/commonUtils";
let selectors = require("../../selectors/verso/recipe.json");
let coreSelectors = require("../../selectors/verso/global.json");
let testData = require('../../test-data/verso/url.json');
let bundlePageSelectors = require("../../selectors/verso/bundles.json");

// Fetch recipe URL from Feature/Hero section on Homepage
Cypress.Commands.add('getHeroRecipe', (recipePageData) => {
  cy.get(selectors['hero_recipe']).scrollIntoView().should('be.visible');
  return cy.get(selectors['hero_recipe']).then(($el) => {
    recipePageData.pageUri = $el.attr('href');
    recipePageData.url = utils.getPageUrl(recipePageData.brand, recipePageData.page, null, true) + recipePageData.pageUri + testData.urlParameters;
    recipePageData.urlWithoutTestParameters = utils.getPageUrl(recipePageData.brand, recipePageData.page, null, true) + recipePageData.pageUri;
    recipePageData.pageUri = recipePageData.pageUri.substring(1);
    return recipePageData;
  })
})

// Validating the Recipe page content
Cypress.Commands.add('validateRecipePageContent', (recipePageData) => {
  let recipePageContent = recipePageData.recipe;
  let brandTranslations = recipePageData.brandConfigData.translations;
  let brandConfigContent = recipePageData.brandConfigData.configContent.recipeData;
  // Validate Hed, Lede Image, Author Name, Pub Date, Rating Stars, Caption Credit and Read Reviews Link under Content Header
  cy.validateLeadImageInContentPage();
  cy.validateContentHedInContentPage(recipePageContent.hed);
  cy.validateBylineInContentPage(recipePageContent, brandTranslations);
  cy.validatePublishedDateInContentPage(recipePageContent.pubDate, bundlePageSelectors.parent['contentHeader-PubDate'], 'MMMM d, yyyy');
  if (recipePageContent.aggregateRating !== null && recipePageContent.reviewsCount !== null) {
    cy.get(selectors['rating_stars']).should('be.visible');
    cy.get(selectors['aggregate_ratings']).should('have.text', (Math.round(recipePageContent.aggregateRating * 10) / 10).toFixed(1));
    cy.get(selectors['reviews_count']).should('have.text', "(" + recipePageContent.reviewsCount + ")");
  }
  else {
    cy.get(selectors['rating_stars']).should('not.exist');
    cy.get(selectors['aggregate_ratings']).should('not.exist');
    cy.get(selectors['reviews_count']).should('not.exist');
  }
  cy.validateCaptionCreditInContentPage(recipePageContent);
  // Validate Content Body, Products, Ingredients, Social Sharing Embeds, Preparation, Rating Stars module and Leave a Review module
  if (recipePageContent.bodyJsonML.content !== null) {
    cy.validateBodyContentIsNotEmpty();
  }
  else {
    cy.get(bundlePageSelectors.parent['content-body']).should('not.exist');
  }
  // Product carousel is not displayed on all recipes. The condition handles the present\absent states
  if (recipePageContent.products.edges.length > 0) {
    cy.get(selectors['products_section_header']).scrollIntoView();
    cy.get(selectors['products_section_header']).should('have.text', brandTranslations['RecipeProductCarousel.Title'][0].value);
    let productsListUI = new Array();
    let productsListGraphQL = new Array();
    cy.get(selectors['products_name']).each(($el, index) => {
      cy.wrap($el).scrollIntoView();
      productsListUI.push($el.text());
      productsListGraphQL.push(recipePageContent.products.edges[index].node.name);
      expect(productsListGraphQL[index]).to.deep.eq(productsListUI[index]);
    }).then(() => {
      expect(recipePageContent.products.edges.length).to.deep.eq(productsListUI.length);
    })
  }
  cy.get(selectors['infoSliceWrapper']).invoke('text').should('exist')
  if (recipePageContent.servingSizeInfo.description) {
    if (Cypress.$(selectors['infoSliceItem']).length === 1) {
      cy.get(selectors['infoSliceItem']).eq(0).should('have.text', recipePageContent.servingSizeInfo.description);
    }
    else {
      cy.get(selectors['infoSliceItem']).eq(0).should('have.text', recipePageContent.times.totalTime);
      cy.get(selectors['infoSliceItem']).eq(1).should('have.text', recipePageContent.servingSizeInfo.description);
    }

  }
  cy.get(selectors['ingredients_list']).eq(0).scrollIntoView();
  cy.get(selectors['ingredients_header']).eq(0).should('have.text', brandTranslations['IngredientList.hedText'][0].value);
  let ingredientsListUI = new Array();
  let ingredientsListGraphQL = new Array();
  let ingredientValue = "";
  let ingredientGroup_SubHeader_Index_Diff = 0;
  recipePageContent.ingredientGroups.forEach(($ingredientGroup, index) => {
    if (recipePageContent.ingredientGroups.length > 1) {
      if ($ingredientGroup.hed !== "") {
        cy.get(selectors['ingredients_sub_header']).eq(index - ingredientGroup_SubHeader_Index_Diff).should('have.text', $ingredientGroup.hed);
      }
      else {
        ingredientGroup_SubHeader_Index_Diff = ingredientGroup_SubHeader_Index_Diff + 1;
      }
    }
    $ingredientGroup.ingredients.forEach(($ingredients) => {
      ingredientsListGraphQL.push($ingredients.description);
    })
  })
  let ingredientDescriptionList = Cypress.$(selectors['ingredients_amount']).length > 0 ? selectors['ingredients_amount'] : selectors['ingredients_description'];
  let ingredientAmountListType = Cypress.$(selectors['ingredients_amount']).length > 0 ? true : false;
  cy.get(ingredientDescriptionList).each(($el, index) => {
    cy.get(selectors['ingredients_description']).eq(index).then(($description) => {
      if ($el.text() !== "" && ingredientAmountListType) {
        ingredientValue = $el.text() + " " + $description.text();
      }
      else {
        ingredientValue = $description.text();
      }
      ingredientsListUI.push(ingredientValue);
      if (ingredientsListUI[index] !== ingredientsListGraphQL[index]) {
        ingredientsListUI[index] = ingredientsListUI[index].replace(/(\r\n|\n|\r)/gm, " ");
        ingredientsListGraphQL[index] = ingredientsListGraphQL[index].replace(/(\r\n|\n|\r)/gm, " ");
        expect(utils.normaliseText(ingredientsListGraphQL[index])).to.deep.eq(utils.normaliseText(ingredientsListUI[index]));
      }
      else {
        expect(ingredientsListGraphQL[index]).to.deep.eq(ingredientsListUI[index]);
      }
    })
  }).then(() => {
    expect(ingredientsListGraphQL.length).to.deep.eq(ingredientsListUI.length);
    if (!ingredientAmountListType) {
      cy.get(selectors['ingredients_amount']).should('not.exist');
    }
  })
  cy.get(selectors['instructions_section']).scrollIntoView();
  cy.get(selectors['instructions_section']).invoke('text').should('not.be.empty');
  let instructionsHeaderText = brandConfigContent['ComponentConfig.InstructionList.settings.hed'];
  if (instructionsHeaderText) {
    cy.get(selectors['instructions_header']).should('have.text', instructionsHeaderText);
  } else {
    cy.get(selectors['instructions_header']).should('not.exist');
  }
  let communityEnabled = recipePageData.brandConfigData.configContent.config.community.enableCommunityExperience;

  if (communityEnabled !== true) {
    cy.get(selectors['review_ratings_form']).scrollIntoView();
    cy.get(selectors['review_ratings_form_header']).should('have.text', brandTranslations['RatingsForm.PromptText'][0].value + recipePageContent.hed + brandTranslations['RatingsForm.PromptText'][2].value);
    cy.get(selectors['review_ratings_form_stars']).should('be.visible');
    cy.get(selectors['review_section']).scrollIntoView();
    cy.get(selectors['review_section_header']).should('have.text', brandTranslations['ReviewForm.Hed'][0].value);
    cy.get(selectors['review_section_textbox_minimised']).should('have.attr', 'placeholder', brandTranslations['ReviewForm.FakeInputPlaceholderText'][0].value).click({ force: true });
    cy.get(selectors['review_section_textbox_sign_in']).should('be.visible').within(($el) => {
      let bannerText = $el.text();
      expect(utils.normaliseText(bannerText)).to.deep.eq(utils.normaliseText(brandConfigContent['ComponentConfig.RatingForm.settings.dangerousSignInExpanded']));
      cy.get('a').each(($element) => {
        let hrefurl = $element.prop('href');
        cy.validateUrl(null, hrefurl);
      })
    })
  }
  // Validate User Reviews module, Tag Links and recirc module
  cy.get(coreSelectors.content['tag_cloud_section_header']).scrollIntoView().should('have.text', brandConfigContent['ComponentConfig.TagCloud.settings.sectionHeader']);
  let tagsListUI = new Array();
  cy.get(coreSelectors.content['tag_cloud_link']).each(($el, index) => {
    tagsListUI.push($el.text());
    cy.validateUrl(null, $el.prop('href'));
  })
})

// Validate paywall banner and cne video
Cypress.Commands.add('validatePaywallAndCneVideo', (recipePageData) => {
  let brandTranslations = recipePageData.brandConfigData.translations;
  let paywallBannerLength = Cypress.$(selectors.paywall_banner).length;
  let expanded_canvas_containerLength = Cypress.$(selectors.expanded_canvas_container).length;
  if (paywallBannerLength > 0) {
    cy.get(selectors['paywall_banner']).should('be.visible');
    cy.get(selectors['paywall_banner_close_button']).click();
    cy.get(selectors['paywall_collpase_banner']).should('be.visible');
  }
  else if (expanded_canvas_containerLength > 0) {
    cy.get(selectors['expanded_canvas_container']).should('be.visible');
  }
  else {
    cy.get(selectors['paywall_banner']).should('not.exist');
  }
  cy.get(selectors['ingredients_list']).eq(0).scrollIntoView();
  cy.validateCNEVideoInContentPage(brandTranslations['VideoWrapper.headerText'][0].value);
})
