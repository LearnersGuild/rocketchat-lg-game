/* global lastSlashCommandRoomIds:true, commandFuncs  */
/* exported lastSlashCommandRoomIds */

const commands = Npm.require('@learnersguild/game-cli')

lastSlashCommandRoomIds = {}
function invoke(command, commandParamStr, commandInfo) {
  console.log(`[LG SLASH COMMANDS] '/${command}' invoked with '${commandParamStr}'`)
  const commandFunc = commandFuncs[command]
  if (commandFunc) {
    commandFunc(command, commandParamStr, commandInfo)
  }
  lastSlashCommandRoomIds[Meteor.userId()] = commandInfo.rid
}

Meteor.methods({
  getLGCommandsConfig() {
    const commandsConfig = {}
    Object.keys(commands).forEach(cmdName => {
      let {commandDescriptor: {name, description, usage}} = commands[cmdName]
      description = description || name
      usage = usage || name
      const params = usage.replace(`${name} `, '')
      commandsConfig[name] = {description, params}
    })
    return commandsConfig
  }
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
