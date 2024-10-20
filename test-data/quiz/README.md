# TNY Quiz App

# CMS
Quiz currently uses google sheets as a cms for managing data. Refer below sheet for valid quiz ids for development.

[Development sheet](https://docs.google.com/spreadsheets/d/1QS3GQ-SqWJYJrty1bEF3Xqz5BGlEtJDty5RQYdm6v_8)

# TNY development
 [Architectural Doc](https://docs.google.com/document/d/13axcuMU9gjBaRTETwzdyCRrvl5F7VCxCU1dwOfTThFM)

# Quiz Cypress Test Suite
- [Cypress tests](https://github.com/CondeNast/cypress-automation/tree/main/components/quiz)

# Quiz test Plan
All the test coverage are available in the below link for Quiz Testing. 
Note : Timer timeout scenario is not covered via automation but verified manually.
-[Quiz Test Plan](https://docs.google.com/spreadsheets/d/1XSMDdGD7Di9yznyD_GbO28zBU6-5FnSBdeMd0Vq20l0/edit#gid=0)

# Quiz Repo
[Quiz Repo link](https://github.com/CondeNast/tny-quiz-app)

# Quiz Instances
Quiz Staging
-  [Quiz server](https://tny-quiz-stag.newyorker.com/quiz/3683adf2-5d3d-4894-a9c9-27cc7cfa4025)
-  [Verso article shell](https://stg.newyorker.com/puzzles-and-games-dept/name-drop/2021/06/05)

Quiz Production
- [Verso article shell](https://www.newyorker.com/puzzles-and-games-dept/name-drop/latest)

# Quiz Figma
- [Figma](https://www.figma.com/file/aVhpoCCLtk4LWnYPjOYtKR/The-New-Yorker-Quiz---MVP?node-id=1084%3A0)


## Install npm
Set up NPM if you haven't already
```
https://www.npmjs.com/get-npm
```

## Install Cypress
```
npm install -g cypress
```

## Clone the repo and install node modules
```
$ git@github.com:CondeNast/cypress-automation.git
$ npm i
```

## Running Test from command line:
```
npx cypress run --browser=chrome --config specPattern=test-suites/quiz

```

## Running Test from cypress test runner:
```
npx cypress open

Select the quiz test spec file from the cypress test runner

```

# CI
-[drone-CI](https://drone.conde.io/CondeNast/cypress-automation)
-[Sorry-Cypress](http://10.90.48.97:8080/cypress-automation-tests/runs)
-[staging](https://github.com/CondeNast/cypress-automation/tree/main-quiz-staging)
-[production](https://github.com/CondeNast/cypress-automation/tree/main-quiz-production)

```