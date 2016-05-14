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
    if (goals.length === 1) {
      throw new Error('You must vote for exactly 2 goals.')
    }
    if (goals.length > 2) {
      notifyUser(commandInfo.rid, `Only 2 goals are allowed, so these were disqualified: ${goals.slice(2).join(', ')}`)
    }

    const {goalRepositoryURL} = lgPlayer.chapter
    const goalLibraryBaseURL = `${goalRepositoryURL}/issues/`
    const goalURLs = goals
      .slice(0, 2)
      .map(goal => goal.replace(goalLibraryBaseURL, ''))
      .map(goal => `${goalLibraryBaseURL}${goal}`)

    invokeVoteAPI(lgJWT, goalURLs)
      .then(vote => {
        // console.log(`[LG SLASH COMMANDS] API success (voteId = ${vote.id})`)
        const goalItems = goalURLs.map((goalURL, i) => {
          const goalNum = goalURL.replace(`${goalRepositoryURL}/issues/`, '')
          return `- [${goalNum} (${i+1})](${goalURL})`
        })
        notifyUser(commandInfo.rid, `Validating your votes:\n ${goalItems.join('\n')}`)
      })
      .catch(error => {
        console.error(error.stack)
        RavenLogger.log(error)
        notifyUser(commandInfo.rid, '**FATAL**: Vote API invocation failed.')
      })
  } catch (errorMessage) {
    notifyUser(commandInfo.rid, `**ERROR:** ${errorMessage.message}`)
  }
}

commandsConfig.vote.onInvoke = (command, commandParamStr, commandInfo) => {
  // console.log('[LG SLASH COMMANDS] about to vote for:', commandParamStr)
  const goals = commandParamStr.split(/\s+/).filter(goal => goal.length > 0)
  if (goals.length > 0) {
    voteForGoals(goals, commandInfo)
  } else {
    notifyUser(commandInfo.rid, 'Loading current cycle voting results ...')
  }
}
