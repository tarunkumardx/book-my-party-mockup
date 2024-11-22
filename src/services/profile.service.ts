import CommonService from './common.service'

class UserProfileService extends CommonService {
  async me() {
    return await this.post({
      query:
				` query  {
				customer(id: "Y3VzdG9tZXI6Mg==") {
					firstName
					email
					lastName
					username
					billing {
						address1
						city
						country
						phone
						state
					}
				}
		  }`
    })
  }

  async getMe() {
    const data = await this.post({
      query:
				`query viewer{
					viewer {
						email
						databaseId
						description
						firstName
						lastName
						id
						nickname
						name
						registeredDate
						venuesStatistics
						extraOptionsUser {
							mobileNumber
							avatar
						}
						roles {
							nodes {
								name
								id
							}
						}
					}
				}
			`
    })
    console.log(data.data.viewer)
    return data.data.viewer
  }

  async updateProfile(ID: string, firstName: string, lastName: string, email: string, mobileNumber: string, avatar:string) {
    console.log(avatar)
    const query = `
			mutation EditProfile($ID: ID!, $firstName: String!, $email: String!, $lastName: String!, , $mobileNumber: String!, $avatar: String!) {
				updateUser(
					input: {id: $ID, firstName: $firstName, lastName: $lastName, email: $email, mobileNumber: $mobileNumber, avatar: $avatar}
					
				) {
					clientMutationId
					user {
						email
					}
				}
			}
		`

    const variables = {
      firstName,
      lastName,
      email,
      ID,
      mobileNumber,
      avatar
    };

    const result = await this.post({ query: query, variables: variables });

    return result.data?.updateUser?.user || result
  }

  async updatePassword(ID: string, password: string) {
    const query = `
			mutation EditProfile($ID: ID!, $password: String!) {
				updateUser(
					input: {id: $ID, password: $password}
				) {
					clientMutationId
					user {
						email
					}
				}
			}
		`

    const variables = {
      ID,
      password
    };

    const result = await this.post({ query: query, variables: variables });

    return result.data?.updateUser?.user || result
  }
}
export const userProfileService = new UserProfileService()
