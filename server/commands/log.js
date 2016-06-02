/* global graphQLFetcher, notifyUser, usageFormat, usageMessage, commandFuncs */

const {log} = Npm.require('@learnersguild/game-cli')

function invokeResponseAPI(lgJWT, questionId, respondentId, responseStrings) {
  const baseURL = process.env.NODE_ENV === 'development' ? 'http://game.learnersguild.dev' : 'https://game.learnersguild.org'

  // TODO: figure out how to get the subject -- probably from the survey?
  const subject = 'HOW-TO-GET-THIS-I-DUNNO'
  const responses = responseStrings.map(value => ({
    questionId,
    respondentId,
    value,
    subject,
  }))

  const mutation = {
    query: `
mutation($responses: [InputResponse]!) {
  saveResponses(responses: $responses) {
    id
  }
}
    `,
    variables: {responses},
  }
  return graphQLFetcher(lgJWT, baseURL)(mutation)
    .then(data => data.saveResponses)
}

function logReflections(args, commandInfo) {
  try {
    const {lgJWT, lgPlayer} = Meteor.user().services.lgSSO
    if (!lgJWT || !lgPlayer) {
      throw new Error('You are not a player in the game.')
    }

    notifyUser(commandInfo.rid, 'Recording your reflection ...')
    invokeResponseAPI(lgJWT, args.reflection, lgPlayer.id, args._)
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

commandFuncs.log = (command, commandParamStr, commandInfo) => {
  let args
  try {
    args = log.parse(commandParamStr.split(/\s+/))
  } catch (error) {
    return notifyUser(commandInfo.rid, usageMessage(error))
  }
  const usageText = log.usage(args)
  if (usageText) {
    notifyUser(commandInfo.rid, usageFormat(usageText))
  } else if (!args.reflection && args._.length === 1) {
    const subcommandFuncs = {
      // TODO: invoke the API and get the survey information
      retro: () => notifyUser(commandInfo.rid, 'RETROSPECTIVE', '🤔  Initiating Retrospective... stand by.'),
    }
    const subcommandFunc = subcommandFuncs(args._[0])
    if (subcommandFunc) {
      subcommandFunc()
    } else {
      notifyUser(commandInfo.rid, '**ERROR:** Invalid action for `/log`. Try `/log --help` for usage.')
    }
  } else if (args.reflection && args._.length >= 1) {
    logReflections(args, commandInfo)
  } else {
    notifyUser(commandInfo.rid, usageFormat(log.usage()))
  }
}
