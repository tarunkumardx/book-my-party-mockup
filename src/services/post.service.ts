import CommonService from './common.service'

class PostService extends CommonService {
  /**
   * Get list of posts with their slugs.
   *
   * @returns - An object containing post slugs
   */
  async getAllPosts(after?: string) {
    let allPosts: string[] = []

    const { data } = await this.post({query: `
    query getAllPosts($after: String) {
      posts(first: 50, after: $after) {
        nodes {
          id
          title
          slug
          content
          seo {
            title
            metaDesc
          }
          featuredImage {
            node {
              mediaItemUrl
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  `,variables: { after }})

    if (data?.posts?.nodes) {
      allPosts = [...allPosts, ...data.posts.nodes]
    }

    if (data?.posts?.pageInfo?.hasNextPage) {
      const postCursor: string[] = await this.getAllPosts(data?.posts?.pageInfo?.endCursor)
      allPosts = [...allPosts, ...postCursor]
    }
    return allPosts
  }

  async getAll(after?: string) {
    const { data } = await this.post({query: `
    query getAllPosts($after: String) {
      posts(first: 6, after: $after) {
        nodes {
          id
          title
          slug
          content
          seo {
            title
            metaDesc
          }
          featuredImage {
            node {
              mediaItemUrl
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  `,variables: { after }})

    return data.posts
  }

  /**
   * Get post details by slug.
   *
   * @returns - An object containing detailed information about the post.
   */
  async getRecentPosts() {
    return await this.post({query: `
    query getRecentPosts {
      posts(first: 5, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            title
            slug
            content
            date
            featuredImage {
              node {
                mediaItemUrl
                slug
                title
                uri
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
   `}
    )
  }

  /**
   * Get post details by slug.
   *
   * @param {String} id - The slug of the post.
   * @returns - An object containing detailed information about the post.
   */
  async getPostBySlug(id: string) {
    const result = await this.post({query: `
      query getPostBySlug($id: ID = "") {
        post(id: $id, idType: SLUG) {
          id
          slug
          title
          content
          date
          author {
            node {
              name
            }
          }
          seo {
            title
            metaDesc
          }
          featuredImage {
            node {
              mediaItemUrl
              slug
              title
            }
          }
        }
      }
      `, variables: { id }
    }
    )

    return result.data.post
  }
}

export const postService = new PostService()