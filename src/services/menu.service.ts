import CommonService from './common.service'

class MenuService extends CommonService {
/**
 * Get navigation menu items based on the specified location.
 *
 * @param {String} location - The menu location enum value.
 * @returns - An object containing an array of menu item nodes, each with label and uri details.
 */
  async getNavigation(location: string) {
    const result = await this.post({
      query: `
        query getMenuItems($location: MenuLocationEnum) {
          menuItems(first: 60, where: { location: $location }) {
            nodes {
              label
              path
              parentId
              title
              childItems (first: 50) {
                nodes {
                  label
                  title
                  path
                }
              }
            }
          }
        }
      `,
      variables: { location }
    });

    return result.data.menuItems.nodes
  }
}

export const menuService = new MenuService()
