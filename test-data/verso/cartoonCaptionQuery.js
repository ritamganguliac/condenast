export const cartoonCaptionQuery = {

  query: `query Cartoons($contestStages: [ContestStage]) {
  cartoons(contestStages: $contestStages) {
    id
    altText
    aspectRatios {
      master {
        duration
        format
        height
        url
        width
      }
    }
    caption
    credit
    notes
    cropMode
    filename
    issueDate
    contestSubmissionEndDate
    announceFinalistsDate
    announceFinalistsIssueDate
    votingEndDate
    restrictCropping
    socialDescription
    socialTitle
    title
    contestStage
    contestFinalists {
      id
      text
      rating
      isDeleted
      userId
      contestId
      createdDate
      lastUpdated
      account
      isInstagram
      userInfo
      user {
        id
        email
        firstName
        lastName
        address {
          address
          city
          country
          state
          zipCode
        }
        phoneNumber
      }
      finalistId
      isWinner
    }
  }
}`,
  variables: {
    "contestStages": ""
  }
}
