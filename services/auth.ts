import { ClientCredentials } from 'simple-oauth2'

export default class OAuthClient {
  constructor() {
    const oauthOptions = {
      client: {
        id: process.env.BLIZZARD_API_KEY,
        secret: process.env.BLIZZARD_SECRET_KEY,
      },
      auth: {
        tokenHost: process.env.OAUTH_TOKEN_HOST || 'https://us.battle.net',
      },
    }

    this.client = new ClientCredentials(oauthOptions)
    this.token = null
  }

  async getToken() {
    try {
      if (this.token === null || this.token.expired()) {
        const token = await this.client.getToken()
        this.token = this.client.createToken(token.token)
      }
      return this._reduceToken(this.token)
    } catch (err) {
      console.error(
        `Failed to retrieve client credentials oauth token: ${err.message}`
      )
      throw err
    }
  }

  _reduceToken(token) {
    return token.token.access_token
  }
}
