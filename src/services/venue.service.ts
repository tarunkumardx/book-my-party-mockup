import { TaxonomyConfig, _Object } from '@/utils/types'
import CommonService from './common.service'
// import { changeDateFormat } from '@/utils/helpers'

class ListService extends CommonService {
  // async getAll() {
  // 	// let allVenues: string[] = []

  // 	const { data } = await this.post({
  // 		query: `
  //       query getAll ($after: String){
  //         venues(first: 50, after: $after) {
  //           nodes {
  //             id
  //             title
  //             slug
  //             content
  //             seo {
  //               title
  //               metaDesc
  //             }
  //             featuredImage {
  //               node {
  //                 sourceUrl
  //               }
  //             }
  //             extraOptions {
  //               address {
  //                 address
  //                 googleMap
  //                 landmarks
  //               }
  //             }
  //           }
  //           pageInfo {
  //             endCursor
  //             hasNextPage
  //             hasPreviousPage
  //             startCursor
  //           }
  //         }
  //       }
  //     `
  // 	})

  // 	// if (data?.venues?.nodes) {
  // 	// 	allVenues = [...allVenues, ...data.venues.nodes]
  // 	// }

  // 	// if (data?.venues?.pageInfo?.hasNextPage) {
  // 	// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
  // 	// 	const postCursor: any = await this.getAll(data?.venues?.pageInfo.endCursor)
  // 	// 	if (postCursor) {
  // 	// 		allVenues = [...allVenues, ...postCursor.nodes]
  // 	// 	}
  // 	// }

  // 	return { nodes: data?.venues?.nodes }
  // }

  async getAll(after = null) {
    let allVenues: string[] = []

    const { data } = await this.post({
      query: `
	      query getAll ($after: String){
	        venues(first: 50, after: $after) {
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
	                sourceUrl
	              }
	            }
	            extraOptions {
	              address {
	                address
	                googleMap
	                landmarks
	              }
                rankingPriority
                hide
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
	    `, variables: { after }
    })

    if (data?.venues?.nodes) {
      allVenues = [...allVenues, ...data.venues.nodes]
    }

    if (data?.venues?.pageInfo?.hasNextPage) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const postCursor: any = await this.getAll(data?.venues?.pageInfo.endCursor)
      if (postCursor) {
        allVenues = [...allVenues, ...postCursor.nodes]
      }
    }

