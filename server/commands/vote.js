/* global graphQLFetcher, notifyUser, commandsConfig */

function invokeVoteAPI(lgJWT, goalDescriptors) {
  const baseURL = process.env.NODE_ENV === 'development' ? 'http://game.learnersguild.dev' : 'https://game.learnersguild.org'
  const mutation = {
    query: `
mutation($goalDescriptors: [String]!) {
  voteForGoals(goalDescriptors: $goalDescriptors) {
    id
  }
}
    `,
    variables: {goalDescriptors},
  }
  return graphQLFetcher(lgJWT, baseURL)(mutation)
    .then(data => data.voteForGoals)
}

function voteForGoals(goalDescriptors, commandInfo) {
  try {
    const {lgJWT, lgPlayer} = Meteor.user().services.lgSSO
    if (!lgJWT || !lgPlayer) {
      throw new Error('You are not a player in the game.')
    }
    if (goalDescriptors.length === 1) {
      throw new Error('You must vote for exactly 2 goals.')
    }
    if (goalDescriptors.length > 2) {
      notifyUser(commandInfo.rid, `Only 2 goals are allowed, so these were disqualified: ${goalDescriptors.slice(2).join(', ')}`)
    }

    notifyUser(commandInfo.rid, `Validating the goals you voted on: ${goalDescriptors.join(', ')}`)
    invokeVoteAPI(lgJWT, goalDescriptors)
      // unless our API invocation fails, we'll stay quiet because the server will notify
      // the user via the web socket
      .catch(error => {
        console.error(error.stack)
        RavenLogger.log(error)
        notifyUser(commandInfo.rid, '**FATAL**: API invocation failed.')
      })
  } catch (errorMessage) {
    notifyUser(commandInfo.rid, `**ERROR:** ${errorMessage.message}`)
  }
}

commandsConfig.vote.onInvoke = (command, commandParamStr, commandInfo) => {
  // console.log('[LG SLASH COMMANDS] about to vote for:', commandParamStr)
  const goalDescriptors = commandParamStr.split(/\s+/).filter(goalDescriptors => goalDescriptors.length > 0)
  if (goalDescriptors.length > 0) {
    voteForGoals(goalDescriptors, commandInfo)
  } else {
    notifyUser(commandInfo.rid, 'Loading current cycle voting results ...')
  }
}
