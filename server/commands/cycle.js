function invokeLaunchCycleAPI(lgJWT) {
  const baseURL = process.env.NODE_ENV === 'development' ? 'http://game.learnersguild.dev' : 'https://game.learnersguild.org'
  const mutation = {
    query: `mutation { launchCycle }`
  }
  return graphQLFetcher(lgJWT, baseURL)(mutation)
    .then(data => data.launchCycle)
}

function launchCycle(commandInfo) {
  try {
    const {lgJWT, lgPlayer} = Meteor.user().services.lgSSO
    if (!lgJWT || !lgPlayer) {
      throw new Error('You are not a player in the game.')
    }
    notifyUser(commandInfo.rid, '🚀  Initiating Launch... stand by.')
    invokeLaunchCycleAPI(lgJWT)
      // unless our API invocation fails, we'll stay quiet because the server will notify
      // the user via the web socket
      .then(response => console.log(`[LG SLASH COMMANDS] '/cycle launch' API response: ${response}`))
      .catch(error => {
        console.error(error.stack)
        RavenLogger.log(error)
        notifyUser(commandInfo.rid, '**FATAL**: Vote API invocation failed.')
      })
  } catch (errorMessage) {
    notifyUser(commandInfo.rid, `**ERROR:** ${errorMessage.message}`)
  }
}

commandsConfig.cycle.onInvoke = (command, commandParamStr, commandInfo) => {
  if (commandParamStr === 'launch') {
    launchCycle(commandInfo)
  } else {
    notifyUser(commandInfo.rid, '**ERROR:** Invalid action for /cycle')
  }
}

