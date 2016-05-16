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
    if (goals.length !== 0 && goals.length !== 2) {
      throw new Error('You must vote for exactly 2 goals.')
    }

    const {goalRepositoryURL} = lgPlayer.chapter
    const goalLibraryBaseURL = `${goalRepositoryURL}/issues/`

    const goalURLs = goals.map(goal => {
      const urlRegex = new RegExp(`^${goalLibraryBaseURL}\\d+$`)

      if (goal.match(urlRegex)) {
        return goal
      }
      else if (goal.match(/^\d+$/)) {
        return `${goalRepositoryURL}/issues/${goal}`
      }
      else {
        throw new Error(`\`${goal}\` is not a valid goal issue number or URL.`)
      }
    })

    invokeVoteAPI(lgJWT, goalURLs)
      .then(vote => {
        // console.log(`[LG SLASH COMMANDS] API success (voteId = ${vote.id})`)
        const goalItems = goalURLs.map((goalURL, i) => {
          const goalNum = goalURL.replace(goalLibraryBaseURL, '')
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
