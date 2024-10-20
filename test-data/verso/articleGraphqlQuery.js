export const articleQuery = {
  query: `query($orgId: ID!, $uri: String) {
    getArticle(organizationId: $orgId, uri: $uri) {
      uri
      hed
      dek
      issueDate
      body {
        content
        connectedEmbeds {
          edges {
            node {
              ... on Cartoon {
                caption
                credit
                title
                id
              }
              ... on Photo {
                id
                credit
                caption
              }
            }
          }
          totalResults
        }
        __typename
      }
      promoHed
      promoDek
      contextualHed
      contextualDek
      pubDate
      socialTitle
      channel {
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
          id
          name
          slug
        }
        root {
          slug
        }
      }
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
          caption
          filename
          credit
        }
      }
      seo {
        title
        description
      }
      linkList {
        ...curatedListField
        ...LinkListData
      }
      relatedContent {
        results {
          ...articleField
          ...curatedListField
          ...galleryField
          ...photoField
          ...recipeField
          ...reviewField
        }
      }
    }
  }
  
  fragment articleField on Article {
   __typename
   metadata {
    contentType
   }
   dek
   hed
   promoDek
   promoHed
   pubDate
   rubric
   isSponsored
   url: uri
   allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
        edges {
          node {
            ... on Contributor {
              name
            }
          }
        }
   }
    tout {
      ...photoField
    }
  }
  
  fragment galleryField on Gallery {
   __typename
   metadata {
    contentType
   }
   dek
   hed
   promoDek
   promoHed
   pubDate
   rubric
   isSponsored
   url: uri
   allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
        edges {
          node {
            ... on Contributor {
              name
            }
          }
        }
   }
    tout {
      ...photoField
    }
  }
  
  fragment recipeField on Recipe {
     __typename
   metadata {
    contentType
   }
   dek
   hed
   promoDek
   promoHed
   pubDate
   url: uri
   allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
        edges {
          node {
            ... on Contributor {
              name
            }
          }
        }
   }
    tout {
      ...photoField
    }
  }
  
  fragment reviewField on ProductReview {
   __typename
   metadata {
    contentType
   }
   dek
   hed
   promoDek
   promoHed
   pubDate
   rubric
   url: uri
   allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
        edges {
          node {
            ... on Contributor {
              name
            }
          }
        }
   }
   tout {
      ...photoField
   }
  }
  
  fragment LinkListData on CuratedList {
    __typename
    curationSubType
    body(textFormat: MARKDOWN) {
      content
      embeds {
        ...photoField
      }
    }
    textItems {
      content
    }
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
    contentWarnings {
      slug
    }
    restrictCropping
    __typename
  }  
 `,
  variables: {
    "orgId": "",
    "uri": ""
  }
};


