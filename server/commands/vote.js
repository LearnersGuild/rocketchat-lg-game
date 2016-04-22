function invokeVoteAPI(lgJWT, goals) {
  const baseURL = process.env.NODE_ENV === 'development' ? 'http://game.learnersguild.dev' : 'https://game.learnersguild.org'
  const mutation = {
    query: `
mutation($goals: [URL]) {
  voteForGoals(goals: $goals) {
    id
  }
}
    `,
    variables: {goals},
  }
  return graphQLFetcher(lgJWT, baseURL)(mutation)
    .then(data => data.voteForGoals)
}

function voteForGoals(goals, commandInfo) {
  try {
    const {lgJWT, playerInfo} = Meteor.user().services.lgSSO
    if (!lgJWT || !playerInfo) {
      throw new Error('You are not a player in the game.')
    }
    const {goalRepositoryURL} = playerInfo.chapter
    const goalURLs = goals.map(goal => {
      let goalURL = goal
      if (goal.match(/\d+/)) {
        goalURL = `${goalRepositoryURL}/issues/${goal}`
      }
      if (goalURL.indexOf(goalRepositoryURL) < 0) {
        throw new Error(`${goal} is not a valid goal issue number or URL.`)
      }
      return goalURL
    })

    invokeVoteAPI(lgJWT, goalURLs)
      .then(vote => {
        console.log(`[LG SLASH COMMANDS] success (voteId = ${vote.id})`)
        notifyUser(commandInfo.rid, `You successfully voted for:\n\n ${goalURLs.join('\n')}`)
      })
      .catch(error => {
        console.error(error.stack)
        notifyUser(commandInfo.rid, 'FATAL: Vote API invocation failed.')
      })
  } catch (errorMessage) {
    notifyUser(commandInfo.rid, errorMessage.toString())
  }
}

commandsConfig.vote.onInvoke = (command, commandParamStr, commandInfo) => {
  console.log('[LG SLASH COMMANDS] about to vote for:', commandParamStr)
  const goals = commandParamStr.split(/\s+/)
  voteForGoals(goals, commandInfo)
}
