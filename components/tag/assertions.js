import * as utils from "../../utils/commonUtils";
let selectors = require("../../selectors/verso/tag.json");
let testData = require('../../test-data/verso/url.json');
let bundleSelectors = require("../../selectors/verso/bundles.json");
let tagSelector = require("../../selectors/verso/gallery.json")

//Validating the SortBy feature
Cypress.Commands.add('validateSortBy', (sortBy) => {
    cy.get(selectors['sortBy_text']).should('have.text', sortBy.sortByText);
    cy.get(selectors['sortBy_container']).find(selectors['dropdown_chevron']).should('exist');
    if (sortBy.modifySortByValue) {
        cy.get(selectors['sortBy_container']).find(selectors['dropdown_control']).click({ force: true });
        cy.get(selectors['sortBy_container']).find(selectors['dropdown_list']).should('be.visible');
        cy.get(selectors['sortBy_container']).find(selectors['dropdown_list']).contains(sortBy.sortByValue).click({ force: true });
        cy.wait(2000);
        cy.get(selectors['page_load_skeleton']).should('not.exist');
    }
    var sortByListGraphQL = sortBy.sortByList;
    sortByListGraphQL = sortByListGraphQL.filter(item => item !== sortBy.sortByValue);
    cy.get(selectors['sortBy_container']).find(selectors['dropdown_value']).should('have.text', sortBy.sortByValue);
    let sortByListUI = new Array();
    cy.get(selectors['sortBy_container']).find(selectors['dropdown_control']).click({ force: true });
    cy.get(selectors['sortBy_container']).find(selectors['dropdown_list']).should('be.visible');
    cy.get(selectors['sortBy_container']).find(selectors['dropdown_list']).each(($el) => {
        sortByListUI.push($el.text());
    }).then(() => {
        expect(sortByListGraphQL).to.deep.eq(sortByListUI)
    })
    cy.get(selectors['sortBy_container']).find(selectors['dropdown_control']).click({ force: true });
    cy.get(selectors['page_load_skeleton']).should('not.exist');
})

//Validating the Filter feature
Cypress.Commands.add('validateFilter', (tagPageData) => {
    let filter = tagPageData.filter;
    cy.get(selectors['filter_text']).should('have.text', filter.filterText);
    let filtersCount = Cypress.$(selectors['filter_container']).find(selectors['dropdown_value']);
    expect(filtersCount.length).to.eq(filter.filterList.length)
    for (let i = 0; i < filtersCount.length; i++) {
        cy.get(selectors['filter_container']).find(selectors['dropdown_chevron']).eq(i).should('exist');
        cy.get(selectors['filter_container']).find(selectors['dropdown_value']).eq(i).should('have.text', filter.filterList[i].name);
        cy.get(selectors['filter_container']).find(selectors['dropdown_control']).eq(i).click({ force: true });
        cy.get(selectors['filter_container']).find(selectors['dropdown_list']).should('be.visible');
        let filterListGraphQL = filter.filterList[i].list;
        let filterListUI = new Array();
        cy.get(selectors['filter_container']).find(selectors['dropdown_list']).each(($el) => {
            filterListUI.push($el.text());
        }).then(() => {
            expect(filterListGraphQL).to.deep.eq(filterListUI)
        })
        if (filter.modifyFilterValue) {
            cy.get(selectors['filter_container']).find(selectors['dropdown_value']).eq(i).then(($el) => {
                let dropdownText = filter.modifyFilterList.filter(item => $el.text() === item.name);
                var indexOfDropdown = filter.modifyFilterList.findIndex(p => p.name == $el.text());
                if (dropdownText.length > 0) {
                    cy.get(selectors['filter_container']).find(selectors['dropdown_list']).each(($value) => {
                        let filterLabel = filter.modifyFilterList[indexOfDropdown].list.filter(item => $value.text() === item);
                        if (filterLabel.length === 1) {
                            cy.wrap($value).click({ force: true });
                            cy.wait(2000);
                            cy.get(selectors['page_load_skeleton']).should('not.exist');
                        }
                    })
                }
            })
        }
        cy.get(selectors['filter_container']).find(selectors['dropdown_control']).eq(i).click({ force: true });
        cy.get(selectors['filter_container']).find(selectors['dropdown_list']).should('not.exist');
        cy.get(selectors['page_load_skeleton']).should('not.exist');
    }
    if (filter.verifyFilterLabel) {
        cy.get(selectors['filter_label']).should('be.visible');
        let filterOptionGraphQL = filter.modifyFilterList.map(value => value.list);
        for (let l = 0; l < filterOptionGraphQL.length - 1; l++) {
            filterOptionGraphQL[0] = filterOptionGraphQL[0].concat(filterOptionGraphQL[l + 1]);
        }
        filterOptionGraphQL = filterOptionGraphQL[0];
        let filterOptionSelectedGraphQL = new Array();
        filterOptionGraphQL.forEach(($el) => {
            filterOptionSelectedGraphQL.push(utils.normaliseText($el));
        })
        let filterOptionSelectedUI = new Array();
        cy.get(selectors['page_load_skeleton']).should('not.exist');
        cy.get(selectors['filter_label']).each(($el) => {
            let labelValue = $el.text();
            if (tagPageData.brand === "bon-appetit") {
                labelValue = $el.text().replace(filter.filterLabelRemoveText, "");
            }
            filterOptionSelectedUI.push(utils.normaliseText((labelValue)));
        }).then(() => {
            expect(filterOptionSelectedGraphQL).to.deep.eq(filterOptionSelectedUI);
        })
        cy.get(selectors['clear_filters']).should('have.text', filter.filterResetText);
    }
})