    return { nodes: allVenues }
  }

  async getVenues(
    first?: number | undefined,
    endCursor?: string | undefined | null,
    startCursor?: string | undefined | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    search?: any
  ) {
    const taxArray: string[] = []

    const taxonomyConfigs: TaxonomyConfig[] = [
      { taxonomy: 'LOCATION', filterKey: 'locations' },
      { taxonomy: 'VENUECATEGORY', filterKey: 'types' },
      { taxonomy: 'VENUETYPE', filterKey: 'venueTypes' },
      { taxonomy: 'CUISINE', filterKey: 'cuisines' },
      { taxonomy: 'FRANCHISECHAIN', filterKey: 'franchises' },
      { taxonomy: 'AMENITY', filterKey: 'amenities' },
      { taxonomy: 'OCCASION', filterKey: 'occasions' },
      { taxonomy: 'ACTIVITY', filterKey: 'activities' },
      { taxonomy: 'AGEGROUP', filterKey: 'age' }
    ];

    function updateTaxArray(filters: _Object, taxArray: string[]) {
      console.log(filters)
      for (const config of taxonomyConfigs) {
        const filterValues = filters?.[config.filterKey];
        if (filterValues?.length > 0 && filterValues[0]?.length > 0) {
          taxArray.push(`
            {
                field: SLUG,
                taxonomy: ${config.taxonomy},
                terms: ["${filterValues.join('","')}"]
            }`
          );
        } else {
          const itemIndex = taxArray.findIndex((item: string) => item.includes(`taxonomy: ${config.taxonomy}`));
          if (itemIndex !== -1) {
            taxArray.splice(itemIndex, 1);
          }
        }
      }
    }

    updateTaxArray(filters, taxArray);

    const metaArray: string[] = []

    if (filters?.priceRange?.length > 0 && filters?.priceRange[0]?.length > 0) {
      const minMaxValues = filters?.priceRange?.map((range: string) => {
        const [min, max] = range.split('-').map(Number);
        return [min, max];
      });

      // Flatten the array of arrays into a single array
      const flattenedMinMaxValues = minMaxValues.reduce((acc: number[], [min, max]: number[]) => {
        acc.push(min, max);
        return acc;
      }, []);

      // Find the minimum and maximum values
      const min = Math.min(...flattenedMinMaxValues);
      const max = Math.max(...flattenedMinMaxValues);

      if (min != 2000 && min != 3000) {
        metaArray.push(`{
					compare: BETWEEN,
					key: "pax_price",
					type: NUMERIC,
					value: "${[min, max]}"
				}`);
      }

      minMaxValues?.map((item: _Object) => {
        if ((item[1] == 2000 && item[0] == 2000) || (item[1] == 3000 && item[0] == 3000)) {
          metaArray.push(`{
            compare: GREATER_THAN_OR_EQUAL_TO,
            key: "pax_price",
            type: NUMERIC,
            value: "${item[1]}"
          }`);
        }
      })
    } else {
      const itemIndex = metaArray.findIndex((item: string) => item.includes('key: "pax_price"'));
      if (itemIndex !== -1) {
        metaArray.splice(itemIndex, 1);
      }
    }

    if (filters?.capacity?.length > 0 && filters?.capacity[0]?.length > 0) {
      const minMaxValues = filters?.capacity?.map((range: string) => {
        const [min, max] = range.split('-').map(Number);
        return [min, max];
      });

      // Flatten the array of arrays into a single array
      const flattenedMinMaxValues = minMaxValues.reduce((acc: number[], [min, max]: number[]) => {
        acc.push(min, max);
        return acc;
      }, []);

      // Find the minimum and maximum values
      const min = Math.min(...flattenedMinMaxValues);
      const max = Math.max(...flattenedMinMaxValues);

      if (min != 1000) {
        metaArray.push(`{
					compare: BETWEEN,
					key: "capacity",
					type: NUMERIC,
					value: "${[min, max]}"
				}`);
      }

      minMaxValues?.map((item: _Object) => {
        if ((item[1] == 1000 && item[0] == 1000)) {
          metaArray.push(`{
					compare: GREATER_THAN_OR_EQUAL_TO,
					key: "capacity",
					type: NUMERIC,
					value: "${item[1]}"
				}`);
        }
      })
    } else {
      const itemIndex = metaArray.findIndex((item: string) => item.includes('key: "capacity"'));
      if (itemIndex !== -1) {
        metaArray.splice(itemIndex, 1);
      }
    }

    // if (filters?.date?.length > 0 && changeDateFormat(filters.date)) {
    // 	metaArray.push(`{
    // 		value: "${changeDateFormat(filters.date)}",
    // 		key: "holidays",
    // 		compare: NOT_LIKE
    // 	}`);
    // 	metaArray.push(`{
    // 		key: "holidays",
    // 		compare: NOT_EXISTS
    // 	}`);
    // }

    let sortKey: string
    let sortValue: string

    switch (filters?.sort) {
    case 'recommended':
      sortKey = 'RANKING_PRIORITY';
      sortValue = 'ASC';
      break;
    case '-price':
      sortKey = 'PAXPRICE';
      sortValue = 'ASC';
      break;
    case 'price':
      sortKey = 'PAXPRICE';
      sortValue = 'DESC';
      break;
    case '-title':
      sortKey = 'TITLE';
      sortValue = 'ASC';
      break;
    case 'title':
      sortKey = 'TITLE';
      sortValue = 'DESC';
      break;
    default:
      sortKey = 'RANKING_PRIORITY';
      sortValue = 'ASC';
      break;
    }

    const { data } = await this.post({
      query: `
      query getVenues(
        $first: Int
        $after: String
        $before: String
      )
      {
        venues(first: $first, after: $after, before: $before,
          where: {
            taxQuery: {
              relation: AND
              taxArray: [${taxArray}]
            },
            metaQuery: {
              relation: OR,
              metaArray: [${metaArray}]
            },
            orderby: {field: ${sortKey}, order: ${sortValue}},
            search: "${search?.length > 0 ? search : ''}",
            author: ${filters?.author || 0},
            ${filters?.hideVenues === true ? 'hide: false' : ''}
          }
          ) 
          {
            nodes {
              id
              title
              slug
              content
              databaseId
              allCuisine {
                nodes {
                  name
                  slug
                }
              }
              activities {
                nodes {
                  name
                  slug
                }
              }
              seo {
                title
                metaDesc
              }
              featuredImage {
                node {
                  sourceUrl
                }
              }
              extraOptions {
                googleReviewsId
                address {
                  address
                  googleMap
                  landmarks
                }
                  
                paxPrice
                holidays
                rankingPriority
                hide
              }
            }
            pageInfo {
              endCursor
              hasNextPage
              hasPreviousPage
              startCursor
              total
            }
          }
      }
      `, variables: {
        first: first,
        after: endCursor,
        before: startCursor
      }
    })

    return data?.venues
  }

  async getVenueDetails(id: string, type?: string) {
    const idType = type ? type : 'URI'

    const { data } = await this.post({
      query: `
        query getVenue ($id: ID = "") {
          venue(id: $id, idType: ${idType}) {
            allCuisine(first: 100) {
              nodes {
                id
                name
                slug
                databaseId
              }
            }
            amenities(first: 100) {
              nodes {
                id
                name
                slug
                databaseId
              }
            }
            activities(first: 100) {
              nodes {
                id
                name
                slug
                databaseId
              }
            }
            ageGroups(first: 100) {
              nodes {
                id
                name
                slug
              }
            }
            occasions(first: 100) {
              nodes {
                id
                name
                slug
              }
            }
            venueCategories(first: 100) {
              nodes {
                id
                name
                slug
              }
            }
            venueTypes(first: 100) {
              nodes {
                id
                name
                slug
              }
            }
            extraOptions {
            rankingPriority
                hide
              packageStartingFrom {
                packageStartingType
                packageStartingTitle
                packageStartingPrice
              }
              alaCarteMenu {
                title
                gallery {
                  image {
                    node {
                      mediaItemUrl
                      databaseId
                      mediaDetails {
                        height
                        width
                      }
                    }
                  }
                }
              }
              address {
                address
                googleMap
                landmarks
                subLocation
              }
                
              googleReviewsId
              capacity
              faqs {
                question
                answer
              }
              highlights
              mediaGallery {
                videoUrl
                imageGallery {
                  items {
                    node {
                      mediaItemUrl
                      databaseId
                    }
                  }
                }
              }
              menuItems {
                itemCategory(first: 500) {
                  nodes {
                    id
                    name
                    slug
                    databaseId
                  }
                }
                itemSubCategory(first: 500) {
                  nodes {
                    id
                    name
                    slug
                    databaseId
                  }
                }
                items(first: 500) {
                  nodes {
                    id
                    slug
                    ... on FoodMenuItem {
                      id
                      title
                      slug
                      databaseId
                    }
                  }
                }
              }
              packages {
                packageSettings1 {
                  items
                  category(first: 100) {
                    nodes {
                      databaseId
                      id
                      name
                      slug
                    }
                  }
                  subCategory(first: 10) {
                    nodes {
                      id
                      name
                      slug
                      databaseId
                    }
                  }
                }
                content
                image {
                  node {
                    mediaItemUrl
                    databaseId
                  }
                }
                price
                title
                dietaryPreference
                freeCancellation
                menuDetail
                minPax
                salePrice
                shortDescription
                timing
                validOn
                packageSettings {
                  menuitem145 {
                    menuitem146
                    menuitem147
                    menuitem148
                    menuitem153
                    menuitem154
                    menuitem171
                    menuitem172
                    menuitem233
                    menuitem335
                  }
                  menuitem149 {
                    fieldGroupName
                    menuitem150
                    menuitem151
                    menuitem173
                    menuitem174
                    menuitem175
                    menuitem176
                    menuitem177
                    menuitem178
                    menuitem179
                    menuitem180
                    menuitem181
                    menuitem182
                    menuitem183
                    menuitem184
                    menuitem185
                    menuitem186
                    menuitem187
                    menuitem188
                    menuitem189
                    menuitem190
                    menuitem191
                  }
                  menuitem192 {
                    menuitem193
                    menuitem194
                    menuitem195
                    menuitem196
                  }
                  menuitem197 {
                    menuitem198
                    menuitem199
                    menuitem200
                    menuitem201
                    menuitem202
                    menuitem203
                    menuitem204
                    menuitem205
                    menuitem206
                    menuitem207
                    menuitem208
                    menuitem209
                    menuitem210
                    menuitem211
                    menuitem212
                    menuitem213
                    menuitem214
                    menuitem215
                    menuitem216
                    menuitem217
                    menuitem218
                  }
                }
              }  
              paxPrice
              holidays
              propertyRules(first: 50) {
                nodes {
                  id
                  ... on PropertyRule {
                    id
                    title
                    slug
                    databaseId
                    propertyrulecategories {
                      nodes {
                        id
                        name
                        slug
                      }
                    }
                  }
                }
              }
            }
            featuredImage {
              node {
                id
                mediaItemUrl
                databaseId
              }
            }
            franchises {
              nodes {
                id
                name
                slug
              }
            }
            id
            locations {
              nodes {
                id
                name
                slug
              }
            }
            slug
            title
            content
            databaseId
            venueOwnerEmail
            author {
              node {
                id
                databaseId
              }
            }
            seo {
              title
              metaDesc
            }
          }
        }
      `,
      variables: { id }
    })

    return data?.venue
  }

  async getVenueDetailsById(id: string, type?: string) {
    const idType = type ? type : 'DATABASE_ID'

    const { data } = await this.post({
      query: `
        query getVenue ($id: ID = "") {
          venue(id: $id, idType: ${idType}) {
          venueCategories(first: 100) {
              nodes {
                id
                name
                slug
              }
            }
            extraOptions {
            rankingPriority
                hide
              packages {
                content
                price
                title
                dietaryPreference
                freeCancellation
                menuDetail
                minPax
                salePrice
                shortDescription
                timing
                validOn
              }
                  
            }
            id
            slug
            title
            content
            databaseId
            venueOwnerEmail
          }
        }
      `,
      variables: { id }
    })

    return data?.venue
  }

  async getAmenities() {
    const { data } = await this.post({
      query: `
        query getAmenities {
          amenities(where: {orderby: TERM_ORDER, order: ASC}, first: 100) {
            nodes {
              id
              name
              slug
              filtersOptions {
                displayAt {
                  nodes {
                    name
                    id
                    slug
                  }
                }
              }
            }
          }
        }
      `
    })

    return data?.amenities?.nodes
  }

  async getCuisines() {
    const { data } = await this.post({
      query: `
        query cuisines {
          allCuisine(where: {orderby: TERM_ORDER, order: ASC}, first: 100) {
            nodes {
              id
              name
              slug
              filtersOptions {
                displayAt {
                  nodes {
                    name
                    id
                    slug
                  }
                }
              }
            }
          }
        }
      `
    })

    return data?.allCuisine?.nodes
  }

  async getVenueCategories() {
    const { data } = await this.post({
      query: `
        query venueCategories {
          venueCategories(first: 100) {
            nodes {
              id
              name
              slug
            }
          }
        }
      `
    })

    return data?.venueCategories?.nodes
  }

  async uploadMedia(mediaItemInput: string) {
    const { data } = await this.post({
      query: `
        mutation MyMutation {
          createMediaItem(input: {filePath: "${mediaItemInput}"}) {
            mediaItem {
              databaseId
            }
          }
        }
      `
    })

    return data?.createMediaItem?.mediaItem?.databaseId
  }

  async getVenueTypes() {
    const { data } = await this.post({
      query: `
        query getVenueTypes {
          venueTypes(where: {orderby: TERM_ORDER, order: ASC}, first: 100) {
            nodes {
              id
              name
              slug
              filtersOptions {
                displayAt {
                  nodes {
                    name
                    id
                    slug
                  }
                }
              }
            }
          }
        }
      `
    })

    return data?.venueTypes?.nodes
  }

  async getFranchises() {
    const { data } = await this.post({
      query: `
        query franchises {
          franchises(where: {orderby: TERM_ORDER, order: ASC}, first: 100) {
            nodes {
              id
              name
              slug
              filtersOptions {
                displayAt {
                  nodes {
                    name
                    id
                    slug
                  }
                }
              }
            }
          }
        }
      `
    })

    return data?.franchises?.nodes
  }

  async getLocations() {
    const { data } = await this.post({
      query: `
        query locations {
          locations(where: {orderby: TERM_ORDER, order: ASC}, first: 100) {
            nodes {
              id
              name
              slug
              filtersOptions {
                displayAt {
                  nodes {
                    name
                    id
                    slug
                  }
                }
              }
              ancestors {
                nodes {
                  name
                  slug
                  ancestors {
                    nodes {
                      name
                      slug
                    }
                  }
                }
              }
            }
          }
        }
      `
    })

    return data?.locations?.nodes
  }

  async getAgeGroups() {
    const { data } = await this.post({
      query: `
        query ageGroups {
          ageGroups(where: {orderby: TERM_ORDER, order: ASC}, first: 100) {
            nodes {
              id
              name
              slug
              filtersOptions {
                displayAt {
                  nodes {
                    name
                    id
                    slug
                  }
                }
              }
            }
          }
        }
      `
    })

    return data?.ageGroups?.nodes
  }

  async getActivities() {
    const { data } = await this.post({
      query: `
        query activities {
          activities(where: {orderby: TERM_ORDER, order: ASC}, first: 100) {
            nodes {
              id
              name
              slug
              filtersOptions {
                displayAt {
                  nodes {
                    name
                    id
                    slug
                  }
                }
              }
            }
          }
        }
      `
    })

    return data?.activities?.nodes
  }

  async getOccasions() {
    const { data } = await this.post({
      query: `
        query occasions {
          occasions(where: {orderby: TERM_ORDER, order: ASC}, first: 100) {
            nodes {
              id
              name
              slug
              filtersOptions {
                displayAt {
                  nodes {
                    name
                    id
                    slug
                  }
                }
              }
            }
          }
        }
      `
    })

    return data?.occasions?.nodes
  }

  async createVenue(variables: _Object) {
    const { data } = await this.post({
      query: `
        mutation MyMutation(
          $title: String!
          $content: String!
          $capacity: String!
          $googleReviewsId: String!
          $highlights: String!
          $paxPrice: String!
          $address: String!
          $holidays: String!
          $mediaGallery: String!
          $alaCarteMenu: String!
          $menuItems: String!
          $packages: String!
          $propertyRules: String!
          $featuredImage: String!
          $authorId: ID!
          $activities: [VenueActivitiesNodeInput!]
          $ageGroups: [VenueAgeGroupsNodeInput!]
          $amenities: [VenueAmenitiesNodeInput!]
          $allCuisine: [VenueAllCuisineNodeInput!]
          $franchises: [VenueFranchisesNodeInput!]
          $locations: [VenueLocationsNodeInput!]
          $occasions: [VenueOccasionsNodeInput!]
          $venueCategories: [VenueVenueCategoriesNodeInput!]
          $venueTypes: [VenueVenueTypesNodeInput]
        ) {
          createVenue(
            input: {
              title: $title
              content: $content
              capacity: $capacity
              featuredImage: $featuredImage
              googleReviewsId: $googleReviewsId
              highlights: $highlights
              paxPrice: $paxPrice
              address: $address
              holidays: $holidays
              mediaGallery: $mediaGallery
              alaCarteMenu: $alaCarteMenu
              menuItems: $menuItems
              packages: $packages
              propertyRules: $propertyRules
              status: PUBLISH
              authorId: $authorId
              ageGroups: { nodes: $ageGroups}
              amenities: { nodes: $amenities }
              activities: { nodes: $activities }
              allCuisine: { nodes: $allCuisine }
              franchises: { nodes: $franchises }
              locations: { nodes: $locations }
              occasions: { nodes: $occasions }
              venueCategories: { nodes: $venueCategories }
              venueTypes: { nodes: $venueTypes}
            }
          ) {
            venue {
              title
              id
            }
          }
        }      
      `,
      variables: variables
    })

    return data?.createVenue?.venue
  }

  async updateVenue(variables: _Object) {
    const { data } = await this.post({
      query: `
        mutation MyMutation(
          $ID: ID!
          $title: String!
          $content: String!
          $capacity: String!
          $googleReviewsId: String!
          $highlights: String!
          $paxPrice: String!
          $address: String!
          $holidays: String!
          $mediaGallery: String!
          $alaCarteMenu: String!
          $menuItems: String!
          $featuredImage: String!
          $packages: String!
          $propertyRules: String!
          $authorId: ID!
          $activities: [VenueActivitiesNodeInput!]
          $ageGroups: [VenueAgeGroupsNodeInput!]
          $amenities: [VenueAmenitiesNodeInput!]
          $allCuisine: [VenueAllCuisineNodeInput!]
          $franchises: [VenueFranchisesNodeInput!]
          $locations: [VenueLocationsNodeInput!]
          $occasions: [VenueOccasionsNodeInput!]
          $venueCategories: [VenueVenueCategoriesNodeInput!]
          $venueTypes: [VenueVenueTypesNodeInput]
        ) {
          updateVenue(
            input: {
              id: $ID
              title: $title
              content: $content
              capacity: $capacity
              featuredImage: $featuredImage
              googleReviewsId: $googleReviewsId
              highlights: $highlights
              paxPrice: $paxPrice
              address: $address
              holidays: $holidays
              mediaGallery: $mediaGallery
              alaCarteMenu: $alaCarteMenu
              menuItems: $menuItems
              packages: $packages
              propertyRules: $propertyRules
              status: PUBLISH
              authorId: $authorId
              ageGroups: { nodes: $ageGroups }
              amenities: { nodes: $amenities }
              activities: { nodes: $activities }
              allCuisine: { nodes: $allCuisine }
              franchises: { nodes: $franchises }
              locations: { nodes: $locations }
              occasions: { nodes: $occasions }
              venueCategories: { nodes: $venueCategories }
              venueTypes: { nodes: $venueTypes }
            }
          ) {
            venue {
              title
            }
          }
        }
      `,
      variables: variables
    })

    return data?.updateVenue?.venue
  }

  async getMenuItemCategories() {
    const { data } = await this.post({
      query: `
				query menuItemCategories {
					menuItemCategories(first: 860) {
						nodes {
							id
							name
							slug
							databaseId
							parent {
								node {
									id
									databaseId
									name
									slug
								}
							}
						}
					}
				}
      `
    })

    return data?.menuItemCategories?.nodes
  }

  async getPropertyRules() {
    const { data } = await this.post({
      query: `
				query propertyRules {
        propertyRules(first: 100) {
          nodes {
            id
            title
            slug
            databaseId
          }
        }
      }
      `
    })

    return data.propertyRules?.nodes
  }

  async deleteVenue(id: string) {
    const { data } = await this.post({
      query: `
        mutation deleteVenue {
          deleteVenue(input: {id: "${id}"}) {
            deletedId
          }
        }
      `
    })

    return data?.deleteVenue
  }

  async getVenueSlug(id: number) {
    const { data } = await this.post({
      query: `
      query Venue {
        venue(id: "${id}", idType: DATABASE_ID) {
          id
          title
          slug
        }
      }
      `
    })

    return data?.venue
  }

  async getVenueMenuItems(authorIn: _Object) {
    const { data } = await this.post({
      query: `
			query allVenueMenuItem {
				menuItemCategories(first: 860) {
					nodes {
						id
						databaseId
						slug
						name
						children(first: 100) {
							nodes {
								id
								databaseId
								name
								slug
								foodMenuItems (where: {authorIn: [${authorIn}]}, first: 200){
									nodes {
										id
										databaseId
										title
										slug
									}
								}
							}
						}
					}
				}
			}
			`
    })

    return data?.menuItemCategories?.nodes
  }

  async addToVenueWsihlist(venueId: number) {
    const { data } = await this.post({
      query: `
        mutation MyMutation {
          addToVenueWishlist(input: {id: "${venueId}"}) {
            success
          }
        }
      `
    })

    return data?.addToVenueWishlist
  }

  async getVenuesIds(id: number) {
    const { data } = await this.post({
      query: `
      query NewQuery {
        venues(first: 100, where: {author: ${id}}) {
          edges {
            node {
              databaseId
            }
          }
        }
      }
      `
    })

    return data?.venues
  }

  async getVenueWsihlist() {
    const { data } = await this.post({
      query: `
        query MyQuery {
          venueWishlist {
            id
            title
            slug
            user_id
            ipaddress
            featured_image
            date
            address
            description
            google_reviews_id
            pax_price
            cuisine_list
          }
        }
      `
    })

    return data?.venueWishlist
  }

  async createVenueMenueItem(category: string, subCategory: string, authorId: number, title: string) {
    const { data } = await this.post({
      query: `
      mutation MyMutation {
        createFoodMenuItem(
          input: {
            menuItemCategories: {
              nodes: [
                { slug: "${category}" },
                { slug: "${subCategory}" }
              ]},
              title: "${title}",
              status: PUBLISH,
              authorId: "${authorId}"
            }
          ) {
            foodMenuItem {
              id
              title
              authorId
            }
          }
      }
      `
    })

    return data?.createFoodMenuItem?.foodMenuItem
  }

  async authorsList() {
    const { data } = await this.post({
      query: `
      query authorsList {
        authorsList(roles: ["administrator"]) {
          id
          name
          slug
        }
      }
      `
    })

    return data?.authorsList
  }

  async updateVenueListing(id:number | null, rankingPriority:number | null = null, hide:boolean | null = null){
    const {data} = await this.post({
      query: `mutation MyMutation {
  updateVenue(input: {id: ${id}, rankingPriority: ${rankingPriority}, hide: ${hide}}) {
    venue {
      extraOptions {
        rankingPriority
        hide
      }
    }
  }
}`
    })
    console.log(data)
    return data
  }
}

export const listService = new ListService()