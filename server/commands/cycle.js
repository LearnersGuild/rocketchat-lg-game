/* global graphQLFetcher, notifyUser, commandsConfig */

function invokeUpdateCycleStateAPI(state, lgJWT) {
  const baseURL = process.env.NODE_ENV === 'development' ? 'http://game.learnersguild.dev' : 'https://game.learnersguild.org'
  const mutation = {
    query: 'mutation($state: String!) { launchCycle(state: $state) { id } }'
  }
  return graphQLFetcher(lgJWT, baseURL)(mutation, {state})
    .then(data => data.launchCycle)
}

function handleUpdateCycleStateCommand(commandInfo, state, msg) {
  try {
    const {lgJWT, lgPlayer} = Meteor.user().services.lgSSO
    if (!lgJWT || !lgPlayer) {
      throw new Error('You are not a player in the game.')
    }
    notifyUser(commandInfo.rid, msg)
    invokeUpdateCycleStateAPI(state, lgJWT)
      // unless our API invocation fails, we'll stay quiet because the server will notify
      // the user via the web socket
      // .then(response => console.log(`[LG SLASH COMMANDS] '/cycle launch' API response: ${response}`))
      .catch(error => {
        console.error(error.stack)
        RavenLogger.log(error)
        notifyUser(commandInfo.rid, '**FATAL**: API invocation failed.')
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
        handleUpdateCycleStateCommand(commandInfo, 'PRACTICE', '🚀  Initiating Launch... stand by.')
        break
      }
      case 'retro': {
        handleUpdateCycleStateCommand(commandInfo, 'RETROSPECTIVE', 'Initiating Retrospective... stand by.')
        break
      }
      default: {
        notifyUser(commandInfo.rid, '**ERROR:** Invalid action for /cycle')
      }
    }
  }
}
