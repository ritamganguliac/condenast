import * as dataHelper from "./contentDataHelper";

export function validateQuizPage(quizData) {
    var quizWorkflow = quizData.data.getQuiz.edges[0].node
    cy.validateQuizPageTitle(quizWorkflow);
    cy.validateQuizPageInstructions();
    cy.validateQuizPageClueScreen(quizWorkflow);
}

//Fetching quiz Data from graphql
export function getQuizInfo(quizData) {
    return dataHelper.getQuizData(quizData).then((data) => {
        quizData = data;
        return quizData;
    })
}

export function getArticleInfo(articleData) {
    return dataHelper.getArticleData(articleData).then((data) => {
        articleData = data;
        return articleData;
    })
}

export function validateClueSixCorrectAnswerResultScreen(quizData, articleData, quizScoreData) {
    var quizWorkflow = quizData.data.getQuiz.edges[0].node
    cy.validateHighestScoreScenario(quizWorkflow, quizData, articleData, quizScoreData);
}

export function validateClueThreeCorrectAnswerResultScreen(quizData, quizScoreData) {
    var quizWorkflow = quizData.data.getQuiz.edges[0].node
    cy.validateLowestScoreScenario(quizWorkflow, quizScoreData);
}

export function validateInCorrectAnswerResultScreen(quizData, articleData) {
    var quizWorkflow = quizData.data.getQuiz.edges[0].node
    cy.validateIncorrectAnswerScenario(quizWorkflow, quizData, articleData);
}
