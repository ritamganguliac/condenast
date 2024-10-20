export const layoutConfigServiceQuery = {
  query: `query LayoutConfigs($organizationId: ID!, $query: LayoutConfigsQueryInput!, $mergeWithPreset: Boolean) {
  layoutConfigs(organizationId: $organizationId, query: $query) {
    id
    contentId
    contentRevision
    organizationId
    layouts(mergeWithPreset: $mergeWithPreset) {
      layoutId
      preset {
        ... on BundleLayoutPreset {
          id
          name
          theme
          palette
          presetCategory
          channelPath
          organizationId
          containerType
          containerImage {
            id
            altText
            filename
          }
          palette
          presetCategory
        }
      }
      theme
      componentConfigs {
        SummaryItem {
          settings
          variation
        }
        SummaryCollectionGrid {
          settings
          variation
        }
        SectionTitle {
          settings
          variation
        }
        ContentHeader {
          settings
          variation
        }
        SmartContainer {
          settings
          variation
        }
        SmartItem {
          settings
          variation
        }
      }
      renditionConfigs {
        name
        config {
          sm {
            aspectRatio
          }
          md {
            aspectRatio
          }
          lg {
            aspectRatio
          }
          xl {
            aspectRatio
          }
        }
      }
    }
  }
}`,
  variables: {
    "organizationId": "4gKgcFDnpSvUqozcC7TYUEcCiDJv",
    "query": {
      "contentId": "",
      "contentRevision": ""
    },
    "mergeWithPreset": true
  }
}
