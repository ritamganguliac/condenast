import * as utils from '../../utils/quiz-tny/commonUtils.js'
const env = Cypress.env('environment');
Cypress.Commands.add('navigateQuiz', (queryParams = '') => {
    if (env === 'staging' || env === 'production')
        queryParams = ''
    const baseUrl = utils.getQuizPageUrl();
    cy.visit(`${baseUrl}`);
    return this;
});
