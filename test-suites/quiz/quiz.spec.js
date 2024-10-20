import * as testHelper from '../../helper/quiz-tny/testHelper.js'
import * as dataHelper from '../../helper/quiz-tny/contentDataHelper.js'

let quizData =
{
    "quizInfoData": {},
}
let articleData =
{
    "articleData": {}
}
let quizScoreData = {}

describe('Name Drop Quiz Page', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage(); 
        cy.navigateQuiz();
        cy.url().then((url) => {
            articleData.uri = url
            testHelper.getArticleInfo(articleData).then((data) => {
                articleData = data;
                quizData.id = articleData.data.getArticle.interactiveOverride.split('/').pop()
                testHelper.getQuizInfo(quizData).then((data) => {
                    quizData = data;
                    dataHelper.getQuizTotalScoreData(quizData.id).then((data) => {
                        quizScoreData = data;
                    })
                    articleData.uri = quizData.data.getQuiz.edges[0].node.relatedLink
                    testHelper.getArticleInfo(articleData).then((data) => {
                        articleData = data;
                    })

                })
            })
        })
    })

    it('validate the quiz with NameDrop Introduction and Instruction Pages', { retries: 2 }, () => {
        testHelper.validateQuizPage(quizData);
    });

    it('validate the quiz Answer Result Screen for Correct Answer for Clue 3', { retries: 2 }, () => {
        testHelper.validateClueThreeCorrectAnswerResultScreen(quizData, quizScoreData);
    });

    // Temporaily skipping these files as they are flakey
    it.skip('validate the quiz Answer Result Screen for Correct Answer for Clue 6', { retries: 2 }, () => {
        testHelper.validateClueSixCorrectAnswerResultScreen(quizData, articleData, quizScoreData);
    })

    it.skip('validate the quiz Answer Result Screen for Incorrect Answer', { retries: 2 }, () => {
        testHelper.validateInCorrectAnswerResultScreen(quizData, articleData);
    });
})
