
export function validateHubPage(workFlowData) {
    cy.validateHubPage(workFlowData)
}

export function validateSubscription(workFlowData) {
    cy.validateSubscription(workFlowData)
}

export function validatePreviewLinks(workFlowData){
    cy.validatePreviewLinks(workFlowData)
}

export function validateUserSubscriptions(workFlowData){
    cy.validateSubscribePopup()
    cy.validateUserProfile(workFlowData)
}

export function validateSignUpLinkHubPage(workFlowData) {
    cy.validateSignUpLinkHubPage(workFlowData)
}
