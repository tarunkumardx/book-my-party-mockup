import CommonService from './common.service';

class AuthService extends CommonService {
  async registerUser(firstName: string, lastName: string, email: string, username: string, password: string, accountType: string) {
    const query = `
      mutation ($firstName: String!, $lastName: String!, $username: String!, $email: String!, $password: String!, $accountType: String!) {
        registerUser(input: { firstName: $firstName, lastName: $lastName, username: $username, email: $email, password: $password, accountType: $accountType }) {
          user {
            email
            jwtAuthToken
            jwtRefreshToken
            id
            username
            capKey
          }
        }
      }
    `;

    const variables = {
      firstName,
      lastName,
      username,
      email,
      password,
      accountType
    };

    const result = await this.post({ query: query, variables: variables });

    return result.data?.registerUser?.user || result
  }

  async customerLogin(password: string, username: string) {
    const query = `
      mutation ($password: String!, $username: String!) {
        login(input: { password: $password, username: $username }) {
          authToken
          refreshToken
          user {
            id
            email
            firstName
            lastName
            name
            username
          }
        }
      }
    `;

    const variables = {
      password,
      username
    };

    const data = await this.post({ query: query, variables: variables });

    return data.data.login || data
  }

  async forgotPassword(email: string) {
    const query = `
      mutation MyMutation {
        sendPasswordResetEmail(input: {username: "${email}"}) {
          success
        }
      }
    `;

    const result = await this.post({ query: query });

    return result.data.sendPasswordResetEmail
  }

  async resetPassword(password: string, login: string, key: string) {
    const query = `
      mutation ResetPassword($password: String!, $key: String!, $login: String!) {
        resetUserPassword(
          input: {
            key: $key
            password: $password
            login: $login
          }
        ) {
          user {
            username
            email
          }
        }
      }
    `;

    const variables = {
      password,
      login,
      key
    };

    const result = await this.post({ query: query, variables: variables });

    return result.data.resetUserPassword || result
  }
}

export const authService = new AuthService();
