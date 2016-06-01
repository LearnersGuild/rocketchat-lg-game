/* global graphQLFetcher, notifyUser, usageFormat, usageMessage, commandFuncs */

const {cycle} = Npm.require('@learnersguild/game-cli')

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

commandFuncs.cycle = (command, commandParamStr, commandInfo) => {
  let args
  try {
    args = cycle.parse(commandParamStr.split(/\s+/))
  } catch (error) {
    return notifyUser(commandInfo.rid, usageMessage(error))
  }
  const usageText = cycle.usage(args)
  if (usageText) {
    notifyUser(commandInfo.rid, usageFormat(usageText))
  } else if (args._.length === 1) {
    const subcommandFuncs = {
      launch: () => handleUpdateCycleStateCommand(commandInfo, 'PRACTICE', '🚀  Initiating Launch... stand by.'),
      retro: () => handleUpdateCycleStateCommand(commandInfo, 'RETROSPECTIVE', '🤔  Initiating Retrospective... stand by.'),
      status: () => notifyUser(commandInfo.rid, 'Sorry -- `status` is not yet implemented.'),
    }
    const subcommandFunc = subcommandFuncs(args._[0])
    if (subcommandFunc) {
      subcommandFunc()
    } else {
      notifyUser(commandInfo.rid, '**ERROR:** Invalid action for `/cycle`. Try `/cycle --help` for usage.')
    }
  } else {
    notifyUser(commandInfo.rid, usageFormat(cycle.usage()))
  }
}
