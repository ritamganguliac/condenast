import { strings, selectors, instructions } from '../../test-data/quiz/test-data.js';
import * as dataHelper from '../../helper/quiz-tny/contentDataHelper.js'
const { format } = require('date-fns');
import { clues } from '../../test-data/quiz/score-title.js'
let clueLength = 6;
let inputText = '';
let validInputItems = []
let clueScoreValue;
let quizLowRankersData = {}
//Validating the IntroPage with valid text and Datetime
Cypress.Commands.add('validateQuizPageTitle', (quizWorkflow) => {
    cy.get(selectors.QuizIntroPage.quiz_Intro).should('be.visible')
    if (Cypress.$(selectors.QuizIntroPage.quiz_paywall_close).length > 0) {
        cy.get(selectors.QuizIntroPage.quiz_paywall_close).should('be.visible');
        cy.get(selectors.QuizIntroPage.quiz_paywall_close).click();
    }
    cy.textEquals(selectors.QuizIntroPage.quiz_Intro_dek, 0, strings.txtQuizIntroDek);
    cy.get(selectors.QuizIntroPage.quiz_Intro_Date).invoke('text').should('exist')
    cy.textEquals(selectors.QuizIntroPage.quiz_Intro_rubric, 0, strings.txtQuizIntroRubric);
    cy.get(selectors.QuizIntroPage.quiz_Intro_Byline).invoke('text').should('exist')
    cy.textEquals(selectors.QuizIntroPage.quiz_Button_start, 0, strings.txtPlayButton);
    cy.textEquals(selectors.QuizIntroPage.quiz_header_Learn_To_Play, 0, strings.txtHeaderInstructions);
    cy.get(selectors.QuizIntroPage.quiz_header_Learn_To_Play).click({ force: true });
    cy.get(selectors.QuizInstructionsPage.quiz_instructions_close).click()
})
//Validate the Quiz Instructions displayed
Cypress.Commands.add('validateQuizPageInstructions', () => {
    cy.textEquals(selectors.QuizInstructionsPage.quiz_instructions_header, 0, instructions.txtQuizInstructionHeader)
    cy.textEquals(selectors.QuizInstructionsPage.quiz_Instructions_Description, 0, instructions.txtQuizInstructionDescription)
    for (let i = 0; i < instructions.txtQuizInstructions.length; i++) {
        cy.textEquals(selectors.QuizInstructionsPage.quiz_Instructions_content, i, instructions.txtQuizInstructions[i])
    }
    if (Cypress.$(selectors.QuizIntroPage.quiz_paywall_close).length > 0) {
        cy.get(selectors.QuizIntroPage.quiz_paywall_close).should('be.visible');
        cy.get(selectors.QuizIntroPage.quiz_paywall_close).click();
    }
})
//Validating the clue title and Clue text displayed 
//Validating the quiz point displayed for every clue forwarding 
Cypress.Commands.add('validateQuizPageClueScreen', (quizWorkflow) => {
    cy.get(selectors.QuizIntroPage.quiz_Button_start).click({ force: true });
    cy.textEquals(selectors.QuizClueScreen.quiz_Previous_Clue_Text, 0, strings.txtPreviousClue)
    cy.textEquals(selectors.QuizClueScreen.quiz_Next_Clue_Text, 0, strings.txtNextClue)
    cy.get(selectors.QuizClueScreen.quiz_howtoplay_ClueScreen).click({ force: true });
    cy.validateQuizPageInstructions();
    cy.get(selectors.QuizClueScreen.quiz_back_to_play).click({ force: true });
    if (Cypress.$(selectors.QuizIntroPage.quiz_paywall_close).length > 0) {
        cy.wait(1000)
        cy.get(selectors.QuizIntroPage.quiz_paywall_close).should('be.visible');
        cy.get(selectors.QuizIntroPage.quiz_paywall_close).click();
    }
    cy.validateClueArrow(clueLength);
    for (let i = 0; i < clueLength; i++) {
        cy.get(selectors.QuizClueScreen.quiz_clue_title).should('have.text', "CLUE" + " " + (clueLength - i))
        cy.textEquals(selectors.QuizClueScreen.quiz_clue_text, 0, quizWorkflow.questions[0].clues[i].text)
        if ((clueLength - i) === 1) {
            cy.wait(1000)
            cy.get(selectors.QuizClueScreen.quiz_btn_answer).should('have.text', "Answer for" + " " + (clueLength - i) + " " + "point")
            return
        }
        else ((clueLength - i) !== 1)
        {
            cy.get(selectors.QuizClueScreen.quiz_btn_answer).should('have.text', "Answer for" + " " + (clueLength - i) + " " + "points")
            cy.get(selectors.QuizClueScreen.quiz_btn_next_clue).click({ force: true });
            cy.get(selectors.QuizClueScreen.quiz_point).should('be.visible')
        }
    }
})
//Validating Prev and Next Clue Arrow Enable and Disable based on Clue Value
Cypress.Commands.add('validateClueArrow', (clueLength) => {
    if (clueLength == 6) {
        cy.get(selectors.QuizClueScreen.quiz_btn_prev_clue).should('be.disabled')
        cy.get(selectors.QuizClueScreen.quiz_btn_next_clue).should('be.enabled')
    }
    else if (clueLength == 1) {
        cy.get(selectors.QuizClueScreen.quiz_btn_next_clue).should('be.disabled')
        cy.get(selectors.QuizClueScreen.quiz_btn_prev_clue).should('be.enabled')
    }
})
//Validate the Count Down Screen with images, texts and urls
Cypress.Commands.add('validateCountDownScreen', (quizWorkflow) => {
    cy.textEquals(selectors.QuizCountDownScreen.quiz_countdown_header, 0, strings.txtGetReady)
    cy.wait(1000)
    cy.textEquals(selectors.QuizCountDownScreen.quiz_countdownText, 0, strings.firstCountDownImageCaption)
    cy.get(selectors.QuizCountDownScreen.quiz_countdown_loader).invoke('attr', 'src').then((imgSrcUrl) => {
        cy.validateUrl(quizWorkflow, imgSrcUrl)
    })
    cy.textEquals(selectors.QuizCountDownScreen.quiz_countdown_rubric_headtext, 0, strings.secondCountDownImageCaption)
    cy.get(selectors.QuizCountDownScreen.quiz_countdown_rubric).invoke('attr', 'src').then((imgSrcUrl) => {
        cy.validateUrl(quizWorkflow, imgSrcUrl)
    })
    cy.textEquals(selectors.QuizCountDownScreen.quiz_countdown_page_drivertext, 0, strings.thirdCountDownImageCaption)
    cy.get(selectors.QuizCountDownScreen.quiz_countdown_page_driver).invoke('attr', 'src').then((imgSrcUrl) => {
        cy.validateUrl(quizWorkflow, imgSrcUrl)
    })
})
//Validate the Answer screen with Valid Answer as Input.
//Validate the scoreTitle displayed in UI against the array values present in the score-title.js file
//Validate the drumroll and the score image url display
Cypress.Commands.add('validateAnswerScreen', (quizWorkflow, inputText) => {
    cy.validateQuizPageTitle(quizWorkflow);
    cy.get(selectors.QuizIntroPage.quiz_Button_start).click({ force: true });
    cy.validateCountDownScreen(quizWorkflow);
    cy.get(selectors.QuizClueScreen.quiz_btn_answer).click({ force: true });
    cy.get(selectors.QuizClueScreen.quiz_timer).should('be.visible')
    cy.textEquals(selectors.QuizClueScreen.quiz_answer_back_clue_text, 0, strings.txtBackToClues)
    cy.get(selectors.QuizClueScreen.quiz_answer_back_clues).click({ force: true });
    cy.get(selectors.QuizClueScreen.quiz_btn_answer).should('have.text', "Answer for" + " " + clueLength + " " + "points")
    cy.get(selectors.QuizClueScreen.quiz_btn_answer).click({ force: true });
    cy.get(selectors.QuizClueScreen.quiz_answer_text).should('be.empty');
    cy.get(selectors.QuizClueScreen.quiz_answer_submit).should('be.disabled');
    cy.get(selectors.QuizClueScreen.quiz_input_answer).type(inputText);
    cy.get(selectors.QuizClueScreen.quiz_answer_submit).click({ force: true });
})
//Validate the Highest Score Case for Allowed Input Answer 
Cypress.Commands.add('validateHighestScoreScenario', (quizWorkflow, quizData, articleData, quizScoreData) => {
    validInputItems = quizWorkflow.questions[0].answers.filter(item => item.allowed);
    inputText = validInputItems[0].text;
    clueScoreValue = clueLength;
    cy.validateAnswerScreen(quizWorkflow, inputText);
    dataHelper.getQuizLowRankersData(quizWorkflow.id, clueScoreValue).then((data) => {
        quizLowRankersData = data
        validatePercentageScore(quizScoreData, clueScoreValue, quizLowRankersData)
    })
})
//Validate the Lowest Score Case for Allowed Input Answer 
Cypress.Commands.add('validateLowestScoreScenario', (quizWorkflow, quizScoreData) => {
    validInputItems = quizWorkflow.questions[0].answers.filter(item => item.allowed);
    inputText = validInputItems[0].text;
    cy.get(selectors.QuizIntroPage.quiz_Button_start).click({ force: true });
    if (Cypress.$(selectors.QuizIntroPage.quiz_paywall_close).length > 0) {
        cy.get(selectors.QuizIntroPage.quiz_paywall_close).should('be.visible');
        cy.get(selectors.QuizIntroPage.quiz_paywall_close).click();
    }
    cy.validateCountDownScreen(quizWorkflow)
    for (let i = 0; i < clueLength - 3; i++) {
        cy.get(selectors.QuizClueScreen.quiz_btn_next_clue).click();
    }
    clueScoreValue = clueLength - 3;
    cy.get(selectors.QuizClueScreen.quiz_btn_answer).click({ force: true });
    cy.get(selectors.QuizClueScreen.quiz_input_answer).type(inputText);
    cy.get(selectors.QuizClueScreen.quiz_answer_submit).click({ force: true });
    dataHelper.getQuizLowRankersData(quizWorkflow.id, clueScoreValue).then((data) => {
        quizLowRankersData = data
        validatePercentageScore(quizScoreData, clueScoreValue, quizLowRankersData)
    })
})
//Validate scorePercentage whose Score is 6 and less than 6
export function validatePercentageScore(quizScoreData, clueScoreValue, quizLowRankersData) {
    let scoreUITitle;
    const TotalResultsCount = quizScoreData.data.getQuizScores.totalResults;
    //Fetch Total users who scoring less than 6
    const lowScorersCount = quizLowRankersData.data.getQuizScores.totalResults;
    // calculate the Score Percentage
    const scorePercent = Math.round(((lowScorersCount / TotalResultsCount) * 10) * 10);
    if (scorePercent >= 70) {
        if (clueScoreValue == 6) {
            cy.get(selectors.QuizResultScreen.quiz_score_caption).should('have.text', strings.perfect + " You scored" + " " + clueScoreValue + " " + "out of" + " " + clueLength + " " + "points.")

        }
        else {
            cy.get(selectors.QuizResultScreen.quiz_score_caption).should('have.text', strings.correct + " You scored" + " " + clueScoreValue + " " + "out of" + " " + clueLength + " " + "points.")

        }
        if (Cypress.$(selectors.QuizIntroPage.quiz_paywall_close).length > 0) {
            cy.get(selectors.QuizIntroPage.quiz_paywall_close).should('be.visible');
            cy.get(selectors.QuizIntroPage.quiz_paywall_close).click();
        }
        cy.wait(10000)
        cy.get(selectors.QuizResultScreen.quiz_score_image).should('be.visible')
        cy.get(selectors.QuizResultScreen.quiz_score_container).should('be.visible');
        //cy.get(selectors.QuizResultScreen.quiz_score_container_message).should('have.text', strings.txtScorePercentageMessage1)
        cy.get(selectors.QuizResultScreen.quiz_correct_answer).should('have.text', strings.correctAnswer + " " + validInputItems[0].text + '.').and('be.visible')
        //Compare scoretitle message from UI with graphql data
        cy.get(selectors.QuizResultScreen.quiz_score_title).invoke('text').then(($text) => {
            scoreUITitle = $text;
            for (let i = 0; i < clues.Clue6.length; i++) {
                var clueString = clues.Clue6[i]
                if (clueString.includes(scoreUITitle)) {
                    expect(clueString).to.eq(scoreUITitle)
                }
            }
        })
    }
    else {

        if (Cypress.$(selectors.QuizIntroPage.quiz_paywall_close).length > 0) {
            cy.get(selectors.QuizIntroPage.quiz_paywall_close).should('be.visible');
            cy.get(selectors.QuizIntroPage.quiz_paywall_close).click();
        }
        cy.wait(10000)
        cy.get(selectors.QuizResultScreen.quiz_score_image).scrollIntoView().should('be.visible')
        cy.get(selectors.QuizResultScreen.quiz_score_container).should('be.visible');
        cy.get(selectors.QuizResultScreen.quiz_score_container_message).invoke('text').should('exist')
        cy.get(selectors.QuizResultScreen.quiz_score_caption).should('have.text', strings.correct + " You scored" + " " + clueScoreValue + " " + "out of" + " " + clueLength + " " + "points.")
        cy.get(selectors.QuizResultScreen.quiz_correct_answer).should('have.text', strings.correctAnswer + " " + validInputItems[0].text + '.')
        //Compare scoretitle message from UI with graphql data
        cy.get(selectors.QuizResultScreen.quiz_score_title).invoke('text').then(($text) => {
            scoreUITitle = $text;
            for (let i = 0; i < clues.Clue3.length; i++) {
                var clueString = clues.Clue3[i]
                if (clueString.includes(scoreUITitle)) {
                    expect(clueString).to.eq(scoreUITitle)
                }
            }
        })
    }
}
//Validate the Answer Screen for Disallowed Input Answer 
Cypress.Commands.add('validateIncorrectAnswerScenario', (quizWorkflow, quizData, articleData) => {
    inputText = 'textValue'; //This is dummy value set to make the incorrect check as there is possibility of having 0 disallowed answer as false.
    cy.validateAnswerScreen(quizWorkflow, inputText);
    cy.validateResultsScreen(quizWorkflow, quizData, articleData)
    cy.get(selectors.QuizResultScreen.quiz_score_caption).should('have.text', strings.incorrect + " You scored" + " " + 0 + " " + "out of" + " " + clueLength + " " + "points.")
    cy.get(selectors.QuizResultScreen.quiz_correct_answer).invoke('text').then(($correctAnswer) => {
        expect($correctAnswer).to.exist
    })
})
//Validate the Results screen with score image, random messages ,View Clue links,images,urls
Cypress.Commands.add('validateResultsScreen', (quizWorkflow, quizData, articleData) => {
    let recommendedLength = quizData.data.getQuiz.edges.length
    let recommended_links = Cypress.$(selectors.QuizResultScreen.quiz_recommended_links).length
    let errataText = quizWorkflow.errata;
    cy.get(selectors.QuizResultScreen.quiz_drumroll_text).should('have.text', strings.drumroll);
    cy.get(selectors.QuizResultScreen.quiz_drum_roll_image).invoke('attr', 'src').then((imgDrumSrcUrl) => {
        cy.validateUrl(quizWorkflow, imgDrumSrcUrl);
    })
    cy.wait(1000)
    cy.get(selectors.QuizResultScreen.quiz_score_image).invoke('attr', 'src').then((imgScoreSrcUrl) => {
        cy.validateUrl(quizWorkflow, imgScoreSrcUrl);
    })
    //Validate PlayPrevious Quiz
    cy.get(selectors.QuizResultScreen.quiz_play_another_button).should('exist');
    cy.get(selectors.QuizResultScreen.quiz_play_another_button).invoke('text').should('not.be.empty')
    cy.get(selectors.QuizResultScreen.quiz_play_another_button).invoke('attr', 'data-href').then((url) => {
        cy.validateUrl(quizWorkflow, url)
    })
    //Validate the errataText
    let errataUIText = Cypress.$(selectors.QuizResultScreen.quiz_errata_test) // This will not be always available.
    if (errataUIText.length > 0 && (errataText !== null && errataText !== '')) {
        cy.textEquals(selectors.QuizResultScreen.quiz_errata_test, 0, errataText)
    }
    //Validate the ViewClues section
    cy.textEquals(selectors.QuizResultScreen.quiz_View_Clues, 0, strings.txtViewClues);
    cy.get(selectors.QuizResultScreen.quiz_View_Clues).click()
    for (let i = 0; i < clueLength; i++) {
        cy.textEquals(selectors.QuizResultScreen.quiz_clue_list_title, i, "CLUE" + " " + (clueLength - i))
        cy.textEquals(selectors.QuizResultScreen.quiz_clue_list_text, i, quizWorkflow.questions[0].clues[i].text)
    }
    cy.get(selectors.QuizInstructionsPage.quiz_instructions_close).click()
    cy.validateArticle(articleData)
    //Validate Another Round section with recommended urls.
    if (Cypress.$(selectors.QuizResultScreen.quiz_recommendation_title).length > 0) {
        cy.textEquals(selectors.QuizResultScreen.quiz_recommendation_title, 0, strings.txtAnotherRound)
    }
    cy.get(selectors.QuizResultScreen.quiz_recommendation_description).scrollIntoView().should('be.visible');
    cy.textEquals(selectors.QuizResultScreen.quiz_recommendation_Nl_link, 0, strings.txtNewsletter)
    cy.get(selectors.QuizResultScreen.quiz_recommendation_Nl_link).invoke('attr', 'data-href').then((url) => {
        cy.validateUrl(quizWorkflow, url)
    })
    //Validation of recommended quizzes display status 200OK
    if (recommended_links > 0) {
        for (let i = 0; i < recommendedLength - 1; i++) {
            cy.get(selectors.QuizResultScreen.quiz_recommended_links).eq(i).invoke('attr', 'data-href').then((url) => {
                expect(url, quizData.data.getQuiz.edges[i + 1].node.relatedLink)
                cy.validateUrl(quizWorkflow, url)
            })
        }
    }
})
//Validate Article Data
Cypress.Commands.add('validateArticle', (articleData) => {
    let promoDek = articleData.data.getArticle.promoDek
    let promoHed = articleData.data.getArticle.promoHed
    let dek = articleData.data.getArticle.dek
    let hed = articleData.data.getArticle.hed
    let headline = promoHed ? promoHed : hed;
    let subHeadline = promoDek ? promoDek : dek;
    cy.textEquals(selectors.QuizArticle.quiz_article_tny_text, 0, strings.txtArticleText)
    //Validate article link
    cy.get(selectors.QuizArticle.quiz_article_tny).invoke('attr', 'data-href').then((Url) => {
        cy.validateUrl(articleData, Url);
    })
    //Validate article image
    cy.get(selectors.QuizArticle.quiz_article_image).invoke('attr', 'src').then((imgSrcUrl) => {
        cy.validateUrl(articleData, imgSrcUrl);
    })
    if (Cypress.$(selectors.QuizIntroPage.quiz_paywall_close).length > 0) {
        cy.get(selectors.QuizIntroPage.quiz_paywall_close).should('be.visible');
        cy.get(selectors.QuizIntroPage.quiz_paywall_close).click();
    }

    cy.textEquals(selectors.QuizArticle.quiz_article_rubric, 0, articleData.data.getArticle.channel.hierarchy[0].name)
    cy.textEquals(selectors.QuizArticle.quiz_article_tny_byline, 0, "By" + " " + articleData.data.getArticle.allContributors.edges[0].node.name)
    cy.textEquals(selectors.QuizArticle.quiz_article_tny_hed, 0, headline)
    cy.textEquals(selectors.QuizArticle.quiz_article_tny_dek, 0, subHeadline)
    cy.get(selectors.QuizArticle.quiz_article_pubDate).invoke('text').should('exist')
})
