export const plpUpcProductQuery = {
    query:`
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
    # Write your query or mutation here
    fragment subBundleData on Bundle {
      id
      url: uri
      hed
      dek
      promoHed
      promoDek
      rubric
      contextualHed
      contextualDek
      pubDate
      seo {
        title
        description
      }
      socialDescription
      socialTitle
      __typename
      metadata {
        contentType
      }
      tout {
        ...photoField
      }
      sections: categories(taxonomy: "sections") {
        id
        name
        slug
      }
      channels: categories(taxonomy: "channels") {
        id
        name
        slug
        parentCategory {
          slug
        }
        hierarchy {
          name
          slug
        }
      }
      allContributors: connected(relname: "contributorsAuthor") {
        edges {
          node {
            ...contributorData
          }
        }
      }
    }
    fragment spotlightContributorData on Contributor {
      name
      title
      bio
      featuredBio
      featuredImage: connected(relname: "featuredImg") {
        edges {
          node {
            ... on Photo {
              title
              altText
              credit
              caption
              ...contributorPhotoField
            }
          }
        }
      }
      featuredStories: connected(relname: "featuredStories") {
        edges {
          node {
            ... on Article {
              ...articleData
            }
          }
        }
      }
      relatedContent: connected(relname: "relatedContent") {
        edges {
          node {
            ... on Article {
              ...articleData
            }
            ... on ExternalLink {
              id
              dek
              hed
              rubric
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
      }
    }
    fragment contributorPhotoField on Photo {
      altText
      aspectRatios(filter: "master") {
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
      contextualTitle
      cropMode
      credit
      filename
      id
    }
    fragment articleData on Article {
      id
      url: uri
      hed
      dek
      promoHed
      promoDek
      contextualHed
      contextualDek
      pubDate
      issueDate
      seo {
        title
        description
      }
      socialDescription
      socialTitle
      __typename
      metadata {
        contentType
      }
      allContributors(types: $contributorTypes) {
        edges {
          node {
            ...contributorData
          }
        }
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
      contentSource
      ledeCaption
      lede {
        ...cNEVideoData
        ...clipField
        ...photoField
      }
      tags {
        id
        name
        slug
      }
      sections: categories(taxonomy: "sections") {
        id
        name
        slug
      }
      channels: categories(taxonomy: "channels") {
        id
        name
        slug
        parentCategory {
          slug
        }
        hierarchy {
          name
          slug
        }
      }
      functionalTags: categories(taxonomy: "functional-tags") {
        id
        slug
      }
      rubric
    }
    fragment cartoonData on Cartoon {
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
      socialDescription
      socialTitle
      __typename
      url: uri
      aspectRatios {
        height
        name
        url
        width
      }
      storeUrl
    }
    fragment reviewField on ProductReview {
      __typename
      metadata {
        contentType
      }
      id
  
      dek
      hed
      promoDek
      promoHed
      pubDate
      rubric
      channels: categories(taxonomy: "channels") {
        id
        name
        slug
        parentCategory {
          slug
        }
        hierarchy {
          name
          slug
        }
      }
      url: uri
      allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
        edges {
          node {
            ...contributorData
          }
        }
      }
  
      tout {
        ...photoField
      }
    }
    fragment musicReleaseFields on MusicRelease {
      __typename
      metadata {
        contentType
      }
      name
      releaseOf: connected(relname: "isReleaseOf") {
        edges {
          node {
            __typename
            id
            ... on MusicAlbum {
              metadata {
                contentType
              }
              name
              isCompilation
              disambiguatingDescription
              byArtist: connected(relname: "byArtist") {
                edges {
                  node {
                    ... on MusicGroup {
                      genres {
                        node {
                          ... on Category {
                            name
                            slug
                          }
                        }
                      }
                      name
                      url: uri
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    fragment musicRecordingFields on MusicRecording {
      __typename
      metadata {
        contentType
      }
      name
      byArtist: connected(relname: "byArtist") {
        edges {
          node {
            ... on MusicGroup {
              name
              genres {
                node {
                  ... on Category {
                    name
                    slug
                  }
                }
              }
              url: uri
            }
          }
        }
      }
    }
    fragment musicReviewField on MusicReview {
      __typename
      id
      metadata {
        contentType
      }
      promoHed
      promoDek
      pubDate
      rubric
      hed
      dek
      channel {
        name
        slug
      }
      tout {
        ...photoField
      }
      url: uri
      allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
        edges {
          node {
            ...contributorData
          }
        }
      }
      reviewed {
        edges {
          node {
            ...musicReleaseFields
            ...musicRecordingFields
          }
          rating {
            node {
              isBestNewMusic
              isBestNewReissue
              score
            }
          }
        }
      }
    }
    fragment galleryData on Gallery {
      __typename
      metadata {
        contentType
      }
      id
      url: uri
      contentSource
      hed
      dek
      tout {
        ...photoField
      }
      toutMedia {
        node {
          ...clipField
          ...photoField
        }
      }
      promoDek
      promoHed
      contextualHed
      contextualDek
      pubDate
      seo {
        title
        description
      }
  
      socialDescription
      url: uri
      channel {
        id
        name
        slug
      }
      tags {
        id
        name
        slug
      }
      functionalTags {
        id
        name
        slug
      }
      sections: categories(taxonomy: "sections") {
        id
        name
        slug
      }
      channels: categories(taxonomy: "channels") {
        id
        name
        slug
        parentCategory {
          slug
        }
        hierarchy {
          name
          slug
        }
      }
      connectedItems(limit: 100) {
        totalResults
        edges {
          node {
            ...photoField
          }
        }
      }
      allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
        edges {
          node {
            ...contributorData
          }
        }
      }
      promoHed
      promoDek
      rubric
      socialTitle
      socialDescription
    }
    fragment externalLinkData on ExternalLink {
      id
      dek
      hed
      rubric
      url
      __typename
      metadata {
        contentType
      }
      tout {
        ...photoField
      }
      rubric
      source
    }
    fragment contributorData on Contributor {
      id
      bio
      email
      name
      url: uri
      photo: tout {
        ...photoField
      }
      socialMedia {
        handle
        network
      }
      title
  
      type
    }
    fragment contributorListData on Contributor {
      id
      bio
      featuredBio
      email
      name
      url: uri
      tout {
        ...photoField
      }
      Category: firstConnected(relname: "categories-channels") {
        node {
          id
          __typename
          ... on Category {
            metadata {
              contentType
            }
            name
            slug
          }
        }
      }
      metadata {
        contentType
      }
      socialMedia {
        handle
        network
      }
      title
  
      type
    }
    fragment curatedArticleData on Article {
      hed
      dek
      promoHed
      promoDek
      contextualHed
      contextualDek
      url: uri
      tout {
        id
        title
        altText
        credit
        filename
        cropMode
        contextualBody
        aspectRatios {
          name
          height
          width
          url
        }
      }
      toutMedia {
        node {
          ...clipField
          ...photoField
        }
      }
      allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
        edges {
          node {
            ...contributorData
          }
        }
      }
      rubric
      sections: categories(taxonomy: "sections") {
        id
        name
        slug
      }
      channels: categories(taxonomy: "channels") {
        id
        name
        slug
        parentCategory {
          slug
        }
      }
    }
    fragment curatedGalleryData on Gallery {
      hed
      dek
      promoHed
      promoDek
      contextualHed
      contextualDek
      url: uri
      body {
        content
      }
      tout {
        id
        title
        altText
        credit
        filename
        cropMode
        contextualBody
        aspectRatios {
          name
          height
          width
          url
        }
      }
      allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
        edges {
          node {
            ...contributorData
          }
        }
      }
      rubric
      sections: categories(taxonomy: "sections") {
        id
        name
        slug
      }
      channels: categories(taxonomy: "channels") {
        id
        name
        slug
        parentCategory {
          slug
        }
      }
      connectedItems {
        totalResults
      }
    }
    fragment curatedExternalLinkData on ExternalLink {
      id
      dek
      hed
      url
      __typename
      metadata {
        contentType
      }
      source
      tout {
        id
        title
        altText
        credit
        filename
        cropMode
        contextualBody
        aspectRatios {
          name
          height
          width
          url
        }
      }
    }
    fragment curatedListData on CuratedList {
      __typename
      metadata {
        contentType
      }
      id
      hed
      dek
  
      url: uri
      tout {
        ...photoField
      }
  
      items: content {
        results {
          id
          ... on Gallery {
            ...curatedGalleryData
          }
          ... on Article {
            ...curatedArticleData
          }
          ... on CNEVideo {
            ...cNEVideoData
          }
          ... on ExternalLink {
            ...curatedExternalLinkData
          }
          ... on CulturalEvent {
            ...culturalEventData
          }
          ... on Product {
            channel {
              id
              name
              slug
            }
            description
            id
            metadata {
              contentType
            }
            name
            pubDate
            tags {
              id
              name
              slug
            }
            tout {
              ...photoField
            }
            url: uri
            __typename
          }
          __typename
          metadata {
            contentType
          }
        }
      }
    }
    fragment curatedSearchData on CuratedSearch {
      __typename
      metadata {
        contentType
      }
      id
      hed
      dek
  
      url: uri
      tout {
        ...photoField
      }
  
      items: content {
        results {
          id
          metadata {
            contentType
          }
          ... on Gallery {
            ...curatedGalleryData
          }
          ... on Article {
            ...curatedArticleData
          }
          ... on CNEVideo {
            ...cNEVideoData
          }
          ... on ExternalLink {
            ...curatedExternalLinkData
          }
          ... on CulturalEvent {
            ...culturalEventData
          }
          ... on ProductReview {
            hed
            dek
            promoDek
            promoHed
            tout {
              ...photoField
            }
  
            url: uri
  
            allContributors(types: [AUTHOR]) {
              edges {
                node {
                  ...contributorData
                }
              }
            }
          }
          __typename
        }
      }
    }
    fragment cNEVideoData on CNEVideo {
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
      photo: imageUrl
      url: canonicalUrl
  
      __typename
    }
    fragment recipeData on Recipe {
      aggregateRating
      channel {
        id
        name
        slug
      }
      allContributors {
        edges {
          node {
            ...contributorData
          }
        }
      }
      hed
      dek
      promoHed
      promoDek
      pubDate
      tags {
        id
        name
        slug
        hierarchy {
          id
          name
        }
      }
      reviewsCount
      tout {
        id
        title
        altText
        credit
        filename
        cropMode
        contextualBody
        aspectRatios {
          name
          height
          width
          url
        }
      }
      body {
        content
      }
      tags {
        id
        name
        slug
        parentCategory {
          name
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
      aggregateRating
      reviewsCount
      url: uri
      __typename
      metadata {
        contentType
      }
    }
    fragment livestoryData on LiveStory {
      allContributors {
        edges {
          node {
            ...contributorData
          }
        }
      }
      hed
      dek
      promoHed
      promoDek
      pubDate
      liveStartDate
      liveEndDate
      rubric
      tout {
        id
        title
        altText
        credit
        filename
        cropMode
        contextualBody
        aspectRatios {
          name
          height
          width
          url
        }
      }
      body {
        content
      }
      url: uri
      __typename
      metadata {
        contentType
      }
    }
    fragment runwaySeasonData on RunwaySeason {
      __typename
      metadata {
        contentType
      }
      id
      # name is String! which is not compatible with Product name (nullable)
      seasonName: name
      year
      isMajor
      active
      allShows: connectedShows(limit: 1000) {
        edges {
          node {
            id
            url: uri
            pubDate
            designer {
              name
            }
          }
        }
      }
      curatedShows: connectedShows(limit: 30, isCurated: true) {
        edges {
          node {
            id
            url: uri
            isSponsored
            instantShow
            showLivestream
            pubDate
            event {
              eventDate
            }
            designer {
              name
            }
            promoImage {
              ...photoField
            }
          }
        }
      }
      url: uri
      pubDate
    }
    fragment runwayShowData on RunwayShow {
      __typename
      metadata {
        contentType
      }
      url: uri
      id
      promoTitle
      livestream
      showLivestream
      season {
        name
        uri
      }
      designer {
        name
        uri
      }
      promoImage {
        ...photoField
      }
      channels: categories(taxonomy: "channels") {
        id
        name
        slug
        parentCategory {
          slug
        }
      }
    }
    fragment lodgingData on Lodging {
      offers {
        seller {
          name
        }
        purchaseUri
        offerId
        shortUrl
      }
    }
    fragment activityData on Activity {
      offers {
        seller {
          name
        }
        purchaseUri
        offerId
        shortUrl
      }
    }
    fragment placeData on Place {
      editorial {
        edges {
          node {
            ... on PlaceEditorial {
              awards: categories(taxonomy: "award-winner") {
                name
                hierarchy {
                  name
                  slug
                }
              }
              categoryTaxonomies {
                name: taxonomy
                categories {
                  id
                  name
                  slug
                  hierarchy {
                    name
                    slug
                  }
                  root {
                    slug
                  }
                }
              }
              awards: categories(taxonomy: "award-winner") {
                name
                hierarchy {
                  name
                  slug
                }
              }
              sections: categories(taxonomy: "price") {
                id
                name
                slug
              }
              channels: categories(taxonomy: "channels") {
                id
                name
                slug
                parentCategory {
                  slug
                }
              }
              body {
                content
              }
              description
              id
              metadata {
                contentType
              }
              promoDek
              promoHed
              pubDate
              seo {
                title
                description
              }
              shortDescription
              uri
            }
          }
        }
      }
      name
      tout {
        ...photoField
      }
      locationInfo {
        addressString
      }
      # metadata not available here
      __typename
    }
    fragment productData on Product {
      channel {
        id
        name
        slug
      }
      description
      id
      name
      pubDate
      tags {
        id
        name
        slug
      }
      tout {
        ...photoField
      }
      url: uri
      __typename
      brand {
        name
      }
      categoriesPaths: connected {
        edges {
          node {
            ... on Category {
              hierarchy {
                slug
              }
            }
          }
        }
      }
      offers {
        comparisonPrice
        currency
        offerId
        price
        purchaseUri: offerLink
        sellerName
        shortUrl: shortLink
      }
      functionalTags {
        name
        slug
      }
    }
    fragment venueData on Venue {
      hed
      dek
      id
      name
      uri
      venueUrl: url
      metadata {
        contentType
      }
      venueChannels: connected(relname: "categories-channels") {
        edges {
          node {
            ... on Category {
              id
              name
              __typename
            }
          }
        }
      }
      photosTout: connected(relname: "photosTout") {
        edges {
          node {
            ... on Photo {
              ...photoField
            }
          }
        }
      }
    }
    fragment businessData on Business {
      id
      legalName
      contactPoint {
        email
      }
      address {
        city
        state
      }
      description
      metadata {
        contentType
      }
      knowsAbout
      connected(relname: "photos", type: PHOTO) {
        edges {
          node {
            ... on Photo {
              ...photoField
            }
          }
        }
      }
      photosLede: connected(relname: "photosLede") {
        edges {
          node {
            ... on Photo {
              ...photoField
            }
          }
        }
      }
      photosTout: connected(relname: "photosTout") {
        edges {
          node {
            ... on Photo {
              ...photoField
            }
          }
        }
      }
      photosLogo: connected(relname: "photosLogo") {
        edges {
          node {
            ... on Photo {
              ...photoField
            }
          }
        }
      }
      directoryCategories: connected(relname: "categories-ad-directory") {
        edges {
          node {
            __typename
            ... on Category {
              metadata {
                contentType
              }
              hierarchy {
                name
                slug
              }
            }
          }
        }
      }
      publishedRevisions {
        results {
          ... on Business {
            uri
            pubDate
          }
        }
      }
    }
    query fetchBundle(
      $organizationId: ID!
      $uri: String
      $id: String
      $containerRevisions: String
      $limit: Int
      $status: PUBLISH_STATUS
      $containerLayout: String
      $paginatedPage: Int
      $contributorTypes: [CONTRIBUTOR_TYPE!]
    ) {
      getBundle(organizationId: $organizationId, uri: $uri, id: $id) {
        id
        hed
        dek
        promoHed
        promoDek
        pubDate
        rubric
        bylineOption
        bylineVariant
        campaignUrl
        isSponsored
        publishInfo {
          firstPublished
        }
        contributorsAuthor: connected(relname: "contributorsAuthor") {
          edges {
            node {
              id
              ... on Contributor {
                name
                contributorType: type
                url: uri
              }
            }
          }
        }
        contributorsMedicalReviewer: connected(
          relname: "contributorsMedicalReviewer"
        ) {
          edges {
            node {
              id
              ... on Contributor {
                name
                contributorType: type
                url: uri
              }
            }
          }
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
        body(textFormat: MARKDOWN) {
          content
          connectedEmbeds(limit: 100, status: $status) {
            totalResults
            edges {
              node {
                ...externalLinkData
                ...cartoonData
                ...clipField
                ...photoField
                ...productData
                ...articleData
                ...galleryData
                ...reviewField
                ...contributorData
                ...curatedListData
                ...recipeData
                ...venueData
                ...placeData
                ...culturalEventData
                ...businessData
              }
            }
          }
        }
        seo {
          title
          description
        }
        socialTitle
        socialDescription
        pubDate
        metadata {
          contentType
        }
        lede {
          ...photoField
          __typename
        }
        tout {
          ...photoField
          __typename
        }
        socialPhoto {
          ...photoField
          __typename
        }
        categoryTaxonomies {
          ...categoryTaxonomiesFragment
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
        containers(limit: 40, filter: { layout: $containerLayout }) {
          results {
            body
            id
            hed: hed
            dek: dek
            type
            template: curationContainerType
            layout
            containerImage {
              ...photoField
            }
            itemSets {
              title
              items(
                revisions: $containerRevisions
                page: $paginatedPage
                limit: $limit
              ) {
                limit
                totalResults
                searches {
                  criteria {
                    filters {
                      categoryIds
                    }
                  }
                }
                edges {
                  contextualHed
                  contextualDek
                  node {
                    id
                    # metadata not available here
                    __typename
                    ... on Bundle {
                      ...subBundleData
                    }
                    ... on Article {
                      ...articleData
                    }
                    ... on Contributor {
                      ...spotlightContributorData
                    }
                    ... on Gallery {
                      ...galleryData
                    }
                    ... on Lodging {
                      ...lodgingData
                    }
                    ... on ProductReview {
                      ...reviewField
                    }
                    ... on ExternalLink {
                      ...externalLinkData
                    }
                    ... on CuratedList {
                      ...curatedListData
                    }
                    ... on Cartoon {
                      ...cartoonData
                    }
                    ... on CuratedSearch {
                      ...curatedSearchData
                    }
                    ... on CNEVideo {
                      ...cNEVideoData
                    }
                    ... on CulturalEvent {
                      ...culturalEventData
                    }
                    ... on Product {
                      ...productData
                    }
                    ... on Recipe {
                      ...recipeData
                    }
                    ... on LiveStory {
                      ...livestoryData
                    }
                    ... on RunwaySeason {
                      ...runwaySeasonData
                    }
                    ... on RunwayShow {
                      ...runwayShowData
                    }
                    ... on Activity {
                      secondaryType
                      ...activityData
                    }
                    ... on Place {
                      ...placeData
                    }
                    ... on Contributor {
                      ...contributorListData
                    }
                    ... on MusicReview {
                      ...musicReviewField
                    }
                    ... on Business {
                      ...businessData
                    }
                    ... on Venue {
                      ...venueData
                    }
                    ... on ContentReference {
                      ...contentReferenceField
                    }
                  }
                }
              }
            }
          }
        }
        url: uri
        organizationId
      }
    }`
    ,
    variables: {
        "organizationId": "4gKgcErsy9d7RdbkfDjCvzkRF36J",
        "containerRevisions": "published",
        "status": "PUBLISHED",
        "uri": "the-essentials-edit",
        "contributorTypes": [
          "AUTHOR",
          "PHOTOGRAPHER"
        ]
      }
    };
