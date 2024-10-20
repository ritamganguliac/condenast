export const quizQuery = {
    query: `query($queryFilters: GetQuizInput!) {
  getQuiz(input: $queryFilters) {
    edges {
      node {
        id
        organizationId
        title
        pubDate
        byline
        questions {
          text
          answers {
            text
            allowed
          }
          clues {
            text
            sequence
          }
        }
        relatedLink
      }
    }
  }
}`,
    variables: {
        "queryFilters": {
            "organizationId": "4gKgcFDnpSvUqozcC7TYUEcCiDJv",
            "id":" "
        }
    }
}

export const articleQuery = {
    query: `query ($orgId: ID!, $uri: String) {
  getArticle(
    organizationId:$orgId
    uri: $uri
  ) {
    hed
    dek
    promoHed
    promoDek
    pubDate
    channel {
      hierarchy {
        name
        slug
      }
    }
    interactiveOverride
    allContributors(types: [AUTHOR]) {
      edges {
        node {
          ... on Contributor {
            name
          }
        }
      }
    }
    lede {
      id
      ... on Photo {
        id
        altText
        filename
      }
    }
    tout {
      id
      ... on Photo {
        id
        altText
        filename
      }
    }
  }
}`,
    variables: {
        "orgId": "4gKgcFDnpSvUqozcC7TYUEcCiDJv",
        "uri": "magazine/2016/04/04/aretha-franklins-american-soul"
    }
}

export const totalScoreResultsQuery = {
    query: `query($queryFilters: GetQuizScoresInput!) {\n  getQuizScores(input: $queryFilters\n  ) {\n    totalResults\n    edges {\n      node {\n        score\n      }\n    }\n  }\n}`,
    variables: {
        "queryFilters": {
            "organizationId": "4gKgcFDnpSvUqozcC7TYUEcCiDJv",
            "filter":
            {
                "quizId":
                {
                    "eq": "3683adf2-5d3d-4894-a9c9-27cc7cfa4025"
                }
            }
        }
    }
}

export const lowRankersQuery = {
    query: `query($queryFilters: GetQuizScoresInput!) {\n  getQuizScores(input: $queryFilters\n  ) {\n    totalResults\n    edges {\n      node {\n        score\n      }\n    }\n  }\n}`,
    variables: {
        "queryFilters":
        {
            "organizationId": "4gKgcFDnpSvUqozcC7TYUEcCiDJv",
            "filter":
            {
                "score": { "lt": 6 },
                "quizId": { "eq": "3683adf2-5d3d-4894-a9c9-27cc7cfa4025" }
            }
        }
    }
}
