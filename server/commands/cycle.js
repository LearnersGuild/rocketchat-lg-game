/* global graphQLFetcher, notifyUser, commandsConfig */

function invokeLaunchCycleAPI(lgJWT) {
  const baseURL = process.env.NODE_ENV === 'development' ? 'http://game.learnersguild.dev' : 'https://game.learnersguild.org'
  const mutation = {
    query: 'mutation { launchCycle { id } }'
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
      // .then(response => console.log(`[LG SLASH COMMANDS] '/cycle launch' API response: ${response}`))
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
  const subcommands = commandParamStr.split(/\s+/).filter(subcommand => subcommand.length > 0)
  if (subcommands.length > 0) {
    const subcommand = subcommands[0]
    switch (subcommand) {
      case 'launch': {
        launchCycle(commandInfo)
        break
      }
      default: {
        notifyUser(commandInfo.rid, '**ERROR:** Invalid action for /cycle')
      }
    }
  }
}
