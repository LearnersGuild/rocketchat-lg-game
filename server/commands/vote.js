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
    const {lgJWT, lgPlayer} = Meteor.user().services.lgSSO
    if (!lgJWT || !lgPlayer) {
      throw new Error('You are not a player in the game.')
    }
    const {goalRepositoryURL} = lgPlayer.chapter
    const goalURLs = goals.map(goal => {
      let goalURL = goal
      if (goal.match(/\d+/)) {
        goalURL = `${goalRepositoryURL}/issues/${goal}`
      }
      if (goalURL.indexOf(goalRepositoryURL) < 0) {
        throw new Error(`\`${goal}\` is not a valid goal issue number or URL.`)
      }
      return goalURL
    })

    // TODO: validate the URLs with a GET to the GitHub API for the issue
    // number, then render the titles below or raise an exception if the issue
    // number isn't valid -- maybe do this in the game service?

    invokeVoteAPI(lgJWT, goalURLs)
      .then(vote => {
        console.log(`[LG SLASH COMMANDS] API success (voteId = ${vote.id})`)
        const goalItems = goalURLs.map((goalURL, i) => {
          const goalNum = goalURL.replace(`${goalRepositoryURL}/issues/`, '')
          return `- [#${goalNum} (${i+1})](${goalURL})`
        })
        notifyUser(commandInfo.rid, `You cast votes for:\n ${goalItems.join('\n')}`)
      })
      .catch(error => {
        console.error(error.stack)
        notifyUser(commandInfo.rid, '**FATAL**: Vote API invocation failed.')
      })
  } catch (errorMessage) {
    notifyUser(commandInfo.rid, `**ERROR:** ${errorMessage.message}`)
  }
}

commandsConfig.vote.onInvoke = (command, commandParamStr, commandInfo) => {
  console.log('[LG SLASH COMMANDS] about to vote for:', commandParamStr)
  const goals = commandParamStr.split(/\s+/).filter(goal => goal.length > 0)
  if (goals.length > 0) {
    voteForGoals(goals, commandInfo)
  }
}