//Validating the TagPageContent
Cypress.Commands.add('validateTagBundleContent', (tagPageData) => {
    if (!tagPageData.notValidateAllStackRatedCards) {
        cy.wait(3000);
    }
    cy.get(selectors['page_load_skeleton']).should('not.exist');
    if (Cypress.$(selectors.sortBy_container).length) {
        // Verify Page Header
        cy.get(selectors['tag_page_header']).then(($el) => {
            expect(utils.normaliseText(tagPageData.Header)).to.eql(utils.normaliseText($el.text()))
        })
        let count = tagPageData.tag.results.length;
        if (count !== 0) {
            cy.get(selectors['filter_message']).should('not.exist');
            if (tagPageData.notValidateAllStackRatedCards) {
                if (count > 5) {
                    count = 5;
                }
            }
            for (let i = 0; i < count; i++) {
                // Verify promoHed
                let hedText = tagPageData.tag.results[i].promoHed ? tagPageData.tag.results[i].promoHed : tagPageData.tag.results[i].hed;
                cy.get(selectors['grid']).eq(i).find(selectors['hed']).eq(0).then(($element) => {
                    expect(utils.normaliseText(hedText)).to.eql(utils.normaliseText($element.text()))
                })
                // Verify promoDek
                let dekText = tagPageData.tag.results[i].promoDek ? tagPageData.tag.results[i].promoDek : tagPageData.tag.results[i].dek;
                if (dekText !== '') {
                    cy.get(selectors['grid']).eq(i).find(selectors['dek']).then(($element) => {
                        expect(utils.normaliseText(dekText)).to.eql(utils.normaliseText($element.text()))
                    })
                }
                else {
                    cy.get(selectors['grid']).eq(i).find(selectors['dek']).should('not.exist');
                }
                // Verify if image url is loaded successfully
                cy.get(selectors['grid']).eq(i).should('be.visible')
                    .find(selectors['hed']).eq(0).scrollIntoView().then($el => {
                        let homePageUrl = testData[Cypress.env('environment')][tagPageData.brand]['homePageUrl'];
                        let imageLinkGraphQL = homePageUrl + "/" + tagPageData.tag.results[i].url;
                        expect(imageLinkGraphQL).to.eql($el.prop('href'));
                    })
                // Verify image loads successfully and verify pixel size of the image
                if (tagPageData.tag.results[i].tout !== null) {
                    cy.get(selectors['grid']).eq(i).find(selectors['image']).then(() => {
                        cy.validateImageLoad(selectors['image'], i);
                    })
                    cy.get(selectors['grid']).eq(i).find(selectors['image']).find('img').invoke('outerWidth').should('be.lt', tagPageData.imagepPixel + 1);
                }
                // Verify rubric
                if (tagPageData.tag.results[i].channels[0]?.name !== undefined) {
                    cy.get(selectors['grid']).eq(i).find(selectors['rubric']).should('have.text', tagPageData.tag.results[i].channels[0].name);
                }
                else {
                    cy.get(selectors['grid']).eq(i).find(selectors['rubric']).should('not.exist');
                }
                // Verify Aggregate Ratings
                let aggregateRating = tagPageData.tag.results[i].aggregateRating;
                if (aggregateRating && aggregateRating !== undefined || aggregateRating === null || aggregateRating === 0) {
                    if (aggregateRating !== null && aggregateRating !== 0) {
                        cy.get(selectors['grid']).eq(i).find(selectors['aggregate_ratings']).should('have.text', "(" + aggregateRating + ")");
                    }
                    else {
                        cy.get(selectors['grid']).eq(i).find(selectors['aggregate_ratings']).should('not.exist');
                    }
                }
                // Verify Author Name
                else {
                    cy.get(selectors['grid']).eq(i).find(selectors['aggregate_ratings']).should('not.exist');
                    if (tagPageData.tag.results[i].allContributors.edges.length > 0 && tagPageData.tag.results[i].__typename !== 'Gallery') {
                        const authorName = tagPageData.tag.results[i].allContributors.edges[0].node.name;
                        cy.get(selectors['grid']).eq(i).find(selectors['author_name']).should('have.text', authorName);
                    }
                    else {
                        cy.get(selectors['grid']).eq(i).find(selectors['author_name']).should('not.exist');
                    }
                }
                // Verify labels
                if (tagPageData.brand === "bon-appetit") {
                    if (tagPageData.tag.results[i].tags !== undefined) {
                        let tagLabelGraphql = tagPageData.tag.results[i].tags;
                        let tagLabelConfig = tagPageData.labels;
                        let tagLabelFlag = false;
                        for (let label of tagLabelConfig) {
                            let tagLabel = tagLabelGraphql.filter(item => label === item.name);
                            if (tagLabel.length > 0) {
                                cy.get(selectors['grid']).eq(i).find(selectors['tag_label']).should('have.text', tagLabel[0].name);
                                tagLabelFlag = true;
                                if (tagPageData.tag.results[i].__typename === 'Gallery') {
                                    cy.get(selectors['grid']).eq(i).find(selectors['image_icon']).should('exist');
                                }
                                break;
                            }
                        }
                        if (!tagLabelFlag) {
                            cy.get(selectors['grid']).eq(i).find(selectors['tag_label']).should('not.exist');
                        }
                    }
                    else if (tagPageData.tag.results[i].__typename === 'Gallery') {
                        cy.get(selectors['grid']).eq(i).find(selectors['image_icon']).should('exist');
                    }
                    else {
                        cy.get(selectors['grid']).eq(i).find(selectors['tag_label']).should('not.exist');
                    }
                }
            }
        }
        else {
            cy.get(selectors['filter_message']).should('be.visible');
            cy.get(selectors['filter_message']).should('have.text', tagPageData.filterErrorText);
        }
        // Verify Total Results
        if (tagPageData.tag.totalResults || tagPageData.tag.totalResults === 0) {
            cy.get(selectors['total_count']).should('have.text', tagPageData.tag.totalResults + " items");
        }
        else {
            cy.get(selectors['total_count']).should('not.exist');
        }
        // Verify Pagination
        if (tagPageData.brand === "bon-appetit") {
            cy.validateTagPageBundleContentOnNextPage(tagPageData);
        }
    }
    else {
        let count = tagPageData.results.length;
        for (let i = 0; i < count; i++) {
            let hedText = tagPageData.results[i].promoHed ? tagPageData.results[i].promoHed : tagPageData.results[i].hed;
            let rubric = tagPageData.results[i].rubric
            let rubricSelector = Cypress.$("[class *='SummaryItemWrapper'] [class*='SummaryItemRubricWrapper']").eq(i).children(bundleSelectors.children.rubric);
            // validate hed, hed hyprelink, rubric and image
            cy.get(tagSelector.profilePage.profileDisplayed).eq(i).find(bundleSelectors.children.hed).eq(0).then(($element) =>{
                expect(utils.normaliseText(hedText)).to.eql(utils.normaliseText($element.text()))
                cy.get(bundleSelectors.children.summaryItemImage).eq(0).should('be.visible')
                cy.get(bundleSelectors.children.hedUrl).eq(i).then(($el) =>{
                    cy.validateUrl(bundleSelectors.children.hedUrl, $el.prop('href'))
                })
                if(rubricSelector.length > 0)
                cy.get(tagSelector.profilePage.profileDisplayed).eq(i).find(bundleSelectors.children.rubric).eq(0).then(($element)=>{
                    expect(utils.normaliseText(rubric)).to.eql(utils.normaliseText($element.text()))
                })
            })
        }
    }
})

