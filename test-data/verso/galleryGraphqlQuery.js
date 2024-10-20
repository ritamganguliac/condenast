export const galleryQuery = {
  query: `query(\n  $organizationId: ID!\n  $uri: String\n  $id: String\n  $status: PUBLISH_STATUS\n  $skipRelatedContent: Boolean!\n  $skipCategoryTaxonomies: Boolean!\n) {\n  getGallery(organizationId: $organizationId, uri: $uri, id: $id) {\n    body(textFormat: MARKDOWN) {\n      content\n      connectedEmbeds(status: $status) {\n        edges {\n          node {\n            ...articleFragment\n            ...clipFragment\n            ...cneVideoFragment\n            ...externalLinkFragment\n            ...galleryEmbedFragment\n            ...photoField\n            ...productFragment\n            ...reviewFragment\n            ... on UnsupportedContent {\n              __typename\n            }\n          }\n        }\n      }\n    }\n    interludeOverride: firstConnected(relname: \"interludeOverride\") {\n      node {\n        ... on CNEVideo {\n          cneId\n        }\n      }\n    }\n    hasAffiliateLinks\n    bylineOption\n    bylineVariant\n    campaignUrl\n    advertiser {\n      name\n      logo {\n        aspectRatios {\n          url\n        }\n        filename\n        title\n        altText\n        id\n      }\n      url\n    }\n    dek(textFormat: MARKDOWN)\n    hed(textFormat: MARKDOWN)\n    id\n    issueDate\n    lang\n    metadata {\n      contentType\n    }\n    publishDate: pubDate\n    publishInfo {\n      firstPublished\n    }\n    seo {\n      title\n    }\n    socialTitle\n    url: uri\n\n    versoSettings: categories(taxonomy: \"verso-settings\") {\n      hierarchy {\n        parentCategory {\n          slug\n        }\n        slug\n      }\n    }\n\n    categoryTaxonomies @skip(if: $skipCategoryTaxonomies) {\n      ...categoryTaxonomiesFragment\n    }\n\n    allContributors {\n      edges {\n        node {\n          ...contributorFragment\n        }\n      }\n    }\n    relatedContent @skip(if: $skipRelatedContent) {\n        results {\n          __typename\n          metadata {\n            contentType\n          }\n          ...relatedVideo\n          ...articleFragment\n          ...galleryEmbedFragment\n          ...clipFragment\n          ...cneVideoFragment\n          ...externalLinkFragment\n          ...photoField\n          ...reviewFragment\n          ...recipeFragment\n        }\n      }\n    lede {\n      ...clipFragment\n      ...cneVideoFragment\n      ...photoField\n    }\n    tout {\n      ...photoField\n    }\n    relatedContent @skip(if: $skipRelatedContent) {\n      results {\n        ...relatedVideo\n        ... on UnsupportedContent {\n          id\n          metadata {\n            contentType\n          }\n          __typename\n        }\n      }\n    }\n    socialPhoto {\n      ...photoField\n    }\n    tags {\n      id\n      name\n      slug\n      metadata {\n        contentType\n      }\n      hierarchy {\n        slug\n      }\n      root {\n        slug\n      }\n    }\n  }\n}\n\nfragment categoryTaxonomiesFragment on CategoryTaxonomy {\n  name: taxonomy\n  categories {\n    id\n    name\n    slug\n    hierarchy {\n      name\n      slug\n    }\n    root {\n      slug\n    }\n  }\n}\n\nfragment articleFragment on Article {\n  dek\n  hed\n  id\n  metadata {\n    contentType\n  }\n  promoDek\n  promoHed\n  tout {\n    ...photoField\n  }\n  url: uri\n  contributors {\n    ...contributorField\n  }\n}\n\nfragment cartoonFragment on Cartoon {\n  id\n  metadata {\n    contentType\n  }\n  filename\n  height\n  width\n  altText\n  caption\n  credit\n  title\n  pubDate\n  socialTitle\n  url: uri\n  aspectRatios {\n    height\n    name\n    url\n    width\n  }\n}\n\nfragment clipFragment on Clip {\n  altText\n  credit\n  caption\n  filename\n  id\n  metadata {\n    contentType\n  }\n  renditions {\n    mp4 {\n      url\n      width\n      height\n      resolution\n    }\n  }\n}\n\nfragment contributorFragment on Contributor {\n  bio\n  contributorType: type\n  id\n  metadata {\n    contentType\n  }\n  name\n  photo: tout {\n    id\n    aspectRatios {\n      name\n      url\n    }\n    caption\n    credit\n    filename\n    metadata {\n      contentType\n    }\n  }\n  socialMedia {\n    handle\n    network\n  }\n  title\n  url: uri\n}\n\nfragment externalLinkFragment on ExternalLink {\n  dek\n  hed\n  id\n  metadata {\n    contentType\n  }\n  rubric\n  tout {\n    ...photoField\n  }\n  url\n}\n\n\nfragment photoField on Photo {\n  altText\n  aspectRatios {\n    name\n    url\n    width\n    height\n    format\n    modifications {\n      crop {\n        height\n        width\n        x\n        y\n      }\n    }\n  }\n  caption\n  contextualBody\n  contextualCaption\n  contextualTitle\n  cropMode\n  credit\n  filename\n  id\n  metadata {\n    contentType\n  }\n  restrictCropping\n  __typename\n}\n\nfragment productFragment on Product {\n  brand {\n    name\n  }\n  functionalTags {\n    name\n    slug\n  }\n  description\n  id\n  metadata {\n    contentType\n  }\n  name\n  offers {\n    sellerName\n    offerId\n    offerLink\n    shortUrl: shortLink\n    price\n    comparisonPrice\n    currency\n  }\n  tout {\n    ...photoField\n  }\n  url: uri\n}\n\nfragment recipeFragment on Recipe {\n  dek\n  hed\n  id\n  metadata {\n    contentType\n  }\n  promoDek\n  promoHed\n  tout {\n    ...photoField\n  }\n  url: uri\n}\n\n#\n# Define separate fragment as this has a lot more data points than plain cne video slide\n#\nfragment relatedVideo on CNEVideo {\n  canonicalUrl\n  cneCategories\n  cneId\n  credit\n  description\n  embedUrl\n  id\n  metadata {\n    contentType\n  }\n  imageUrl\n  premiereDate\n  title\n  scriptEmbedUrl: scriptUrl\n}\n\nfragment reviewFragment on ProductReview {\n  body(textFormat: MARKDOWN) {\n    content\n  }\n  hed\n  id\n  metadata {\n    contentType\n  }\n  promoDek\n  tout {\n    ...photoField\n  }\n  url: uri\n}\n\n# TNY Venue\nfragment venueFragment on Venue {\n  id\n  name\n  venueUrl: url\n  metadata {\n    contentType\n  }\n}\n\nfragment cneVideoFragment on CNEVideo {\n  cneId\n  dek: description\n  id\n  metadata {\n    contentType\n  }\n  scriptEmbedUrl: scriptUrl\n  title\n}\n\nfragment contributorField on Contributor {\n  id\n  url: uri\n  name\n  contributorType: type\n  photo: tout {\n    ...photoField\n  }\n  title\n  bio\n  shortBio\n  socialMedia {\n    handle\n    network\n  }\n  metadata {\n    contentType\n  }\n}\n fragment galleryEmbedFragment on Gallery {\n    id\n    contentWarnings {\n      slug\n    }\n    metadata {\n      contentType\n    }\n    allContributors {\n      edges {\n        node {\n          ...contributorFragment\n        }\n      }\n    }\n    hed\n    promoDek\n    rubric\n    lede {\n      ...photoField\n      ...cneVideoFragment\n      ...clipFragment\n    }\n    channel {\n      name\n      slug\n    }\n    channels: categories(taxonomy: \"channels\") {\n      name\n    }\n    tout {\n      ...photoField\n    }\n    connectedItems(limit: 100) {\n      totalResults\n      edges {\n        node {\n          ...articleFragment\n          ...cartoonFragment\n          ...clipFragment\n          ...photoField\n          ...recipeFragment\n          ...reviewFragment\n          ...venueFragment\n        }\n      }\n    }\n    url: uri\n  }`,
  variables: { "organizationId": "4gKgcEwKAVNxUrZexgrooyWrpMcR", "uri": "gallery/best-restaurants-in-charleston", "skipRelatedContent": false, "skipCategoryTaxonomies": true }

}

