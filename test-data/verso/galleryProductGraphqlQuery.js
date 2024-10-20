export const galleryUpcProductQuery = {
    query: `fragment productField on Product {
        id
        brand {
          name
        } 
        awards {
          name
          date
        }
        category:connected{
          edges {
            node {
              ...on Category {
                hierarchy {
                  slug
                }
              }
            }
          }
        }
        contextualBody
        contextualTitle
        description
        functionalTags {
          name
          slug
        }
        name
        offers {
          currency
          comparisonPrice
          purchaseUri: offerLink
          offerId
          offerType
          price
          sellerName
          shortUrl: shortLink
          countryCode
        }
        tout {
          ...photoField
        }
        url: uri
        metadata {
          contentType
        }
        __typename
      }
      fragment cartoonFragment on Cartoon {
        id
        metadata {
          contentType
        }
        filename
        height
        width
        altText
        title
        caption
        credit
        socialTitle
        socialDescription
        __typename
        url: uri
        aspectRatios {
          height
          name
          url
          width
        }
        storeUrl
        publishInfo {
          firstPublished
        }
      }
      query (
        $organizationId: ID!
        $uri: String
        $id: String
        $page: Int
        $limit: Int
      ) {
        getGallery(organizationId: $organizationId, uri: $uri, id: $id) {
          itemsPageN: connectedItems(limit: $limit, page: $page) {
            totalResults
            items: edges {
              item: node {
                ...articleFragment
                ...clipFragment
                ...cneVideoFragment
                ...cartoonFragment
                ...externalLinkFragment
                ...photoField
                ...placeFragment
                ...productField
                ...recipeFragment
                ...reviewFragment
                ...venueFragment
              }
            }
          }
        }
      }
      fragment articleFragment on Article {
        dek
        hed
        id
        contextualBody
        metadata {
          contentType
        }
        promoDek
        promoHed
        tout {
          ...photoField
        }
        url: uri
      }
      fragment clipFragment on Clip {
        altText
        credit
        caption
        filename
        id
        metadata {
          contentType
        }
        renditions {
          mp4 {
            url
            width
            height
            resolution
          }
        }
      }
      fragment externalLinkFragment on ExternalLink {
        dek
        hed
        id
        metadata {
          contentType
        }
        rubric
        tout {
          ...photoField
        }
        url
      }
      fragment photoField on Photo {
        altText
        aspectRatios {
          name
          url
          width
          height
          format
        }
        caption
        contextualBody
        contextualCaption
        credit
        contextualCredit
        contextualTitle
        contextualBody
        filename
        id
        metadata {
          contentType
        }
        contentWarnings {
          slug
        }
      }
      # CNT venues are places
      fragment placeFragment on Place {
        __typename
        locationInfo {
          city {
            name
          }
          country {
            name
          }
        }
        editorial {
          edges {
            node {
              id
              ... on PlaceEditorial {
                awards: categories(taxonomy: "award-winner") {
                  name
                  hierarchy {
                    name
                    slug
                  }
                }
                description
                functionalTags: categories(taxonomy: "functional-tags") {
                  name
                }
                metadata {
                  contentType
                }
                price: categories(taxonomy: "price") {
                  name
                }
                ratings {
                  edges {
                    node {
                      attribute
                      score
                      scale {
                        key
                        maxValue
                        minValue
                      }
                    }
                  }
                }
                overallRating: rating(attribute: "overall") {
                  node {
                    score
                  }
                }
                promoHed
                promoDek
                dek: shortDescription
                url: uri
              }
            }
          }
        }
        name
        operationalInfo {
          price
        }
        tout {
          # Not supported yet
          #    ...clipFragment
          ...photoField
        }
        ... on Activity {
          offers {
            seller {
              name
            }
            purchaseUri
            shortUrl
          }
        }
        ... on Lodging {
          offers {
            seller {
              name
            }
            purchaseUri
            shortUrl
          }
          roomsCount
        }
      }
      fragment recipeFragment on Recipe {
        dek
        hed
        id
        metadata {
          contentType
        }
        promoDek
        promoHed
        contextualBody
        tout {
          ...photoField
        }
        url: uri
      }
      fragment reviewFragment on ProductReview {
        body(textFormat: MARKDOWN) {
          content
        }
        hed
        id
        metadata {
          contentType
        }
        promoDek
        tout {
          ...photoField
        }
        url: uri
      }
      # TNY Venue
      fragment venueFragment on Venue {
        id
        name
        venueUrl: url
        metadata {
          contentType
        }
      }
    
      fragment cneVideoFragment on CNEVideo {
        cneId
        dek: description
        id
        metadata {
          contentType
        }
        scriptEmbedUrl: scriptUrl
        title
      }`,
      variables: {
        "organizationId": "4gKgcErsy9d7RdbkfDjCvzkRF36J",
        "status": "PUBLISHED",
        "uri": "slideshow/best-lug-sole-boots",
        "limit": 100
      }
    };