//Clear All Filters
Cypress.Commands.add('clearFilters', () => {
    cy.get(selectors['clear_filters_linkText']).click({ force: true });
    cy.wait(2000);
    cy.get(selectors['page_load_skeleton']).should('not.exist');
    cy.get(selectors['filter_label']).should('not.exist');
    cy.get(selectors['clear_filters_linkText']).should('not.exist');
})

//Verify Url slug
Cypress.Commands.add('verifyUrlSlug', (urlSlug) => {
    cy.url().should('include', urlSlug.filter);
    cy.url().should('include', urlSlug.sortBy);
    cy.url().should('include', urlSlug.linkSlug);
    cy.url().should('not.include', urlSlug.notIncludeComma);
    cy.url().should('not.include', urlSlug.notIncludeSpace);
})

//Navigate to next page and validate bundle and filter data
Cypress.Commands.add('validateTagPageBundleContentOnNextPage', (tagPageData, navigateToNextPage = false) => {
    let pageCount = Math.ceil(tagPageData.tag.totalResults / tagPageData.pageLimit);
    if (tagPageData.tag.totalResults > tagPageData.pageLimit) {
        if (tagPageData.pageNumber === 1) {
            cy.get(selectors['pagination_button_previous']).should('have.text', "Previous");
            cy.get(selectors['pagination_button_previous']).should('not.have.attr', 'href');
            cy.get(selectors['pagination_button_next']).should('have.text', "Next");
            cy.get(selectors['pagination_button_next']).should('have.attr', 'href');
            cy.get(selectors['page_summary']).should('have.text', "1 of " + pageCount);
        }
        else if (tagPageData.pageNumber === 2 && navigateToNextPage) {
            cy.get(selectors['pagination_button_next']).click({ force: true });
            cy.get(selectors['pagination_button_next']).eq(0).should('have.text', "Previous");
            cy.get(selectors['pagination_button_next']).eq(0).should('have.attr', 'href');
            if (tagPageData.tag.totalResults <= ((tagPageData.pageLimit) * 2)) {
                cy.get(selectors['pagination_button_previous']).should('have.text', "Next");
            }
            else {
                cy.get(selectors['pagination_button_next']).eq(1).should('have.text', "Next");
                cy.get(selectors['pagination_button_next']).eq(1).should('have.attr', 'href');
            }
            cy.get(selectors['page_summary']).should('have.text', "2 of " + pageCount);
            cy.validateTagBundleContent(tagPageData);
        }
        else {
            if (!(tagPageData.pageNumber === 2 && !navigateToNextPage)) {
                throw new Error("Pagination Error in Tag Page");
            }
        }
    }
    else {
        cy.get(selectors['pagination_button_previous']).should('not.exist');
        cy.get(selectors['pagination_button_next']).should('not.exist');
    }
})