export const galleryItemsQuery = {
  query: `
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
            ...externalLinkFragment
            ...photoField
            ...placeFragment
            ...productField
            ...recipeFragment
            ...reviewFragment
            ...venueFragment
            ...on Cartoon {
               credit
               caption
              }
            ... on UnsupportedContent {
              __typename
              id
              metadata {
                contentType
              }
            }
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
  }
`,
  variables: { "organizationId": "4gKgcEwKAVNxUrZexgrooyWrpMcR", "uri": "gallery/best-restaurants-in-charleston", "limit": 100 }
}

export const profilePageQuery = {
  query: "fragment photoField on Photo {\n        altText        \n        aspectRatios {\n            name\n            url\n            width\n            height\n            format\n            modifications {\n                crop {\n                    height\n                    width\n                    x\n                    y\n                }\n            }\n        }\n        caption\n        contextualBody\n        contextualCaption\n        contextualTitle\n        cropMode\n        credit        \n        filename\n        id\n        metadata {\n          contentType\n        }\n        contentWarnings{\n          slug\n        }\n        restrictCropping\n        __typename      \n    }\nquery getBusiness($organizationId: ID!, $id: String, $uri: String) {\n    getBusiness(organizationId: $organizationId, id: $id, uri: $uri) {\n      id\n      name\n      legalName\n      contactPoint {\n        email\n        telephone\n        url\n      }\n      knowsAbout\n      description\n      hasDataConsent\n      address {\n        street\n        streetExtended\n        city\n        postalCode\n        state\n        country\n      }\n      geo {\n        lat\n        lng\n      }\n      seoTitle\n      seoDescription\n      socialMedia {\n        handle\n        network\n      }\n      photos: connected(relname: \"photos\") {\n        edges {\n          node {\n            ... on Photo {\n              ...photoField\n            }\n          }\n        }\n      }\n      photosLede: connected(relname: \"photosLede\") {\n        edges {\n          node {\n            ... on Photo {\n              ...photoField\n            }\n          }\n        }\n      }\n      photosLogo: connected(relname: \"photosLogo\") {\n        edges {\n          node {\n            ... on Photo {\n              ...photoField\n            }\n          }\n        }\n      }\n      photosTout: connected(relname: \"photosTout\") {\n        edges {\n          node {\n            ... on Photo {\n              ...photoField\n            }\n          }\n        }\n      }\n      categories: connected(relname: \"categories-ad-directory\") {\n        edges {\n          node {\n            __typename\n            ... on Category {\n              metadata {\n                contentType\n              }\n              hierarchy {\n                name\n                slug\n              }\n            }\n          }\n        }\n      }\n    }\n  }",
  variables: {
    "organizationId": "4gKgcErAkkSHxcAFYh1GjXEpxc6q",
    "uri": "adpro/directory/profile/test-business-profile"
  }
}

