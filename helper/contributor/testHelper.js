import * as utils from "../../utils/commonUtils";
import * as dataHelper from "../../helper/contributor/contentDataHelper";

export function validateContentHeader(workFlowData) {
    cy.validateContentHeader(workFlowData);
}

export function validateAllFiction(workFlowData) {
    cy.validateAllFiction(workFlowData)
}

export function validateNewYorkerPodcast(workFlowData) {
    cy.validateNewYorkerPodcast(workFlowData)
}

export function validateAboutAuthor(workFlowData) {
    cy.validateAboutAuthor(workFlowData)
}

export function validateMoreByAuthor(workFlowData) {
    cy.validateMoreByAuthor(workFlowData)
}

export function getcontributorData(workFlowData, UrlIndex) {
    cy.visit(utils.getPageUrl(workFlowData.brand, workFlowData.page, UrlIndex), { retryOnStatusCodeFailure: true});
    workFlowData.pageUri = utils.getPageUri(workFlowData.brand, workFlowData.page, UrlIndex);
    return dataHelper.getContributorInfo(workFlowData).then((data) => {
        workFlowData = data;
        return workFlowData;
    })
}


export function getcontributorContentData(workFlowData, UrlIndex) {
    cy.visit(utils.getPageUrl(workFlowData.brand, workFlowData.page, UrlIndex), { retryOnStatusCodeFailure: true});
    workFlowData.pageUri = utils.getPageUri(workFlowData.brand, workFlowData.page, UrlIndex);
    return dataHelper.getContributorContentInfo(workFlowData).then((data) => {
        workFlowData.contributorContentData = data;
        return workFlowData.contributorContentData;
    })
}

export function validateContributorPageHeader(workFlowData){
    cy.validateContributorPageHeader(workFlowData)
}

export function validateContributorPageContent(workFlowData){
    cy.validateContributorPageContent(workFlowData)
}
