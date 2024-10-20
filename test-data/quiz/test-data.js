export const environments = {
    //This staging url is temporary as once its merged to production url will be modified
    production: {
        "quizPage": "https://www.newyorker.com/puzzles-and-games-dept/name-drop/latest",
        "brand": "The New Yorker",
        "orgId": "4gKgcFDnpSvUqozcC7TYUEcCiDJv"
    },
    staging: {
        "quizPage": "https://stg.newyorker.com/puzzles-and-games-dept/name-drop/2021/06/05",
        "brand": "The New Yorker",
        "orgId": "4gKgcEy9SqS1hhu8DJ37D8GnRNuV"
    }
}

export const strings = {
    txtQuizIntroDek: "The fewer clues you need, the more points you receive.",
    txtQuizIntroRubric: "PUZZLES & GAMES DEPT.",
    txtPlayButton: "Play quiz",
    txtHeaderInstructions: "Learn how to play »",
    txtPreviousClue: "Previous clue",
    txtNextClue: "Next clue",
    drumroll: 'Drumroll, please . . . ',
    timesup: 'Time’s up',
    incorrect: 'Incorrect.',
    perfect: 'Perfect.',
    correct: 'Correct.',
    correctAnswer: 'The correct answer is',
    txtViewClues: 'View clues »',
    txtAnotherRound: 'Another round?',
    txtGetReady: 'Get ready . . . ',
    firstCountDownImageCaption: '100 seconds',
    secondCountDownImageCaption: '6 clues',
    thirdCountDownImageCaption: '1 answer',
    txtBackToClues: 'Back to clues',
    txtNewsletter: 'Sign up for newsletter »',
    txtArticleText: "As seen in <em>The New Yorker</em>",
    txtScorePercentageMessage1: "That puts you in the top 10% of players so far.",
    txtScorePercentageMessage2: "That’s higher than <percentage> of players so far."
}

