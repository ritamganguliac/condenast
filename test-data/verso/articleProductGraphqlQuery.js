export const articleProductQuery = {
  query: `
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
        fragment culturalEventData on CulturalEvent {
          id
          body {
            content
          }
          dek
          hed
          location {
            name
            city
            region
            country
          }
          promoHed
          promoDek
          ticketUrl
          url: uri
          startDate
          endDate
          metadata {
            contentType
          }
          connected(relname: "venues") {
            edges {
              node {
                ... on Venue {
                  venueName: name
                  address {
                    city
                    region
                    country
                  }
                }
              }
            }
          }
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
    
      query GetArticle(
        $organizationId: ID!
        $uri: String
        $id: String
        $status: PUBLISH_STATUS
      ) {
        getArticle(organizationId: $organizationId, uri: $uri, id: $id) {
          allContributors {
            edges {
              node {
                ...contributorFragment
              }
            }
          }
          interactiveOverride
          interludeOverride: firstConnected(relname: "interludeOverride") {
            node {
              ... on CNEVideo {
                cneId
              }
            }
          }
          mediaOverrides {
            relName
            overrides {
              breakpoint
              aspectRatio
            }
          }
          bylineOption
          bylineVariant
          campaignUrl
          relatedArtists: connected(relname: "relatedArtists") {
            edges {
              node {
                ...musicGroupField
              }
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
          lang
          contentSource
          contentWarnings {
            slug
          }
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
          hed
          promoHed
          dek
          promoDek
          id
          issueDate
          revisionCreatedAt: pubDate
          linkList {
            ...curatedListField
            ...LinkListData
          }
          publishInfo {
            firstPublished
          }
          functionalTags {
            name
            slug
          }
          tags {
            id
            name
            slug
            metadata {
              contentType
            }
            hierarchy {
              slug
            }
            root {
              slug
            }
          }
          body(textFormat: MARKDOWN) {
            content
            connectedEmbeds(limit: 100, status: $status) {
              totalResults
              edges {
                node {
                  ...videoArticleField
                  ...externalLinkField
                  ...cartoonField
                  ...clipField
                  ...photoField
                  ...videoField
                  ...productField
                  ...articleField
                  ...galleryField
                  ...reviewField
                  ...contributorFragment
                  ...contentList
                  ...curatedListField
                  ...recipeField
                  ...venueField
                  ...placeFragment
                  ...culturalEventData
                  ...musicReviewField
                  ...liveStoryField
                  ...contentReferenceField
                }
              }
            }
          }
          lede {
            ...cartoonField
            ...clipField
            ...galleryField
            ...photoField
            ...videoField
          }
          tout {
            ...photoField
          }
          relatedContent {
            results {
              ...articleField
              ...bundleField
              ...curatedListField
              ...externalLinkField
              ...galleryField
              ...photoField
              ...recipeField
              ...reviewField
              ...venueField
              ...videoField
            }
          }
          rubric
          socialTitle
          socialDescription
          socialPhoto {
            ...photoField
          }
          seo {
            title
            description
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
          channels: categories(taxonomy: "channels") {
            name
            slug
            parentCategory {
              name
              slug
            }
          }
          sections: categories(taxonomy: "sections") {
            name
            slug
          }
          metadata {
            contentType
          }
          ledeCaption
          organizationId
          url: uri
          hasAffiliateLinks
          affiliateLinksCount
          isCommerceContent
        }
      }
      fragment contributorFragment on Contributor {
        id
        url: uri
        name
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
      fragment externalLinkField on ExternalLink {
        __typename
        id
        hed
        dek
        rubric
        url
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
        metadata {
          contentType
        }
      }
      fragment musicGroupField on MusicGroup {
        __typename
        metadata {
          contentType
        }
        name
        uri
        genres {
          node {
            ... on Category {
              id
              name
              url: slug
            }
          }
        }
      }
      fragment videoField on CNEVideo {
        __typename
        id
        metadata {
          contentType
        }
        # caption
        categories: cneCategories
        cneId
        credit
        cnehed: title
        cnedek: description
        description
        durationInMs
        embedUrl
        premiereDate
        scriptEmbedUrl: scriptUrl
        liveStreamMetadata {
          startDate
          endDate
          isCurrentlyBroadcasting
        }
        series {
          slug
          title
        }
        title
        # url
        imageUrl
        url: canonicalUrl
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
      fragment galleryField on Gallery {
        __typename
        id
        metadata {
          contentType
        }
        allContributors(types: [AUTHOR, PHOTOGRAPHER, ADAPTATION_BY]) {
          edges {
            node {
              ...contributorFragment
            }
          }
        }
        contentWarnings {
          slug
        }
        hed
        promoDek
        rubric
        lede {
          ...photoField
          ...videoField
          ...clipField
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
              ...articleAsChildField
              ...cartoonField
              ...clipField
              ...photoField
              ...placeFragment
              ...productField
              ...recipeField
              ...reviewField
              ...venueField
              ...videoField
            }
          }
        }
        url: uri
      }
      fragment cartoonField on Cartoon {
        __typename
        id
        metadata {
          contentType
        }
        filename
        height
        width
        altText
        caption
        credit
        title
        pubDate
        socialTitle
        url: uri
        aspectRatios {
          height
          name
          url
          width
        }
        storeUrl
      }
    
      fragment articleField on Article {
        __typename
        id
        allContributors(types: [AUTHOR, PHOTOGRAPHER, ADAPTATION_BY]) {
          edges {
            node {
              ...contributorFragment
            }
          }
        }
        channel {
          slug
          name
        }
        channels: categories(taxonomy: "channels") {
          name
        }
        contentWarnings {
          slug
        }
        hed
        dek
        promoHed
        promoDek
        url: uri
        rubric
        lede {
          ...cartoonField
          ...clipField
          ...galleryField
          ...photoField
          ...videoField
        }
        tout {
          ...photoField
        }
        toutMedia {
          node {
            ...clipField
            ...photoField
          }
        }
        metadata {
          contentType
        }
      }
      fragment reviewField on ProductReview {
        __typename
        id
        allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
          edges {
            node {
              ...contributorFragment
            }
          }
        }
        metadata {
          contentType
        }
        promoHed
        promoDek
        hed
        dek
        channel {
          name
          slug
        }
        tout {
          ...photoField
        }
        body(textFormat: MARKDOWN) {
          content
        }
        url: uri
      }
    
      fragment bundleField on Bundle {
        __typename
        id
        hed
        dek
        promoHed
        promoDek
        seo {
          title
          description
        }
        socialTitle
        socialDescription
        pubDate
        channels: categories(taxonomy: "channels") {
          name
        }
        metadata {
          contentType
        }
        lede {
          ...clipField
          ...galleryField
          ...photoField
          ...videoField
        }
        tout {
          ...photoField
        }
        url: uri
      }
      fragment curatedListField on CuratedList {
        __typename
        id
        hed
        dek
        uri
        publishInfo {
          version
        }
        metadata {
          contentType
        }
        tout {
          ...photoField
        }
        curationSubType
      }
      fragment LinkListData on CuratedList {
        __typename
        curationSubType
        body(textFormat: MARKDOWN) {
          content
          embeds {
            ...videoArticleField
            ...externalLinkField
            ...cartoonField
            ...clipField
            ...photoField
            ...videoField
            ...productField
            ...articleField
            ...galleryField
            ...reviewField
            ...contributorFragment
            ...recipeField
            ...venueField
            ...culturalEventData
          }
        }
        textItems {
          content
          embeds {
            ...articleAsChildField
            ...galleryAsChildField
          }
        }
      }
      # we have to use an article-like fragment to use it as children in other types to avoid the conflicts
      fragment articleAsChildField on Article {
        __typename
        id
        allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
          edges {
            node {
              ...contributorFragment
            }
          }
        }
        channel {
          slug
          name
        }
        channels: categories(taxonomy: "channels") {
          name
        }
        hed
        dek
        promoHed
        promoDek
        url: uri
        rubric
        lede {
          ...clipField
          ...photoField
          ...videoField
        }
        tout {
          ...photoField
        }
        metadata {
          contentType
        }
      }
      fragment recipeField on Recipe {
        __typename
        id
        metadata {
          contentType
        }
        body(textFormat: MARKDOWN) {
          content
        }
        channel {
          name
          slug
        }
        allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
          edges {
            node {
              ...contributorFragment
            }
          }
        }
        dek
        hed
        lede: connected(relname: "photosTout", limit: 1) {
          edges {
            node {
              ...photoField
            }
          }
        }
        tout {
          ...photoField
        }
        promoDek
        promoHed
        url: uri
      }
      fragment venueField on Venue {
        __typename
        id
        name
        venueUrl: url
        metadata {
          contentType
        }
      }
      fragment galleryAsChildField on Gallery {
        __typename
        id
        allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
          edges {
            node {
              ...contributorFragment
            }
          }
        }
        channel {
          slug
          name
        }
        channels: categories(taxonomy: "channels") {
          name
        }
        hed
        dek
        promoHed
        promoDek
        url: uri
        rubric
        lede {
          ...clipField
          ...photoField
          ...videoField
        }
        tout {
          ...photoField
        }
        metadata {
          contentType
        }
      }
      # CNT venues are places
      # This is subset of fragment in src/presenters/galleries/query.content-service.graphql, keep in sync
      fragment placeFragment on Place {
        # metadadata not available here
        __typename
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
          ...clipField
          ...photoField
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
      fragment videoArticleField on VideoArticle {
        __typename
        allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
          edges {
            node {
              ...contributorFragment
            }
          }
        }
        hed
        dek
        embedUrl
        url: uri
        tout {
          ...photoField
        }
        metadata {
          contentType
        }
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
      }
      `,
  variables: {
    organizationId: "4gKgcErsy9d7RdbkfDjCvzkRF36J",
    uri: "article/vogue-wardrobe-essentials-guide",
    limit: 100,
  },
};