export const profileSearchPage ={
  query :`query (\n    $organizationId: ID!\n    $contentPage: Int\n    $contentLimit: Int = 20\n    $qString: String!\n    $query: String\n  ) {\n    search(\n      organizationId: $organizationId\n      filters: { hierarchies: [$qString], types: [BUSINESS] }\n      query: $query\n    ) {\n      content(page: $contentPage, limit: $contentLimit) {\n        page\n        totalResults\n        results {\n          ... on Business {\n            id\n            name\n            legalName\n            contactPoint {\n              email\n            }\n            address {\n              city\n              state\n            }\n            description\n            metadata {\n              contentType\n            }\n            knowsAbout\n            socialMedia {\n              handle\n            }\n            connected(relname: \"photos\", type: PHOTO) {\n              edges {\n                node {\n                  ... on Photo {\n                    ...photoField\n                  }\n                }\n              }\n            }\n\n            photosLede: connected(relname: \"photosLede\") {\n              edges {\n                node {\n                  ... on Photo {\n                    ...photoField\n                  }\n                }\n              }\n            }\n\n            photosTout: connected(relname: \"photosTout\") {\n              edges {\n                node {\n                  ... on Photo {\n                    ...photoField\n                  }\n                }\n              }\n            }\n\n            photosLogo: connected(relname: \"photosLogo\") {\n              edges {\n                node {\n                  ... on Photo {\n                    ...photoField\n                  }\n                }\n              }\n            }\n\n            categories: connected(relname: \"categories-ad-directory\") {\n              edges {\n                node {\n                  __typename\n                  ... on Category {\n                    metadata {\n                      contentType\n                    }\n                    hierarchy {\n                      name\n                      slug\n                    }\n                  }\n                }\n              }\n            }\n\n            publishedRevisions {\n              results {\n                ... on Business {\n                  uri\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n  fragment photoField on Photo {\n        altText        \n        aspectRatios {\n            name\n            url\n            width\n            height\n            format\n            modifications {\n                crop {\n                    height\n                    width\n                    x\n                    y\n                }\n            }\n        }\n        caption\n        contextualBody\n        contextualCaption\n        contextualTitle\n        cropMode\n        credit        \n        filename\n        id\n        metadata {\n          contentType\n        }\n        contentWarnings{\n          slug\n        }\n        restrictCropping\n        __typename      \n    }`,
  variables: {"organizationId":"4gKgcEwfFP9GHnX9S1tUNoPkZdoV","contentLimit":100,"qString":"ad-directory/business-type/architecture/building-architect"}
 }

