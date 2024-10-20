import { error } from 'jquery';

const { environments } = require('../../test-data/quiz/test-data.js');
let gqlQuery = require('../../test-data/quiz/quiz-data.js');
//Fetch Quiz Data
export function getQuizData(quizData) {
    gqlQuery.quizQuery.variables.queryFilters.id = quizData.id;
    return cy.queryGraphQL(gqlQuery.quizQuery).then((response) => {
        quizData = response.body;
        return quizData
    })
}

//Fetch article data
export function getArticleData(articleData) {
    gqlQuery.articleQuery.variables.uri = articleData.uri.replace(/^.*\/\/[^\/]+/, '').substring(1);
    return cy.queryGraphQL(gqlQuery.articleQuery).then((response) => {
        articleData = response.body;
        return articleData
    })
}

//Fetch Quiz Score data
export function getQuizTotalScoreData(quizId) {
    gqlQuery.totalScoreResultsQuery.variables.queryFilters.filter.quizId.eq = quizId;
    return cy.queryGraphQL(gqlQuery.totalScoreResultsQuery).then((response) => {
        return response.body;
    })
}

//Fetch User Quiz Score Percentage data
export function getQuizLowRankersData(quizId, clueScoreValue) {
    gqlQuery.lowRankersQuery.variables.queryFilters.filter.quizId.eq = quizId;
    gqlQuery.lowRankersQuery.variables.queryFilters.filter.score.lt = clueScoreValue;
    return cy.queryGraphQL(gqlQuery.lowRankersQuery).then((response) => {
        return response.body;
    })
}
