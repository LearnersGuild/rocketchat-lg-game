/* global lastSlashCommandRoomIds:true, commandFuncs, notifyUser, formatUsage, formatError  */
/* exported lastSlashCommandRoomIds */

const commands = Npm.require('@learnersguild/game-cli')

lastSlashCommandRoomIds = {}
function invoke(command, commandParamStr, commandInfo) {
  console.log(`[LG SLASH COMMANDS] '/${command}' invoked with '${commandParamStr}'`)
  const commandFunc = commandFuncs[command].invoke
  if (commandFunc) {
    const {lgJWT, lgPlayer, lgUser} = Meteor.user().services.lgSSO
    const notify = msg => notifyUser(commandInfo.rid, msg)
    const argv = commandParamStr.split(/\s+/).filter(arg => arg.trim().length > 0)
    commandFunc(argv, notify, {lgJWT, lgPlayer, lgUser, formatUsage, formatError})
  }
  lastSlashCommandRoomIds[Meteor.userId()] = commandInfo.rid
}

Meteor.methods({
  getLGCommandsConfig() {
    const commandsConfig = {}
    Object.keys(commands).forEach(cmdName => {
      let {
        commandDescriptor: {name, description, usage: usageMessage},
        parse,
        usage,
        invoke,
      } = commands[cmdName]
      description = description || name
      usageMessage = usageMessage || name
      const params = usageMessage.replace(`${name} `, '')
      commandsConfig[name] = {description, params}
      commandFuncs[name] = {parse, usage, invoke}
    })
    return commandsConfig
  },

  parseLGCommandStr(command, commandParamStr) {
    const argv = commandParamStr.split(/\s+/).filter(arg => arg.trim().length > 0)
    const args = commandFuncs[command].parse(argv)
    return args
  },
})

/* eslint-disable prefer-arrow-callback */
Meteor.startup(function () {
  const commandsConfig = Meteor.call('getLGCommandsConfig')
  Object.keys(commandsConfig).forEach(command => {
    const commandConfig = commandsConfig[command]
    const {description, params} = commandConfig
    RocketChat.slashCommands.add(command, invoke, {description, params})
  })
})
