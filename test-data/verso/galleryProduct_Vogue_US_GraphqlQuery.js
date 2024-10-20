export const galleryUpcProductQuery = {
    query: ` fragment cartoonFragment on Cartoon {
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
      pubDate
      storeUrl
      publishInfo {
        firstPublished
      }
    }
  
  
    
    fragment liveStoryField on LiveStory {
      id
      hed
      dek
      uri
      rubric
      tout {
        id
        aspectRatios {
          name
          url
        }
        metadata {
          contentType
        }
      }
      organizationId
      metadata {
        contentType
      }
      allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
        edges {
          node {
            ...contributorFragment
          }
        }
      }
    }
  
  
    
    fragment contributorFragment on Contributor {
      __typename
      id
      url: uri
      name
      title
      # type comes from fragment in search query
      type
      contributorType: type
      photo: tout {
        id
        aspectRatios {
          url
        }
        metadata {
          contentType
        }
      }
      title
      bio
      socialMedia {
        handle
        network
      }
      metadata {
        contentType
      }
    }
  
  
    
      fragment categoryTaxonomiesFragment on CategoryTaxonomy  {
        name: taxonomy
        categories {
          id
          name
          slug
          hierarchy {
            name
            slug
          }
          parent: parentCategory {
            name
            slug
          }
          root {
            slug
          }
        }
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
    
  
    
    fragment productField on Product {
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
      
  
    
  fragment contentList on CuratedList {
      id
      hed
      content(limit: 5) {
          results {
              __typename
              metadata {
                  contentType
              }
              ...on Article {
                  id
                  hed
                  dek
                  contextualDek
                  promoDek
                  contextualHed
                  promoHed
                  uri
                  rubric
                  channel {
                      slug
                      name
                  }
              }
              ...on Gallery {
                  id
                  hed
                  dek
                  contextualDek
                  promoDek
                  contextualHed
                  promoHed
                  uri
                  rubric
                  channel {
                      slug
                      name
                  }
              }
              ...on ExternalLink {
                  id
                  hed
                  url
                  rubric
                  contextualRubric
  
              }
          }
      }
  }
  
  
    
          fragment contentReferenceField on ContentReference {
              id
              identifier
              provider
              hed
              dek
              metadata {
              contentType
              }
        }
  
    
            fragment revisionInfoField on RevisionInfo {
              version
              createdAt
              authorName
          }
  
    query GetGallery(
      $organizationId: ID!
      $uri: String
      $id: String
      $status: PUBLISH_STATUS
      $skipRelatedContent: Boolean!
    ) {
      getGallery(organizationId: $organizationId, uri: $uri, id: $id) {
        body(textFormat: MARKDOWN) {
          content
          connectedEmbeds(status: $status, limit: 100) {
            edges {
              node {
                ...articleFragment
                ...clipFragment
                ...cneVideoFragment
                ...externalLinkFragment
                ...galleryEmbedFragment
                ...contentList
                ...photoField
                ...productField
                ...reviewFragment
                ...liveStoryField
                ...contentReferenceField
              }
            }
          }
        }
        interludeOverride: connected(limit: 1, relname: "interludeOverride") {
          edges {
            node {
              ... on CNEVideo {
                cneId
              }
            }
          }
        }
        hasAffiliateLinks
        affiliateLinksCount
        isCommerceContent
        bylineOption
        bylineVariant
        campaignUrl
        contentWarnings {
          slug
        }
        contentSource
        advertiser {
          name
          logo {
            aspectRatios {
              url
            }
            filename
            title
            altText
            id
          }
          url
        }
        dek(textFormat: MARKDOWN)
        hed(textFormat: MARKDOWN)
        id
        issueDate
        lang
        metadata {
          contentType
        }
        publishDate: pubDate
        publishInfo {
          firstPublished
          template
        }
        revisionInfo {
          ...revisionInfoField
        }
        rubric
        seo {
          title
        }
        location: categories(taxonomy: "location") {
          id
          name
          slug
          hierarchy {
            name
            slug
          }
        }
        socialTitle
        url: uri
  
        versoSettings: categories(taxonomy: "verso-settings") {
          hierarchy {
            parentCategory {
              slug
            }
            slug
          }
        }
  
        categoryTaxonomies {
          ...categoryTaxonomiesFragment
        }
  
        allContributors {
          edges {
            node {
              ...contributorFragment
            }
          }
        }
        lede {
          ...clipFragment
          ...cneVideoFragment
          ...photoField
        }
        tout {
          ...photoField
        }
        relatedContent @skip(if: $skipRelatedContent) {
          results {
            __typename
            metadata {
              contentType
            }
            ...relatedVideo
            ...articleFragment
            ...galleryEmbedFragment
            ...clipFragment
            ...cneVideoFragment
            ...externalLinkFragment
            ...photoField
            ...productField
            ...reviewFragment
            ...recipeFragment
            ...musicReviewField
          }
        }
        relatedProducts: connected(relname: "relatedProducts") {
          edges {
            node {
              ...productField
              ...contentReferenceField
            }
          }
        }
        socialPhoto {
          ...photoField
        }
        tags {
          id
          name
          slug
          metadata {
            contentType
            archived
          }
          hierarchy {
            slug
          }
          root {
            slug
          }
        }
        functionalTags {
          name
          slug
        }
      }
    }
  
    fragment articleFragment on Article {
      dek
      hed
      id
      contentWarnings {
        slug
      }
      metadata {
        contentType
      }
      promoDek
      promoHed
      tout {
        ...photoField
      }
      url: uri
      allContributors(types: [AUTHOR, PHOTOGRAPHER, ADAPTATION_BY]) {
        edges {
          node {
            ...contributorFragment
          }
        }
      }
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
  
    fragment galleryEmbedFragment on Gallery {
      id
      contentWarnings {
        slug
      }
      metadata {
        contentType
      }
      allContributors {
        edges {
          node {
            ...contributorFragment
          }
        }
      }
      hed
      promoDek
      rubric
      lede {
        ...photoField
        ...cneVideoFragment
        ...clipFragment
      }
      channel {
        name
        slug
      }
      channels: categories(taxonomy: "channels") {
        name
      }
      tout {
        ...photoField
      }
      connectedItems(limit: 100) {
        totalResults
        edges {
          node {
            ...articleFragment
            ...cartoonFragment
            ...clipFragment
            ...photoField
            ...productField
            ...recipeFragment
            ...reviewFragment
            ...venueFragment
          }
        }
      }
      url: uri
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
      tout {
        ...photoField
      }
      url: uri
    }
  
    #
    # Define separate fragment as this has a lot more data points than plain cne video slide
    #
    fragment relatedVideo on CNEVideo {
      canonicalUrl
      cneCategories
      cneId
      credit
      description
      embedUrl
      id
      metadata {
        contentType
      }
      imageUrl
      premiereDate
      title
      scriptEmbedUrl: scriptUrl
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
      hed: title
      id
      imageUrl
      url: canonicalUrl
      metadata {
        contentType
      }
      scriptEmbedUrl: scriptUrl
      title
    }
  
    fragment musicReviewField on MusicReview {
      __typename
      allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
        edges {
          node {
            ...contributorFragment
          }
        }
      }
      id
      hed
      dek
      artist: connected(relname: "itemsReviewed") {
        edges {
          node {
            ... on MusicRelease {
              connected(relname: "isReleaseOf") {
                edges {
                  node {
                    ... on MusicAlbum {
                      connected(relname: "byArtist") {
                        edges {
                          node {
                            ... on MusicGroup {
                              name
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      #embedUrl
      url: uri
      tout {
        ...photoField
      }
      metadata {
        contentType
      }
    }`,
      variables: {
        "organizationId": "4gKgcErsy9d7RdbkfDjCvzkRF36J",
        "status": "PUBLISHED",
        "uri": "slideshow/best-lug-sole-boots",
        "skipRelatedContent": false
      }
    };
