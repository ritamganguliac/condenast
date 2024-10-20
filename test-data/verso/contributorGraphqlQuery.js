export const contributorQuery = {
    query: `fragment contributorField on Contributor {
      id
      url: uri
      name
      contributorType: type
      photo: tout {
        ...photoField
      }
      title
      bio
      shortBio
      socialMedia {
        handle
        network
      }
      metadata {
        contentType
      }
      relatedContent: firstConnected(relname: "relatedContent") {
          node {
            ... on ExternalLink {
              id
              dek
              hed
              url
              __typename
              metadata {
                contentType
              }
              rubric
              source
            }
          }
        }
    featuredStories: connected(relname: "featuredStories") {
      edges {
        node {
          ... on Article {
            id
            url: uri
            hed
            dek
            rubric
            pubDate
            photo: tout {
              ...photoField
            }
            __typename
              metadata {
                contentType
              }
          }
        }
      }
    }
      __typename
    }
  
  
    fragment photoField on Photo {
        altText        
        aspectRatios {
            name
            url
            width
            height
            format
            modifications {
                crop {
                    height
                    width
                    x
                    y
                }
            }
        }
        caption
        contextualBody
        contextualCaption
        contextualTitle
        cropMode
        credit        
        filename
        id
        metadata {
          contentType
        }
        contentWarnings{
          slug
        }
        restrictCropping
        __typename      
    }
          fragment revisionInfoField on RevisionInfo {
            version
            createdAt
            authorName
        }
  query ($organizationId: ID!, $uri: String, $id: String) {
    getContributor(organizationId: $organizationId, uri: $uri, id: $id) {
      ...contributorField
      revisionInfo {
        ...revisionInfoField
      }
    }
  }`,

  variables: {
    uri: "contributor/chioma-nnadi",
    organizationId: "4gKgcErsy9d7RdbkfDjCvzkRF36J"
  }
}

export const contributorContentQuery = {
  query: `fragment photoField on Photo {
      altText        
      aspectRatios {
          name
          url
          width
          height
          format
          modifications {
              crop {
                  height
                  width
                  x
                  y
              }
          }
      }
      caption
      contextualBody
      contextualCaption
      contextualTitle
      cropMode
      credit        
      filename
      id
      metadata {
        contentType
      }
      contentWarnings{
        slug
      }
      restrictCropping
      __typename      
  }
  

  fragment contributorField on Contributor {
    id
    url: uri
    name
    contributorType: type
    photo: tout {
      ...photoField
    }
    title
    bio
    shortBio
    socialMedia {
      handle
      network
    }
    metadata {
      contentType
    }
    relatedContent: firstConnected(relname: "relatedContent") {
        node {
          ... on ExternalLink {
            id
            dek
            hed
            url
            __typename
            metadata {
              contentType
            }
            rubric
            source
          }
        }
      }
  featuredStories: connected(relname: "featuredStories") {
    edges {
      node {
        ... on Article {
          id
          url: uri
          hed
          dek
          rubric
          pubDate
          photo: tout {
            ...photoField
          }
          __typename
            metadata {
              contentType
            }
        }
      }
    }
  }
    __typename
  }


query GetContributor(
  $organizationId: ID!
  $filters: SearchFilters
  $page: Int
  $limit: Int
) {
  search(organizationId: $organizationId, filters: $filters) {
    content(page: $page, limit: $limit) {
      results {
        __typename
        metadata {
          contentType
        }
        ... on Article {
          allContributors {
            edges {
              node {
                ...contributorField
              }
            }
          }
          channels: categories(taxonomy: "channels") {
            ...channelFields
            hierarchy {
              name
              slug
            }
            parent: parentCategory {
              ...channelFields
            }
          }
          sections: categories(taxonomy: "sections") {
            name
            slug
          }
          dek
          hed
          id
          metadata {
            contentType
          }
          promoHed
          promoDek
          revisionCreatedAt: pubDate
          rubric
          tout: firstConnected(relname: "photosTout") {
            node {
              ...toutFields
              ...clipField
            }
          }
          url: uri
        }

        ... on ProductReview {
          allContributors {
            edges {
              node {
                ...contributorField
              }
            }
          }
          channel {
            ...channelFields
          }
          dek
          hed
          id
          metadata {
            contentType
          }
          promoHed
          promoDek
          rubric
          tout: firstConnected(relname: "photosTout") {
            node {
              ...toutFields
              ...clipField
            }
          }
          url: uri
        }

        ... on Gallery {
          allContributors {
            edges {
              node {
                ...contributorField
              }
            }
          }
          channel {
            ...channelFields
          }
          dek
          hed
          id
          metadata {
            contentType
          }
          promoHed
          promoDek
          revisionCreatedAt: pubDate
          rubric
          tout: firstConnected(relname: "photosTout") {
            node {
              ...toutFields
              ...clipField
            }
          }
          url: uri
        }

        ... on Recipe {
          allContributors {
            edges {
              node {
                ...contributorField
              }
            }
          }
          channel {
            ...channelFields
          }
          dek
          hed
          id
          promoDek
          promoHed
          pubDate
          metadata {
            contentType
          }
          tout: firstConnected(relname: "photosTout") {
            node {
              ...toutFields
              ...clipField
            }
          }
          url: uri
        }

        ... on RunwayReview {
          id
          metadata {
            contentType
          }
          pubDate
          url: uri
        }

        ... on PlaceEditorial {
          id
          metadata {
            contentType
          }
          place {
            node {
              ...placeFragment
            }
          }
          promoDek
          pubDate
          tout: firstConnected(relname: "photosTout") {
            node {
              ...toutFields
              ...clipField
            }
          }
          url: uri
        }
      }
      page
      limit
      totalResults
    }
  }
}

fragment placeFragment on Place {
  name
}

fragment channelFields on Category {
  name
  slug
}

fragment toutFields on Photo {
  altText
  aspectRatios {
    height
    name
    width
    url
    format
  }
  filename
  id
  metadata {
    contentType
  }
  title
}

fragment clipField on Clip {
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
}`,

  variables: {
      "organizationId": "4gKgcErsy9d7RdbkfDjCvzkRF36J",
      "filters": {
        "relIds": [
          "55f25899822e0025344c4283"
        ],
        "types": [
          "ARTICLE",
          "GALLERY",
          "CNEVIDEO",
          "REVIEW",
          "RECIPE",
          "HOTEL",
          "BAR",
          "RESTAURANT",
          "SHIP",
          "SHOP",
          "SPA",
          "ACTIVITY"
        ]
      },
      "page": 1,
      "limit": 40
  }

}