//Remove individual filter from filter labels
Cypress.Commands.add('removeFilter', (removeFilterValue) => {
    cy.get(selectors['filter_label']).contains(removeFilterValue).find(selectors['remove_filter']).click({ force: true });
    cy.wait(2000);
    cy.get(selectors['page_load_skeleton']).should('not.exist');
})

//Remove individual filter from filter dropdown
Cypress.Commands.add('removeFilterFromDropdown', (filterName, removeFilterValue) => {
    let filtersCount = Cypress.$(selectors['filter_container']).find(selectors['dropdown_value']);
    for (let i = 0; i < filtersCount.length; i++) {
        cy.get(selectors['filter_container']).find(selectors['dropdown_value']).eq(i).then(($el) => {
            if ($el.text() === filterName) {
                cy.get(selectors['filter_container']).find(selectors['dropdown_control']).eq(i).click({ force: true });
                cy.get(selectors['filter_container']).find(selectors['dropdown_list']).should('be.visible');
                cy.get(selectors['filter_container']).find(selectors['dropdown_list']).each(($value) => {
                    if ($value.text() === removeFilterValue) {
                        cy.wrap($value).click({ force: true });
                        cy.wait(2000);
                        cy.get(selectors['page_load_skeleton']).should('not.exist');
                    }
                })
                cy.get(selectors['filter_container']).find(selectors['dropdown_control']).eq(i).click({ force: true });
                cy.get(selectors['filter_container']).find(selectors['dropdown_list']).should('not.exist');
            }
        })
    }
})

Cypress.Commands.add('validateVogueTagBundleData', (tagPageData) => {
    let itemsLength = tagPageData.tag.results.length;
    for (let i = 0; i < itemsLength; i++) {
        cy.get(bundleSelectors.children.hed).eq(i).then(($el) => {
            let apiHed = tagPageData.tag.results[i].promoHed ? tagPageData.tag.results[i].promoHed : tagPageData.tag.results[i].hed
            expect(utils.normaliseText($el.text())).to.eq(utils.normaliseText(apiHed))
        })
        cy.get(bundleSelectors.children.rubric).eq(i).then(($el) => {
            let apiRubric = tagPageData.tag.results[i].rubric ? tagPageData.tag.results[i].rubric : tagPageData.tag.results[i].sections[0].name;
            expect(utils.normaliseText($el.text())).to.eq(utils.normaliseText(apiRubric))
        })
        let authorName = tagPageData.tag.results[i].allContributors.edges[0] ? tagPageData.tag.results[i].allContributors.edges[0].node.name : undefined;
        let photographerName = tagPageData.tag.results[i].allContributors.edges[1] ? tagPageData.tag.results[i].allContributors.edges[1].node.name : undefined;
        let index = i;
        if (authorName !== undefined) {
            cy.get(bundleSelectors.children.byLine + '> div').eq(index).then(($el) => {
                let byline1 = $el.text().replace('By', '')
                expect(utils.normaliseText(byline1)).to.include(utils.normaliseText(authorName))
                if (photographerName !== undefined) {
                    expect(utils.normaliseText(byline1)).to.include(utils.normaliseText(photographerName))
                }
            })
        }
    }
})
