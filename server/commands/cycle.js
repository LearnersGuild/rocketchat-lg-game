/* global graphQLFetcher, notifyUser, commandsConfig */

function invokeUpdateCycleStateAPI(state, lgJWT) {
  const baseURL = process.env.NODE_ENV === 'development' ? 'http://game.learnersguild.dev' : 'https://game.learnersguild.org'
  const mutation = {
    query: 'mutation($state: String!) { updateCycleState(state: $state) { id } }',
    variables: {state},
  }
  return graphQLFetcher(lgJWT, baseURL)(mutation)
    .then(data => data.launchCycle)
}

function handleUpdateCycleStateCommand(commandInfo, state, msg) {
  try {
    const {lgJWT, lgUser} = Meteor.user().services.lgSSO
    console.log({lgUser})
    if (!lgJWT || lgUser.roles.indexOf('moderator') < 0) {
      throw new Error('You are not a moderator.')
    }
    notifyUser(commandInfo.rid, msg)
    invokeUpdateCycleStateAPI(state, lgJWT)
      .catch(error => {
        console.error(error.stack)
        RavenLogger.log(error)
        notifyUser(commandInfo.rid, `**ERROR**: ${error.message}`)
      })
  } catch (errorMessage) {
    notifyUser(commandInfo.rid, `**ERROR:** ${errorMessage.message}`)
  }
}

function showUsage(rid) {
  notifyUser(rid, `**USAGE:**
  \`/cycle launch\` - Form teams and launch the cycle
  \`/cycle retro\` - Start the retrospective
  \`/cycle help\` - Show this handy usage information
`)
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
        handleUpdateCycleStateCommand(commandInfo, 'RETROSPECTIVE', '🤔  Initiating Retrospective... stand by.')
        break
      }
      case '--help':
      case 'help': {
        showUsage(commandInfo.rid)
        break
      }
      default: {
        notifyUser(commandInfo.rid, '**ERROR:** Invalid action for `/cycle`. Try `/cycle --help` for usage.')
      }
    }
  } else {
    showUsage(commandInfo.rid)
  }
}
