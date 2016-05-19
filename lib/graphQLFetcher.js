/* global graphQLFetcher:true */
/* exported graphQLFetcher */

graphQLFetcher = (lgJWT, baseURL) => {
  return graphQLParams => {
    if (!process.env.APP_BASEURL) {
      throw new Error('APP_BASEURL must be set in environment')
    }
    const options = {
      headers: {
        'Authorization': `Bearer ${lgJWT}`,
        'Origin': process.env.APP_BASEURL,
        'Content-Type': 'application/json',
        'LearnersGuild-Skip-Update-User-Middleware': 1,
      },
      data: graphQLParams,
    }

    return new Promise((resolve, reject) => {
      HTTP.post(`${baseURL}/graphql`, options, (error, response) => {
        if (error) {
          return reject(error)
        }
        return resolve(response.data)
      })
    }).then(graphQLResponse => {
      if (graphQLResponse.errors) {
        const messages = graphQLResponse.errors.map(e => e.message)
        throw new Error(messages.join('\n'))
      }
      return graphQLResponse.data
    })
  }
}
