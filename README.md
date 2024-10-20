# Cypress Automation Tests
    Data-Driven E2E regression tests suite was built using a open source automation tool cypress for various products like verso and AMP.To explore more about cyrpess you can visit https://www.cypress.io/

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
npx cypress run --browser=chrome --config specPattern=test-suites/verso

Note : By modifying the values of specPattern , we can run different specFiles

```

## Running Test from cypress test runner:
```
npx cypress open

```
```
Select testing type as E2E testing and click on Configured option which inturn provides browser options to run
Select chrome browser and click on "Start E2E Testing in chrome" 
Select the necessary test spec file from the cypress test runner

```
# CI
- [Drone-CI](https://drone.conde.io/CondeNast/cypress-automation)
- [Sorry-Cypress](http://sorry-cypress.aws.conde.io:8080/cypress-automation-tests/runs)
- [Verso-Staging](https://github.com/CondeNast/cypress-automation/tree/main-verso-staging)
- [Verso-Production](https://github.com/CondeNast/cypress-automation/tree/main-verso-production)
- [Cypress-TestResults-slack](https://condenast.slack.com/archives/C024QJ8A97S)

```
```
# Verso Storybook Details
- [Verso-Storybook](http://verso-components.conde.io/)
- [verso-storybook-summeryItem](http://verso-components.conde.io/?path=/story/components-discovery-summaryitem--default)

```
```
# Quick Links

# Verso-Automation Coverage
  This document will be updated based on the automation coverage for the verso components for various brands
- [Verso-Automation Coverage](https://docs.google.com/spreadsheets/d/1GVFurmG9sGtpmKPe3ovs94HVFkG7s9LRujBctQ7dDpQ/edit#gid=636154196)


# Verso school:
https://cnissues.atlassian.net/wiki/spaces/CEX/pages/608994658/Verso+School


# Verso onboarding:
https://github.com/CondeNast/verso/blob/master/docs/onboarding.md


# Interfaces: Details about the migrated verso components.
https://interfaces.conde.io/


# Multiverso:
https://multiverso.conde.io/list#


# Copilot URLs 
https://copilot.condenast.io/
https://stg-copilot.condenast.io/
https://ci-copilot.condenast.io/


# Graphql URL
- [Graphql](https://graphql.condenast.io/graphql)

# Verso Configs 
- [Tenant Config Tool](https://verso-prod.conde.io/config/conde-nast-traveler)
- [BrandURLs-APIs](https://github.com/CondeNast/cypress-automation/blob/main/test-data/verso/url.json)


# Notes
- Ensure you are connected in US VPN before start running the tests
- [Framework Document](https://cnissues.atlassian.net/wiki/spaces/QUAL/pages/1442087523/End-to-End+Test+Automation+Suite+Data+Driven)
- [Get started with Verso](https://github.com/CondeNast/verso/blob/master/docs/onboarding.md)

```