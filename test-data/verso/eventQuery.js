export const eventQuery = {
  query: `query getCulturalEvent($organizationId: ID!, $uri: String, $id: String) {
    getCulturalEvent(organizationId: $organizationId, uri: $uri, id: $id) {
      id
      eventDetails
      ticketUrl
      body {
        content
      }
      startDate
      endDate
      timeZone
      eventStatus
      eventRubric
      timeZone
      ctaLabel
      hed
      promoHed
      metadata {
        contentType
      }
      lede {
        metadata {
          contentType
        }
        ...photoField
        ...clipField
      }
      eventVenues: connected(relname: "venues") {
        edges {
          node {
            ...venueField
          }
        }
      }
      pubDate
      relatedContent {
        results {
          ... on CulturalEvent {
            __typename
            startDate
            eventStatus
            eventRubric
            hed
            body {
              content
            }
            ticketUrl
            url: uri
            timeZone
            ctaLabel
            eventVenues: connected(relname: "venues") {
              edges {
                node {
                  ...venueField
                }
              }
            }
            metadata {
              contentType
            }
            eventFunctionalTags: connected(
              relname: "categories-functional-tags"
            ) {
              edges {
                node {
                  ... on Category {
                    name
                    slug
                  }
                }
              }
            }
            lede {
              metadata {
                contentType
              }
              ...photoField
              ...clipField
            }
          }
        }
      }
      contributorsAuthor: connected(relname: "contributorsAuthor") {
        edges {
          node {
            id
            ... on Contributor {
              name
              url: uri
            }
          }
        }
      }
      categoriesSections: connected(relname: "categories-sections") {
        edges {
          node {
            id
            __typename
            ... on Category {
              name
              hierarchy {
                name
                slug
              }
            }
          }
        }
      }
      categoriesIssues: connected(relname: "categories-issues") {
        edges {
          node {
            id
            __typename
            ... on Category {
              id
              name
              hierarchy {
                name
                slug
              }
              parent: parentCategory {
                name
                slug
              }
            }
          }
        }
      }
    }
  }
  fragment venueField on Venue {
    venueName: name
    address {
      city
      country
      region
      country
    }
  }
  fragment photoField on Photo {
    id
    url
    filename
    caption
    credit
    altText
    aspectRatios {
      width
      format
    }
  }
  fragment clipField on Clip {
    __typename
    id
    metadata {
      contentType
    }
    altText
    credit
    caption
    filename
    renditions {
      mp4 {
        url
        width
        height
        resolution
      }
    }
  }
`,
  variables: {
    "organizationId": "4gKgcEoDWriApA1nauzJwNnT7XNz",
    "uri": "event/vogue-club/julia-hobbs",
    "containerRevisions": "published",
    "id": ""
  }
};
