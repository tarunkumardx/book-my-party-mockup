import CommonService from './common.service'

class PageService extends CommonService {
  /**
   * Fetches a list of pages.
   *
   * @returns - An object containing an array of page nodes, each with title, content, slug, and featuredImage details.
   */
  async getAllPages() {
    const data = await this.post({
      query: `
      query getAllPages {
        pages(first: 50) {
          nodes {
            title
            slug
            seo {
              title
              metaDesc
            }
          }
        }
      }
    `})

    return data.data.pages.nodes
  }

  /**
   * Get page details by slug
   *
   * @param {String} id - Page slug
   * @returns - An object containing page details, including content, title, slug, ID, and URI.
   */
  async getPageBySlug(id: string) {
    const data = await this.post({
      query: `
      query getPageBySlug($id: ID = "") {
        page(id: $id, idType: URI) {
          id
          title
          slug
          uri
          content
          contentTypeName
          seo {
            title
            metaDesc
          }
          template {
            templateName
            ... on PageBuilderTemplate {
              templateName
              pagesPagebuilder {
                pageLayout {
                  ... on PagesPagebuilderPageLayoutHeadingLayout {
                    fieldGroupName
                    headingType
                    title
                  }
                  ... on PagesPagebuilderPageLayoutContentBoxLayout {
                    content
                    fieldGroupName
                  }
                  ... on PagesPagebuilderPageLayoutVenuesLayout {
                    headingType
                    fieldGroupName
                    title
                    link {
                      label
                      target
                    }
                    items {
                      nodes {
                        ... on Venue {
                          id
                          title
                          slug
                          featuredImage {
                            node {
                              mediaItemUrl
                              sourceUrl
                            }
                          }
                          extraOptions {
                            paxPrice
                            googleReviewsId
                            address {
                              address
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
      `, variables: { id }
    });

    return data.data.page
  }

  /**
   * Get home page hero slider
   *
   * @param {String} id - Page slug
   * @returns {Object} - An object containing page details, including content, title, slug, ID, and URI.
   */
  async getPageBuilderElements(id: string) {
    const result = await this.post({
      query: `
      query PageBuilder($id: ID = "") {
        page(id: $id, idType: URI) {
          id
          seo {
            title
            metaDesc
          }
          pageBuilder {
            pageLayout {
              ... on PageBuilderPageLayoutOffersSliderLayout {
                fieldGroupName
                title
                offers {
                  tabTitle
                  offerSlider {
                    url
                    image {
                      node {
                        mediaItemUrl
                      }
                    }
                  }
                }
              }
              ... on PageBuilderPageLayoutHowItWorksLayout {
                fieldGroupName
                workBoxes {
                  title
                  description
                  icon {
                    node {
                      mediaItemUrl
                    }
                  }
                }
              }
              ... on PageBuilderPageLayoutTopPartyPlacesLayout {
                fieldGroupName
                subtitle
                title
                places {
                  location {
                    nodes {
                      id
                      name
                      slug
                    }
                  }
                  venues {
                    nodes {
                      ... on Venue {
                        id
                        title
                        slug
                        databaseId
                        featuredImage {
                          node {
                            mediaItemUrl
                          }
                        }
                        extraOptions {
                          address {
                            address
                            googleMap
                            landmarks
                          }
                          paxPrice
                        }
                      }
                    }
                  }
                }
              }
              ... on PageBuilderPageLayoutBmpLuxeLayout {
                description
                fieldGroupName
                title
                items {
                  location
                  title
                  image {
                    node {
                      mediaItemUrl
                    }
                  }
                  link {
                    label
                    target
                  }
                }
                link {
                  label
                  target
                }
              }
              ... on PageBuilderPageLayoutMemoryLayout {
                fieldGroupName
                image {
                  node {
                    mediaItemUrl
                  }
                }
              }
              ... on PageBuilderPageLayoutGalleryLayout {
                fieldGroupName
                subTitle
                title
                gallery {
                  nodes {
                    mediaItemUrl
                  }
                }
                link {
                  label
                  target
                }
              }
              ... on PageBuilderPageLayoutBlogsLayout {
                description
                fieldGroupName
                title
                subtitle
                link {
                  label
                  target
                }
              }
              ... on PageBuilderPageLayoutTestimonialSliderLayout {
                fieldGroupName
                subtitle
                title
                testimonials {
                  name
                  quotes
                  ratingStar
                  avatar {
                    node {
                      mediaItemUrl
                    }
                  }
                }
              }
              ... on PageBuilderPageLayoutFaqsListLayout {
                fieldGroupName
                listItems {
                  answer
                  question
                }
              }
            }
          }
        }
      }
  `, variables: { id }
    });

    return result?.data?.page
  }

  async getAllPosts() {
    const result = await this.post({
      query: `
        query Post {
          posts(first: 6, where: { orderby: { field: DATE, order: DESC } }) {
            nodes {
              title
              slug
              content
              featuredImage {
                node {
                  mediaItemUrl
                }
              }
            }
          }
        }
      `
    })
    return result.data.posts.nodes
  }
}

export const pageService = new PageService();