export const searchQuery = {
  query: `fragment contributorFragment on Contributor {
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
\nfragment clipField on Clip {
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
\nfragment cartoonFragment on Cartoon {
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
 url: uri
 aspectRatios {
  name
  url
 }
 storeUrl
 publishInfo {
  firstPublished
 }
}
\nfragment photoData on Photo {
 altText
 contextualBody
 credit
 cropMode
 filename
 id
 title
 aspectRatios {
  height
  name
  override
  url
  width
  modifications {
   crop {
    height
    width
   }
  }
 }
 __typename
 metadata {
  contentType
 }
}
\nfragment reviewField on ProductReview {
 __typename
 metadata {
  contentType
 }

 dek
 hed
 promoDek
 promoHed
 pubDate
 rubric

 url: uri
 allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
  edges {
   node {
    ...contributorFragment
   }
  }
 }
 tout {
  ...photoData
 }
}
\nfragment articleField on Article {
 __typename
 metadata {
  contentType
 }

 dek
 hed
 promoDek
 promoHed
 pubDate
 rubric
 isSponsored
 url: uri
 allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
  edges {
   node {
    ...contributorFragment
   }
  }
 }
 tout {
  ...photoData
 }
 toutMedia {
  node {
   ...clipField
   ...photoData
  }
 }
 channels: categories(taxonomy: \"channels\") {
  name
  slug

  parentCategory {
   name
   slug
  }
 }
 sections: categories(taxonomy: \"sections\") {
  name
  slug
 }
 syndication {
  source
 }
}
\nfragment galleryField on Gallery {
 __typename
 metadata {
  contentType
 }
 dek
 hed
 id
 promoDek
 promoHed
 pubDate
 rubric
 isSponsored

 connectedItems(limit: $connectedItemsLimit) {
  totalResults
  limit
  edges {
   node {
    ...cartoonFragment
   }
  }
 }

 relatedContent: connected(relname: \"related\", limit: 3) {
  edges {
   node {
    ... on Gallery {
     __typename
     metadata {
      contentType
     }
     dek
     hed
     id
     promoDek
     promoHed
     pubDate
     rubric
     isSponsored
     url: uri
     connectedItems(page: 1, limit: 1) {
      totalResults
      edges {
       node {
        ...cartoonFragment
       }
      }
     }
    }
   }
  }
 }

 url: uri

 allContributors(types: [AUTHOR, PHOTOGRAPHER]) {
  edges {
   node {
    ...contributorFragment
   }
  }
 }
 tout {
  ...photoData
 }
 toutMedia {
  node {
   ...clipField
   ...photoData
  }
 }
 channels: categories(taxonomy: \"channels\") {
  name
  slug
  parentCategory {
   name
   slug
  }
 }
 sections: categories(taxonomy: \"sections\") {
  name
  slug
 }
 syndication {
  source
 }
 recomendedGallery:recommendations(
   contentTypes: [GALLERY],
   limit: 3
   category: [\"channels/cartoons\"]
  ) {
  limit
   results {
    id
    __typename
    ... on Gallery {
     id
     hed
     dek
     connected {
      edges {
       node {
        ... on Category {
         slug
         hierarchy {
          slug
         }
        }
       }
      }
     }
    }
   }
  }
}
fragment CNEVideoField on CNEVideo {
 __typename
 metadata {
  contentType
 }
 description
 embedUrl
 id
 photo: imageUrl
 scriptEmbedUrl: scriptUrl
 title
 url: canonicalUrl
}
fragment recipeField on Recipe {
 __typename
 metadata {
  contentType
 }
 dek
 hed
 promoDek
 promoHed
 pubDate
 url: uri
 syndication {
  source
 }
 allContributors {
  edges {
   node {
    ...contributorFragment
   }
  }
 }
 tout {
  ...photoData
 }
}
fragment nativeRecipeField on NativeRecipe {
 __typename
 metadata {
  contentType
 }
 dek
 hed
 promoDek
 promoHed
 pubDate
 url: uri
 allContributors {
  edges {
   node {
    ...contributorFragment
   }
  }
 }
 tout {
  ...photoData
 }
}
fragment runwayCollectionField on RunwayShow {
 __typename
 metadata {
  contentType
 }
 season {
  name
 }
 designer {
  name
 }
 pubDate

 url: uri
 promoImage {
  ...photoData
 }
 channels: categories(taxonomy: \"channels\") {
  name
  slug
  parentCategory {
   name
   slug
  }
 }
}
\nquery GetSearch(
 $organizationId: ID!
 $query: String
 $filters: SearchFilters
 $sort: [SortInput!]
 $page: Int
 $limit: Int,
 $connectedItemsLimit: Int = 20
) {
 search(
  organizationId: $organizationId
  query: $query
  filters: $filters
  sort: $sort
 ) {
  content(page: $page, limit: $limit) {
   limit
   results {
    ...reviewField
    ...articleField
    ...galleryField
    ...CNEVideoField
    ...recipeField
    ...nativeRecipeField
    ...runwayCollectionField
    id
    metadata {
     contentType
    }
   }
   page
   limit
   totalResults
  }
 }
`,
  variables: {
    "orgId": "4gKgcEy9SqS1hhu8DJ37D8GnRNuV",
    "filters": {
      "notIds": ["62181754fd03902891e75b10"],
      "random": true,
      "hierarchies": "channels/cartoons",
      "types": "GALLERY",
      "seed": "2023-01-15"
    }, "limit": 1
  }
};
