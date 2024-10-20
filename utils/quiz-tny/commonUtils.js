import { environments } from '../../test-data/quiz/test-data.js';
export function getQuizPageUrl() {
    return environments[Cypress.env('environment')]['quizPage'];
}