export const selectors = {
    QuizIntroPage: {
        quiz_Intro: "svg.quiz-intro__logo",
        quiz_Intro_dek: ".quiz-intro__dek",
        quiz_Intro_rubric: ".quiz-intro__rubric",
        quiz_Intro_Byline: ".quiz-intro__byline",
        quiz_Intro_Date: ".quiz-intro__date-lg",
        quiz_Intro_day: ".quiz-intro__date-day",
        quiz_Button_start: ".quiz-intro__btn-start",
        quiz_header_Learn_To_Play: "button.quiz-header-howtoplay-instructions",
        quiz_paywall_close: "[class*='PaywallBarChevronButton']",
        quiz_paywall_collapsed: ".paywall-bar__collapsed #paywall-bar__caret"
    },
    QuizCountDownScreen: {
        quiz_countdown_header: ".quiz-countdown-header",
        quiz_countdown_loader: ".quiz-countdown-loader--wrapper-stuck-in-the-matrix > .quiz-countdown-loader--image-placeholder > picture.quiz-countdown-loader--image > img",
        quiz_countdownText: ".quiz-countdown-loader--wrapper-stuck-in-the-matrix > .quiz-countdown-loader--text",
        quiz_countdown_rubric: ".quiz-countdown-loader--wrapper-rubric-head > .quiz-countdown-loader--image-placeholder > .quiz-countdown-loader--image > img",
        quiz_countdown_rubric_headtext: ".quiz-countdown-loader--wrapper-rubric-head > .quiz-countdown-loader--text",
        quiz_countdown_page_driver: ".quiz-countdown-loader--wrapper-page-diver > .quiz-countdown-loader--image-placeholder > .quiz-countdown-loader--image > img",
        quiz_countdown_page_drivertext: ".quiz-countdown-loader--wrapper-page-diver > .quiz-countdown-loader--text"
    },
    QuizInstructionsPage: {
        quiz_instructions_header: ".quiz-instructions__content--hed",
        quiz_Instructions_Description: ".quiz-instructions__content--description",
        quiz_Instructions_content: ".quiz-instructions__content--list > li",
        quiz_instructions_close: ".quiz-header-howtoplay-close"
    },
    QuizClueScreen: {
        quiz_Previous_Clue_Text: "button > span.quiz-body___content-btn-prev-clue-text",
        quiz_Next_Clue_Text: "button > span.quiz-body___content-btn-next-clue-text",
        quiz_howtoplay_ClueScreen: ".quiz-header-howtoplay-button",
        quiz_back_to_play: ".quiz-instructions__content--button",
        quiz_clue_title: "div.quiz-clues_current[aria-hidden='false'] > h2.quiz-clue-title",
        quiz_clue_text: "div.quiz-clues_current[aria-hidden='false'] > .quiz-clue-text",
        quiz_btn_prev_clue: ".quiz-body__content-btn-prev-clue",
        quiz_btn_next_clue: ".quiz-body__content-btn-next-clue",
        quiz_point: ".quiz-point",
        quiz_btn_answer: ".quiz-body__btn-answer",
        quiz_answer_submit: ".quiz-answer-submit--btn",
        quiz_answer_text: "input[placeholder='Enter your answer']",
        quiz_input_answer: ".quiz-answer__input-box",
        quiz_answer_back_clues: "div.quiz-answer-back > .quiz-answer-back--btn",
        quiz_answer_back_clue_text: "button > span.quiz-answer-back--btn-text",
        quiz_timer: "div.quiz-timer-counter >.quiz-timer__countdown"
    },
    QuizResultScreen: {
        quiz_drum_roll_image: ".quiz-drumroll--image > img",
        quiz_score_image: ".quiz-score--image > img",
        quiz_drumroll_text: ".quiz-drumroll",
        quiz_score_title: "div.quiz-score--wrapper > .quiz-score--title",
        quiz_score_caption: "div.quiz-score-container > .quiz-score-container--caption",
        quiz_score_container: "div.quiz-score-container",
        quiz_score_container_message: "div.quiz-score-container > .quiz-score-container--message",
        quiz_correct_answer: "div > span.quiz-article-ans--text",
        quiz_View_Clues: "div.quiz-article-ans > button.quiz-article-ans--clues",
        quiz_clue_list_title: ".clue-list-container > ul > li >div.quiz-clue > h2.quiz-clue-title",
        quiz_clue_list_text: ".clue-list-container > ul > li >div.quiz-clue > p.quiz-clue-text",
        quiz_recommendation_title: "div > .quiz-recommendation--title",
        quiz_recommendation_description: ".quiz-recommendation--nl-description",
        quiz_recommendation_Nl_link: "button.quiz-recommendation--nl-link",
        quiz_recommended_links: "ul.quiz-recommendation--list > li > button.quiz-recommendation--quiz",
        quiz_play_another_button: ".quiz-score--button",
        quiz_errata_test: ".quiz-article-errata"
    },
    QuizArticle: {
        quiz_article_tny: ".quiz-article__tny",
        quiz_article_tny_text: ".quiz-article__tny-text",
        quiz_article_rubric: ".quiz-article__tny-rubric",
        quiz_article_image: ".quiz-article__tny-image > img",
        quiz_article_tny_hed: ".quiz-article__tny-hed",
        quiz_article_tny_dek: ".quiz-article__tny-dek",
        quiz_article_tny_byline: ".quiz-article__tny-byline",
        quiz_article_pubDate: ".quiz-article__tny-publish--date"
    }
}

export const instructions = {
    txtQuizInstructionHeader: 'How To Play',
    txtQuizInstructionDescription: 'The goal of each game is to guess a notable name, using as few clues as possible.',
    txtQuizInstructions:
        [
            "You can request up to six clues to help you guess. The clues become easier as you go along.",
            "Every time you request another clue (by selecting “Next clue”), your score drops by a point. If you answer correctly on the first clue (labelled “Clue 6”), your score will be six points. If you answer correctly on the next clue (“Clue 5”), your score will be five points, and so on.",
            "You can review previous clues at any time without losing points.",
            "When you think you know the answer, select the Answer button and type it in. For people who have multiple names, go with the most well-known option. Either the full name or just the last name is acceptable.",
            "You only get one guess. Incorrect answers score zero points, so guess carefully.",
            "The game ends after a hundred seconds. If you run out of time, you score zero points, so keep an eye on the timer! "
        ]
}
