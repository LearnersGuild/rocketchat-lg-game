/* global graphQLFetcher, notifyUser, usageFormat, commandFuncs */

const {vote} = Npm.require('@learnersguild/game-cli')

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

commandFuncs.vote = (command, commandParamStr, commandInfo) => {
  const args = vote.parse(commandParamStr.split(/\s+/))
  const usageMessage = vote.usage(args)
  if (usageMessage) {
    // Rocket.Chat
    notifyUser(commandInfo.rid, usageFormat(usageMessage))
  } else if (args._.length > 0) {
    voteForGoals(args._, commandInfo)
  } else {
    notifyUser(commandInfo.rid, 'Loading current cycle voting results ...')
  }
}
